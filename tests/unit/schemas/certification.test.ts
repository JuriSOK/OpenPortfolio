import { describe, expect, it } from 'vitest';
import { certificationSchema } from '../../../schemas/certification';

const validCertification = {
  slug: 'aws-saa',
  status: 'draft' as const,
  name: { fr: 'AWS Solutions Architect Associate' },
  issueDate: '2023-05-01',
};

describe('certificationSchema', () => {
  it('accepte un cas valide sans issuer (optionnel)', () => {
    expect(certificationSchema.safeParse(validCertification).success).toBe(true);
  });

  it('accepte issuer présent', () => {
    expect(
      certificationSchema.safeParse({
        ...validCertification,
        issuer: { fr: 'Amazon Web Services' },
      }).success,
    ).toBe(true);
  });

  it('rejette un verificationUrl invalide', () => {
    expect(
      certificationSchema.safeParse({ ...validCertification, verificationUrl: 'not-a-url' })
        .success,
    ).toBe(false);
  });

  it('bloque la publication si name.en manque', () => {
    expect(
      certificationSchema.safeParse({ ...validCertification, status: 'published' }).success,
    ).toBe(false);
  });

  it('accepte la publication sans issuer si name est traduit', () => {
    expect(
      certificationSchema.safeParse({
        ...validCertification,
        status: 'published',
        name: { fr: 'AWS Solutions Architect Associate', en: 'AWS Solutions Architect Associate' },
      }).success,
    ).toBe(true);
  });

  it('bloque la publication si issuer est présent sans en', () => {
    expect(
      certificationSchema.safeParse({
        ...validCertification,
        status: 'published',
        name: { fr: 'AWS SAA', en: 'AWS SAA' },
        issuer: { fr: 'Amazon Web Services' },
      }).success,
    ).toBe(false);
  });
});
