import type { Project } from '../../schemas/project';

interface Sluggable {
  slug: string;
}

function compareBySlugAsc(a: Sluggable, b: Sluggable): number {
  return a.slug.localeCompare(b.slug);
}

// Ordre projets (F02-001) : featuredRank asc (undefined en dernier), puis
// startDate desc, tie-break final par slug asc pour un ordre 100%
// déterministe même à égalité stricte.
export function compareProjects(a: Project, b: Project): number {
  const rankA = a.featuredRank ?? Number.POSITIVE_INFINITY;
  const rankB = b.featuredRank ?? Number.POSITIVE_INFINITY;
  if (rankA !== rankB) return rankA - rankB;
  if (a.startDate !== b.startDate) return b.startDate.localeCompare(a.startDate);
  return compareBySlugAsc(a, b);
}

// Comparateur générique par date décroissante (dates ISO AAAA-MM-JJ,
// comparables lexicographiquement), tie-break final par slug asc. Réutilisé
// pour Experience.startDate, Education.startDate, Certification.issueDate.
export function compareByDateDesc<T extends Sluggable>(
  getDate: (entry: T) => string,
): (a: T, b: T) => number {
  return (a, b) => {
    const dateA = getDate(a);
    const dateB = getDate(b);
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return compareBySlugAsc(a, b);
  };
}

export { compareBySlugAsc };
