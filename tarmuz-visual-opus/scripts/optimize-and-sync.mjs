/*
  Image optimization + DB sync script
  - Traverses Arabic site folders under `الموقع/`
  - Optimizes images: max dimension 1920px, WebP q=75 (fallback JPEG q=75)
  - Deletes all existing projects via API
  - Creates projects per folder with optimized images uploaded as multipart/form-data

  Usage:
    - Ensure Node 18+
    - Install deps: npm i -D sharp fast-glob
    - Set environment variables:
        API_BASE=http://localhost:5000
        AUTH_TOKEN=your_jwt_token
    - Run: npm run sync:images
*/

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SITE_DIR = path.join(ROOT, 'الموقع');
const OUT_DIR = path.join(ROOT, '.cache', 'optimized-site');

let API_BASE = process.env.API_BASE || 'http://localhost:5000';
let AUTH_TOKEN = process.env.AUTH_TOKEN || process.env.auth_token || process.env.TOKEN || '';
const API_PREFIX = () => `${API_BASE}/api`;

function log(...args) { console.log('[opt-sync]', ...args); }
function warn(...args) { console.warn('[opt-sync]', ...args); }
function err(...args) { console.error('[opt-sync]', ...args); }

async function ensureDir(dir) { await fsp.mkdir(dir, { recursive: true }); }

async function tryLoadConfigs() {
  // Allow fallback to local files if env vars are not provided
  try {
    if (!AUTH_TOKEN) {
      const tokenPath = path.join(__dirname, 'token.txt');
      if (fs.existsSync(tokenPath)) {
        const t = (await fsp.readFile(tokenPath, 'utf8')).trim();
        if (t) AUTH_TOKEN = t;
      }
    }
  } catch {}
  try {
    const basePath = path.join(__dirname, 'api-base.txt');
    if (fs.existsSync(basePath)) {
      const b = (await fsp.readFile(basePath, 'utf8')).trim();
      if (b) API_BASE = b;
    }
  } catch {}
}

// Resize + convert to WebP (q=75). If format unsupported, try JPEG.
async function optimizeImage(inputFile, outputFileBase) {
  try {
    const img = sharp(inputFile, { failOn: 'none' });
    const meta = await img.metadata();
    const w = meta.width || 0;
    const h = meta.height || 0;
    const fitSize = Math.max(w, h) > 1920 ? 1920 : Math.max(w, h);

    const pipeline = sharp(inputFile).rotate().resize({
      width: w >= h ? fitSize : undefined,
      height: h > w ? fitSize : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    });

    // Prefer WebP
    const webpOut = `${outputFileBase}.webp`;
    await pipeline.webp({ quality: 75 }).toFile(webpOut);
    return webpOut;
  } catch (e) {
    warn('WebP failed, falling back to JPEG for', inputFile, e?.message);
    try {
      const pipeline = sharp(inputFile).rotate().resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true,
      });
      const jpegOut = `${outputFileBase}.jpg`;
      await pipeline.jpeg({ quality: 75 }).toFile(jpegOut);
      return jpegOut;
    } catch (e2) {
      err('JPEG fallback failed for', inputFile, e2?.message);
      return null;
    }
  }
}

// Map category candidates similar to admin DataMigration
function categoryCandidates(raw) {
  const candidates = [];
  const en = String(raw || '').trim();
  const enLower = en.toLowerCase();
  const enTitle = enLower ? enLower.charAt(0).toUpperCase() + enLower.slice(1) : '';
  const enUpper = en ? en.toUpperCase() : '';
  const arMap = {
    'تصميم خارجي': 'exterior',
    'تصميم داخلي': 'interior',
    'سوشل ميديا': 'جديد',
    'مخططات تنفيذية': 'landscape',
    'هوية بصرية': 'جديد',
  };
  const mappedEn = arMap[raw] || undefined;

  if (raw) candidates.push(raw); // Arabic original
  if (mappedEn) candidates.push(mappedEn);
  if (en) candidates.push(en);
  if (enLower && enLower !== en) candidates.push(enLower);
  if (enTitle && enTitle !== enLower) candidates.push(enTitle);
  if (enUpper && enUpper !== enTitle) candidates.push(enUpper);
  if (!candidates.includes('landscape')) candidates.push('landscape'); // hard fallback
  if (!candidates.length) candidates.push('Uncategorized');
  return candidates;
}

async function getProjects() {
  const res = await fetch(`${API_PREFIX()}/projects`, {
    headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : undefined,
  });
  if (!res.ok) throw new Error(`getProjects failed: ${res.status}`);
  return res.json();
}

async function deleteProject(id) {
  const res = await fetch(`${API_PREFIX()}/projects/${id}`, {
    method: 'DELETE',
    headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`deleteProject ${id} failed: ${res.status} ${text}`);
  }
}

