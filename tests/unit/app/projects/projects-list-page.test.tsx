import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { Project } from '../../../../lib/content/getContent';

// Indépendance vis-à-vis du contenu réel (plan PR6 §8) : lib/content/getContent
// est mocké — cette suite reste vraie quel que soit le statut de
// content/projects/openportfolio.yml, avant ou après sa publication.
vi.mock('../../../../lib/content/getContent', () => ({
  getProjects: vi.fn(),
}));

import { getProjects } from '../../../../lib/content/getContent';
import ProjectsListPage from '../../../../app/[locale]/projects/page';

const mockedGetProjects = vi.mocked(getProjects);

function buildProject(overrides: Partial<Project>): Project {
  return {
    slug: 'project-a',
    status: 'published',
    type: 'personal',
    title: { fr: 'Titre FR', en: 'Title EN' },
    summary: { fr: 'Résumé FR', en: 'Summary EN' },
    problem: { fr: 'Problème', en: 'Problem' },
    solution: { fr: 'Solution', en: 'Solution' },
    role: { fr: 'Rôle', en: 'Role' },
    technologies: ['TypeScript'],
    startDate: '2026-01-01',
    ...overrides,
  };
}

describe('ProjectsListPage', () => {
  it('état vide (fr) : texte accessible affiché quand getProjects retourne []', async () => {
    mockedGetProjects.mockReturnValue([]);
    const element = await ProjectsListPage({ params: Promise.resolve({ locale: 'fr' }) });
    const html = renderToStaticMarkup(element);
    expect(html).toContain('Aucun projet publié pour le moment.');
    expect(html).toContain('role="status"');
  });

  it('état vide (en) : texte accessible affiché quand getProjects retourne []', async () => {
    mockedGetProjects.mockReturnValue([]);
    const element = await ProjectsListPage({ params: Promise.resolve({ locale: 'en' }) });
    const html = renderToStaticMarkup(element);
    expect(html).toContain('No published projects yet.');
  });

  it('liste avec projets publiés : rendu dans l’ordre transmis par getProjects, sans retri', async () => {
    mockedGetProjects.mockReturnValue([
      buildProject({ slug: 'project-b', title: { fr: 'Projet B' } }),
      buildProject({ slug: 'project-a', title: { fr: 'Projet A' } }),
    ]);
    const element = await ProjectsListPage({ params: Promise.resolve({ locale: 'fr' }) });
    const html = renderToStaticMarkup(element);
    expect(html).not.toContain('Aucun projet publié');
    const indexB = html.indexOf('Projet B');
    const indexA = html.indexOf('Projet A');
    expect(indexB).toBeGreaterThanOrEqual(0);
    expect(indexA).toBeGreaterThan(indexB);
  });

  it('un seul projet publié : rendu correct sans état vide', async () => {
    mockedGetProjects.mockReturnValue([buildProject({})]);
    const element = await ProjectsListPage({ params: Promise.resolve({ locale: 'fr' }) });
    const html = renderToStaticMarkup(element);
    expect(html).toContain('Titre FR');
    expect(html).not.toContain('Aucun projet publié');
  });

  it('aucun lien cassé : la route de fiche détaillée n’existe pas, aucune carte ne pointe vers /projects/<slug>/', async () => {
    mockedGetProjects.mockReturnValue([
      buildProject({ slug: 'project-a' }),
      buildProject({ slug: 'project-b' }),
    ]);
    const element = await ProjectsListPage({ params: Promise.resolve({ locale: 'fr' }) });
    const html = renderToStaticMarkup(element);
    expect(html).not.toContain('href="');
  });
});
