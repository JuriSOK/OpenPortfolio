import { z } from 'zod';
import {
  checkLocalizedListTranslation,
  checkLocalizedStringTranslation,
  isoDateSchema,
  localizedRichText,
  localizedString,
  localizedStringList,
  slugSchema,
} from './common';
import { mediaSchema } from './media';

// archived n'existe que sur Project (§11.2 du dossier MOA) : enum local,
// contentStatusSchema partagé reste à 3 valeurs pour les autres entités.
export const projectStatusSchema = z.enum(['draft', 'review', 'published', 'archived']);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

const projectTypeSchema = z.enum(['personal', 'academic', 'hackathon']);

const projectLinkSchema = z
  .object({
    type: z.enum(['repo', 'demo', 'article']),
    url: z.string().url(),
  })
  .strict();

const projectSeoSchema = z
  .object({
    title: localizedString(),
    description: localizedString(),
    image: mediaSchema,
  })
  .strict();

export const projectSchema = z
  .object({
    slug: slugSchema,
    status: projectStatusSchema,
    type: projectTypeSchema,
    title: localizedString(),
    summary: localizedString(),
    problem: localizedRichText(),
    solution: localizedRichText(),
    role: localizedString(),
    results: localizedStringList().optional(),
    technologies: z.array(z.string().min(1)).min(1),
    skills: z.array(slugSchema).optional(),
    startDate: isoDateSchema,
    endDate: isoDateSchema.optional(),
    links: z.array(projectLinkSchema).optional(),
    media: z.array(mediaSchema).optional(),
    featuredRank: z.number().int().positive().optional(),
    seo: projectSeoSchema.optional(),
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

    if (data.status === 'published' && !data.seo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['seo'],
        message: 'seo requis pour publier un projet',
      });
    }

    if (data.status !== 'published') return;

    checkLocalizedStringTranslation(data.title, ['title'], ctx);
    checkLocalizedStringTranslation(data.summary, ['summary'], ctx);
    checkLocalizedStringTranslation(data.role, ['role'], ctx);
    checkLocalizedStringTranslation(data.problem, ['problem'], ctx);
    checkLocalizedStringTranslation(data.solution, ['solution'], ctx);
    checkLocalizedListTranslation(data.results, ['results'], ctx);
    if (data.seo) {
      checkLocalizedStringTranslation(data.seo.title, ['seo', 'title'], ctx);
      checkLocalizedStringTranslation(data.seo.description, ['seo', 'description'], ctx);
    }
  });

export type Project = z.infer<typeof projectSchema>;
