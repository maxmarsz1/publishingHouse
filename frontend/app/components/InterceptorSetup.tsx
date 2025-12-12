'use client';

import { useEffect } from 'react';
import { useAuthInterceptor } from '@/hooks/useAuthInterceptor';
import { useUI } from '@/app/context/UIContext';
import apiClient from '@/app/utils/api-client';

export const InterceptorSetup = () => {
    useAuthInterceptor();
    const { showSnackbar } = useUI();

    useEffect(() => {
        const interceptor = apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                let message = "Wystąpił nieoczekiwany błąd.";

                if (!error.response || error.code === "ERR_NETWORK") {
                    message = "Serwer jest niedostępny. Spróbuj ponownie później.";
                } else if (error.response.status >= 500) {
                    message = `Błąd serwera (${error.response.status}). Spróbuj ponownie później.`;
                } else {
                    message = error.response?.data?.error || error.response?.data?.detail || message;
                }

                // Avoid showing error for 401 as it might be handled by AuthInterceptor (redirect to login)
                // But typically 401 means session expired.
                if (error.response?.status !== 401) {
                    showSnackbar(message, 'error');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            apiClient.interceptors.response.eject(interceptor);
        };
    }, [showSnackbar]);

    return null;
};