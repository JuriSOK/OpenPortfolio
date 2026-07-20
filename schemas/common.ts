import { z } from 'zod';

export const localeSchema = z.enum(['fr', 'en']);
export type Locale = z.infer<typeof localeSchema>;

export const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug kebab-case requis');

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date ISO (AAAA-MM-JJ) requise');

export const contentStatusSchema = z.enum(['draft', 'review', 'published']);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

// ADR-0011 : fr obligatoire dès draft (langue par défaut) ; en optionnel en
// draft/review, requis uniquement au passage à published. La complétude
// conditionnelle par statut est vérifiée par les helpers check* ci-dessous,
// appelés explicitement depuis le .superRefine() de chaque schéma d'entité.
export const localizedString = () =>
  z
    .object({
      fr: z.string().min(1),
      en: z.string().min(1).optional(),
    })
    .strict();

export const localizedRichText = () => localizedString();

const nonEmptyTrimmedString = z
  .string()
  .refine((value) => value.trim().length > 0, 'chaîne non vide requise');

export const localizedStringList = () =>
  z
    .object({
      fr: z.array(nonEmptyTrimmedString).min(1),
      en: z.array(nonEmptyTrimmedString).min(1).optional(),
    })
    .strict();

type LocalizedStringValue = { fr: string; en?: string };
type LocalizedListValue = { fr: string[]; en?: string[] };
type BilingualValue<T> = { fr: T; en?: T };

const TRANSLATION_REQUIRED_MESSAGE =
  'traduction anglaise requise pour publier (translationRequired)';

// Helpers de bas niveau (ADR-0011) : chaque schéma d'entité les appelle
// explicitement, champ par champ (y compris imbriqués et en tableau), depuis
// un .superRefine() déclenché seulement si status === 'published'. No-op si
// la valeur est absente : un champ optionnel non renseigné n'est jamais en
// erreur, à aucun statut.

export function checkLocalizedStringTranslation(
  value: LocalizedStringValue | undefined,
  path: (string | number)[],
  ctx: z.RefinementCtx,
): void {
  if (value === undefined) return;
  if (!value.en || value.en.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [...path, 'en'],
      message: TRANSLATION_REQUIRED_MESSAGE,
    });
  }
}

export function checkLocalizedListTranslation(
  value: LocalizedListValue | undefined,
  path: (string | number)[],
  ctx: z.RefinementCtx,
): void {
  if (value === undefined) return;
  if (!value.en || value.en.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [...path, 'en'],
      message: TRANSLATION_REQUIRED_MESSAGE,
    });
  }
}

export function checkBilingualMediaTranslation<T>(
  value: BilingualValue<T> | undefined,
  path: (string | number)[],
  ctx: z.RefinementCtx,
): void {
  if (value === undefined) return;
  if (value.en === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [...path, 'en'],
      message: TRANSLATION_REQUIRED_MESSAGE,
    });
  }
}
