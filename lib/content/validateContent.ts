import { join } from 'node:path';
import type { ZodTypeAny } from 'zod';
import { mediaFileExists } from './checkMediaReferences';
import { checkRelations, type RelationDeclaration, type ValidatedEntry } from './checkRelations';
import { readCollection } from './readCollection';

export interface ContentValidationError {
  file: string;
  field: string;
  message: string;
}

export interface CollectionRegistryEntry {
  schema: ZodTypeAny;
  // Profile est un singleton (§11.1 du dossier MOA) : au plus un fichier
  // dans sa collection. Cette règle est indépendante de la présence d'un
  // champ `slug` — Profile n'en a pas — contrairement à la détection de
  // doublon de slug ci-dessous, qui ne s'applique qu'aux entités qui en ont un.
  singleton?: boolean;
  relations?: RelationDeclaration[];
}

// Une entrée par collection (nom de dossier sous content/ → schéma Zod).
export type CollectionRegistry = Record<string, CollectionRegistryEntry>;

export interface ValidateContentOptions {
  contentDir: string;
  publicDir: string;
  registry: CollectionRegistry;
}

export interface ValidateContentResult {
  errors: ContentValidationError[];
  entryCount: number;
}

// Cherche récursivement tout objet "média" (structurellement reconnu par un
// champ "path" string, cf. mediaSchema) dans une entité déjà validée, pour
// vérifier que le fichier référencé existe bien sous public/. Marche par
// structure plutôt que par nom de champ littéral ("media") : couvre aussi
// bien un tableau (Project.media[], Hobby.media[]) qu'un objet unique sous
// un autre nom (Profile.portrait, Profile.cv.fr/en, Project.seo.image).
function extractMediaPaths(data: unknown): string[] {
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

export function validateContent({
  contentDir,
  publicDir,
  registry,
}: ValidateContentOptions): ValidateContentResult {
  const errors: ContentValidationError[] = [];
  let entryCount = 0;
  const validatedEntriesByCollection = new Map<string, ValidatedEntry[]>();
  const relationsByCollection = new Map<string, RelationDeclaration[]>();

  for (const [collectionName, { schema, singleton, relations }] of Object.entries(registry)) {
    if (relations) {
      relationsByCollection.set(collectionName, relations);
    }

    const collectionDir = join(contentDir, collectionName);
    const entries = readCollection(collectionDir);
    const seenSlugs = new Map<string, string>();
    const validatedEntries: ValidatedEntry[] = [];

    for (const entry of entries) {
      entryCount += 1;
      const result = schema.safeParse(entry.data);

      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push({
            file: entry.filePath,
            field: issue.path.join('.') || '(racine)',
            message: issue.message,
          });
        }
        continue;
      }

      const data = result.data as Record<string, unknown> & { slug?: string };
      validatedEntries.push({ filePath: entry.filePath, data });

      if (data.slug) {
        const existingFile = seenSlugs.get(data.slug);
        if (existingFile) {
          errors.push({
            file: entry.filePath,
            field: 'slug',
            message: `slug "${data.slug}" déjà utilisé dans ${existingFile}`,
          });
        } else {
          seenSlugs.set(data.slug, entry.filePath);
        }
      }

      for (const mediaPath of extractMediaPaths(data)) {
        if (!mediaFileExists(publicDir, mediaPath)) {
          errors.push({
            file: entry.filePath,
            field: 'media.path',
            message: `média introuvable sous public/ : "${mediaPath}"`,
          });
        }
      }
    }

    if (singleton && validatedEntries.length > 1) {
      const extraEntry = validatedEntries[validatedEntries.length - 1];
      errors.push({
        file: extraEntry ? extraEntry.filePath : collectionDir,
        field: `(${collectionName})`,
        message: `la collection "${collectionName}" n'accepte qu'un seul fichier (singleton), ${validatedEntries.length} trouvés`,
      });
    }

    validatedEntriesByCollection.set(collectionName, validatedEntries);
  }

  errors.push(...checkRelations(validatedEntriesByCollection, relationsByCollection));

  return { errors, entryCount };
}
