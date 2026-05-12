export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className=" flex-1 w-full relative">
      <div className="container px-4 flex flex-col gap-4 py-6 mx-auto">
        {children}
      </div>
    </div>
  );
}
