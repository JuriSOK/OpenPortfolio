import { z } from 'zod';
import {
  checkLocalizedStringTranslation,
  contentStatusSchema,
  isoDateSchema,
  localizedString,
  slugSchema,
} from './common';

export const educationSchema = z
  .object({
    slug: slugSchema,
    status: contentStatusSchema,
    institution: localizedString(),
    degree: localizedString(),
    specialization: localizedString().optional(),
    startDate: isoDateSchema,
    endDate: isoDateSchema.optional(),
    skills: z.array(slugSchema).optional(),
    projects: z.array(slugSchema).optional(),
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

    checkLocalizedStringTranslation(data.institution, ['institution'], ctx);
    checkLocalizedStringTranslation(data.degree, ['degree'], ctx);
    checkLocalizedStringTranslation(data.specialization, ['specialization'], ctx);
  });

export type Education = z.infer<typeof educationSchema>;
