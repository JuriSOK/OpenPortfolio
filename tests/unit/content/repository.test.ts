import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { hobbySchema } from '../../../schemas/hobby';
import { profileSchema } from '../../../schemas/profile';
import { skillSchema } from '../../../schemas/skill';
import { ContentConfigurationError, ContentIntegrityError } from '../../../lib/content/errors';
import { loadCollection, loadSingletonCollection } from '../../../lib/content/repository';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '../fixtures');

describe('loadCollection', () => {
  it('retourne [] quand le sous-dossier de la collection est absent mais contentDir racine existe', () => {
    const contentDir = join(FIXTURES_DIR, 'content-invalid-broken-relation', 'content');
    const hobbies = loadCollection({ contentDir, collectionName: 'hobbies', schema: hobbySchema });
    expect(hobbies).toEqual([]);
  });

  it('lève ContentConfigurationError quand contentDir racine est absent ou inaccessible', () => {
    const contentDir = join(FIXTURES_DIR, 'does-not-exist-contentdir');
    expect(() =>
      loadCollection({ contentDir, collectionName: 'skills', schema: skillSchema }),
    ).toThrow(ContentConfigurationError);
  });

  it('lève ContentIntegrityError sur une entité qui ne passe pas la validation Zod', () => {
    const contentDir = join(FIXTURES_DIR, 'content-invalid-incomplete-translation', 'content');
    expect(() =>
      loadCollection({ contentDir, collectionName: 'skills', schema: skillSchema }),
    ).toThrow(ContentIntegrityError);
  });

  it('lève ContentIntegrityError sur deux fichiers de la même collection partageant le même slug', () => {
    const contentDir = join(FIXTURES_DIR, 'content-invalid-duplicate-slug', 'content');
    expect(() =>
      loadCollection({ contentDir, collectionName: 'skills', schema: skillSchema }),
    ).toThrow(ContentIntegrityError);
  });
});

describe('loadSingletonCollection', () => {
  it('retourne [] quand le sous-dossier profile est absent mais contentDir racine existe', () => {
    const contentDir = join(FIXTURES_DIR, 'content-invalid-broken-relation', 'content');
    const profiles = loadSingletonCollection({
      contentDir,
      collectionName: 'profile',
      schema: profileSchema,
    });
    expect(profiles).toEqual([]);
  });

  it('lève ContentConfigurationError quand contentDir racine est absent ou inaccessible', () => {
    const contentDir = join(FIXTURES_DIR, 'does-not-exist-contentdir');
    expect(() =>
      loadSingletonCollection({ contentDir, collectionName: 'profile', schema: profileSchema }),
    ).toThrow(ContentConfigurationError);
  });
});
