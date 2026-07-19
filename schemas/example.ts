import { z } from 'zod';
import { contentStatusSchema, localizedString, slugSchema } from './common';
import { mediaSchema } from './media';

// Schéma générique de démonstration, sans rapport avec une entité métier
// réelle (Profile/Project/Experience/...). Son unique rôle est de prouver
// que le pipeline content/*.yml → Zod → lib/content/* → validate-content
// fonctionne de bout en bout. Il sera supprimé quand les schémas métier
// réels seront ajoutés (PR dédiée, cf. dossier produit §11).
export const exampleItemSchema = z
  .object({
    slug: slugSchema,
    status: contentStatusSchema,
    title: localizedString(),
    media: mediaSchema.optional(),
  })
  .strict();

export type ExampleItem = z.infer<typeof exampleItemSchema>;
