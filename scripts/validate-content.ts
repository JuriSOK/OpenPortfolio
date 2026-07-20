import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentRegistry } from '../lib/content/registry';
import { validateContent } from '../lib/content/validateContent';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const { errors, entryCount } = validateContent({
  contentDir: join(ROOT, 'content'),
  publicDir: join(ROOT, 'public'),
  registry: contentRegistry,
});

if (errors.length > 0) {
  console.error(
    `Validation du contenu échouée (${errors.length} erreur(s) sur ${entryCount} entrée(s)) :\n`,
  );
  for (const error of errors) {
    console.error(`  ${error.file} — champ "${error.field}" : ${error.message}`);
  }
  process.exit(1);
}

console.log(
  `Validation du contenu réussie (${entryCount} entrée(s), collections : ${Object.keys(contentRegistry).join(', ')}).`,
);
