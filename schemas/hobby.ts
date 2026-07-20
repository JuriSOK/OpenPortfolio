import { z } from 'zod';
import {
  checkLocalizedStringTranslation,
  contentStatusSchema,
  localizedString,
  slugSchema,
} from './common';
import { mediaSchema } from './media';

// Modèle minimal strict : aucune fiche fonctionnelle ni composant UI dédiés
// à Hobby dans le dossier MOA (seule la relation vers Media est explicite,
// §11.1). `label` est minimal techniquement nécessaire, pas dérivé d'une
// phrase du dossier.
export const hobbySchema = z
  .object({
    slug: slugSchema,
    status: contentStatusSchema,
    label: localizedString(),
    media: z.array(mediaSchema).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.status !== 'published') return;
    checkLocalizedStringTranslation(data.label, ['label'], ctx);
  });

export type Hobby = z.infer<typeof hobbySchema>;
