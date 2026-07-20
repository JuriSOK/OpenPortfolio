import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { ZodType } from 'zod';
import { ContentConfigurationError, ContentIntegrityError } from './errors';
import { readCollection } from './readCollection';
import { indexBySlug } from './relations';

// contentDir racine absent/inaccessible : anomalie de configuration, pas de
// contenu — ne doit jamais se traduire silencieusement par des collections
// vides (ce serait indiscernable d'un contenu simplement vide).
function assertContentDirAccessible(contentDir: string): void {
  if (!existsSync(contentDir) || !statSync(contentDir).isDirectory()) {
    throw new ContentConfigurationError(
      `dossier de contenu introuvable ou inaccessible : "${contentDir}" ` +
        '(vérifiez le paramètre contentDir de createContentRepository)',
    );
  }
}

function parseEntries<T>(entries: ReturnType<typeof readCollection>, schema: ZodType<T>): T[] {
  const validated: T[] = [];
  for (const entry of entries) {
    const result = schema.safeParse(entry.data);
    if (!result.success) {
      const [firstIssue] = result.error.issues;
      const field = firstIssue ? firstIssue.path.join('.') || '(racine)' : '(racine)';
      const message = firstIssue?.message ?? 'entrée invalide';
      throw new ContentIntegrityError(
        `contenu invalide dans "${entry.filePath}" — champ "${field}" : ${message} ` +
          '(exécutez npm run validate-content pour le détail complet)',
      );
    }
    validated.push(result.data);
  }
  return validated;
}

export interface LoadCollectionOptions<T> {
  contentDir: string;
  collectionName: string;
  schema: ZodType<T>;
}

// Charge et valide une collection portant un slug (toutes sauf profile). Un
// sous-dossier de collection absent, contentDir racine présent, reste un cas
// normal -> liste vide (comportement inchangé de readCollection). Applique
// systématiquement indexBySlug pour garantir l'absence de doublon avant tout
// filtrage par statut (npm run dev ne déclenche pas prebuild), puis
// reconvertit en tableau (ordre d'insertion préservé).
export function loadCollection<T extends { slug: string }>({
  contentDir,
  collectionName,
  schema,
}: LoadCollectionOptions<T>): T[] {
  assertContentDirAccessible(contentDir);
  const entries = readCollection(join(contentDir, collectionName));
  const validated = parseEntries(entries, schema);
  const index = indexBySlug(collectionName, validated);
  return Array.from(index.values());
}

// Profile est un singleton sans champ slug : pas de détection de doublon par
// slug (sa cardinalité 0/1 est vérifiée séparément par getProfile).
export function loadSingletonCollection<T>({
  contentDir,
  collectionName,
  schema,
}: LoadCollectionOptions<T>): T[] {
  assertContentDirAccessible(contentDir);
  const entries = readCollection(join(contentDir, collectionName));
  return parseEntries(entries, schema);
}
