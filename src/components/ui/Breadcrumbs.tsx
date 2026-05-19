import { useMatches, Link } from "react-router-dom";
import type { CrumbHandle } from "../../routes/CrumbHandle";

export function Breadcrumbs() {
  // Récupère toutes les routes correspondant à l'URL actuelle
  const matches = useMatches();

  // On filtre pour ne garder que les routes qui ont un "handle.crumb"
  const crumbs = matches
    .filter((match) => Boolean((match.handle as CrumbHandle)?.crumb))
    .map((match) => {
      const handle = match.handle as CrumbHandle;
      return {
        label: handle.crumb(match.data), // On passe les données du loader
        path: match.pathname,
      };
    });

  if (crumbs.length <= 1) return null; // Ne pas afficher si on est juste à la racine

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container">
      <ol className="flex gap-1 text-sm font-medium">
        {crumbs.map((crumb, index) => (
          <li key={index}>
            {index < crumbs.length - 1 ? (
              <>
                <Link
                  to={crumb.path}
                  className="text-neutral-500 hover:underline hover:text-blue-500"
                >
                  {crumb.label}
                </Link>
                <span className="ml-1">/</span>
              </>
            ) : (
              <span className="current-page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
