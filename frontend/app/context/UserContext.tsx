"use client";

import { createContext, useState, ReactNode, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/app/utils/api-client";
import axios from "axios";

type UserContextType = {
  isStaff: boolean;
  setIsStaff: (value: boolean) => void;
  revalidateUserStatus: () => Promise<void>;
  logoutUser: () => void;
};

export const UserContext = createContext<UserContextType>({
  isStaff: false,
  setIsStaff: () => {},
  revalidateUserStatus: async () => {},
  logoutUser: () => {},
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
  initialIsStaff: boolean;
}

export function UserProvider({ children, initialIsStaff }: UserProviderProps) {
  const [isStaff, setIsStaff] = useState<boolean>(initialIsStaff);
  const router = useRouter();

  const logoutUser = useCallback(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    axios.post(`${API_BASE_URL}/auth/logout/`, {}, { withCredentials: true })
        .catch(error => console.error("Logout API call failed, but clearing local state.", error));
    setIsStaff(false);

    router.push('/auth/login');
  }, [router]);

  const revalidateUserStatus = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/is-staff/');
      
      setIsStaff(response.data.is_staff);
    } catch (error) {
      console.error("Failed to revalidate user status:", error);
      logoutUser();
    }
  }, [logoutUser]);

  return (
    <UserContext.Provider value={{ isStaff, setIsStaff, revalidateUserStatus, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}