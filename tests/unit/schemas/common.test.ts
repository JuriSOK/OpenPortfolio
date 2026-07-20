import { z } from 'zod';
import { describe, expect, it } from 'vitest';
import {
  checkBilingualMediaTranslation,
  checkLocalizedListTranslation,
  checkLocalizedStringTranslation,
  localizedStringList,
  localizedString,
  slugSchema,
} from '../../../schemas/common';

describe('localizedString', () => {
  const schema = localizedString();

  it('accepte un objet avec fr et en renseignés', () => {
    expect(schema.safeParse({ fr: 'Bonjour', en: 'Hello' }).success).toBe(true);
  });

  it('accepte un objet avec seulement fr (en optionnel avant publication, ADR-0011)', () => {
    expect(schema.safeParse({ fr: 'Bonjour' }).success).toBe(true);
  });

  it('rejette une chaîne vide pour fr', () => {
    expect(schema.safeParse({ fr: '' }).success).toBe(false);
  });

  it('rejette une chaîne vide pour en si en est fourni', () => {
    expect(schema.safeParse({ fr: 'Bonjour', en: '' }).success).toBe(false);
  });
});

describe('localizedStringList', () => {
  const schema = localizedStringList();

  it('accepte fr et en non vides avec des éléments non vides', () => {
    expect(schema.safeParse({ fr: ['Un'], en: ['One'] }).success).toBe(true);
  });

  it('accepte en absent (optionnel avant publication)', () => {
    expect(schema.safeParse({ fr: ['Un'] }).success).toBe(true);
  });

  it('rejette un tableau fr vide', () => {
    expect(schema.safeParse({ fr: [] }).success).toBe(false);
  });

  it('rejette un élément fr composé uniquement d’espaces', () => {
    expect(schema.safeParse({ fr: ['   '] }).success).toBe(false);
  });

  it('rejette un tableau en vide si en est fourni', () => {
    expect(schema.safeParse({ fr: ['Un'], en: [] }).success).toBe(false);
  });

  it('rejette un élément en composé uniquement d’espaces', () => {
    expect(schema.safeParse({ fr: ['Un'], en: ['  '] }).success).toBe(false);
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

// Les helpers translationRequired (ADR-0011) sont testés isolément via un
// schéma minimal reproduisant l'usage réel : un .superRefine() déclenché
// seulement si status === 'published'.
const publishGateShape = z.object({
  status: z.enum(['draft', 'published']),
  field: z.any().optional(),
});

describe('checkLocalizedStringTranslation', () => {
  const schema = publishGateShape.superRefine((data, ctx) => {
    if (data.status !== 'published') return;
    checkLocalizedStringTranslation(data.field, ['field'], ctx);
  });

  it('ne bloque pas un champ absent, même en published', () => {
    expect(schema.safeParse({ status: 'published' }).success).toBe(true);
  });

  it('ne bloque pas en draft même si en manque', () => {
    expect(schema.safeParse({ status: 'draft', field: { fr: 'Bonjour' } }).success).toBe(true);
  });

  it('bloque en published si en manque', () => {
    expect(schema.safeParse({ status: 'published', field: { fr: 'Bonjour' } }).success).toBe(false);
  });

  it('accepte en published si en est renseigné', () => {
    expect(
      schema.safeParse({ status: 'published', field: { fr: 'Bonjour', en: 'Hello' } }).success,
    ).toBe(true);
  });
});

describe('checkLocalizedListTranslation', () => {
  const schema = publishGateShape.superRefine((data, ctx) => {
    if (data.status !== 'published') return;
    checkLocalizedListTranslation(data.field, ['field'], ctx);
  });

  it('ne bloque pas un champ absent en published', () => {
    expect(schema.safeParse({ status: 'published' }).success).toBe(true);
  });

  it('bloque en published si en manque', () => {
    expect(schema.safeParse({ status: 'published', field: { fr: ['Un'] } }).success).toBe(false);
  });

  it('accepte en published si en est renseigné', () => {
    expect(
      schema.safeParse({ status: 'published', field: { fr: ['Un'], en: ['One'] } }).success,
    ).toBe(true);
  });
});

describe('checkBilingualMediaTranslation', () => {
  const schema = publishGateShape.superRefine((data, ctx) => {
    if (data.status !== 'published') return;
    checkBilingualMediaTranslation(data.field, ['field'], ctx);
  });

  it('ne bloque pas un champ absent en published', () => {
    expect(schema.safeParse({ status: 'published' }).success).toBe(true);
  });

  it('bloque en published si en manque', () => {
    expect(schema.safeParse({ status: 'published', field: { fr: {} } }).success).toBe(false);
  });

  it('accepte en published si en est présent', () => {
    expect(schema.safeParse({ status: 'published', field: { fr: {}, en: {} } }).success).toBe(true);
  });
});
