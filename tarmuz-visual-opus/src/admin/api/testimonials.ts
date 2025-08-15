import { API_PREFIX } from '@/lib/config';

export type Testimonial = {
  _id?: string;
  quote_ar: string;
  quote_en: string;
  clientName_ar: string;
  clientName_en?: string;
  position_ar?: string;
  position_en?: string;
  company_ar?: string;
  company_en?: string;
  avatar?: string;
  rating?: number; // 1-5
  status?: 'active' | 'inactive';
};

function authHeader() {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${API_PREFIX}/testimonials`);
  if (!res.ok) throw new Error('Failed to load testimonials');
  return res.json();
}

export async function createTestimonial(data: Omit<Testimonial, '_id'>): Promise<Testimonial> {
  const res = await fetch(`${API_PREFIX}/testimonials`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
  const res = await fetch(`${API_PREFIX}/testimonials/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteTestimonial(id: string): Promise<{ msg: string }> {
  const res = await fetch(`${API_PREFIX}/testimonials/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
