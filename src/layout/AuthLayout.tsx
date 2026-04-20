import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex justify-center w-full h-screen border">
      <div className="hidden lg:flex bg-amber-50 lg:w-1/2"></div>
      <div className="flex-1 flex justify-center h-full">
        <Outlet />
      </div>
    </div>
  );
}
