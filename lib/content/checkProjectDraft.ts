import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { slugSchema } from '../../schemas/common';
import { projectSchema, type Project } from '../../schemas/project';
import { skillSchema, type Skill } from '../../schemas/skill';
import { mediaFileExists } from './checkMediaReferences';
import { extractMediaPaths } from './mediaPaths';
import { readCollection } from './readCollection';
import type { ContentValidationError } from './validateContent';

// Enveloppe strictement validée : rejette toute clé inconnue et tout champ
// mal typé avant le moindre accès au système de fichiers. `contentDir` et
// `publicDir` sont volontairement non optionnels ici (contrairement au
// contrat JSON du CLI scripts/check-project-draft.ts) : c'est au CLI de
// résoudre le défaut vers les vrais dossiers du dépôt avant d'appeler cette
// fonction, pour que checkProjectDraft reste toujours explicite et testable
// avec des dossiers temporaires/fixtures — jamais de défaut implicite ici.
const checkProjectDraftInputSchema = z
  .object({
    mode: z.enum(['create', 'update']),
    slug: z.string().min(1),
    contentDir: z.string().min(1),
    publicDir: z.string().min(1),
    candidate: z.unknown(),
    candidateSkills: z.array(z.unknown()).optional(),
  })
  .strict();

export interface CheckProjectDraftResult {
  errors: ContentValidationError[];
  // Présents uniquement si la validation est intégralement réussie
  // (aucune erreur) — jamais de données partielles à exploiter en cas
  // d'échec.
  project?: Project;
  skills?: Skill[];
}

