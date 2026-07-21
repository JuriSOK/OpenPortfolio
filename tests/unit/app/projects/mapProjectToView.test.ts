import { describe, expect, it } from 'vitest';
import { toProjectCardView } from '../../../../app/[locale]/projects/mapProjectToView';
import type { Project } from '../../../../lib/content/getContent';

// Objets construits à la main, jamais lus depuis content/ ni via fixtures
// YAML — cette suite ne doit dépendre d'aucun état du contenu réel.

const publishedProject: Project = {
  slug: 'openportfolio',
  status: 'published',
  type: 'personal',
  title: { fr: 'OpenPortfolio', en: 'OpenPortfolio' },
  summary: { fr: 'Résumé FR', en: 'Summary EN' },
  problem: { fr: 'Problème FR', en: 'Problem EN' },
  solution: { fr: 'Solution FR', en: 'Solution EN' },
  role: { fr: 'Rôle FR', en: 'Role EN' },
  technologies: ['TypeScript', 'Next.js'],
  startDate: '2026-01-15',
};

describe('toProjectCardView', () => {
  it('résout les champs localisés pour fr', () => {
    const view = toProjectCardView(publishedProject, 'fr');
    expect(view.title).toBe('OpenPortfolio');
    expect(view.summary).toBe('Résumé FR');
    expect(view.typeLabel).toBe('Projet personnel');
  });

  it('résout les champs localisés pour en', () => {
    const view = toProjectCardView(publishedProject, 'en');
    expect(view.summary).toBe('Summary EN');
    expect(view.typeLabel).toBe('Personal project');
  });

  it('repli en -> fr quand la traduction anglaise est absente (statut review)', () => {
    const reviewProject: Project = {
      ...publishedProject,
      status: 'review',
      title: { fr: 'Titre FR seul' },
      summary: { fr: 'Résumé FR seul' },
    };
    const view = toProjectCardView(reviewProject, 'en');
    expect(view.title).toBe('Titre FR seul');
    expect(view.summary).toBe('Résumé FR seul');
  });

  it('ne renseigne jamais href : la route de fiche détaillée n’existe pas dans cette PR', () => {
    const view = toProjectCardView(publishedProject, 'fr');
    expect(view.href).toBeUndefined();
  });

  it('endDate absent : dateRangeLabel = année de début seule', () => {
    const view = toProjectCardView(publishedProject, 'fr');
    expect(view.dateRangeLabel).toBe('2026');
  });

  it('endDate présent et différent : dateRangeLabel = plage d’années', () => {
    const view = toProjectCardView({ ...publishedProject, endDate: '2026-06-01' }, 'fr');
    expect(view.dateRangeLabel).toBe('2026');
    const rangeView = toProjectCardView(
      { ...publishedProject, startDate: '2024-01-01', endDate: '2026-06-01' },
      'fr',
    );
    expect(rangeView.dateRangeLabel).toBe('2024–2026');
  });

  it('media absent : image undefined', () => {
    const view = toProjectCardView(publishedProject, 'fr');
    expect(view.image).toBeUndefined();
  });

  it('media présent mais sans entrée de type image : image undefined', () => {
    const view = toProjectCardView(
      {
        ...publishedProject,
        media: [
          { path: 'documents/cv.pdf', type: 'document', decorative: false, alt: { fr: 'CV' } },
        ],
      },
      'fr',
    );
    expect(view.image).toBeUndefined();
  });

  it('plusieurs images : sélectionne la première entrée de type image', () => {
    const view = toProjectCardView(
      {
        ...publishedProject,
        media: [
          { path: 'documents/cv.pdf', type: 'document', decorative: false, alt: { fr: 'CV' } },
          {
            path: 'images/first.png',
            type: 'image',
            decorative: false,
            alt: { fr: 'Première image' },
          },
          {
            path: 'images/second.png',
            type: 'image',
            decorative: false,
            alt: { fr: 'Seconde image' },
          },
        ],
      },
      'fr',
    );
    expect(view.image).toEqual({ src: '/images/first.png', alt: 'Première image' });
  });

  it('image decorative:true : alt résolu à une chaîne vide', () => {
    const view = toProjectCardView(
      {
        ...publishedProject,
        media: [{ path: 'images/deco.png', type: 'image', decorative: true }],
      },
      'fr',
    );
    expect(view.image).toEqual({ src: '/images/deco.png', alt: '' });
  });

  it('image non décorative avec alt : texte alternatif localisé résolu', () => {
    const view = toProjectCardView(
      {
        ...publishedProject,
        media: [
          {
            path: 'images/info.png',
            type: 'image',
            decorative: false,
            alt: { fr: 'Alt FR', en: 'Alt EN' },
          },
        ],
      },
      'en',
    );
    expect(view.image).toEqual({ src: '/images/info.png', alt: 'Alt EN' });
  });
});
