import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Certification } from '../../schemas/certification';
import { certificationSchema } from '../../schemas/certification';
import type { Education } from '../../schemas/education';
import { educationSchema } from '../../schemas/education';
import type { Experience } from '../../schemas/experience';
import { experienceSchema } from '../../schemas/experience';
import type { Hobby } from '../../schemas/hobby';
import { hobbySchema } from '../../schemas/hobby';
import type { Profile } from '../../schemas/profile';
import { profileSchema } from '../../schemas/profile';
import type { Project } from '../../schemas/project';
import { projectSchema } from '../../schemas/project';
import type { Skill } from '../../schemas/skill';
import { skillSchema } from '../../schemas/skill';
import { ContentIntegrityError } from './errors';
import type { QueryOptions } from './filter';
import { isVisibleExperience, isVisibleProjectStatus, isVisibleStatus } from './filter';
import { indexBySlug, resolveSlugs } from './relations';
import { loadCollection, loadSingletonCollection } from './repository';
import { compareByDateDesc, compareBySlugAsc, compareProjects } from './sort';

export type { QueryOptions } from './filter';
export type { Profile } from '../../schemas/profile';
export type { Project, ProjectStatus } from '../../schemas/project';
export type { Experience } from '../../schemas/experience';
export type { Education } from '../../schemas/education';
export type { Certification } from '../../schemas/certification';
export type { Skill } from '../../schemas/skill';
export type { Hobby } from '../../schemas/hobby';

export type ProjectWithRelations = Omit<Project, 'skills'> & { skills: Skill[] };

export interface ContentRepository {
  getProfile(options?: QueryOptions): Profile | null;
  getProjects(options?: QueryOptions): Project[];
  getProjectBySlug(slug: string, options?: QueryOptions): ProjectWithRelations | null;
  getExperiences(options?: QueryOptions): Experience[];
  getEducation(options?: QueryOptions): Education[];
  getCertifications(options?: QueryOptions): Certification[];
  getSkills(options?: QueryOptions): Skill[];
  getHobbies(options?: QueryOptions): Hobby[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONTENT_DIR = join(__dirname, '../..', 'content');

export interface CreateContentRepositoryOptions {
  contentDir?: string;
}

// Fonctions autonomes, fermées lexicalement sur contentDir (closures), pas
// des méthodes dépendant de `this` : `const { getProjects } =
// createContentRepository(...)` puis un appel déstructuré `getProjects()`
// doit fonctionner à l'identique d'un appel `repository.getProjects()`.
export function createContentRepository(
  options: CreateContentRepositoryOptions = {},
): ContentRepository {
  const contentDir = options.contentDir ?? DEFAULT_CONTENT_DIR;

  function getProfile(queryOptions: QueryOptions = {}): Profile | null {
    const entries = loadSingletonCollection({
      contentDir,
      collectionName: 'profile',
      schema: profileSchema,
    });

    // Cardinalité vérifiée AVANT le filtrage par statut : deux profils dont
    // un seul serait visible ne doivent pas être silencieusement acceptés
    // comme "un seul profil". validateContent.ts ne fait ce contrôle qu'au
    // build (prebuild), absent en `npm run dev`.
    if (entries.length > 1) {
      throw new ContentIntegrityError(
        `la collection "profile" n'accepte qu'un seul fichier (singleton), ${entries.length} trouvés`,
      );
    }

    const [profile] = entries;
    if (!profile || !isVisibleStatus(profile.status, queryOptions)) {
      return null;
    }
    return profile;
  }

  function getSkills(queryOptions: QueryOptions = {}): Skill[] {
    const entries = loadCollection({ contentDir, collectionName: 'skills', schema: skillSchema });
    return entries
      .filter((entry) => isVisibleStatus(entry.status, queryOptions))
      .sort(compareBySlugAsc);
  }

  function getHobbies(queryOptions: QueryOptions = {}): Hobby[] {
    const entries = loadCollection({ contentDir, collectionName: 'hobbies', schema: hobbySchema });
    return entries
      .filter((entry) => isVisibleStatus(entry.status, queryOptions))
      .sort(compareBySlugAsc);
  }

  function getEducation(queryOptions: QueryOptions = {}): Education[] {
    const entries = loadCollection({
      contentDir,
      collectionName: 'education',
      schema: educationSchema,
    });
    return entries
      .filter((entry) => isVisibleStatus(entry.status, queryOptions))
      .sort(compareByDateDesc<Education>((entry) => entry.startDate));
  }

  function getCertifications(queryOptions: QueryOptions = {}): Certification[] {
    const entries = loadCollection({
      contentDir,
      collectionName: 'certifications',
      schema: certificationSchema,
    });
    return entries
      .filter((entry) => isVisibleStatus(entry.status, queryOptions))
      .sort(compareByDateDesc<Certification>((entry) => entry.issueDate));
  }

  function getExperiences(queryOptions: QueryOptions = {}): Experience[] {
    const entries = loadCollection({
      contentDir,
      collectionName: 'experiences',
      schema: experienceSchema,
    });
    return entries
      .filter((entry) => isVisibleExperience(entry, queryOptions))
      .sort(compareByDateDesc<Experience>((entry) => entry.startDate));
  }

  function getProjects(queryOptions: QueryOptions = {}): Project[] {
    const entries = loadCollection({
      contentDir,
      collectionName: 'projects',
      schema: projectSchema,
    });
    return entries
      .filter((entry) => isVisibleProjectStatus(entry.status, queryOptions))
      .sort(compareProjects);
  }

  function getProjectBySlug(
    slug: string,
    queryOptions: QueryOptions = {},
  ): ProjectWithRelations | null {
    const project = getProjects(queryOptions).find((entry) => entry.slug === slug);
    if (!project) return null;

    const allSkills = loadCollection({ contentDir, collectionName: 'skills', schema: skillSchema });
    const allSkillsIndex = indexBySlug('skills', allSkills);
    const visibleSkillsIndex = indexBySlug(
      'skills',
      allSkills.filter((skill) => isVisibleStatus(skill.status, queryOptions)),
    );

    const { skills, ...rest } = project;
    const resolvedSkills = resolveSlugs(skills, allSkillsIndex, visibleSkillsIndex, {
      sourceCollection: 'projects',
      sourceSlug: project.slug,
      field: 'skills',
      targetCollection: 'skills',
    });

    return { ...rest, skills: resolvedSkills };
  }

  return {
    getProfile,
    getProjects,
    getProjectBySlug,
    getExperiences,
    getEducation,
    getCertifications,
    getSkills,
    getHobbies,
  };
}

const defaultRepository = createContentRepository();

export const {
  getProfile,
  getProjects,
  getProjectBySlug,
  getExperiences,
  getEducation,
  getCertifications,
  getSkills,
  getHobbies,
} = defaultRepository;