// Dry-run atomique : valide un candidat Project et, le cas échéant, les
// Skill candidates qui l'accompagnent, sans jamais écrire sur le disque
// (aucun appel à writeFileSync/mkdirSync/rm nulle part dans ce module).
// Réutilise exclusivement des briques déjà existantes (projectSchema,
// skillSchema, readCollection, extractMediaPaths, mediaFileExists) : aucune
// règle Zod n'est réimplémentée ici.
export function checkProjectDraft(input: unknown): CheckProjectDraftResult {
  const envelope = checkProjectDraftInputSchema.safeParse(input);
  if (!envelope.success) {
    return {
      errors: envelope.error.issues.map((issue) => ({
        file: '(entrée)',
        field: issue.path.join('.') || '(racine)',
        message: issue.message,
      })),
    };
  }

  const { mode, slug, contentDir, publicDir, candidate, candidateSkills = [] } = envelope.data;

  // Le slug cible doit être conforme à slugSchema AVANT toute construction
  // de chemin — une valeur invalide (ex. contenant "/" ou "..") est rejetée
  // ici, sans le moindre appel fs.
  const slugCheck = slugSchema.safeParse(slug);
  if (!slugCheck.success) {
    return {
      errors: [
        {
          file: '(slug)',
          field: 'slug',
          message: slugCheck.error.issues[0]?.message ?? 'slug invalide',
        },
      ],
    };
  }

  const errors: ContentValidationError[] = [];
  const projectFilePath = join(contentDir, 'projects', `${slug}.yml`);
  const projectFileExists = existsSync(projectFilePath);

  if (mode === 'create' && projectFileExists) {
    errors.push({
      file: projectFilePath,
      field: 'slug',
      message: `slug "${slug}" déjà utilisé (fichier existant) — choisir un autre slug`,
    });
  }

  if (mode === 'update' && !projectFileExists) {
    errors.push({
      file: projectFilePath,
      field: 'slug',
      message: `aucun projet existant pour le slug "${slug}" — mise à jour impossible`,
    });
  }

  const projectResult = projectSchema.safeParse(candidate);
  if (!projectResult.success) {
    for (const issue of projectResult.error.issues) {
      errors.push({
        file: projectFilePath,
        field: issue.path.join('.') || '(racine)',
        message: issue.message,
      });
    }
  } else if (projectResult.data.slug !== slug) {
    // Le slug est immuable : le champ interne doit toujours correspondre au
    // slug cible (donc au nom de fichier). Aucun renommage n'est supporté.
    errors.push({
      file: projectFilePath,
      field: 'slug',
      message: `slug interne "${projectResult.data.slug}" ne correspond pas au slug cible "${slug}" (renommage non supporté)`,
    });
  }

  // Compétences déjà présentes sur disque : slug -> status (issu du champ
  // interne data.slug, comme checkRelations.ts et validateContent.ts, pas du
  // nom de fichier).
  const existingSkillEntries = readCollection(join(contentDir, 'skills'));
  const existingSkillSlugs = new Set<string>();
  const existingSkillStatusBySlug = new Map<string, string>();
  for (const entry of existingSkillEntries) {
    const data = entry.data as Record<string, unknown>;
    if (typeof data.slug === 'string') {
      existingSkillSlugs.add(data.slug);
      if (typeof data.status === 'string') {
        existingSkillStatusBySlug.set(data.slug, data.status);
      }
    }
  }

  // Skill candidates proposées dans la même exécution (pas encore écrites).
  const validCandidateSkills: Skill[] = [];
  const candidateSkillStatusBySlug = new Map<string, string>();
  const seenCandidateSlugs = new Set<string>();

  candidateSkills.forEach((rawCandidateSkill, index) => {
    const rawSlug =
      rawCandidateSkill &&
      typeof rawCandidateSkill === 'object' &&
      typeof (rawCandidateSkill as Record<string, unknown>).slug === 'string'
        ? (rawCandidateSkill as Record<string, unknown>).slug
        : undefined;
    // Label informatif uniquement (jamais utilisé pour un accès fs) : le
    // slug brut n'est pas encore validé à ce stade.
    const skillFileLabel = rawSlug
      ? `content/skills/${rawSlug}.yml (candidate)`
      : `(candidateSkills[${index}])`;

    const skillResult = skillSchema.safeParse(rawCandidateSkill);
    if (!skillResult.success) {
      for (const issue of skillResult.error.issues) {
        errors.push({
          file: skillFileLabel,
          field: issue.path.join('.') || '(racine)',
          message: issue.message,
        });
      }
      return;
    }

    const candidateSlug = skillResult.data.slug;

    if (existingSkillSlugs.has(candidateSlug)) {
      errors.push({
        file: skillFileLabel,
        field: 'slug',
        message: `slug "${candidateSlug}" déjà utilisé par une compétence existante — ne pas dupliquer`,
      });
      return;
    }

    if (seenCandidateSlugs.has(candidateSlug)) {
      errors.push({
        file: skillFileLabel,
        field: 'slug',
        message: `slug "${candidateSlug}" dupliqué entre plusieurs compétences candidates`,
      });
      return;
    }

    seenCandidateSlugs.add(candidateSlug);
    candidateSkillStatusBySlug.set(candidateSlug, skillResult.data.status);
    validCandidateSkills.push(skillResult.data);
  });

  // Ensemble des slugs de compétences disponibles pendant ce dry-run :
  // déjà sur disque ∪ candidates valides de cette exécution.
  const availableSkillSlugs = new Set<string>([...existingSkillSlugs, ...seenCandidateSlugs]);

  if (projectResult.success) {
    for (const skillSlug of projectResult.data.skills ?? []) {
      if (!availableSkillSlugs.has(skillSlug)) {
        errors.push({
          file: projectFilePath,
          field: 'skills',
          message: `relation vers "skills/${skillSlug}" introuvable`,
        });
        continue;
      }

      // Cohérence de visibilité (règle portée uniquement ici, pas par les
      // schémas) : un Project published ne peut référencer que des Skills
      // published, existantes ou candidates. Jamais de publication
      // automatique d'une Skill pour résoudre l'incohérence.
      if (projectResult.data.status === 'published') {
        const skillStatus =
          existingSkillStatusBySlug.get(skillSlug) ?? candidateSkillStatusBySlug.get(skillSlug);
        if (skillStatus !== 'published') {
          errors.push({
            file: projectFilePath,
            field: 'skills',
            message: `la compétence "${skillSlug}" est "${skillStatus ?? 'inconnue'}" — elle ne sera pas visible publiquement si ce projet est publié`,
          });
        }
      }
    }

    for (const mediaPath of extractMediaPaths(projectResult.data)) {
      if (!mediaFileExists(publicDir, mediaPath)) {
        errors.push({
          file: projectFilePath,
          field: 'media.path',
          message: `média introuvable sous public/ : "${mediaPath}"`,
        });
      }
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors,
    project: projectResult.success ? projectResult.data : undefined,
    skills: validCandidateSkills,
  };
}
