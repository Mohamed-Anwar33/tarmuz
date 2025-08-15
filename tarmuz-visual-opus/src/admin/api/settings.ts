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
