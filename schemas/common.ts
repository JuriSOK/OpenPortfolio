import { z } from 'zod';

export const localeSchema = z.enum(['fr', 'en']);
export type Locale = z.infer<typeof localeSchema>;

export const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug kebab-case requis');

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date ISO (AAAA-MM-JJ) requise');

export const contentStatusSchema = z.enum(['draft', 'review', 'published']);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

// fr ET en toujours requis ensemble (jamais .partial()) : la complétude de
// traduction (ADR-0005) est garantie structurellement par Zod, pas par une
// vérification ad hoc séparée.
export const localizedString = () =>
  z
    .object({
      fr: z.string().min(1),
      en: z.string().min(1),
    })
    .strict();

export const localizedRichText = () => localizedString();

export const localizedStringList = () =>
  z
    .object({
      fr: z.array(z.string()),
      en: z.array(z.string()),
    })
    .strict();
