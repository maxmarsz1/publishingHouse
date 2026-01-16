'use client';

import { useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import axios from 'axios';
import apiClient from '@/app/utils/api-client';

const setupInterceptors = (revalidate: () => Promise<void>, logout: () => void) => {
  let isRefreshing = false;
  let pendingRequests: (() => void)[] = [];

  const refreshAccessToken = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      await axios.post(`${API_BASE_URL}/auth/refresh/`, {}, { withCredentials: true });
    } catch (err) {
      logout();
      throw err;
    }
  };

  const interceptor = apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url?.includes('/auth/logout/')) {
          // If logout fails with 401, it means we are already logged out or token is invalid.
          // Treat this as success to ensure client cleanup proceeds.
          return Promise.resolve({ status: 200, data: { message: "Already logged out" } });
        }
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            await refreshAccessToken();

            await revalidate();

            pendingRequests.forEach((cb) => cb());
            pendingRequests = [];
            isRefreshing = false;

            return apiClient(originalRequest);
          } catch (err) {
            isRefreshing = false;
            pendingRequests = [];
            return Promise.reject(err);
          }
        }

        return new Promise((resolve) => {
          pendingRequests.push(() => {
            resolve(apiClient(originalRequest));
          });
        });
      }
      return Promise.reject(error);
    }
  );

  return interceptor;
};


export function useAuthInterceptor() {
  const { revalidateUserStatus, logoutUser } = useUser();

  useEffect(() => {
    const interceptorId = setupInterceptors(revalidateUserStatus, logoutUser);

    return () => {
      apiClient.interceptors.response.eject(interceptorId);
    };
  }, [revalidateUserStatus, logoutUser]);
}