import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkProjectDraft } from '../lib/content/checkProjectDraft';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DEFAULT_CONTENT_DIR = join(ROOT, 'content');
const DEFAULT_PUBLIC_DIR = join(ROOT, 'public');

// CLI fine, strictement read-only : lit un document JSON sur stdin
// ({mode, slug, candidate, candidateSkills?, contentDir?, publicDir?}).
// contentDir/publicDir sont optionnels ici (contrairement à
// lib/content/checkProjectDraft.ts qui les exige explicitement) : en leur
// absence, ce CLI les résout vers les vrais dossiers du dépôt. Succès :
// {"valid":true} seul sur stdout, code 0. Erreur : diagnostic sur stderr,
// code non nul. N'écrit jamais sur le disque.
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

if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
  console.error('Le document JSON attendu sur stdin doit être un objet.');
  process.exit(1);
}

const body = raw as Record<string, unknown>;
const input = {
  ...body,
  contentDir: body.contentDir ?? DEFAULT_CONTENT_DIR,
  publicDir: body.publicDir ?? DEFAULT_PUBLIC_DIR,
};

const result = checkProjectDraft(input);

if (result.errors.length > 0) {
  console.error(`Validation du candidat échouée (${result.errors.length} erreur(s)) :\n`);
  for (const error of result.errors) {
    console.error(`  ${error.file} — champ "${error.field}" : ${error.message}`);
  }
  process.exit(1);
}

process.stdout.write(`${JSON.stringify({ valid: true })}\n`);
