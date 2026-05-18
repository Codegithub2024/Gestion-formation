import { useQuery } from "@tanstack/react-query";
import { auditService } from "../../../services/audit.service";
import AuditTable from "../../../components/admin/securite/AuditTable";

export default function AuditPage() {
  const { data: logs = [] } = useQuery({
    queryKey: ["logs"],
    queryFn: auditService.getLogs,
  });
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl text-neutral-800 font-semibold">Audit</h1>
          {logs.length !== 0 && (
            <p className="font-medium text-sm flex gap-1 items-center text-neutral-600">
              {logs.length} logs
            </p>
          )}
        </div>
      </div>
      <AuditTable logs={logs} />
    </>
  );
}
