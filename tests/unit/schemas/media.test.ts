import { describe, expect, it } from 'vitest';
import { mediaSchema } from '../../../schemas/media';

describe('mediaSchema', () => {
  it('accepte un média decorative sans alt', () => {
    expect(
      mediaSchema.safeParse({ path: 'images/foo.svg', decorative: true, type: 'image' }).success,
    ).toBe(true);
  });

  it('rejette un média non decorative sans alt (F04-003)', () => {
    expect(
      mediaSchema.safeParse({ path: 'images/foo.svg', decorative: false, type: 'image' }).success,
    ).toBe(false);
  });

  it('accepte un média non decorative avec alt', () => {
    expect(
      mediaSchema.safeParse({
        path: 'images/foo.svg',
        decorative: false,
        type: 'image',
        alt: { fr: 'Texte alternatif' },
      }).success,
    ).toBe(true);
  });

  it('applique decorative: false par défaut si non renseigné, et exige alt', () => {
    expect(mediaSchema.safeParse({ path: 'images/foo.svg', type: 'image' }).success).toBe(false);
  });

  it('rejette un type hors enum', () => {
    expect(
      mediaSchema.safeParse({ path: 'images/foo.svg', decorative: true, type: 'audio' }).success,
    ).toBe(false);
  });

  it('rejette une clé additionnelle (.strict())', () => {
    expect(
      mediaSchema.safeParse({
        path: 'images/foo.svg',
        decorative: true,
        type: 'image',
        extra: 'nope',
      }).success,
    ).toBe(false);
  });

  it('accepte le type document (CV PDF)', () => {
    expect(
      mediaSchema.safeParse({ path: 'documents/cv-fr.pdf', decorative: true, type: 'document' })
        .success,
    ).toBe(true);
  });
});
