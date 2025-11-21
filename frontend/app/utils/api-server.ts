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
let pendingRequests: (() => void)[] = [];

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
    }

    return Promise.reject(error); // Propagate other errors
  }
);


export default apiServer;
