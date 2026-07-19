import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { exampleItemSchema } from '../../../schemas/example';
import type { CollectionRegistry } from '../../../lib/content/validateContent';
import { validateContent } from '../../../lib/content/validateContent';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '../fixtures');
const REPO_ROOT = join(__dirname, '../../..');

const registry: CollectionRegistry = {
  example: { schema: exampleItemSchema },
};

describe('validateContent', () => {
  it('ne remonte aucune erreur sur un jeu de contenu valide', () => {
    const fixtureDir = join(FIXTURES_DIR, 'content-valid');
    const { errors, entryCount } = validateContent({
      contentDir: join(fixtureDir, 'content'),
      publicDir: join(fixtureDir, 'public'),
      registry,
    });

    expect(errors).toEqual([]);
    expect(entryCount).toBe(1);
  });

  it('détecte un slug dupliqué et identifie les fichiers concernés (REC-05)', () => {
    const fixtureDir = join(FIXTURES_DIR, 'content-invalid-duplicate-slug');
    const { errors } = validateContent({
      contentDir: join(fixtureDir, 'content'),
      publicDir: join(fixtureDir, 'public'),
      registry,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]?.field).toBe('slug');
    expect(errors[0]?.message).toContain('duplicate-slug');
    expect(errors[0]?.file).toMatch(/item-b\.yml$/);
  });

  it('détecte une référence média manquante (REC-06)', () => {
    const fixtureDir = join(FIXTURES_DIR, 'content-invalid-missing-media');
    const { errors } = validateContent({
      contentDir: join(fixtureDir, 'content'),
      publicDir: join(fixtureDir, 'public'),
      registry,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]?.field).toBe('media.path');
    expect(errors[0]?.message).toContain('does-not-exist.svg');
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
