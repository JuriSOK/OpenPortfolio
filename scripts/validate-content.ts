import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { certificationSchema } from '../schemas/certification';
import { educationSchema } from '../schemas/education';
import { experienceSchema } from '../schemas/experience';
import { hobbySchema } from '../schemas/hobby';
import { profileSchema } from '../schemas/profile';
import { projectSchema } from '../schemas/project';
import { skillSchema } from '../schemas/skill';
import type { CollectionRegistry } from '../lib/content/validateContent';
import { validateContent } from '../lib/content/validateContent';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Les 7 collections officielles du dossier produit (§11.1). Media reste un
// objet embarqué (schemas/media.ts), pas une 8e collection.
const registry: CollectionRegistry = {
  profile: {
    schema: profileSchema,
    singleton: true,
    relations: [{ field: 'skills', targetCollection: 'skills' }],
  },
  projects: {
    schema: projectSchema,
    relations: [{ field: 'skills', targetCollection: 'skills' }],
  },
  experiences: {
    schema: experienceSchema,
    relations: [
      { field: 'skills', targetCollection: 'skills' },
      { field: 'projects', targetCollection: 'projects' },
    ],
  },
  education: {
    schema: educationSchema,
    relations: [
      { field: 'skills', targetCollection: 'skills' },
      { field: 'projects', targetCollection: 'projects' },
    ],
  },
  certifications: {
    schema: certificationSchema,
    relations: [{ field: 'skills', targetCollection: 'skills' }],
  },
  skills: { schema: skillSchema },
  hobbies: { schema: hobbySchema },
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
