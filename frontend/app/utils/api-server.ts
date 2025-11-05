import axios, { InternalAxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("ERROR: NEXT_PUBLIC_API_BASE_URL is not defined in environment variables.");
  throw new Error("API Base URL not configured.");
}

const apiServer = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});


apiServer.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request (401). Token might be expired or missing.");
      // TODO: Add global token refresh logic or redirect logic here.
    }
    return Promise.reject(error);
  }
);

apiServer.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("Attempting to access protected API without an accessToken cookie.");
    }
  } catch (e) {
    console.error("Failed to read cookies in API server request interceptor:", e);
  }
  
  return config;
});

apiServer.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request (401). Token might be expired or missing.");
      
    }
    
    return Promise.reject(error);
  }
);

export default apiServer;