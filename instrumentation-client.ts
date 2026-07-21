// Chargé automatiquement par Next.js avant l'hydratation (voir
// require-instrumentation-client dans le runtime client) — remplace le
// script anti-flash inline précédemment posé dans app/[locale]/layout.tsx
// (cf. docs/decisions/0004-strategie-style.md, addendum). Ne s'applique
// qu'aux routes localisées (/fr, /en) : le socle non localisé (redirection
// "/") n'a pas de thème à initialiser.
const locale = window.location.pathname.split('/')[1];

if (locale === 'fr' || locale === 'en') {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDark = stored === 'dark' || (stored !== 'light' && prefersDark);

    document.documentElement.classList.toggle('dark', isDark);
  } catch {
    // Storage ou matchMedia peuvent être indisponibles.
    // Le thème clair par défaut reste alors actif.
  }
}

export {};