async function createProject(payload, filePaths) {
  const fd = new FormData();
  const idToUse = payload.id ?? Date.now();
  fd.append('id', String(idToUse));
  if (payload.title_ar) fd.append('title_ar', payload.title_ar);
  if (payload.title_en) fd.append('title_en', payload.title_en);
  if (payload.description_ar) fd.append('description_ar', payload.description_ar);
  if (payload.description_en) fd.append('description_en', payload.description_en);
  if (payload.category) fd.append('category', payload.category);

  for (const f of filePaths) {
    const fileBuf = await fsp.readFile(f);
    const fileName = path.basename(f);
    const ext = path.extname(fileName).toLowerCase();
    let mime = 'application/octet-stream';
    if (ext === '.webp') mime = 'image/webp';
    else if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
    else if (ext === '.png') mime = 'image/png';
    else if (ext === '.gif') mime = 'image/gif';
    const blob = new Blob([fileBuf], { type: mime });
    fd.append('images', blob, fileName);
  }

  const res = await fetch(`${API_PREFIX()}/projects`, {
    method: 'POST',
    headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : undefined,
    body: fd,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`createProject failed: ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

async function clearAllProjects() {
  try {
    const arr = await getProjects();
    log(`Found ${arr.length} existing projects. Deleting...`);
    for (const p of arr) {
      const id = p._id ?? p.id;
      if (!id) continue;
      try {
        await deleteProject(String(id));
        log('Deleted', p.title_ar || p.title_en || id);
      } catch (e) {
        warn('Delete failed', id, e?.message);
      }
    }
  } catch (e) {
    warn('Fetching projects failed, continuing:', e?.message);
  }
}

async function scanSite() {
  const categories = (await fsp.readdir(SITE_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const projects = [];
  for (const cat of categories) {
    const catDir = path.join(SITE_DIR, cat);
    const subdirs = (await fsp.readdir(catDir, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const proj of subdirs) {
      const projDir = path.join(catDir, proj);
      const images = await fg(['**/*.{png,jpg,jpeg,webp,avif,heic,heif}', '!**/thumbs*/**'], { cwd: projDir, absolute: true, onlyFiles: true, dot: false });
      if (!images.length) continue;
      projects.push({ category: cat, name: proj, dir: projDir, images });
    }
  }
  return projects;
}

async function optimizeAll(projects) {
  await ensureDir(OUT_DIR);
  const outPathsPerProject = new Map();

  for (const p of projects) {
    const destDir = path.join(OUT_DIR, p.category, p.name);
    await ensureDir(destDir);
    const outs = [];
    for (const imgPath of p.images) {
      const base = path.basename(imgPath, path.extname(imgPath));
      const outBase = path.join(destDir, base);
      const optimized = await optimizeImage(imgPath, outBase);
      if (optimized) outs.push(optimized);
    }
    outPathsPerProject.set(p, outs);
    log(`Optimized ${outs.length}/${p.images.length} images -> ${path.relative(ROOT, destDir)}`);
  }
  return outPathsPerProject;
}

async function main() {
  await tryLoadConfigs();
  log('Starting optimization & sync');
  log('ROOT =', ROOT);
  log('SITE_DIR =', SITE_DIR);
  log('API_BASE =', API_BASE);
  if (!fs.existsSync(SITE_DIR)) {
    throw new Error(`Site directory not found: ${SITE_DIR}`);
  }
  if (!AUTH_TOKEN) warn('No AUTH_TOKEN provided. If your API requires auth, set AUTH_TOKEN env or scripts/token.txt.');

  const siteProjects = await scanSite();
  log(`Discovered ${siteProjects.length} projects from folders.`);

  const optimized = await optimizeAll(siteProjects);

  log('Clearing existing projects in DB...');
  await clearAllProjects();

  log('Creating projects...');
  for (const p of siteProjects) {
    const files = optimized.get(p) || [];
    if (!files.length) {
      warn('Skipping project with no optimized images:', p.name);
      continue;
    }
    const candidates = categoryCandidates(p.category);
    const payloadBase = {
      id: Date.now(),
      title_ar: p.name,
      title_en: p.name,
      description_ar: '',
      description_en: '',
    };

    let created = false; let lastErr = null;
    for (const cat of candidates) {
      try {
        await createProject({ ...payloadBase, category: cat }, files);
        log(`Created project '${p.name}' with category '${cat}' (images: ${files.length})`);
        created = true; break;
      } catch (e) {
        lastErr = e; warn(`Create retry with category '${cat}' failed:`, e?.message);
      }
    }
    if (!created) {
      warn(`Failed to create project '${p.name}':`, lastErr?.message);
    }
  }

  log('Done.');
}

main().catch((e) => { err('Fatal:', e); process.exitCode = 1; });
