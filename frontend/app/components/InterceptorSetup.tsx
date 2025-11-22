'use client';

import { useAuthInterceptor } from '@/hooks/useAuthInterceptor'; 

export const InterceptorSetup = () => {
    useAuthInterceptor(); 
    return null;
};