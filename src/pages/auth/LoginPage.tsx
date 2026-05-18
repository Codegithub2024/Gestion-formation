import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth.api";
import { getRedirectPath } from "../../utils/auth.utils";
import FormError from "../../components/ui/FormError";
import type { LoginRequest } from "../../types/requests.types";
import { ApiError } from "../../api/base.api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    email: "",
    motDePasse: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      setError(null);
      e.preventDefault();
      setLoading(true);

      const res = await login(loginForm);

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
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full shadow mx-auto bg-white rounded-2xl h-fit max-w-90"
    >
      <div className="flex flex-col items-center pt-6 lg:pt-10">
        <h2 className="text-xl font-bold leading-9 capitalize text-neutral-800">
          formulaire de connection
        </h2>
        <span className="text-sm text-neutral-500">
          Veillez vous identifier
        </span>
      </div>
      <div className="flex flex-col flex-1 gap-3 p-6 lg:p-10">
        <Input
          onChange={handleChange}
          type="email"
          name="email"
          placeholder="exemple@gmail.com"
          required
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          name="motDePasse"
          onChange={handleChange}
          required
        />
        {error && <FormError message={error} />}
        <div className="flex items-center pt-4">
          <Button
            type="submit"
            text="Envoyer"
            buttonStyle="black"
            className="flex-1 h-10 *:text-base"
            state={loading}
          />
        </div>
      </div>
    </form>
  );
}
