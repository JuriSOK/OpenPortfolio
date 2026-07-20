import { z } from 'zod';
import {
  checkBilingualMediaTranslation,
  checkLocalizedStringTranslation,
  contentStatusSchema,
  localizedRichText,
  localizedString,
  slugSchema,
} from './common';
import { mediaSchema } from './media';

const socialLinkSchema = z
  .object({
    label: localizedString(),
    url: z.string().url(),
  })
  .strict();

// CV localisé (F01-001, F04-003) : fr obligatoire dès que cv existe, en
// optionnel structurellement, requis uniquement en published (ADR-0011).
const cvSchema = z
  .object({
    fr: mediaSchema,
    en: mediaSchema.optional(),
  })
  .strict();

// Profile est un singleton (§11.1) : pas de champ slug, cardinalité (0 ou 1
// fichier) vérifiée par lib/content/validateContent.ts, pas par ce schéma.
// Modèle minimal strict : aucun champ name/headline/languages/availability/
// location — rien dans le dossier MOA ne les justifie.
export const profileSchema = z
  .object({
    status: contentStatusSchema,
    summary: localizedRichText(),
    positioning: localizedString(),
    values: localizedRichText().optional(),
    objectives: localizedRichText().optional(),
    skills: z.array(slugSchema).optional(),
    socialLinks: z.array(socialLinkSchema).optional(),
    contactEmail: z.string().email().optional(),
    cv: cvSchema.optional(),
    portrait: mediaSchema.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.status !== 'published') return;

    checkLocalizedStringTranslation(data.summary, ['summary'], ctx);
    checkLocalizedStringTranslation(data.positioning, ['positioning'], ctx);
    checkLocalizedStringTranslation(data.values, ['values'], ctx);
    checkLocalizedStringTranslation(data.objectives, ['objectives'], ctx);
    data.socialLinks?.forEach((link, index) => {
      checkLocalizedStringTranslation(link.label, ['socialLinks', index, 'label'], ctx);
    });
    checkBilingualMediaTranslation(data.cv, ['cv'], ctx);
  });

export type Profile = z.infer<typeof profileSchema>;
