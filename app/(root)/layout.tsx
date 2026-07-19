import type { Metadata } from 'next';
import '../globals.css';

// Racine indépendante de app/[locale]/layout.tsx (technique des "multiple
// root layouts" de Next.js via route group) : la route "/" n'est pas
// localisée, elle ne fait que rediriger vers "/fr" (voir page.tsx), donc
// elle n'a pas besoin du script anti-flash ni d'un `lang` dynamique.
export const metadata: Metadata = {
  title: 'OpenPortfolio',
};

export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
