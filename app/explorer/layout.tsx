import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function Dashboardlayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="bg-sidebar flex flex-col ">
          <div className="sticky top-0 z-30 bg-background/50 backdrop-blur-md rounded-b-2xl">
            <SiteHeader />
          </div>
          <div
            className="flex-1 bg-background/50 rounded-2xl overflow-y-auto hide-scrollbar"
            style={
              {
                scrollbarWidth: "none" ,
                WebkitScrollbar: {
                  display: "none",
                } ,
              } as React.CSSProperties
            }
          >
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Dashboardlayout;
