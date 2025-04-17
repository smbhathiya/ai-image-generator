"use client";
import { db } from "@/configs/drizzle";
import { Users } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useEffect, ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  const { user } = useUser();

  useEffect(() => {
    const checkNewUser = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const email = user.primaryEmailAddress.emailAddress;

      try {
        const result = await db.select().from(Users).where(eq(Users.email, email));

        if (result.length === 0) {
          await db.insert(Users).values({
            name: user.fullName ?? "",
            email,
            imageUrl: user.imageUrl ?? "",
          });
        }
      } catch (error) {
        console.error("Error checking or inserting user:", error);
      }
    };

    if (user) {
      checkNewUser();
    }
  }, [user]); 

  return <>{children}</>; 
};

export default Provider;