import axios, { InternalAxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("ERROR: NEXT_PUBLIC_API_BASE_URL is not defined in environment variables.");
  throw new Error("API Base URL not configured.");
}

const apiServer = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

// ------------------ REQUEST INTERCEPTOR ------------------
apiServer.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ------------------ RESPONSE INTERCEPTOR ------------------
apiServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("Access token expired. Attempting to refresh...");

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();

          // Resolve queued requests
          pendingRequests.forEach((cb) => cb(newToken));
          pendingRequests = [];
          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiServer(originalRequest);

        } catch (err) {
          isRefreshing = false;
          pendingRequests = [];
          console.error("Token refresh failed:", err);
          return Promise.reject(err);
        }
      }

      // Queue concurrent requests
      return new Promise((resolve) => {
        pendingRequests.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiServer(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

// ------------------ REFRESH FUNCTION ------------------
async function refreshAccessToken(): Promise<string> {
  try {
    const NEXT_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // Call your Next.js proxy endpoint
    const response = await axios.post(
      `${NEXT_URL}/api/auth/refresh`,
      {},                   // body can be empty; proxy reads cookies
      { withCredentials: true }
    );

    const newAccessToken = response.data.access;
    if (!newAccessToken) throw new Error("No access token returned from proxy");

    return newAccessToken;

  } catch (err) {
    console.error("Failed to refresh token via proxy:", err);
    throw err;
  }
}

export default apiServer;
