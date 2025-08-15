import { API_PREFIX } from '@/lib/config';

export type Service = {
  _id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
};

export type ServiceFormData = Omit<Service, '_id'>;

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getServices = async (): Promise<Service[]> => {
  const response = await fetch(`${API_PREFIX}/services`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`فشل في تحميل الخدمات (${response.status}) ${text}`.trim());
  }

  return response.json();
};

export const createService = async (data: ServiceFormData): Promise<Service> => {
  const response = await fetch(`${API_PREFIX}/services`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`فشل في إنشاء الخدمة (${response.status}) ${text}`.trim());
  }

  return response.json();
};

export const updateService = async (id: string, data: ServiceFormData): Promise<Service> => {
  const response = await fetch(`${API_PREFIX}/services/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`فشل في تحديث الخدمة (${response.status}) ${text}`.trim());
  }

  return response.json();
};

export const deleteService = async (id: string): Promise<void> => {
  const response = await fetch(`${API_PREFIX}/services/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`فشل في حذف الخدمة (${response.status}) ${text}`.trim());
  }
};
