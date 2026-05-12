import SessionForm from "../../../components/admin/sessions/SessionForm";

export default function SessionsFormPage() {
  return (
    <div className="flex flex-col gap-4 max-w-lg bg-white mx-auto w-full p-4 rounded-2xl">
      <h1 className="text-xl text-neutral-800 font-semibold">
        Nouvelle sessions
      </h1>
      <SessionForm />
    </div>
  );
}
