import { useState } from "react";

const chapters = [
  {
    id: 1,
    icon: "🧱",
    title: "Les Fondations",
    subtitle: "Pourquoi gérer les erreurs ?",
    color: "#FF6B35",
    sections: [
      {
        title: "Le problème sans gestion d'erreurs",
        type: "concept",
        content: `Imagine que tu commandes une pizza. Le livreur peut :
• Trouver ton adresse ✅
• Se perdre ❌
• Avoir un accident ❌
• Trouver la porte fermée ❌

Sans gestion d'erreurs, ton app "crash" ou affiche rien. Avec, elle dit : "Ta commande est retardée, voici pourquoi."`,
      },
      {
        title: "Les 3 types d'erreurs que tu rencontreras",
        type: "list",
        items: [
          { label: "Erreurs Réseau", desc: "Le serveur est éteint, pas de connexion, timeout", icon: "🌐" },
          { label: "Erreurs HTTP", desc: "401 (non autorisé), 404 (pas trouvé), 500 (erreur serveur)", icon: "📡" },
          { label: "Erreurs Métier", desc: "Email déjà pris, solde insuffisant, token expiré", icon: "⚙️" },
        ],
      },
      {
        title: "La structure de base : le Result Pattern",
        type: "code",
        lang: "typescript",
        code: `// ❌ MAUVAIS : retourner directement les données
async function getUser() {
  return await fetch('/api/user'); // crash si erreur !
}

// ✅ BON : toujours wrapper dans un Result
type Result<T, E = AppError> =
  | { success: true;  data: T }
  | { success: false; error: E };

// Maintenant tu SAIS toujours si ça a marché ou pas
async function getUser(): Promise<Result<User>> {
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: parseError(err) };
  }
}`,
      },
    ],
  },
  {
    id: 2,
    icon: "🏷️",
    title: "Typer les Erreurs",
    subtitle: "Créer un système d'erreurs solide",
    color: "#7C3AED",
    sections: [
      {
        title: "Créer un type d'erreur universel",
        type: "code",
        lang: "typescript",
        code: `// Ce type couvre TOUTES les erreurs possibles
// peu importe la base de données ou l'API

type ErrorCode =
  // 🔐 Auth / JWT
  | "UNAUTHORIZED"
  | "TOKEN_EXPIRED"
  | "TOKEN_INVALID"
  | "TOKEN_MISSING"
  | "FORBIDDEN"
  // 📦 Données
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "DUPLICATE_ENTRY"
  // 🌐 Réseau
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "SERVER_ERROR"
  // ⚙️ Métier
  | "INSUFFICIENT_BALANCE"
  | "QUOTA_EXCEEDED"
  | "UNKNOWN";

interface AppError {
  code: ErrorCode;        // Le TYPE de l'erreur (machine-readable)
  message: string;        // Message humain
  statusCode?: number;    // Code HTTP (401, 404, 500...)
  details?: unknown;      // Infos supplémentaires (champs invalides, etc.)
  timestamp: string;      // Quand ça s'est passé
}`,
      },
      {
        title: "Une fabrique d'erreurs (Error Factory)",
        type: "code",
        lang: "typescript",
        code: `// Une fonction pour créer des erreurs standardisées
function createError(
  code: ErrorCode,
  message: string,
  statusCode?: number,
  details?: unknown
): AppError {
  return {
    code,
    message,
    statusCode,
    details,
    timestamp: new Date().toISOString(),
  };
}

// Utilisation :
const err = createError(
  "NOT_FOUND",
  "Utilisateur introuvable",
  404
);
// { code: "NOT_FOUND", message: "...", statusCode: 404, ... }`,
      },
      {
        title: "Lire l'erreur renvoyée par le serveur",
        type: "code",
        lang: "typescript",
        code: `// Les serveurs renvoient des formats différents.
// Cette fonction normalise TOUT en AppError.

async function parseServerError(response: Response): Promise<AppError> {
  // 1. Essaie de lire le JSON du serveur
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  // 2. Mappe le status HTTP → ErrorCode
  const code = httpStatusToCode(response.status);

  // 3. Récupère le message du serveur ou génère-en un
  const message =
    (body as any)?.message ||
    (body as any)?.error ||
    defaultMessageForStatus(response.status);

  return createError(code, message, response.status, body);
}

function httpStatusToCode(status: number): ErrorCode {
  const map: Record<number, ErrorCode> = {
    400: "VALIDATION_ERROR",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "DUPLICATE_ENTRY",
    408: "TIMEOUT",
    500: "SERVER_ERROR",
    503: "SERVER_ERROR",
  };
  return map[status] ?? "UNKNOWN";
}`,
      },
    ],
  },
  {
    id: 3,
    icon: "🔌",
    title: "Le Client API",
    subtitle: "Un fetch() solide et réutilisable",
    color: "#059669",
    sections: [
      {
        title: "Ton client HTTP universel",
        type: "code",
        lang: "typescript",
        code: `// apiClient.ts — colle ce fichier dans N'IMPORTE quel projet

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface RequestConfig extends RequestInit {
  timeout?: number;
}

async function apiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<Result<T>> {
  const { timeout = 10000, ...fetchConfig } = config;

  // ⏱️ Gestion du timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(\`\${BASE_URL}\${endpoint}\`, {
      ...fetchConfig,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),      // JWT automatique
        ...fetchConfig.headers,
      },
    });

    clearTimeout(timeoutId);

    // ❌ Réponse HTTP non-ok (400, 401, 500...)
    if (!response.ok) {
      const error = await parseServerError(response);
      return { success: false, error };
    }

    // ✅ Succès
    const data: T = await response.json();
    return { success: true, data };

  } catch (err) {
    clearTimeout(timeoutId);

    // Timeout ou erreur réseau
    if ((err as Error).name === 'AbortError') {
      return { success: false, error: createError('TIMEOUT', 'Requête trop longue') };
    }
    return { success: false, error: createError('NETWORK_ERROR', 'Pas de connexion') };
  }
}

// Helper : ajoute le JWT automatiquement
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: \`Bearer \${token}\` } : {};
}

// Export des méthodes HTTP
export const api = {
  get:    <T>(url: string, cfg?: RequestConfig) =>
            apiClient<T>(url, { method: 'GET', ...cfg }),
  post:   <T>(url: string, body: unknown, cfg?: RequestConfig) =>
            apiClient<T>(url, { method: 'POST', body: JSON.stringify(body), ...cfg }),
  put:    <T>(url: string, body: unknown, cfg?: RequestConfig) =>
            apiClient<T>(url, { method: 'PUT', body: JSON.stringify(body), ...cfg }),
  delete: <T>(url: string, cfg?: RequestConfig) =>
            apiClient<T>(url, { method: 'DELETE', ...cfg }),
};`,
      },
    ],
  },
  {
    id: 4,
    icon: "🔐",
    title: "JWT & Auth",
    subtitle: "Gérer les tokens comme un pro",
    color: "#DC2626",
    sections: [
      {
        title: "Comprendre le JWT en 30 secondes",
        type: "concept",
        content: `Un JWT c'est comme un badge d'entrée dans un immeuble :

🪪 HEADER    → "Ce badge est de type JWT, signé avec SHA256"
📦 PAYLOAD  → "Employé: Alice, Accès: Admin, Expire: 18h00"
🔏 SIGNATURE → "Tampon officiel pour prouver que c'est vrai"

Le tout est encodé : eyJhbGciOi... (illisible mais décodable)

⚠️ IMPORTANT : Le payload est visible par tout le monde !
Ne jamais mettre de mot de passe dedans.`,
      },
      {
        title: "Décoder et typer un JWT",
        type: "code",
        lang: "typescript",
        code: `// Types pour ton payload JWT
interface JWTPayload {
  sub: string;        // ID utilisateur
  email: string;
  role: 'user' | 'admin' | 'moderator';
  iat: number;        // Issued At (timestamp création)
  exp: number;        // Expiration (timestamp)
}

// Décoder sans librairie (le payload est du base64)
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Le payload est la 2e partie, encodé en base64
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return payload as JWTPayload;
  } catch {
    return null; // Token malformé
  }
}

// Vérifier si le token est expiré
function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;

  const nowInSeconds = Date.now() / 1000;
  return payload.exp < nowInSeconds;
}

// Vérifier si le token expire bientôt (dans 5 min)
function isTokenExpiringSoon(token: string, bufferSeconds = 300): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;

  const nowInSeconds = Date.now() / 1000;
  return payload.exp < nowInSeconds + bufferSeconds;
}`,
      },
      {
        title: "Gérer le refresh token automatiquement",
        type: "code",
        lang: "typescript",
        code: `// tokenManager.ts — gestion centralisée des tokens

class TokenManager {
  private static ACCESS_KEY  = 'access_token';
  private static REFRESH_KEY = 'refresh_token';

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  static async getValidToken(): Promise<string | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    // ✅ Token OK, pas besoin de refresh
    if (!isTokenExpiringSoon(token)) return token;

    // ⚠️ Token expire bientôt → refresh automatique
    return await this.refreshAccessToken();
  }

  static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    if (!refreshToken) {
      this.logout(); // Pas de refresh token → déconnexion
      return null;
    }

    const result = await api.post<{ accessToken: string }>(
      '/auth/refresh',
      { refreshToken }
    );

    if (result.success) {
      localStorage.setItem(this.ACCESS_KEY, result.data.accessToken);
      return result.data.accessToken;
    }

    // Le refresh a échoué → déconnexion forcée
    this.logout();
    return null;
  }

  static logout(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    window.location.href = '/login';
  }
}`,
      },
      {
        title: "Gérer les erreurs JWT côté API",
        type: "code",
        lang: "typescript",
        code: `// Dans ton apiClient, intercepter les 401
async function apiClientWithAuth<T>(
  endpoint: string,
  config: RequestConfig = {},
  retry = true   // ← pour éviter une boucle infinie
): Promise<Result<T>> {

  const result = await apiClient<T>(endpoint, config);

  // Si 401 et qu'on peut retry
  if (
    !result.success &&
    result.error.code === 'UNAUTHORIZED' &&
    retry
  ) {
    // Tente un refresh de token
    const newToken = await TokenManager.refreshAccessToken();

    if (newToken) {
      // ✅ Nouveau token → relance la requête UNE FOIS
      return apiClientWithAuth<T>(endpoint, config, false);
    }
    // ❌ Refresh échoué → l'erreur remonte
  }

  return result;
}

// Connaître LE TYPE d'erreur JWT renvoyé par le serveur :
// Les serveurs renvoient souvent ces formats dans le body :
// { error: "jwt expired" }
// { error: "invalid signature" }
// { message: "Token has expired" }
// { code: "TOKEN_EXPIRED", message: "..." }

function parseJWTError(body: unknown): ErrorCode {
  const msg = ((body as any)?.error || (body as any)?.message || '').toLowerCase();
  if (msg.includes('expired'))   return 'TOKEN_EXPIRED';
  if (msg.includes('invalid'))   return 'TOKEN_INVALID';
  if (msg.includes('missing') || msg.includes('no token')) return 'TOKEN_MISSING';
  return 'UNAUTHORIZED';
}`,
      },
    ],
  },
  {
    id: 5,
    icon: "⚛️",
    title: "React & UI",
    subtitle: "Afficher les erreurs intelligemment",
    color: "#0EA5E9",
    sections: [
      {
        title: "Hook useApi réutilisable",
        type: "code",
        lang: "typescript",
        code: `// hooks/useApi.ts — à utiliser dans tous tes composants

interface ApiState<T> {
  data: T | null;
  error: AppError | null;
  loading: boolean;
}

function useApi<T>(
  apiCall: () => Promise<Result<T>>,
  deps: unknown[] = []
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null, error: null, loading: true,
  });

  useEffect(() => {
    let cancelled = false; // évite les race conditions

    setState(s => ({ ...s, loading: true, error: null }));

    apiCall().then(result => {
      if (cancelled) return;

      if (result.success) {
        setState({ data: result.data, error: null, loading: false });
      } else {
        setState({ data: null, error: result.error, loading: false });
      }
    });

    return () => { cancelled = true; };
  }, deps);

  return state;
}

// Utilisation dans un composant :
function UserProfile({ userId }: { userId: string }) {
  const { data, error, loading } = useApi(
    () => api.get<User>(\`/users/\${userId}\`),
    [userId]
  );

  if (loading) return <Spinner />;
  if (error)   return <ErrorMessage error={error} />;
  return <div>{data?.name}</div>;
}`,
      },
      {
        title: "Composant ErrorMessage intelligent",
        type: "code",
        lang: "typescript",
        code: `// components/ErrorMessage.tsx

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  UNAUTHORIZED:        "Connectez-vous pour continuer",
  TOKEN_EXPIRED:       "Session expirée, reconnectez-vous",
  TOKEN_INVALID:       "Session invalide, reconnectez-vous",
  TOKEN_MISSING:       "Authentification requise",
  FORBIDDEN:           "Vous n'avez pas accès à cette ressource",
  NOT_FOUND:           "La ressource demandée est introuvable",
  VALIDATION_ERROR:    "Les données saisies sont invalides",
  DUPLICATE_ENTRY:     "Cette entrée existe déjà",
  NETWORK_ERROR:       "Vérifiez votre connexion internet",
  TIMEOUT:             "Le serveur met trop de temps à répondre",
  SERVER_ERROR:        "Erreur serveur, réessayez plus tard",
  INSUFFICIENT_BALANCE:"Solde insuffisant",
  QUOTA_EXCEEDED:      "Quota dépassé",
  UNKNOWN:             "Une erreur inattendue s'est produite",
};

function ErrorMessage({ error }: { error: AppError }) {
  const message = ERROR_MESSAGES[error.code] || error.message;
  const isAuth = ['UNAUTHORIZED','TOKEN_EXPIRED','TOKEN_INVALID'].includes(error.code);

  return (
    <div className="error-container">
      <p>{message}</p>
      {isAuth && (
        <button onClick={() => window.location.href = '/login'}>
          Se connecter
        </button>
      )}
      {error.code === 'NETWORK_ERROR' && (
        <button onClick={() => window.location.reload()}>
          Réessayer
        </button>
      )}
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 6,
    icon: "🗺️",
    title: "Le Flux Complet",
    subtitle: "Le parcours d'une requête API",
    color: "#F59E0B",
    sections: [
      {
        title: "Flux de bout en bout",
        type: "flow",
        steps: [
          { num: "1", label: "Composant React", desc: "appelle useApi() ou api.get()", color: "#0EA5E9" },
          { num: "2", label: "TokenManager", desc: "vérifie si le JWT est valide/expiré", color: "#7C3AED" },
          { num: "3", label: "apiClient", desc: "construit la requête avec headers + JWT", color: "#059669" },
          { num: "4", label: "fetch()", desc: "envoie la requête au serveur", color: "#6B7280" },
          { num: "5", label: "Réponse OK ?", desc: "200-299 → extraire les données", color: "#059669", branch: true },
          {
            num: "6",
            label: "Réponse KO ?",
            desc: "4xx/5xx → parseServerError() → AppError",
            color: "#DC2626",
            isBranch: true,
          },
          {
            num: "7",
            label: "401 détecté ?",
            desc: "tenter refreshAccessToken() automatiquement",
            color: "#F59E0B",
            isBranch: true,
          },
          { num: "8", label: "Result<T>", desc: "{ success, data } ou { success, error }", color: "#FF6B35" },
          { num: "9", label: "Hook useApi", desc: "met à jour l'état : data / error / loading", color: "#0EA5E9" },
          { num: "10", label: "UI Rendu", desc: "affiche les données ou ErrorMessage", color: "#059669" },
        ],
      },
      {
        title: "Checklist pour tout projet",
        type: "checklist",
        items: [
          "Définir les types AppError et ErrorCode",
          "Créer apiClient.ts avec timeout + headers auth",
          "Créer TokenManager pour accès/refresh/logout",
          "Mapper les status HTTP → ErrorCode",
          "Créer le hook useApi réutilisable",
          "Créer ErrorMessage avec textes adaptés par code",
          "Intercepter les 401 pour auto-refresh",
          "Logger les erreurs côté client (optionnel)",
          "Tester chaque cas : réseau, 401, 404, 500",
        ],
      },
    ],
  },
];

export default function TsError() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [copied, setCopied] = useState(false);

  const chapter = chapters[activeChapter];
  const section = chapter.sections[activeSection];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        background: "#0D0D0D",
        minHeight: "100vh",
        color: "#E5E5E5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          padding: "24px 32px",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 28 }}>🛡️</span>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>
            TypeScript Error Mastery
          </h1>
        </div>
        <p style={{ margin: 0, color: "#888", fontSize: 13 }}>Gestion des erreurs API & JWT · De zéro à expert</p>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 260,
            background: "#111",
            borderRight: "1px solid #222",
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          {chapters.map((ch, i) => (
            <div key={ch.id}>
              <button
                onClick={() => {
                  setActiveChapter(i);
                  setActiveSection(0);
                }}
                style={{
                  width: "100%",
                  background: activeChapter === i ? `${ch.color}18` : "transparent",
                  border: "none",
                  borderLeft: activeChapter === i ? `3px solid ${ch.color}` : "3px solid transparent",
                  padding: "14px 20px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 18 }}>{ch.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: activeChapter === i ? ch.color : "#ccc",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {ch.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#555", fontFamily: "system-ui, sans-serif" }}>{ch.subtitle}</div>
                </div>
              </button>

              {activeChapter === i && (
                <div style={{ paddingLeft: 16, paddingBottom: 8 }}>
                  {ch.sections.map((sec, j) => (
                    <button
                      key={j}
                      onClick={() => setActiveSection(j)}
                      style={{
                        width: "100%",
                        background: activeSection === j ? "#1a1a1a" : "transparent",
                        border: "none",
                        padding: "8px 12px",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: 11,
                        color: activeSection === j ? ch.color : "#555",
                        fontFamily: "system-ui, sans-serif",
                        borderRadius: 4,
                        transition: "all 0.15s",
                      }}
                    >
                      {j + 1}. {sec.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {/* Chapter Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span
                style={{
                  background: `${chapter.color}22`,
                  border: `1px solid ${chapter.color}44`,
                  color: chapter.color,
                  borderRadius: 6,
                  padding: "4px 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                CHAPITRE {chapter.id}
              </span>
              <span style={{ fontSize: 20 }}>{chapter.icon}</span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              {section.title}
            </h2>
          </div>

          {/* Nav pills */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {chapter.sections.map((sec, j) => (
              <button
                key={j}
                onClick={() => setActiveSection(j)}
                style={{
                  background: activeSection === j ? chapter.color : "#1a1a1a",
                  border: `1px solid ${activeSection === j ? chapter.color : "#333"}`,
                  color: activeSection === j ? "#fff" : "#777",
                  borderRadius: 20,
                  padding: "5px 14px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: activeSection === j ? 700 : 400,
                  transition: "all 0.2s",
                }}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* Section Content */}
          {section.type === "concept" && (
            <div
              style={{
                background: "#141414",
                border: `1px solid ${chapter.color}33`,
                borderRadius: 12,
                padding: 28,
                whiteSpace: "pre-line",
                lineHeight: 1.8,
                fontSize: 15,
                color: "#ccc",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {section.content}
            </div>
          )}

          {section.type === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {section.items?.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "#141414",
                    border: `1px solid #2a2a2a`,
                    borderRadius: 10,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#fff",
                        marginBottom: 4,
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ color: "#888", fontSize: 13, fontFamily: "system-ui, sans-serif" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.type === "code" && (
            <div
              style={{
                background: "#0a0a0a",
                border: "1px solid #2a2a2a",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#141414",
                  padding: "10px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #222",
                }}
              >
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
                </div>
                <span style={{ fontSize: 12, color: "#555" }}>{section.lang}</span>
                <button
                  onClick={() => copyCode(section.code)}
                  style={{
                    background: copied ? "#059669" : "#1a1a1a",
                    border: "1px solid #333",
                    color: copied ? "#fff" : "#888",
                    borderRadius: 6,
                    padding: "4px 12px",
                    fontSize: 11,
                    cursor: "pointer",
                    fontFamily: "system-ui, sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? "✓ Copié !" : "Copier"}
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "20px 24px",
                  overflowX: "auto",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#e2e8f0",
                }}
              >
                <code>{section.code}</code>
              </pre>
            </div>
          )}

          {section.type === "flow" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {section.steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: step.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 13,
                        color: "#fff",
                        flexShrink: 0,
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      {step.num}
                    </div>
                    {i < section.steps.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          height: 24,
                          background: "#2a2a2a",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      background: "#141414",
                      border: `1px solid ${step.color}33`,
                      borderRadius: 10,
                      padding: "12px 18px",
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: i < section.steps.length - 1 ? 0 : 0,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: step.color,
                        minWidth: 160,
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      {step.label}
                    </div>
                    <div style={{ color: "#888", fontSize: 13, fontFamily: "system-ui, sans-serif" }}>
                      → {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.type === "checklist" && (
            <div
              style={{
                background: "#141414",
                border: "1px solid #2a2a2a",
                borderRadius: 12,
                padding: 24,
              }}
            >
              {section.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: i < section.items.length - 1 ? "1px solid #1a1a1a" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      border: `2px solid ${chapter.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 12,
                      color: chapter.color,
                      fontWeight: 800,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      color: "#ccc",
                      fontFamily: "system-ui, sans-serif",
                      paddingTop: 2,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
            <button
              onClick={() => {
                if (activeSection > 0) setActiveSection(activeSection - 1);
                else if (activeChapter > 0) {
                  setActiveChapter(activeChapter - 1);
                  setActiveSection(chapters[activeChapter - 1].sections.length - 1);
                }
              }}
              disabled={activeChapter === 0 && activeSection === 0}
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                color: "#888",
                borderRadius: 8,
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "system-ui, sans-serif",
                opacity: activeChapter === 0 && activeSection === 0 ? 0.3 : 1,
              }}
            >
              ← Précédent
            </button>
            <div style={{ fontSize: 12, color: "#444", fontFamily: "system-ui, sans-serif", alignSelf: "center" }}>
              Ch. {activeChapter + 1}/{chapters.length} · Section {activeSection + 1}/{chapter.sections.length}
            </div>
            <button
              onClick={() => {
                if (activeSection < chapter.sections.length - 1) setActiveSection(activeSection + 1);
                else if (activeChapter < chapters.length - 1) {
                  setActiveChapter(activeChapter + 1);
                  setActiveSection(0);
                }
              }}
              disabled={activeChapter === chapters.length - 1 && activeSection === chapter.sections.length - 1}
              style={{
                background: chapter.color,
                border: "none",
                color: "#fff",
                borderRadius: 8,
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "system-ui, sans-serif",
                opacity:
                  activeChapter === chapters.length - 1 && activeSection === chapter.sections.length - 1 ? 0.3 : 1,
              }}
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
