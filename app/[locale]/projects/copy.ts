import type { Project } from '../../../lib/content/getContent';
import type { Locale } from '../layout';

// Dictionnaire minimal, strictement scopé à la liste des projets (fiche
// détaillée hors périmètre de cette PR — voir décision PO). Pas un système
// i18n général. `satisfies Record<Locale, ProjectsCopy>` garantit à la
// compilation que fr et en exposent les mêmes clés.
export interface ProjectsCopy {
  listHeading: string;
  empty: string;
  typeLabels: Record<Project['type'], string>;
}

const PROJECTS_COPY = {
  fr: {
    listHeading: 'Projets',
    empty: 'Aucun projet publié pour le moment.',
    typeLabels: {
      personal: 'Projet personnel',
      academic: 'Projet académique',
      hackathon: 'Hackathon',
    },
  },
  en: {
    listHeading: 'Projects',
    empty: 'No published projects yet.',
    typeLabels: {
      personal: 'Personal project',
      academic: 'Academic project',
      hackathon: 'Hackathon',
    },
  },
} as const satisfies Record<Locale, ProjectsCopy>;

export function getProjectsCopy(locale: Locale): ProjectsCopy {
  return PROJECTS_COPY[locale];
}
