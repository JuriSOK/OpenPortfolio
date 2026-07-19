import Link from 'next/link';

// Export statique (ADR-0003) : `redirect()` de next/navigation et la
// fonction `redirects()` de next.config.ts sont des mécanismes serveur, non
// disponibles sans runtime Node. "/" est donc une page HTML statique avec
// une balise meta-refresh (Next.js hoiste automatiquement les <meta> rendus
// ici vers le <head> du document) et un lien de secours accessible. Ce
// n'est pas une redirection HTTP 301/302 : une redirection au niveau de
// l'hébergeur pourra être ajoutée une fois l'ADR-0008 tranché (voir
// docs/architecture/README.md). `next/link` rend un <a href> HTML classique
// (fonctionne sans JavaScript), donc le secours reste valable même si
// l'hydratation échoue.
export default function RootRedirectPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/fr" />
      <p>
        Redirection vers la version française du site… <Link href="/fr">Continuer vers /fr</Link>
      </p>
    </>
  );
}
