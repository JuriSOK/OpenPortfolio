import type { ContentValidationError } from './validateContent';

export interface RelationDeclaration {
  field: string;
  targetCollection: string;
}

export interface ValidatedEntry {
  filePath: string;
  data: Record<string, unknown>;
}

// Vérifie que chaque relation déclarée (ex. Project.skills -> collection
// "skills") pointe vers un slug qui existe réellement, une fois toutes les
// collections lues et validées par Zod. Approche déclarative (pas
// d'introspection récursive par nom de champ) : chaque collection du
// registre déclare explicitement ses champs de relation et leur collection
// cible (cf. scripts/validate-content.ts).
export function checkRelations(
  validatedEntriesByCollection: Map<string, ValidatedEntry[]>,
  relationsByCollection: Map<string, RelationDeclaration[]>,
): ContentValidationError[] {
  const slugsByCollection = new Map<string, Set<string>>();
  for (const [collectionName, entries] of validatedEntriesByCollection) {
    const slugs = new Set<string>();
    for (const entry of entries) {
      const slug = entry.data.slug;
      if (typeof slug === 'string') {
        slugs.add(slug);
      }
    }
    slugsByCollection.set(collectionName, slugs);
  }

  const errors: ContentValidationError[] = [];

  for (const [collectionName, entries] of validatedEntriesByCollection) {
    const relations = relationsByCollection.get(collectionName);
    if (!relations || relations.length === 0) continue;

    for (const entry of entries) {
      for (const relation of relations) {
        const value = entry.data[relation.field];
        if (!Array.isArray(value)) continue;

        const targetSlugs = slugsByCollection.get(relation.targetCollection) ?? new Set<string>();
        for (const referencedSlug of value) {
          if (typeof referencedSlug === 'string' && !targetSlugs.has(referencedSlug)) {
            errors.push({
              file: entry.filePath,
              field: relation.field,
              message: `relation vers "${relation.targetCollection}/${referencedSlug}" introuvable`,
            });
          }
        }
      }
    }
  }

  return errors;
}
