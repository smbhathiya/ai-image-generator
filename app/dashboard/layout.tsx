import { ReactNode } from "react";

function Dashboardlayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Dashboardlayout;
