"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  const { user } = useUser();

  useEffect(() => {
    const handleUserCheck = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const userData = {
        email: user.primaryEmailAddress.emailAddress,
        name: user.fullName ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
      };

      try {
        await fetch("/api/check-or-insert-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

      } catch (error) {
        throw error;
      }
    };

    if (user) {
      handleUserCheck();
    }
  }, [user]);

  return <>{children}</>;
};

export default Provider;
