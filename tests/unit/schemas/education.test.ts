import { describe, expect, it } from 'vitest';
import { educationSchema } from '../../../schemas/education';

const validEducation = {
  slug: 'master-info',
  status: 'draft' as const,
  institution: { fr: 'Université de Paris' },
  degree: { fr: 'Master Informatique' },
  startDate: '2020-09-01',
};

describe('educationSchema', () => {
  it('accepte un cas valide minimal', () => {
    expect(educationSchema.safeParse(validEducation).success).toBe(true);
  });

  it('accepte endDate absent (formation en cours)', () => {
    expect(educationSchema.safeParse(validEducation).success).toBe(true);
  });

  it('rejette endDate antérieure à startDate', () => {
    expect(
      educationSchema.safeParse({
        ...validEducation,
        startDate: '2022-09-01',
        endDate: '2020-09-01',
      }).success,
    ).toBe(false);
  });

  it('bloque la publication si degree.en manque', () => {
    expect(educationSchema.safeParse({ ...validEducation, status: 'published' }).success).toBe(
      false,
    );
  });

  it('accepte la publication si toutes les traductions sont présentes', () => {
    expect(
      educationSchema.safeParse({
        ...validEducation,
        status: 'published',
        institution: { fr: 'Université de Paris', en: 'University of Paris' },
        degree: { fr: 'Master Informatique', en: 'Master in Computer Science' },
      }).success,
    ).toBe(true);
  });
});
