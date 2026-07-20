import { describe, expect, it } from 'vitest';
import { experienceSchema } from '../../../schemas/experience';

const validExperience = {
  slug: 'exp-one',
  status: 'draft' as const,
  organization: { fr: 'ACME' },
  role: { fr: 'Développeur' },
  startDate: '2022-01-01',
  missions: { fr: ['Développer des fonctionnalités'] },
};

describe('experienceSchema', () => {
  it('accepte un cas valide minimal', () => {
    expect(experienceSchema.safeParse(validExperience).success).toBe(true);
  });

  it('accepte endDate absent (poste en cours)', () => {
    expect(experienceSchema.safeParse(validExperience).success).toBe(true);
  });

  it('rejette endDate antérieure à startDate', () => {
    expect(
      experienceSchema.safeParse({
        ...validExperience,
        startDate: '2022-06-01',
        endDate: '2022-01-01',
      }).success,
    ).toBe(false);
  });

  it('applique private: false par défaut', () => {
    const result = experienceSchema.safeParse(validExperience);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.private).toBe(false);
    }
  });

  it('accepte private: true (F03-001)', () => {
    expect(experienceSchema.safeParse({ ...validExperience, private: true }).success).toBe(true);
  });

  it('bloque la publication si missions.en manque', () => {
    expect(experienceSchema.safeParse({ ...validExperience, status: 'published' }).success).toBe(
      false,
    );
  });

  it('accepte la publication si toutes les traductions sont présentes', () => {
    expect(
      experienceSchema.safeParse({
        ...validExperience,
        status: 'published',
        organization: { fr: 'ACME', en: 'ACME' },
        role: { fr: 'Développeur', en: 'Developer' },
        missions: { fr: ['Développer des fonctionnalités'], en: ['Develop features'] },
      }).success,
    ).toBe(true);
  });
});
