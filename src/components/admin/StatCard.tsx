interface StatCardProps {
  name: string;
  icon: React.ReactNode;
  value?: number;
}

export default function StatCard({ name, icon, value }: StatCardProps) {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-white card rounded-2xl">
      <div className="flex items-center justify-between h-10 px-4 py-2.5 gap-4 border-b-2 border-b-neutral-100">
        <p className="texdy-amber-text/10 text-sm font-semibold text-neutral-500 leading-4.5 rounded-sm">{name}</p>
        <span className="text-primary-blue-text *:stroke-3">{icon}</span>
      </div>
      <div className="flex items-center flex-1 p-4 py-6">
        <span className="text-5xl font-semibold leading-8 tracking-tight text-blue-400">{value || 0}</span>
      </div>
    </div>
  );
}
