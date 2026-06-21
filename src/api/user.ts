import { request } from './client';

export type RegisterUserCommand = {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dni?: string | null;
  pin?: string | null;
};

export type LoginUserCommand = {
  phone?: string | null;
  pin?: string | null;
};

export type UserResponse = {
  id?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dni?: string | null;
};

export type LoginResponse = UserResponse;

export const userApi = {
  register: (body: RegisterUserCommand) =>
    request<UserResponse>('/User/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: LoginUserCommand) =>
    request<LoginResponse>('/User/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
