import { z } from 'zod';
import {
  checkLocalizedStringTranslation,
  contentStatusSchema,
  isoDateSchema,
  localizedString,
  slugSchema,
} from './common';

// issuer optionnel : aucune source explicite du dossier MOA n'impose ce
// champ pour Certification (F03-002 traite Education+Certification ensemble
// sans détail de champs propre à Certification) — décision PR#2.
export const certificationSchema = z
  .object({
    slug: slugSchema,
    status: contentStatusSchema,
    name: localizedString(),
    issuer: localizedString().optional(),
    issueDate: isoDateSchema,
    verificationUrl: z.string().url().optional(),
    skills: z.array(slugSchema).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.status !== 'published') return;

    checkLocalizedStringTranslation(data.name, ['name'], ctx);
    checkLocalizedStringTranslation(data.issuer, ['issuer'], ctx);
  });

export type Certification = z.infer<typeof certificationSchema>;
