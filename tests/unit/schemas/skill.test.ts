import { describe, expect, it } from 'vitest';
import { skillSchema } from '../../../schemas/skill';

const validSkill = {
  slug: 'react',
  status: 'draft' as const,
  name: { fr: 'React' },
  category: 'Frontend',
};

describe('skillSchema', () => {
  it('accepte un cas valide minimal', () => {
    expect(skillSchema.safeParse(validSkill).success).toBe(true);
  });

  it('rejette une catégorie manquante (F03-003)', () => {
    const rest: Record<string, unknown> = { ...validSkill };
    delete rest.category;
    expect(skillSchema.safeParse(rest).success).toBe(false);
  });

  it('rejette un level partiel (scale sans justification)', () => {
    expect(skillSchema.safeParse({ ...validSkill, level: { scale: '1-5' } }).success).toBe(false);
  });

  it('accepte un level complet (scale + justification)', () => {
    expect(
      skillSchema.safeParse({
        ...validSkill,
        level: { scale: '1-5', justification: { fr: 'Utilisé en production depuis 3 ans' } },
      }).success,
    ).toBe(true);
  });

  it('bloque la publication si name.en manque', () => {
    expect(skillSchema.safeParse({ ...validSkill, status: 'published' }).success).toBe(false);
  });

  it('accepte la publication si toutes les traductions sont présentes', () => {
    expect(
      skillSchema.safeParse({
        ...validSkill,
        status: 'published',
        name: { fr: 'React', en: 'React' },
      }).success,
    ).toBe(true);
  });

  it('bloque la publication si level.justification.en manque', () => {
    expect(
      skillSchema.safeParse({
        ...validSkill,
        status: 'published',
        name: { fr: 'React', en: 'React' },
        level: { scale: '1-5', justification: { fr: 'Utilisé en prod' } },
      }).success,
    ).toBe(false);
  });
});
