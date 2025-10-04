"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useClerk } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const { openUserProfile } = useClerk();

  return (
    <div className="m-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-background border-0 shadow-none">
          <CardHeader className="flex items-center gap-2">
            <Settings className="w-6 h-6 gap-2" />
            <CardTitle className="text-2xl font-bold">Settings</CardTitle>
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
                <Button onClick={() => openUserProfile?.()}>
                  Open Profile
                </Button>
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
    </div>
  );
}
