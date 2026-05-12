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
      <ol style={{ display: "flex", listStyle: "none", gap: "10px" }}>
        {crumbs.map((crumb, index) => (
          <li key={index}>
            {index < crumbs.length - 1 ? (
              <>
                <Link to={crumb.path}>{crumb.label}</Link>
                <span style={{ marginLeft: "10px" }}>/</span>
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
