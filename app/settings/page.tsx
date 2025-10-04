"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useClerk } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function SettingsPage() {
  const { openUserProfile } = useClerk();

  return (
    <div className="m-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Account</p>
              <p className="text-sm text-muted-foreground">
                Update your profile and account settings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => openUserProfile?.()}>Open Profile</Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode
              </p>
            </div>
            <ModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
