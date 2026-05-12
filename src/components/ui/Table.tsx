export default function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-2xl bg-white shadow overflow-hidden overflow-x-auto">
      <table className="text-neutral-800 whitespace-nowrap w-full">
        {children}
      </table>
    </div>
  );
}

export function Td({ children }: { children: React.ReactNode }) {
  return <td className="text-left py-1 px-4 w-16">{children}</td>;
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 border-b border-neutral-200">{children}</th>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className=" h-10 text-neutral-700 text-base">{children}</tr>;
}

export function BodyTr({ children }: { children: React.ReactNode }) {
  return (
    <tr className=" h-10 text-neutral-700 border-b-neutral-200 border-b last:border-b-0 text-base">
      {children}
    </tr>
  );
}
