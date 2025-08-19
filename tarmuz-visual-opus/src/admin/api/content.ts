import { apiFetch } from '@/lib/api';

export type ContentType = 'hero' | 'about' | 'services' | 'portfolio' | 'testimonials' | 'contact';

export type ContentDoc = {
  _id?: string;
  type: ContentType | string;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  content_ar?: string;
  content_en?: string;
  image?: string;
  images?: string[]; // optional gallery for sections like hero
  video?: string;
  isActive?: boolean;
  featuredIds?: string[]; // for portfolio: selected project ids for homepage
  services?: Array<{
    name_ar?: string;
    name_en?: string;
    icon?: string;
    description_ar?: string;
    description_en?: string;
  }>;
  about_features?: {
    vision?: {
      title_ar?: string;
      title_en?: string;
      description_ar?: string;
      description_en?: string;
    };
    team?: {
      title_ar?: string;
      title_en?: string;
      description_ar?: string;
      description_en?: string;
    };
    excellence?: {
      title_ar?: string;
      title_en?: string;
      description_ar?: string;
      description_en?: string;
    };
  };
  contact?: {
    email?: string;
    phone?: string;
    address_ar?: string;
    address_en?: string;
  };
  social?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    snapchat?: string;
    whatsapp?: string;
    telegram?: string;
    pinterest?: string;
    behance?: string;
    dribbble?: string;
  };
  location?: { lat?: number; lng?: number };
  createdAt?: string;
  updatedAt?: string;
};

export async function getContent(type: string) {
  try {
    return await apiFetch<ContentDoc>(`/content/${type}`);
  } catch (error: any) {
    // If content doesn't exist (404), return empty document with type
    if (error?.status === 404 || error?.message?.includes('404')) {
      // Proactively create the content to avoid repeated 404s
      try {
        const created = await apiFetch<ContentDoc>(`/content`, {
          method: 'POST',
          body: JSON.stringify({ type, featuredIds: [] }),
        });
        return created;
      } catch (createErr: any) {
        // If POST not supported, fallback to returning an in-memory doc
        return { type, featuredIds: [] } as ContentDoc;
      }
    }
    throw error;
  }
}

export async function updateContent(type: string, payload: Partial<ContentDoc>) {
  try {
    return await apiFetch<ContentDoc>(`/content/${type}`, {
      method: 'PUT',
      body: JSON.stringify({ type, ...payload }),
    });
  } catch (error: any) {
    // If content doesn't exist (404), try creating it first
    if (error?.status === 404 || error?.message?.includes('404')) {
      try {
        return await apiFetch<ContentDoc>(`/content`, {
          method: 'POST',
          body: JSON.stringify({ type, ...payload }),
        });
      } catch (createError) {
        // If POST also fails, try PUT again (maybe it was created in the meantime)
        return await apiFetch<ContentDoc>(`/content/${type}`, {
          method: 'PUT',
          body: JSON.stringify({ type, ...payload }),
        });
      }
    }
    throw error;
  }
}
