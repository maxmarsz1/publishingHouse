import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ------------------------------
// Refresh handling state
// ------------------------------
let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

// ------------------------------
// Request Interceptor
// ------------------------------
apiClient.interceptors.request.use((config) => {
  // Browser automatically sends cookies due to withCredentials: true,
  // so we don't manually attach accessToken for client-side
  return config;
});

// ------------------------------
// Response Interceptor
// ------------------------------
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn("Client: Access token expired. Attempting refresh...");

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newAccessToken = await refreshAccessToken();

          pendingRequests.forEach((cb) => cb(newAccessToken));
          pendingRequests = [];
          isRefreshing = false;

          // Attach new token manually just in case backend does not set it as cookie
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        } catch (err) {
          isRefreshing = false;
          pendingRequests = [];
          console.error("Client: Token refresh failed.", err);
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        pendingRequests.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

// ------------------------------
// Refresh Function (client-side)
// ------------------------------
async function refreshAccessToken(): Promise<string> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh/`,
      {}, // Django reads HttpOnly cookies; no body needed unless your backend requires refresh in JSON
      { withCredentials: true }
    );

    const newAccessToken = response.data.access;

    if (!newAccessToken) {
      throw new Error("Refresh did not return new access token");
    }

    return newAccessToken;
  } catch (err) {
    console.error("Client: Refresh request failed:", err);
    throw err;
  }
}

export default apiClient;
