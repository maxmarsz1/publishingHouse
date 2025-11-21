"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

type UserContextType = {
  isStaff: boolean | null;
  setIsStaff: (value: boolean) => void;
};

export const UserContext = createContext<UserContextType>({
  isStaff: null,
  setIsStaff: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [isStaff, setIsStaff] = useState<boolean | null>(null);

  useEffect(() => {
    const staff = localStorage.getItem("is_staff");
    if (staff !== null) setIsStaff(staff === "true");
  }, []);

  return (
    <UserContext.Provider value={{ isStaff, setIsStaff }}>
      {children}
    </UserContext.Provider>
  );
}
