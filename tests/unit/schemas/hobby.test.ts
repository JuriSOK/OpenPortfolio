import { describe, expect, it } from 'vitest';
import { hobbySchema } from '../../../schemas/hobby';

const validHobby = {
  slug: 'photographie',
  status: 'draft' as const,
  label: { fr: 'Photographie' },
};

describe('hobbySchema', () => {
  it('accepte un cas valide minimal', () => {
    expect(hobbySchema.safeParse(validHobby).success).toBe(true);
  });

  it('rejette un label manquant', () => {
    const rest: Record<string, unknown> = { ...validHobby };
    delete rest.label;
    expect(hobbySchema.safeParse(rest).success).toBe(false);
  });

  it('rejette une clé additionnelle non spécifiée (ex. description)', () => {
    expect(hobbySchema.safeParse({ ...validHobby, description: { fr: 'x' } }).success).toBe(false);
  });

  it('bloque la publication si label.en manque', () => {
    expect(hobbySchema.safeParse({ ...validHobby, status: 'published' }).success).toBe(false);
  });

  it('accepte la publication si label est traduit', () => {
    expect(
      hobbySchema.safeParse({
        ...validHobby,
        status: 'published',
        label: { fr: 'Photographie', en: 'Photography' },
      }).success,
    ).toBe(true);
  });
});
