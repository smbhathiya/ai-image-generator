import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function Dashboardlayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="bg-sidebar">
          <div className="flex flex-1 flex-col bg-background/50 rounded-2xl">
            <div className="sticky top-0 z-30">
              <SiteHeader />
            </div>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Dashboardlayout;
