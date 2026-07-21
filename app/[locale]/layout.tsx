import type { Metadata } from 'next';
import '../globals.css';

// Racine indépendante de app/(root)/layout.tsx (technique des "multiple root
// layouts" de Next.js) : c'est ici que `lang` est réellement dérivé du
// segment [locale] courant (ADR-0005). L'initialisation du thème (anti-flash,
// ADR-0004) vit désormais dans instrumentation-client.ts à la racine du
// dépôt, chargé par Next.js avant l'hydratation — voir l'addendum
// docs/decisions/0004-strategie-style.md pour le contexte du changement.
const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'OpenPortfolio',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    // suppressHydrationWarning : instrumentation-client.ts peut poser la
    // classe `dark` sur <html> avant l'hydratation, ce qui produirait sinon
    // un avertissement d'hydratation légitime mais non pertinent ici (l'écart
    // est intentionnel, pas un bug de rendu).
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
