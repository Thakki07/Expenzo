const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function postData(endpoint: string, data: any) {
  const res = await fetch(`${API_URL}/api/${endpoint}`, {
    method: 'POST',
    credentials: 'include', // only if needed for cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'API Error');
  }

  return res.json();
}

