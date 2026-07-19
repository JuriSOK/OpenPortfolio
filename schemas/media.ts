import { z } from 'zod';
import { localizedString } from './common';

export const mediaSchema = z
  .object({
    // Chemin relatif à public/ (ex. "images/examples/example-cover.svg").
    path: z.string().min(1),
    alt: localizedString().optional(),
    decorative: z.boolean().default(false),
    type: z.enum(['image', 'document', 'video', 'link']),
  })
  .strict();

export type Media = z.infer<typeof mediaSchema>;
