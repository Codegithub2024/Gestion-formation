type NavGroupType = {
  children: React.ReactNode;
  groupName: string;
  isNavbarOpen: boolean;
};

export default function NavGroup({ children, groupName, isNavbarOpen }: NavGroupType) {
  return (
    <div className="flex flex-col mt-2">
      <div className={`py-0.5 rounded-md overflow-hidden text-xs font-semibold text-neutral-500 pl-3`}>
        <p
          className={`transition-all flex gap-2 relative items-center duration-300 ease-in-out text-xs font-semibold text-neutral-600 ${isNavbarOpen ? "opacity-100" : "opacity-0"}`}
        >
          {groupName}
        </p>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
