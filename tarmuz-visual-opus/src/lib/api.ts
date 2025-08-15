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
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
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
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
