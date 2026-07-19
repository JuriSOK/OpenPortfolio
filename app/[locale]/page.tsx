import type { Locale } from './layout';

// Placeholder de socle technique uniquement : texte brut, aucun composant
// designé, aucun contenu personnel. Les pages métier (accueil, projets,
// etc.) font l'objet d'une PR dédiée.
export default async function LocaleHomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return <p>OpenPortfolio — socle technique ({locale}).</p>;
}
