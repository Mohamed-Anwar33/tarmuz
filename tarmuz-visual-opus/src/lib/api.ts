import { API_PREFIX } from './config';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function getAuthHeader() {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_PREFIX}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const ct = res.headers.get('content-type') || '';
    let payload: any = undefined;
    try {
      payload = ct.includes('application/json') ? await res.json() : await res.text();
    } catch (_) {
      // ignore parse errors
    }
    const err: any = new Error(
      (typeof payload === 'string' && payload) || payload?.msg || `Request failed: ${res.status}`
    );
    err.status = res.status;
    err.payload = payload;
    err.path = path;
    throw err;
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

export async function uploadFile(file: File): Promise<{ filePath: string; filename: string; originalName: string; size: number }>
{
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    body: form,
    headers: {
      ...getAuthHeader(),
    },
  });
  if (!res.ok) {
    let msg = 'Upload failed';
    try {
      const ct = res.headers.get('content-type') || '';
      const body = ct.includes('application/json') ? await res.json() : await res.text();
      msg = (typeof body === 'string' && body) || body?.msg || msg;
    } catch (_) {}
    const err: any = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return res.json();
}
