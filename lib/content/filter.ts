import type { ContentStatus } from '../../schemas/common';
import type { Experience } from '../../schemas/experience';
import type { ProjectStatus } from '../../schemas/project';

export interface QueryOptions {
  /** Inclut le statut "review" en plus de "published" (F04-002 : review peut
   *  apparaître en prévisualisation). false par défaut : seul published est
   *  exposé. draft est toujours exclu, quelle que soit cette option. */
  includeReview?: boolean;
}

export function isVisibleStatus(status: ContentStatus, options: QueryOptions = {}): boolean {
  if (status === 'published') return true;
  if (status === 'review') return options.includeReview === true;
  return false; // draft toujours exclu
}

// archived n'est jamais exposé publiquement, même en mode preview : c'est un
// statut de fin de vie, distinct du workflow éditorial draft/review/published.
export function isVisibleProjectStatus(status: ProjectStatus, options: QueryOptions = {}): boolean {
  if (status === 'archived') return false;
  return isVisibleStatus(status, options);
}

// private est un mécanisme de confidentialité (F03-001), distinct du
// workflow éditorial : exclu inconditionnellement, y compris en preview.
export function isVisibleExperience(
  experience: Pick<Experience, 'status' | 'private'>,
  options: QueryOptions = {},
): boolean {
  if (experience.private) return false;
  return isVisibleStatus(experience.status, options);
}
