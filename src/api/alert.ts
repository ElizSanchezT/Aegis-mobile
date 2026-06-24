import { request } from './client';

export type CreateAlertCommand = {
  triggeredById: number;
  triggeredAt: string;
  latitude: number;
  longitude: number;
  precision: number;
};

export type EndAlertRequest = {
  endedAt: string;
};

export type AlertResponse = {
  id: number;
};

export const alertApi = {
  getAll: () =>
    request('/Alert'),

  getById: (id: number) =>
    request(`/Alert/${id}`),

  create: (body: CreateAlertCommand) =>
    request<AlertResponse>('/Alert', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  end: (id: number, body: EndAlertRequest) =>
    request(`/Alert/${id}/end`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
};
