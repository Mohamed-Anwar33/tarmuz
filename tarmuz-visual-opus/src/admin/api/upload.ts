import { API_PREFIX } from '@/lib/config';

export const uploadFile = async (file: File): Promise<{ filePath: string; filename: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('فشل في رفع الصورة');
  }

  return response.json();
};
