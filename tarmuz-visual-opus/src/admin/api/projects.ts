import { API_PREFIX } from '@/lib/config';

export type Project = {
  _id?: string;
  id?: string | number;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  category?: string;
  images?: string[]; // stored file paths
};

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_PREFIX}/projects`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to load projects');
  const data = await res.json();
  // Ensure each project has a usable `_id` for UI actions (fallback to `id`)
  return Array.isArray(data)
    ? data.map((p: Project) => ({
        ...p,
        _id: p._id ?? (p.id != null ? String(p.id) : undefined),
      }))
    : data;
}

export async function createProject(data: Omit<Project, '_id'>, files: File[]): Promise<Project> {
  const form = new FormData();
  // Backend requires `id`; generate one if not provided
  const idToUse = data.id ?? Date.now();
  form.append('id', String(idToUse));
  if (data.title_ar) form.append('title_ar', data.title_ar);
  if (data.title_en) form.append('title_en', data.title_en);
  if (data.description_ar) form.append('description_ar', data.description_ar);
  if (data.description_en) form.append('description_en', data.description_en);
  if (data.category) form.append('category', data.category);
  // removed featured flag
  files.forEach((f) => form.append('images', f));
  // Debug: log payload keys/values
  try {
    // eslint-disable-next-line no-console
    console.debug('[createProject] FormData', Array.from(form.entries()));
  } catch {}
  const res = await fetch(`${API_PREFIX}/projects`, {
    method: 'POST',
    headers: authHeader(),
    body: form,
  });
  const text = await res.text();
  // eslint-disable-next-line no-console
  console.debug('[createProject] response', res.status, text);
  if (!res.ok) throw new Error(text || 'Failed to create project');
  return text ? JSON.parse(text) : ({} as any);
}

export async function updateProject(id: string, data: Partial<Project>, files: File[]): Promise<Project> {
  const form = new FormData();
  if (data.id !== undefined) form.append('id', String(data.id));
  if (data.title_ar !== undefined) form.append('title_ar', String(data.title_ar));
  if (data.title_en !== undefined) form.append('title_en', String(data.title_en));
  if (data.description_ar !== undefined) form.append('description_ar', String(data.description_ar));
  if (data.description_en !== undefined) form.append('description_en', String(data.description_en));
  if (data.category !== undefined) form.append('category', String(data.category));
  // removed featured flag
  files.forEach((f) => form.append('images', f));
  // Debug: log payload keys/values
  try {
    // eslint-disable-next-line no-console
    console.debug('[updateProject] FormData', Array.from(form.entries()));
  } catch {}
  const res = await fetch(`${API_PREFIX}/projects/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: form,
  });
  const text = await res.text();
  // eslint-disable-next-line no-console
  console.debug('[updateProject] response', res.status, text);
  if (!res.ok) throw new Error(text || 'Failed to update project');
  return text ? JSON.parse(text) : ({} as any);
}

export async function deleteProject(id: string): Promise<{ msg: string }> {
  // eslint-disable-next-line no-console
  console.debug('[deleteProject] request', `${API_PREFIX}/projects/${id}`);
  const res = await fetch(`${API_PREFIX}/projects/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  const text = await res.text().catch(() => '');
  // eslint-disable-next-line no-console
  console.debug('[deleteProject] response', res.status, text);
  if (!res.ok) {
    const msg = text || `Delete failed with status ${res.status}`;
    throw new Error(msg);
  }
  // Some APIs return 204 No Content
  return text ? JSON.parse(text) : { msg: 'deleted' };
}

function authHeader() {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
