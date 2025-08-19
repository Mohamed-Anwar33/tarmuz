import { apiFetch } from '@/lib/api';

export type ProfilePayload = { username: string; email: string };
export async function updateProfile(payload: ProfilePayload): Promise<{ msg: string; user: { id: string; username: string; email: string } }> {
  return apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export type ChangePasswordPayload = { currentPassword: string; newPassword: string };
export async function changePassword(payload: ChangePasswordPayload): Promise<{ msg: string }> {
  return apiFetch('/auth/password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
