const API_BASE = "";

async function request(endpoint, options = {}) {
  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Handle FormData uploads (omit Content-Type header so browser sets boundary)
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  // Handle 401 Unauthorized globally for session expiration
  if (response.status === 401 && !endpoint.includes("/api/auth/login")) {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  }

  const contentType = response.headers.get("content-type");
  let data = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = { ok: response.ok, text: await response.text() };
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { method: "GET", ...options }),
  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  delete: (endpoint, options = {}) => request(endpoint, { method: "DELETE", ...options }),
};
