const AuthFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>)
    },
    redirect: "manual"
  });

  if (response.type === "opaqueredirect") {
    if (response.url) {
      window.location.href = response.url;
      return response;
    }
  }

  return response;
};

export default AuthFetch;
