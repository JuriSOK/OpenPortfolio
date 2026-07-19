import { join } from 'node:path';
import type { ZodTypeAny } from 'zod';
import { mediaFileExists } from './checkMediaReferences';
import { readCollection } from './readCollection';

export interface ContentValidationError {
  file: string;
  field: string;
  message: string;
}

export interface CollectionRegistryEntry {
  schema: ZodTypeAny;
}

// Une entrée par collection (nom de dossier sous content/ → schéma Zod).
// Les collections officielles sans schéma métier (Profile, Project, ...)
// ne sont pas encore enregistrées ici — voir schemas/example.ts.
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

// Cherche récursivement tout champ "media" (objet avec un champ "path")
// dans une entité déjà validée, pour vérifier que le fichier référencé
// existe bien sous public/.
function extractMediaPaths(data: unknown): string[] {
  const paths: string[] = [];
  if (!data || typeof data !== 'object') {
    return paths;
  }

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (
      key === 'media' &&
      value &&
      typeof value === 'object' &&
      'path' in (value as Record<string, unknown>) &&
      typeof (value as { path?: unknown }).path === 'string'
    ) {
      paths.push((value as { path: string }).path);
    } else if (value && typeof value === 'object') {
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

  for (const [collectionName, { schema }] of Object.entries(registry)) {
    const collectionDir = join(contentDir, collectionName);
    const entries = readCollection(collectionDir);
    const seenSlugs = new Map<string, string>();

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

      const data = result.data as { slug?: string };
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
  }

  return { errors, entryCount };
}
