import { z } from 'zod';
import {
  checkLocalizedStringTranslation,
  contentStatusSchema,
  localizedString,
  slugSchema,
} from './common';

// Pas de champ de relation sortante (projects/experiences/education) sur
// Skill : la relation est portée uniquement par Project/Experience/Education/
// Certification via `skills: slug[]`, jamais dupliquée ici (décision PR#2).
export const skillSchema = z
  .object({
    slug: slugSchema,
    status: contentStatusSchema,
    name: localizedString(),
    category: z.string().min(1),
    level: z
      .object({
        scale: z.string().min(1),
        justification: localizedString(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.status !== 'published') return;

    checkLocalizedStringTranslation(data.name, ['name'], ctx);
    if (data.level) {
      checkLocalizedStringTranslation(data.level.justification, ['level', 'justification'], ctx);
    }
  });

export type Skill = z.infer<typeof skillSchema>;
