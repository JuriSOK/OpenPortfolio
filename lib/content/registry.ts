import { certificationSchema } from '../../schemas/certification';
import { educationSchema } from '../../schemas/education';
import { experienceSchema } from '../../schemas/experience';
import { hobbySchema } from '../../schemas/hobby';
import { profileSchema } from '../../schemas/profile';
import { projectSchema } from '../../schemas/project';
import { skillSchema } from '../../schemas/skill';
import type { CollectionRegistry } from './validateContent';

// Source unique des 7 collections officielles (§11.1 du dossier MOA) :
// schéma, singleton, relations. Importé par scripts/validate-content.ts,
// tests/unit/content/validate-content.test.ts et lib/content/getContent.ts
// pour éviter une 3e copie de ce mapping.
export const contentRegistry: CollectionRegistry = {
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
