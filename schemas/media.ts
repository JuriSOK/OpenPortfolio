import { z } from 'zod';
import { localizedString } from './common';

// F04-003 : alt obligatoire pour tout média informatif (decorative: false).
// Intégré ici (pas via un helper appliqué manuellement par entité) pour que
// la règle s'applique automatiquement partout où mediaSchema est réutilisé
// (media[], portrait, cv, seo.image), sans risque d'oubli.
export const mediaSchema = z
  .object({
    // Chemin relatif à public/ (ex. "images/examples/example-cover.svg").
    path: z.string().min(1),
    alt: localizedString().optional(),
    decorative: z.boolean().default(false),
    type: z.enum(['image', 'document', 'video', 'link']),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.decorative && !data.alt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['alt'],
        message: 'texte alternatif requis pour un média non décoratif',
      });
    }
  });

export type Media = z.infer<typeof mediaSchema>;
