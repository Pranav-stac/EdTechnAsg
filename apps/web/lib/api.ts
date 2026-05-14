function getApiUrl(): string {
  if (typeof window === "undefined") {
    return (
      process.env.API_URL?.trim() ||
      process.env.NEXT_PUBLIC_API_URL?.trim() ||
      "http://localhost:4000"
    );
  }

  return process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000";
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const apiUrl = getApiUrl();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    headers.Cookie = cookieStore.toString();
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...init,
      credentials: "include",
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error(`API unreachable at ${apiUrl}${path}`);
  }

  let data: { error?: { message?: string } };
  try {
    data = await response.json();
  } catch {
    throw new Error(`API returned a non-JSON response for ${path}`);
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || "Request failed");
  }
  return data as T;
}

export const API_URL = getApiUrl();
