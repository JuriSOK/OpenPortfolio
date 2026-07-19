import { describe, expect, it } from 'vitest';
import { localizedString, slugSchema } from '../../../schemas/common';

describe('localizedString', () => {
  const schema = localizedString();

  it('accepte un objet avec fr et en renseignés', () => {
    expect(schema.safeParse({ fr: 'Bonjour', en: 'Hello' }).success).toBe(true);
  });

  it('rejette un objet où la locale en est manquante', () => {
    expect(schema.safeParse({ fr: 'Bonjour' }).success).toBe(false);
  });

  it('rejette une chaîne vide pour une locale', () => {
    expect(schema.safeParse({ fr: '', en: 'Hello' }).success).toBe(false);
  });
});

describe('slugSchema', () => {
  it('accepte un slug kebab-case', () => {
    expect(slugSchema.safeParse('mon-slug-valide').success).toBe(true);
  });

  it('rejette un slug avec majuscules ou underscores', () => {
    expect(slugSchema.safeParse('Mon_Slug').success).toBe(false);
  });
});
