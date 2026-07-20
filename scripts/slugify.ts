import { slugify } from '../lib/content/slugify';

// CLI fine : `tsx scripts/slugify.ts "<titre>"` — succès : le slug est
// imprimé seul sur stdout, code 0. Erreur (argument manquant) : diagnostic
// sur stderr, code non nul. N'écrit jamais sur le disque.
const title = process.argv[2];

if (typeof title !== 'string' || title.trim().length === 0) {
  console.error('Usage : tsx scripts/slugify.ts "<titre>"');
  process.exit(1);
}

process.stdout.write(`${slugify(title)}\n`);
