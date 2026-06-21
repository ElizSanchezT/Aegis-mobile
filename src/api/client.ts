const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.102:5043';

export async function request<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
