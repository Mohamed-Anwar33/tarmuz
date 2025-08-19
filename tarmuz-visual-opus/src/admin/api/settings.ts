import { apiFetch } from '@/lib/api';

export type ContactRecipientDTO = { contactRecipient: string };

export async function getContactRecipient(): Promise<ContactRecipientDTO> {
  return apiFetch<ContactRecipientDTO>('/settings/contact-recipient');
}

export async function updateContactRecipient(contactRecipient: string): Promise<ContactRecipientDTO> {
  return apiFetch<ContactRecipientDTO>('/settings/contact-recipient', {
    method: 'PUT',
    body: JSON.stringify({ contactRecipient }),
  });
}

// ---- Login options ----
export type LoginOptions = { loginShowEmail: boolean; loginEnableEmail: boolean };

// Public (no auth header) - use apiFetch which adds auth if token exists; backend endpoint is public anyway
export async function getLoginOptionsPublic(): Promise<LoginOptions> {
  return apiFetch<LoginOptions>('/settings/login-options-public');
}

export async function getLoginOptions(): Promise<LoginOptions> {
  return apiFetch<LoginOptions>('/settings/login-options');
}

export async function updateLoginOptions(payload: LoginOptions): Promise<LoginOptions> {
  return apiFetch<LoginOptions>('/settings/login-options', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// ---- Branding (logo) ----
export type Branding = { logoUrl: string; logoUrlScrolled?: string };

export async function getBrandingPublic(): Promise<Branding> {
  return apiFetch<Branding>('/settings/branding-public');
}

export async function getBranding(): Promise<Branding> {
  return apiFetch<Branding>('/settings/branding');
}

export async function updateBranding(payload: Branding): Promise<Branding> {
  return apiFetch<Branding>('/settings/branding', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
