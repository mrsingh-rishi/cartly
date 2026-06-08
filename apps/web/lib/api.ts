const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store"
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error?.message ?? "Request failed.");
  return body;
}

export function adminApi<T>(path: string, init?: RequestInit): Promise<T> {
  const key = process.env.NEXT_PUBLIC_ADMIN_API_KEY ?? "dev-admin-key";
  return api<T>(path, { ...init, headers: { "x-admin-key": key, ...init?.headers } });
}

