import { useQuery } from "@tanstack/react-query";
import { auditService } from "../../../api/services/audit.service";
import AuditTable from "../../../components/admin/securite/AuditTable";

export default function AuditPage() {
  const { data: logs = [] } = useQuery({
    queryKey: ["logs"],
    queryFn: auditService.getLogs,
  });
  return (
    <>
      <AuditTable logs={logs} />
    </>
  );
}
