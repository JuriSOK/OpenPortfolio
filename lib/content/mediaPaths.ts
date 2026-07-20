// Cherche récursivement tout objet "média" (structurellement reconnu par un
// champ "path" string, cf. mediaSchema) dans une entité déjà validée, pour
// vérifier que le fichier référencé existe bien sous public/. Marche par
// structure plutôt que par nom de champ littéral ("media") : couvre aussi
// bien un tableau (Project.media[], Hobby.media[]) qu'un objet unique sous
// un autre nom (Profile.portrait, Profile.cv.fr/en, Project.seo.image).
//
// Extrait de validateContent.ts (module partagé) pour être réutilisé par
// lib/content/checkProjectDraft.ts sans dupliquer cette logique.
export function extractMediaPaths(data: unknown): string[] {
  if (!data || typeof data !== 'object') {
    return [];
  }

  if (
    !Array.isArray(data) &&
    'path' in (data as Record<string, unknown>) &&
    typeof (data as { path?: unknown }).path === 'string'
  ) {
    return [(data as { path: string }).path];
  }

  const paths: string[] = [];
  const values = Array.isArray(data) ? data : Object.values(data as Record<string, unknown>);
  for (const value of values) {
    if (value && typeof value === 'object') {
      paths.push(...extractMediaPaths(value));
    }
  }

  return paths;
}
