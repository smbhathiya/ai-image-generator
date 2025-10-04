"use client";

import React from "react";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { signOut } = useClerk();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Sign out"
      onClick={() => void signOut()}
    >
      <LogOut className="w-4 h-4" />
    </Button>
  );
}
