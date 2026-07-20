import { describe, expect, it } from 'vitest';
import { mergeProjectPatch } from '../../../lib/content/mergeProjectPatch';

const existingProject = {
  slug: 'demo-project',
  status: 'draft',
  type: 'personal',
  title: { fr: 'Titre FR', en: 'Title EN' },
  summary: { fr: 'Résumé FR', en: 'Summary EN' },
  problem: { fr: 'Problème FR', en: 'Problem EN' },
  solution: { fr: 'Solution FR', en: 'Solution EN' },
  role: { fr: 'Rôle FR', en: 'Role EN' },
  results: { fr: ['Résultat FR'], en: ['Result EN'] },
  technologies: ['TypeScript'],
  skills: ['react'],
  startDate: '2024-01-01',
  seo: {
    title: { fr: 'SEO titre FR', en: 'SEO title EN' },
    description: { fr: 'SEO description FR', en: 'SEO description EN' },
    image: { path: 'images/old.svg', type: 'image', decorative: true },
  },
};

describe('mergeProjectPatch', () => {
  it('rejette un existing invalide', () => {
    const result = mergeProjectPatch({ slug: 'x' }, {});
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.merged).toBeUndefined();
  });

  it('rejette une clé inconnue dans le patch', () => {
    const result = mergeProjectPatch(existingProject, { unknownField: 'x' });
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('refuse toute tentative de changement de slug via le patch', () => {
    const result = mergeProjectPatch(existingProject, { slug: 'autre-slug' });
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('laisse les champs absents du patch strictement inchangés', () => {
    const result = mergeProjectPatch(existingProject, { summary: { fr: 'Nouveau résumé FR' } });
    expect(result.errors).toEqual([]);
    expect(result.merged?.title).toEqual(existingProject.title);
    expect(result.merged?.technologies).toEqual(existingProject.technologies);
    expect(result.merged?.skills).toEqual(existingProject.skills);
    expect(result.merged?.slug).toBe('demo-project');
  });

  it('remplace un scalaire seulement si présent dans le patch', () => {
    const result = mergeProjectPatch(existingProject, { featuredRank: 3 });
    expect(result.merged?.featuredRank).toBe(3);
    expect(result.merged?.status).toBe('draft');
  });

  it('fusionne fr/en indépendamment pour un objet localisé simple', () => {
    const result = mergeProjectPatch(existingProject, { summary: { fr: 'Nouveau résumé FR' } });
    expect(result.merged?.summary).toEqual({ fr: 'Nouveau résumé FR', en: 'Summary EN' });
  });

  it('remplace intégralement un tableau seulement si explicitement fourni', () => {
    const result = mergeProjectPatch(existingProject, { technologies: ['Next.js'] });
    expect(result.merged?.technologies).toEqual(['Next.js']);
    expect(result.merged?.skills).toEqual(existingProject.skills);
  });

  it('fusionne seo.title et seo.description indépendamment sans écraser seo.image', () => {
    const result = mergeProjectPatch(existingProject, {
      seo: { title: { fr: 'Nouveau titre SEO FR' } },
    });

    expect(result.errors).toEqual([]);
    expect(result.merged?.seo).toEqual({
      title: { fr: 'Nouveau titre SEO FR', en: 'SEO title EN' },
      description: existingProject.seo.description,
      image: existingProject.seo.image,
    });
  });

  it('remplace seo.image seulement si explicitement fourni dans le patch', () => {
    const result = mergeProjectPatch(existingProject, {
      seo: { image: { path: 'images/new.svg', type: 'image', decorative: true } },
    });

    expect((result.merged?.seo as { image: unknown }).image).toEqual({
      path: 'images/new.svg',
      type: 'image',
      decorative: true,
    });
    expect((result.merged?.seo as { title: unknown }).title).toEqual(existingProject.seo.title);
  });

  it('détecte une traduction potentiellement obsolète sur results quand seul fr est modifié', () => {
    const result = mergeProjectPatch(existingProject, { results: { fr: ['Nouveau résultat FR'] } });

    expect(result.staleTranslationFields).toContain('results.en');
    expect(result.merged?.results).toEqual({ fr: ['Nouveau résultat FR'], en: ['Result EN'] });
  });

  it('détecte une traduction potentiellement obsolète sur title', () => {
    const result = mergeProjectPatch(existingProject, { title: { fr: 'Nouveau titre FR' } });
    expect(result.staleTranslationFields).toContain('title.en');
  });

  it('détecte une traduction potentiellement obsolète sur seo.title et seo.description', () => {
    const result = mergeProjectPatch(existingProject, {
      seo: {
        title: { fr: 'Nouveau titre SEO FR' },
        description: { fr: 'Nouvelle description SEO FR' },
      },
    });

    expect(result.staleTranslationFields).toContain('seo.title.en');
    expect(result.staleTranslationFields).toContain('seo.description.en');
  });

  it('ne signale pas de traduction obsolète quand en est fourni explicitement dans le patch', () => {
    const result = mergeProjectPatch(existingProject, {
      title: { fr: 'Nouveau titre FR', en: 'New title EN' },
    });

    expect(result.staleTranslationFields).toEqual([]);
    expect(result.merged?.title).toEqual({ fr: 'Nouveau titre FR', en: 'New title EN' });
  });

  it("ne signale pas de traduction obsolète quand le champ n'est pas touché par le patch", () => {
    const result = mergeProjectPatch(existingProject, { featuredRank: 5 });
    expect(result.staleTranslationFields).toEqual([]);
  });
});
