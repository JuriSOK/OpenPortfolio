import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exampleItemSchema } from '../schemas/example';
import type { CollectionRegistry } from '../lib/content/validateContent';
import { validateContent } from '../lib/content/validateContent';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Seule la collection de démonstration est enregistrée dans cette PR : les
// 7 collections officielles (Profile, Project, ...) rejoindront ce registre
// au fur et à mesure que leurs schémas métier seront ajoutés.
const registry: CollectionRegistry = {
  example: { schema: exampleItemSchema },
};

const { errors, entryCount } = validateContent({
  contentDir: join(ROOT, 'content'),
  publicDir: join(ROOT, 'public'),
  registry,
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
  `Validation du contenu réussie (${entryCount} entrée(s), collections : ${Object.keys(registry).join(', ')}).`,
);
