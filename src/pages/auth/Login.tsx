import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { login, type LoginStatus } from "../../api/auth.api";
import { getRedirectPath } from "../../utils/auth.utils";
import FormError from "../../components/FormError";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      const target = e.target as typeof e.target & {
        email: { value: string };
        password: { value: string };
      };

      const res = await login(target.email.value, target.password.value);

      if (!res.success || !res.data) {
        setLoading(false);
        setError(res.errorMessage ?? "Erreur de connexion");
        return;
      }

      setUser(res.data);

      navigate(getRedirectPath(res.data.role));
    } finally {
        setError("Une erreur s'est produite !");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col border p-6 gap-6 h-fit border-neutral-200 w-full mx-auto max-w-90"
    >
      <h2 className="leading-relaxed font-bold text-3xl text-neutral-800">
        Connection
      </h2>
      <div className="flex flex-col gap-3 flex-1">
        <Input
          type="email"
          htmlFor="email"
          label="email"
          placeholder="exemple@gmail.com"
          required
        />
        <Input
          htmlFor="password"
          type="password"
          label="password"
          placeholder="Mot de passe"
          required
        />
        {error && <FormError message={error} />}
      </div>
      <Button
        type="submit"
        text="Envoyer"
        buttonStyle="amber"
        state={loading}
        onClick={() => handleSubmit}
      />
    </form>
  );
}
