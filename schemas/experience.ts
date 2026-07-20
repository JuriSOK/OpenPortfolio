import { z } from 'zod';
import {
  checkLocalizedListTranslation,
  checkLocalizedStringTranslation,
  contentStatusSchema,
  isoDateSchema,
  localizedRichText,
  localizedString,
  localizedStringList,
  slugSchema,
} from './common';

// private/exclude n'est ajouté qu'à Experience (F03-001, seule fiche MOA qui
// le mentionne explicitement) — décision PR#2.
export const experienceSchema = z
  .object({
    slug: slugSchema,
    status: contentStatusSchema,
    organization: localizedString(),
    role: localizedString(),
    startDate: isoDateSchema,
    // Absence de endDate = poste en cours (F03-001), pas de valeur sentinelle.
    endDate: isoDateSchema.optional(),
    context: localizedRichText().optional(),
    missions: localizedStringList(),
    results: localizedStringList().optional(),
    technologies: z.array(z.string().min(1)).optional(),
    skills: z.array(slugSchema).optional(),
    projects: z.array(slugSchema).optional(),
    private: z.boolean().default(false),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'endDate doit être postérieure ou égale à startDate',
      });
    }

    if (data.status !== 'published') return;

    checkLocalizedStringTranslation(data.organization, ['organization'], ctx);
    checkLocalizedStringTranslation(data.role, ['role'], ctx);
    checkLocalizedStringTranslation(data.context, ['context'], ctx);
    checkLocalizedListTranslation(data.missions, ['missions'], ctx);
    checkLocalizedListTranslation(data.results, ['results'], ctx);
  });

export type Experience = z.infer<typeof experienceSchema>;
