import { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

function Dashboardlayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 z-30 bg-background/50 backdrop-blur-md">
        <SiteHeader />
      </div>
      <main className="flex-1 bg-background/50 rounded-2xl overflow-y-auto hide-scrollbar p-4">
        {children}
      </main>
    </div>
  );
}

export default Dashboardlayout;
