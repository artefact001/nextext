export const api = async (endpoint, method = 'GET', data = null) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: data ? JSON.stringify(data) : null,
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  return await res.json();
};
