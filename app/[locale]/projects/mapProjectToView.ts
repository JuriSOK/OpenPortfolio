import type { ProjectCardProps } from '../../../components/projects/ProjectCard';
import type { Media } from '../../../schemas/media';
import type { Project } from '../../../lib/content/getContent';
import { resolveLocalizedString } from '../../../lib/content/locale';
import type { Locale } from '../layout';
import { getProjectsCopy } from './copy';

// Seul point du code qui touche resolveLocalizedString et le formatage de
// dates : ProjectCard ne reçoit jamais de Project ni de locale (voir
// ProjectCard.tsx).

function formatDateRange(startDate: string, endDate: string | undefined): string {
  const startYear = startDate.slice(0, 4);
  if (!endDate) return startYear;
  const endYear = endDate.slice(0, 4);
  if (endYear === startYear) return startYear;
  return `${startYear}–${endYear}`;
}

function resolveImageAlt(media: Media, locale: Locale): string {
  if (media.decorative) return '';
  return resolveLocalizedString(media.alt, locale) ?? '';
}

function firstImage(
  media: Media[] | undefined,
  locale: Locale,
): { src: string; alt: string } | undefined {
  const image = media?.find((item) => item.type === 'image');
  if (!image) return undefined;
  return { src: `/${image.path}`, alt: resolveImageAlt(image, locale) };
}

// La route de fiche détaillée (/projects/[slug]) n'existe pas encore dans
// cette PR (décision PO : PR6 réduite à la liste) : href n'est jamais
// renseigné ici, ProjectCard rend alors un <article> non interactif plutôt
// que de pointer vers une page inexistante. Une future PR de fiche projet
// réintroduira le calcul de href à partir du slug publié.
export function toProjectCardView(project: Project, locale: Locale): ProjectCardProps {
  const copy = getProjectsCopy(locale);
  return {
    title: resolveLocalizedString(project.title, locale) ?? project.title.fr,
    summary: resolveLocalizedString(project.summary, locale) ?? project.summary.fr,
    typeLabel: copy.typeLabels[project.type],
    dateRangeLabel: formatDateRange(project.startDate, project.endDate),
    technologies: project.technologies,
    image: firstImage(project.media, locale),
  };
}
