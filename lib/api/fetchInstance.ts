const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const res = await fetch(BASE_URL + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    throw res;
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }

  return (await res.text()) as unknown as T;
};
