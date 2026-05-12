import type { SessionData } from "react-router-dom";
import type { Session } from "../../../types/session.types";

type SessionTableProps = {
  sessions: Session[];
  onEdit: (id: number) => void;
  onView: (id: number) => void;
};
//@ts-ignore
export default function SessionTable({
  sessions,
  onEdit,
  onView,
}: SessionTableProps) {
  if (sessions.length === 0) {
    return (
      <div className="inline-flex justify-center px-6 py-10 bg-white rounded-2xl">
        <p className="text-neutral-600 text-center font-semibold">
          Aucune session disponible
        </p>
      </div>
    );
  }
  return (
    <div className=" flex rounded-2xl overflow-hidden mb-10">
      <table className="text-neutral-800 bg-white whitespace-nowrap w-full">
        <thead className="bg-white">
          <tr className="border-b border-neutral-200 h-10 text-neutral-700 text-base">
            <th className="text-left px-4 border-neutral-200 border-e last:border-e-0">
              Lieu
            </th>
            <th className="text-left px-4 border-neutral-200 border-e last:border-e-0 w-16">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.lieu}</td>
              <td>
                <button onClick={() => onEdit(session.id)}>Modifier</button>
                <button onClick={() => onView(session.id)}>Voir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
