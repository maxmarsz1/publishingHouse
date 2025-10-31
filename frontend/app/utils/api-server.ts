import axios from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("ERROR: NEXT_PUBLIC_API_BASE_URL is not defined in environment variables.");
  throw new Error("API Base URL not configured.");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request (401). Token might be expired or missing.");
      // TODO: Add global token refresh logic or redirect logic here.
    }
    return Promise.reject(error);
  }
);


export default api;