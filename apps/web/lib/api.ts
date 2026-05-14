const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    headers.Cookie = cookieStore.toString();
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Request failed");
  }
  return data as T;
}

export { API_URL };
