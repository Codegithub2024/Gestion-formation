import { ShieldAlert } from "lucide-react";
import type { SecurityLog } from "../../../types/audit.types";
import Table, { BodyTr, Td, Th, Thead, Tr } from "../../ui/Table";
import Badge from "../../ui/Badge";
import type { TypeEvenementSecurite } from "../../../types/enums.types";

type AuditTableProps = {
  logs: SecurityLog[];
};

const eventVariant: Record<
  TypeEvenementSecurite,
  "green" | "red" | "amber" | "gray" | "blue" | "purple"
> = {
  LOGIN_SUCCES: "green",
  LOGIN_ECHEC: "red",
  ACCES_REFUSE: "red",
  TOKEN_EXPIRE: "amber",
  MODIFICATION_ENTITE: "blue",
  SUPPRESSION_ENTITE: "purple",
};

export default function AuditTable({ logs }: AuditTableProps) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Événement</Th>
          <Th>Utilisateur</Th>
          <Th>IP</Th>
          <Th>Détails</Th>
          <Th>Date</Th>
          <Th>Alerte</Th>
        </Tr>
      </Thead>
      <tbody>
        {logs.map((log) => (
          <BodyTr key={log.id}>
            <Td>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-50 rounded-lg">
                  <ShieldAlert size={15} className="text-red-400" />
                </div>
                <Badge
                  text={log.typeEvenement}
                  variant={eventVariant[log.typeEvenement]}
                />
              </div>
            </Td>
            <Td>{log.username}</Td>
            <Td>{log.adresseIp}</Td>
            <Td>{log.details ?? "—"}</Td>
            <Td>{new Date(log.dateEvenement).toLocaleString("fr-FR")}</Td>
            <Td>
              <Badge
                text={log.alerteEnvoyee ? "Envoyée" : "Non"}
                variant={log.alerteEnvoyee ? "red" : "gray"}
              />
            </Td>
          </BodyTr>
        ))}
      </tbody>
    </Table>
  );
}
