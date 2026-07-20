import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { certificationSchema } from '../../../schemas/certification';
import { educationSchema } from '../../../schemas/education';
import { experienceSchema } from '../../../schemas/experience';
import { hobbySchema } from '../../../schemas/hobby';
import { profileSchema } from '../../../schemas/profile';
import { projectSchema } from '../../../schemas/project';
import { skillSchema } from '../../../schemas/skill';
import type { CollectionRegistry } from '../../../lib/content/validateContent';
import { validateContent } from '../../../lib/content/validateContent';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '../fixtures');
const REPO_ROOT = join(__dirname, '../../..');

// Registre réel des 7 collections officielles (miroir de
// scripts/validate-content.ts), utilisé pour les tests d'intégration.
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

function validateFixture(name: string) {
  const fixtureDir = join(FIXTURES_DIR, name);
  return validateContent({
    contentDir: join(fixtureDir, 'content'),
    publicDir: join(fixtureDir, 'public'),
    registry,
  });
}

describe('validateContent', () => {
  it('ne remonte aucune erreur sur un jeu de contenu valide couvrant les 7 collections', () => {
    const { errors, entryCount } = validateFixture('content-valid');

    expect(errors).toEqual([]);
    expect(entryCount).toBe(7);
  });

  it('détecte un slug dupliqué et identifie les fichiers concernés (REC-05)', () => {
    const { errors } = validateFixture('content-invalid-duplicate-slug');

    expect(errors).toHaveLength(1);
    expect(errors[0]?.field).toBe('slug');
    expect(errors[0]?.message).toContain('duplicate-slug');
    expect(errors[0]?.file).toMatch(/item-b\.yml$/);
  });

  it('détecte une référence média manquante (REC-06)', () => {
    const { errors } = validateFixture('content-invalid-missing-media');

    expect(errors).toHaveLength(1);
    expect(errors[0]?.field).toBe('media.path');
    expect(errors[0]?.message).toContain('does-not-exist.svg');
  });

  it('détecte une relation vers un slug inexistant (F04-001, REC-05 étendu)', () => {
    const { errors } = validateFixture('content-invalid-broken-relation');

    expect(errors).toHaveLength(1);
    expect(errors[0]?.field).toBe('skills');
    expect(errors[0]?.message).toContain('does-not-exist');
  });

  it('bloque un contenu published avec une traduction anglaise incomplète (F05-002, ADR-0011)', () => {
    const { errors } = validateFixture('content-invalid-incomplete-translation');

    expect(errors).toHaveLength(1);
    expect(errors[0]?.field).toBe('name.en');
  });

  it('détecte des dates incohérentes (endDate antérieure à startDate)', () => {
    const { errors } = validateFixture('content-invalid-inconsistent-dates');

    expect(errors).toHaveLength(1);
    expect(errors[0]?.field).toBe('endDate');
  });

  describe('singleton Profile (0/1/2 fichiers)', () => {
    it('accepte 0 fichier dans content/profile/', () => {
      const { errors } = validateFixture('content-invalid-broken-relation');
      expect(errors.some((error) => error.field === '(profile)')).toBe(false);
    });

    it('accepte 1 fichier dans content/profile/', () => {
      const { errors } = validateFixture('content-valid');
      expect(errors.some((error) => error.field === '(profile)')).toBe(false);
    });

    it('refuse 2 fichiers dans content/profile/', () => {
      const { errors } = validateFixture('content-invalid-profile-duplicate');
      const singletonErrors = errors.filter((error) => error.field === '(profile)');
      expect(singletonErrors).toHaveLength(1);
      expect(singletonErrors[0]?.message).toContain('singleton');
    });
  });

  it('valide sans erreur le vrai contenu du dépôt (garde-fou de non-régression)', () => {
    const { errors } = validateContent({
      contentDir: join(REPO_ROOT, 'content'),
      publicDir: join(REPO_ROOT, 'public'),
      registry,
    });

    expect(errors).toEqual([]);
  });
});
