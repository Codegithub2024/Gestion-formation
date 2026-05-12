import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { sessionService } from "../../../api/services/session.service";
import SessionTable from "../../../components/admin/sessions/SessionTable";
import Button from "../../../components/ui/Button";
import { Plus } from "lucide-react";
import Container from "../../../components/ui/Container";

// pages/admin/sessions/SessionsPage.tsx
export default function SessionsPage() {
  const navigate = useNavigate();
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionService.getAll,
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-neutral-800 font-semibold">Sessions</h1>
        <NavLink to="/admin/sessions/new">
          <Button text="Nouvelle session" buttonStyle="amber" className="px-2">
            <Plus size={18} />
          </Button>
        </NavLink>
      </div>
      <SessionTable
        sessions={sessions}
        onEdit={(id) => navigate(`/admin/sessions/${id}/edit`)}
        onView={(id) => navigate(`/admin/sessions/${id}`)}
      />
    </>
  );
}
