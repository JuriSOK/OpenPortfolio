import type { Metadata } from 'next';
import '../globals.css';

// Racine indépendante de app/(root)/layout.tsx (technique des "multiple root
// layouts" de Next.js) : c'est ici que `lang` est réellement dérivé du
// segment [locale] courant (ADR-0005), et que vit le script anti-flash de
// thème (ADR-0004) puisque c'est la partie de l'app destinée à du contenu
// réel, contrairement à la redirection statique de "/".
const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'OpenPortfolio',
};

// Lit la préférence de thème stockée, retombe sur `prefers-color-scheme`,
// et pose la classe `dark` sur <html> avant l'hydratation pour éviter tout
// flash. Aucun composant de bascule (ThemeToggle) n'existe encore dans
// cette PR : seule la mécanique est en place.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
