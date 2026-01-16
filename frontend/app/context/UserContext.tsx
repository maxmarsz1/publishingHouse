"use client";

import { createContext, useState, ReactNode, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/app/utils/api-client";


type UserContextType = {
  isStaff: boolean;
  isAuthenticated: boolean;
  setIsStaff: (value: boolean) => void;
  revalidateUserStatus: () => Promise<void>;
  logoutUser: () => void;
};

export const UserContext = createContext<UserContextType>({
  isStaff: false,
  isAuthenticated: false,
  setIsStaff: () => { },
  revalidateUserStatus: async () => { },
  logoutUser: () => { },
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
  initialIsAuthenticated: boolean;
}

export function UserProvider({ children, initialIsStaff, initialIsAuthenticated }: UserProviderProps) {
  const [isStaff, setIsStaff] = useState<boolean>(initialIsStaff);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialIsAuthenticated);
  const router = useRouter();

  const logoutUser = useCallback(async () => {
    setIsAuthenticated(false); // Immediate feedback to stop fetches
    try {
      const response = await apiClient.post('/auth/logout/');
      console.log("Wylogowano pomyślnie:", response);
    } catch (error) {
      console.error("Wylogowanie nie powiodło się", error);
    } finally {
      router.push('/auth/login');
      setIsStaff(false);
    }
  }, [router]);

  const revalidateUserStatus = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/is-staff/');

      setIsStaff(response.data.is_staff);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Nie udało się zweryfikować statusu użytkownika:", error);
      logoutUser();
    }
  }, [logoutUser]);

  return (
    <UserContext.Provider value={{ isStaff, isAuthenticated, setIsStaff, revalidateUserStatus, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}