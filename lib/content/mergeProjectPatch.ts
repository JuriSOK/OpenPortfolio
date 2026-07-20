import { z } from 'zod';
import { projectStatusSchema, projectSchema } from '../../schemas/project';
import type { ContentValidationError } from './validateContent';

// Objet localisé partiel : les deux sous-champs sont optionnels dans un
// patch (contrairement à schemas/common.ts::localizedString(), où `fr` est
// obligatoire — un patch peut légitimement ne toucher qu'à `en`, ou l'un ou
// l'autre).
const localizedStringPatchSchema = z
  .object({ fr: z.string().min(1).optional(), en: z.string().min(1).optional() })
  .strict();

const localizedListPatchSchema = z
  .object({ fr: z.array(z.string()).optional(), en: z.array(z.string()).optional() })
  .strict();

// Schéma dédié au patch partiel — strict, sans le champ `slug` (donc toute
// tentative de changement de slug est rejetée comme clé inconnue). Ne
// réimplémente pas les règles métier fines (enums de `type`, format ISO de
// `startDate`, etc.) : seule la *forme* est validée ici, la validation
// sémantique complète du résultat fusionné est de la responsabilité de
// checkProjectDraft (projectSchema), appelé juste après par la skill.
const projectPatchSchema = z
  .object({
    status: projectStatusSchema.optional(),
    type: z.string().optional(),
    title: localizedStringPatchSchema.optional(),
    summary: localizedStringPatchSchema.optional(),
    problem: localizedStringPatchSchema.optional(),
    solution: localizedStringPatchSchema.optional(),
    role: localizedStringPatchSchema.optional(),
    results: localizedListPatchSchema.optional(),
    technologies: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    links: z.array(z.unknown()).optional(),
    media: z.array(z.unknown()).optional(),
    featuredRank: z.number().optional(),
    seo: z
      .object({
        title: localizedStringPatchSchema.optional(),
        description: localizedStringPatchSchema.optional(),
        image: z.unknown().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export interface MergeProjectPatchResult {
  errors: ContentValidationError[];
  merged?: Record<string, unknown>;
  staleTranslationFields?: string[];
}

type LocalizedStringLike = { fr?: string; en?: string } | undefined;

function mergeLocalizedString(
  path: string,
  existing: LocalizedStringLike,
  patch: LocalizedStringLike,
  staleTranslationFields: string[],
): LocalizedStringLike {
  if (patch === undefined) {
    return existing;
  }

  const merged = {
    fr: patch.fr ?? existing?.fr,
    en: patch.en ?? existing?.en,
  };

  const frChanged = patch.fr !== undefined && patch.fr !== existing?.fr;
  const enPreserved = patch.en === undefined;
  if (frChanged && enPreserved && existing?.en) {
    staleTranslationFields.push(`${path}.en`);
  }

  return merged;
}

type LocalizedListLike = { fr?: string[]; en?: string[] } | undefined;

function mergeLocalizedList(
  path: string,
  existing: LocalizedListLike,
  patch: LocalizedListLike,
  staleTranslationFields: string[],
): LocalizedListLike {
  if (patch === undefined) {
    return existing;
  }

  const merged = {
    fr: patch.fr ?? existing?.fr,
    en: patch.en ?? existing?.en,
  };

  const frChanged =
    patch.fr !== undefined && JSON.stringify(patch.fr) !== JSON.stringify(existing?.fr);
  const enPreserved = patch.en === undefined;
  if (frChanged && enPreserved && existing?.en && existing.en.length > 0) {
    staleTranslationFields.push(`${path}.en`);
  }

  return merged;
}

// Fusion déterministe d'un patch partiel sur un Project existant. Jamais de
// sérialisation YAML ici : uniquement des objets JS en mémoire. Le résultat
// (`merged`) doit être revalidé par checkProjectDraft (projectSchema) avant
// toute écriture — cette fonction ne remplace pas cette validation.
export function mergeProjectPatch(existing: unknown, patch: unknown): MergeProjectPatchResult {
  const existingResult = projectSchema.safeParse(existing);
  if (!existingResult.success) {
    return {
      errors: existingResult.error.issues.map((issue) => ({
        file: '(existing)',
        field: issue.path.join('.') || '(racine)',
        message: issue.message,
      })),
    };
  }

  const patchResult = projectPatchSchema.safeParse(patch);
  if (!patchResult.success) {
    return {
      errors: patchResult.error.issues.map((issue) => ({
        file: '(patch)',
        field: issue.path.join('.') || '(racine)',
        message: issue.message,
      })),
    };
  }

  const ex = existingResult.data as unknown as Record<string, unknown>;
  const p = patchResult.data as Record<string, unknown>;
  const staleTranslationFields: string[] = [];

  const merged: Record<string, unknown> = {
    ...ex,
    ...(p.status !== undefined ? { status: p.status } : {}),
    ...(p.type !== undefined ? { type: p.type } : {}),
    ...(p.startDate !== undefined ? { startDate: p.startDate } : {}),
    ...(p.endDate !== undefined ? { endDate: p.endDate } : {}),
    ...(p.featuredRank !== undefined ? { featuredRank: p.featuredRank } : {}),
    ...(p.technologies !== undefined ? { technologies: p.technologies } : {}),
    ...(p.skills !== undefined ? { skills: p.skills } : {}),
    ...(p.links !== undefined ? { links: p.links } : {}),
    ...(p.media !== undefined ? { media: p.media } : {}),
  };

  merged.title = mergeLocalizedString(
    'title',
    ex.title as LocalizedStringLike,
    p.title as LocalizedStringLike,
    staleTranslationFields,
  );
  merged.summary = mergeLocalizedString(
    'summary',
    ex.summary as LocalizedStringLike,
    p.summary as LocalizedStringLike,
    staleTranslationFields,
  );
  merged.problem = mergeLocalizedString(
    'problem',
    ex.problem as LocalizedStringLike,
    p.problem as LocalizedStringLike,
    staleTranslationFields,
  );
  merged.solution = mergeLocalizedString(
    'solution',
    ex.solution as LocalizedStringLike,
    p.solution as LocalizedStringLike,
    staleTranslationFields,
  );
  merged.role = mergeLocalizedString(
    'role',
    ex.role as LocalizedStringLike,
    p.role as LocalizedStringLike,
    staleTranslationFields,
  );
  merged.results = mergeLocalizedList(
    'results',
    ex.results as LocalizedListLike,
    p.results as LocalizedListLike,
    staleTranslationFields,
  );

  if (p.seo !== undefined) {
    const existingSeo = (ex.seo as Record<string, unknown> | undefined) ?? {};
    const patchSeo = p.seo as Record<string, unknown>;
    merged.seo = {
      ...existingSeo,
      ...(patchSeo.image !== undefined ? { image: patchSeo.image } : {}),
      title: mergeLocalizedString(
        'seo.title',
        existingSeo.title as LocalizedStringLike,
        patchSeo.title as LocalizedStringLike,
        staleTranslationFields,
      ),
      description: mergeLocalizedString(
        'seo.description',
        existingSeo.description as LocalizedStringLike,
        patchSeo.description as LocalizedStringLike,
        staleTranslationFields,
      ),
    };
  } else {
    merged.seo = ex.seo;
  }

  // results peut devenir `undefined` si absent des deux côtés — ne pas
  // introduire une clé `results: undefined` explicite dans l'objet fusionné.
  if (merged.results === undefined) {
    delete merged.results;
  }
  if (merged.seo === undefined) {
    delete merged.seo;
  }

  return { errors: [], merged, staleTranslationFields };
}
