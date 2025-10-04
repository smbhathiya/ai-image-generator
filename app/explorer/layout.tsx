import { ReactNode } from "react";

function Dashboardlayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col">

      <main className="flex-1 bg-background/50 rounded-2xl overflow-y-auto hide-scrollbar p-4">
        {children}
      </main>
    </div>
  );
}

export default Dashboardlayout;
