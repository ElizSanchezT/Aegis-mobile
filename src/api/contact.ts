import { request } from './client';

export type AddContactCommand = {
  userId: number;
  name?: string | null;
  phone?: string | null;
  alias?: string | null;
};

export type ApiContact = {
  id: number;
  userId: number;
  name: string;
  phone: string | null;
  alias: string | null;
  alertEnabled: boolean;
};

export const contactApi = {
  getByUser: (userId: number) =>
    request<ApiContact[]>(`/Contact/user/${userId}`),

  add: (body: AddContactCommand) =>
    request<ApiContact>('/Contact', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  toggleAlert: (id: number, userId: number) =>
    request<ApiContact>(`/Contact/${id}/toggle-alert?userId=${userId}`, {
      method: 'PATCH',
    }),

  remove: (id: number, userId: number) =>
    request(`/Contact/${id}?userId=${userId}`, {
      method: 'DELETE',
    }),
};
