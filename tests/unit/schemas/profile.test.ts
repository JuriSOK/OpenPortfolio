import { describe, expect, it } from 'vitest';
import { profileSchema } from '../../../schemas/profile';

const validProfile = {
  status: 'draft' as const,
  summary: { fr: 'Résumé du profil' },
  positioning: { fr: 'Positionnement' },
};

describe('profileSchema', () => {
  it('accepte un cas valide minimal, sans champ slug', () => {
    const result = profileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
    if (result.success) {
      expect((result.data as Record<string, unknown>).slug).toBeUndefined();
    }
  });

  it('rejette un champ slug non prévu par le schéma (.strict())', () => {
    expect(profileSchema.safeParse({ ...validProfile, slug: 'profile' }).success).toBe(false);
  });

  it('accepte socialLinks avec une url valide', () => {
    expect(
      profileSchema.safeParse({
        ...validProfile,
        socialLinks: [{ label: { fr: 'GitHub' }, url: 'https://github.com/example' }],
      }).success,
    ).toBe(true);
  });

  it('rejette socialLinks avec une url invalide', () => {
    expect(
      profileSchema.safeParse({
        ...validProfile,
        socialLinks: [{ label: { fr: 'GitHub' }, url: 'not-a-url' }],
      }).success,
    ).toBe(false);
  });

  it('accepte cv avec fr seul (en optionnel avant publication)', () => {
    expect(
      profileSchema.safeParse({
        ...validProfile,
        cv: { fr: { path: 'documents/cv-fr.pdf', decorative: true, type: 'document' } },
      }).success,
    ).toBe(true);
  });

  it('bloque la publication si summary.en manque', () => {
    expect(profileSchema.safeParse({ ...validProfile, status: 'published' }).success).toBe(false);
  });

  it('bloque la publication si cv est présent sans cv.en', () => {
    expect(
      profileSchema.safeParse({
        ...validProfile,
        status: 'published',
        summary: { fr: 'Résumé du profil', en: 'Profile summary' },
        positioning: { fr: 'Positionnement', en: 'Positioning' },
        cv: { fr: { path: 'documents/cv-fr.pdf', decorative: true, type: 'document' } },
      }).success,
    ).toBe(false);
  });

  it('accepte la publication si toutes les traductions et cv.en sont présents', () => {
    expect(
      profileSchema.safeParse({
        ...validProfile,
        status: 'published',
        summary: { fr: 'Résumé du profil', en: 'Profile summary' },
        positioning: { fr: 'Positionnement', en: 'Positioning' },
        socialLinks: [{ label: { fr: 'GitHub', en: 'GitHub' }, url: 'https://github.com/example' }],
        cv: {
          fr: { path: 'documents/cv-fr.pdf', decorative: true, type: 'document' },
          en: { path: 'documents/cv-en.pdf', decorative: true, type: 'document' },
        },
      }).success,
    ).toBe(true);
  });

  it('bloque la publication si socialLinks[].label.en manque', () => {
    expect(
      profileSchema.safeParse({
        ...validProfile,
        status: 'published',
        summary: { fr: 'Résumé du profil', en: 'Profile summary' },
        positioning: { fr: 'Positionnement', en: 'Positioning' },
        socialLinks: [{ label: { fr: 'GitHub' }, url: 'https://github.com/example' }],
      }).success,
    ).toBe(false);
  });
});
