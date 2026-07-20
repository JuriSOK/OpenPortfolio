import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { mergeProjectPatch } from '../lib/content/mergeProjectPatch';

// CLI fine : lit `{existing, patch}` sur stdin, appelle mergeProjectPatch et
// écrit `{merged, staleTranslationFields}` sur stdout en cas de succès
// uniquement. N'écrit jamais aucun fichier. Erreur : diagnostic sur stderr,
// code non nul. La skill add-project doit toujours passer par ce CLI pour
// fusionner une mise à jour — jamais de fusion réimplémentée à la main.
const documentSchema = z.object({ existing: z.unknown(), patch: z.unknown() }).strict();

function readStdin(): string {
  try {
    return readFileSync(0, 'utf-8');
  } catch {
    return '';
  }
}

let raw: unknown;
try {
  raw = JSON.parse(readStdin());
} catch (error) {
  console.error(`JSON invalide sur stdin : ${(error as Error).message}`);
  process.exit(1);
}

const document = documentSchema.safeParse(raw);
if (!document.success) {
  console.error('Document JSON attendu sur stdin : { "existing": {...}, "patch": {...} }');
  for (const issue of document.error.issues) {
    console.error(`  champ "${issue.path.join('.') || '(racine)'}" : ${issue.message}`);
  }
  process.exit(1);
}

const result = mergeProjectPatch(document.data.existing, document.data.patch);

if (result.errors.length > 0) {
  console.error(`Fusion refusée (${result.errors.length} erreur(s)) :\n`);
  for (const error of result.errors) {
    console.error(`  ${error.file} — champ "${error.field}" : ${error.message}`);
  }
  process.exit(1);
}

process.stdout.write(
  `${JSON.stringify({ merged: result.merged, staleTranslationFields: result.staleTranslationFields })}\n`,
);
