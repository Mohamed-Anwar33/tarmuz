import { API_BASE } from '@/lib/config';

export interface Category {
  _id: string;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE}/api/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

// Get categories from projects (for backward compatibility)
export const getProjectCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE}/api/categories/from-projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch project categories');
  }
  return response.json();
};

// Create category (admin only)
export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}/api/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || 'Failed to create category');
  }
  
  return response.json();
};

// Update category (admin only)
export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}/api/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || 'Failed to update category');
  }
  
  return response.json();
};

// Delete category (admin only)
export const deleteCategory = async (id: string): Promise<void> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}/api/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || 'Failed to delete category');
  }
};
