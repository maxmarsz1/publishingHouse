"use client";

import { createContext, useState, ReactNode } from "react";

type UserContextType = {
  // We can simplify this to boolean since the server will always tell us true/false
  isStaff: boolean; 
  setIsStaff: (value: boolean) => void;
};

export const UserContext = createContext<UserContextType>({
  isStaff: false,
  setIsStaff: () => {},
});

interface UserProviderProps {
  children: ReactNode;
  initialIsStaff: boolean;
}

export function UserProvider({ children, initialIsStaff }: UserProviderProps) {
  const [isStaff, setIsStaff] = useState<boolean>(initialIsStaff);

  return (
    <UserContext.Provider value={{ isStaff, setIsStaff }}>
      {children}
    </UserContext.Provider>
  );
}