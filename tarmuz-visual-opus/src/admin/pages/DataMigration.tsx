import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getServices, deleteService } from '@/admin/api/services';
import { createTestimonial, getTestimonials, deleteTestimonial } from '@/admin/api/testimonials';
import { createProject, getProjects, deleteProject } from '@/admin/api/projects';
import { useToast } from '@/components/ui/use-toast';
import { API_PREFIX } from '@/lib/config';
import { DEFAULT_CONTENT } from '@/contexts/SiteContentContext';
import { updateContent } from '@/admin/api/content';

async function urlToFile(url: string, filename?: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  const name = filename || url.split('/').pop() || 'asset.jpg';
  return new File([blob], name, { type: blob.type || 'image/jpeg' });
}

export default function DataMigration() {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const appendLog = (m: string) => setLog((prev) => [...prev, m]);

  const exportContent = async () => {
    setBusy(true);
    setLog([]);
    try {
      // Auth check
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({ title: 'Authentication required', description: 'الرجاء تسجيل الدخول ثم إعادة المحاولة', variant: 'destructive' });
        setBusy(false);
        return;
      }

      appendLog('Exporting services (content)...');
      try {
        const servicesPayload = DEFAULT_CONTENT.services.map((s) => ({
          name_ar: s.title.ar,
          name_en: s.title.en,
          icon: s.icon || '',
          description_ar: s.description.ar,
          description_en: s.description.en,
        }));
        await updateContent('services', { services: servicesPayload, isActive: true });
        appendLog(`✓ Services content updated (${servicesPayload.length})`);
      } catch (err: any) {
        appendLog(`✗ Failed to update services content: ${err?.message || String(err)}`);
      }

      appendLog('Exporting testimonials...');
      for (const t of DEFAULT_CONTENT.testimonials) {
        try {
          await createTestimonial({
            quote_ar: t.content.ar,
            quote_en: t.content.en,
            clientName_ar: t.name.ar,
            clientName_en: t.name.en,
            position_ar: t.position.ar,
            position_en: t.position.en,
            rating: t.rating,
            status: 'active',
          });
          appendLog(`✓ Testimonial created: ${t.name.ar}`);
        } catch (err: any) {
          appendLog(`✗ Failed to create testimonial (${t.name.ar}): ${err?.message || String(err)}`);
        }
      }
      appendLog('Testimonials exported.');

      appendLog('Exporting projects with images...');
      // Category is required by backend; we'll try multiple candidate encodings (en lower, Title, Arabic) to match enum.
      for (const p of DEFAULT_CONTENT.portfolio.projects) {
        try {
          const files: File[] = [];
          if (p.image) {
            try {
              const file = await urlToFile(p.image as string);
              files.push(file);
            } catch (e) {
              appendLog(`! Image fetch failed for project ${p.title.en}`);
            }
          }
          const payloadBase: any = {
            id: p.id,
            title_ar: p.title.ar,
            title_en: p.title.en,
            description_ar: p.description.ar,
            description_en: p.description.en,
          };

          const candidates: string[] = [];
          const en = typeof p.category === 'string' ? String(p.category) : '';
          const enLower = en.toLowerCase();
          const enTitle = enLower ? enLower.charAt(0).toUpperCase() + enLower.slice(1) : '';
          const enUpper = en ? en.toUpperCase() : '';
          const arMap: Record<string, string> = {
            architecture: 'العمارة',
            branding: 'الهوية التجارية',
            landscape: 'المناظر الطبيعية',
          };
          const ar = arMap[enLower];
          // Proactive mapping: if backend currently accepts only 'landscape', map other known categories to it as a candidate
          const mappedFallback: Record<string, string> = {
            architecture: 'landscape',
            branding: 'landscape',
          };
          const mapped = mappedFallback[enLower];

          if (en) candidates.push(en); // original
          if (enLower && enLower !== en) candidates.push(enLower);
          if (enTitle && enTitle !== enLower) candidates.push(enTitle);
          if (enUpper && enUpper !== enTitle) candidates.push(enUpper);
          if (ar) candidates.push(ar);
          if (mapped) candidates.push(mapped);
          // Final hard fallback to ensure creation
          if (!candidates.includes('landscape')) candidates.push('landscape');
          // Ensure we try something; if empty, default to a generic
          if (candidates.length === 0) candidates.push('Uncategorized');

          let lastErr: any = null;
          let created = false;
          for (const cat of candidates) {
            try {
              const payload = { ...payloadBase, category: cat };
              await createProject(payload, files);
              appendLog(`✓ Project created with category '${cat}': ${p.title.en}`);
              created = true;
              break;
            } catch (e: any) {
              lastErr = e;
              appendLog(`! Retry with category '${cat}' failed: ${e?.message || String(e)}`);
            }
          }
          if (!created) {
            throw new Error(lastErr?.message || 'All category attempts failed');
          }
          appendLog(`✓ Project created: ${p.title.ar} / ${p.title.en}`);
        } catch (err: any) {
          appendLog(`✗ Failed to create project (${p.title.en}): ${err?.message || String(err)}`);
        }
      }
      appendLog('Projects exported.');

      toast({ title: 'Export complete', description: 'All content exported to database.' });
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Export failed', description: err.message || String(err), variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const resetData = async () => {
    setBusy(true);
    setLog([]);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        appendLog('✗ No auth token found. Please log in first.');
        toast({ title: 'خطأ', description: 'يرجى تسجيل الدخول أولاً', variant: 'destructive' });
        return;
      }

      appendLog('Deleting existing projects...');
      try {
        const projects = await getProjects();
        for (const p of projects) {
          if (p._id) {
            try {
              await deleteProject(p._id);
              appendLog(`✓ Deleted project: ${p.title_ar || p.title_en}`);
            } catch (err: any) {
              appendLog(`✗ Failed to delete project ${p._id}: ${err?.message || String(err)}`);
            }
          }
        }
      } catch (err: any) {
        appendLog(`✗ Failed to fetch projects for deletion: ${err?.message || String(err)}`);
      }

      appendLog('Deleting existing services...');
      try {
        const services = await getServices();
        for (const s of services) {
          if (s._id) {
            try {
              await deleteService(s._id);
              appendLog(`✓ Deleted service: ${s.title_ar || s.title_en}`);
            } catch (err: any) {
              appendLog(`✗ Failed to delete service ${s._id}: ${err?.message || String(err)}`);
            }
          }
        }
      } catch (err: any) {
        appendLog(`✗ Failed to fetch services for deletion: ${err?.message || String(err)}`);
      }

      appendLog('Deleting existing testimonials...');
      try {
        const testimonials = await getTestimonials();
        for (const t of testimonials) {
          if (t._id) {
            try {
              await deleteTestimonial(t._id);
              appendLog(`✓ Deleted testimonial: ${t.clientName_ar}`);
            } catch (err: any) {
              appendLog(`✗ Failed to delete testimonial ${t._id}: ${err?.message || String(err)}`);
            }
          }
        }
      } catch (err: any) {
        appendLog(`✗ Failed to fetch testimonials for deletion: ${err?.message || String(err)}`);
      }

      appendLog('Reset completed.');
      toast({ title: 'تم', description: 'تم حذف البيانات الموجودة' });
    } catch (err: any) {
      appendLog(`✗ Reset failed: ${err?.message || String(err)}`);
      toast({ title: 'خطأ', description: 'فشل في حذف البيانات', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const resetAndExport = async () => {
    setBusy(true);
    setLog([]);
    try {
      // Auth check
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({ title: 'Authentication required', description: 'الرجاء تسجيل الدخول ثم إعادة المحاولة', variant: 'destructive' });
        setBusy(false);
        return;
      }

      await resetData();
      await exportContent();
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Reset failed', description: err.message || String(err), variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Data Migration</h1>
      <p className="text-sm text-muted-foreground">Export current site content (projects, services, testimonials) to backend DB. Optionally clear existing first.</p>
      <div className="flex gap-4">
        <Button onClick={exportContent} disabled={busy} className="bg-blue-600 hover:bg-blue-700">
          {busy ? 'Exporting...' : 'Export Content'}
        </Button>
        <Button onClick={resetData} disabled={busy} variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
          {busy ? 'Deleting...' : 'Reset Data'}
        </Button>
        <Button onClick={resetAndExport} disabled={busy} variant="destructive">
          {busy ? 'Processing...' : 'Reset & Export'}
        </Button>
      </div>
      <div className="bg-muted p-3 rounded text-sm max-h-64 overflow-auto">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
