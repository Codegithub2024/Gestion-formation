import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { login, type LoginStatus } from "../../api/auth.api";
import { getRedirectPath } from "../../utils/auth.utils";
import FormError from "../../components/ui/FormError";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
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

      console.log(res.data);

      setAuth(
        {
          nom: res.data.nom,
          prenom: res.data.prenom,
          email: res.data.email,
          role: res.data.role,
        },
        res.data.accessToken,
        res.data.refreshToken,
      );

      navigate(getRedirectPath(res.data.role));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full mx-auto bg-white rounded-2xl h-fit max-w-90"
    >
      <div className="flex flex-col items-center pt-6 lg:pt-10">
        <h2 className="text-xl font-bold leading-9 capitalize text-neutral-800">
          formulaire de connection
        </h2>
        <span className="text-sm text-neutral-500">
          Veillez vous identifier{" "}
        </span>
      </div>
      <div className="flex flex-col flex-1 gap-3 p-6 lg:p-10">
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
        <div className="flex items-center py-3 pb-0">
          <Button
            type="submit"
            text="Envoyer"
            buttonStyle="blue"
            className="flex-1 h-10"
            state={loading}
            onClick={() => handleSubmit}
          />
        </div>
      </div>
    </form>
  );
}
