import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex justify-center-safe items-center-safe w-full h-screen border">
      <div className="flex-1 flex justify-center bg-neutral-100 py-10 items-center h-full">
        <Outlet />
      </div>
    </div>
  );
}
