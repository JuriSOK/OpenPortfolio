import { ContentIntegrityError } from './errors';

interface Sluggable {
  slug: string;
}

// Construit un index slug -> entité, sur une liste donnée. Point de contrôle
// d'intégrité central : deux entrées de la même collection partageant le
// même slug ne sont jamais silencieusement écrasées dans la Map — le doublon
// lève ContentIntegrityError, avant toute notion de statut/visibilité (un
// doublon published/draft reste une erreur même si une seule des deux
// entrées serait visible). Nécessaire car validateContent.ts/checkRelations.ts
// ne détectent les slugs dupliqués qu'au build (prebuild), absent en
// `npm run dev`. Profile n'a pas de slug et n'est pas concerné : sa
// cardinalité singleton est vérifiée séparément (cf. getContent.ts).
export function indexBySlug<T extends Sluggable>(
  collectionName: string,
  entries: T[],
): Map<string, T> {
  const index = new Map<string, T>();
  for (const entry of entries) {
    if (index.has(entry.slug)) {
      throw new ContentIntegrityError(
        `slug dupliqué "${entry.slug}" dans la collection "${collectionName}"`,
      );
    }
    index.set(entry.slug, entry);
  }
  return index;
}

export interface ResolveSlugsContext {
  sourceCollection: string;
  sourceSlug: string;
  field: string;
  targetCollection: string;
}

// Résout un tableau de slugs référencés vers les entités de la collection
// cible, dans l'ordre déclaré. Trois cas par slug :
// 1. absent de allIndex (n'existe dans AUCUNE entrée cible, quel que soit
//    son statut) -> anomalie réelle, lève ContentIntegrityError (le pipeline
//    prebuild/checkRelations.ts aurait dû la bloquer en amont).
// 2. présent dans allIndex mais absent de visibleIndex (existe mais n'est
//    pas visible selon les QueryOptions courantes, ex. draft, ou review sans
//    includeReview) -> cas normal, omis silencieusement du résultat.
// 3. présent dans visibleIndex -> inclus.
export function resolveSlugs<T extends Sluggable>(
  slugs: string[] | undefined,
  allIndex: Map<string, T>,
  visibleIndex: Map<string, T>,
  context: ResolveSlugsContext,
): T[] {
  if (!slugs) return [];

  const resolved: T[] = [];
  for (const slug of slugs) {
    if (!allIndex.has(slug)) {
      throw new ContentIntegrityError(
        `relation introuvable : ${context.sourceCollection}/${context.sourceSlug} champ ` +
          `"${context.field}" référence "${context.targetCollection}/${slug}" qui n'existe ` +
          'dans aucune entrée',
      );
    }

    const visible = visibleIndex.get(slug);
    if (visible) {
      resolved.push(visible);
    }
  }

  return resolved;
}
