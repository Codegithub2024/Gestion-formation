export default function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto overflow-hidden">
      <table className="text-neutral-800 whitespace-nowrap w-full">
        {children}
      </table>
    </div>
  );
}

export function Td({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <td className={`text-left py-2 px-4 ${right ? "text-right" : "text-left"}`}>
      {children}
    </td>
  );
}

export function Th({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <th
      className={`text-left font-semibold px-4 py-2 ${right ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

export function Tr({ children }: { children: React.ReactNode }) {
  return (
    <tr className="text-neutral-700 text-sm font-medium border-b border-b-neutral-500">
      {children}
    </tr>
  );
}

export function BodyTr({ children }: { children: React.ReactNode }) {
  return (
    <tr className="hover:bg-neutral-100 transition-all duration-200 text-neutral-700">
      {children}
    </tr>
  );
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-neutral-200">{children}</tbody>;
}
