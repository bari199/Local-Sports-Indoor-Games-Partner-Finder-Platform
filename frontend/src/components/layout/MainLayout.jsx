import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;