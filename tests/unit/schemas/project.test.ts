import { describe, expect, it } from 'vitest';
import { projectSchema } from '../../../schemas/project';

const validProject = {
  slug: 'demo-project',
  status: 'draft' as const,
  type: 'personal' as const,
  title: { fr: 'Projet de démo' },
  summary: { fr: 'Résumé' },
  problem: { fr: 'Problème' },
  solution: { fr: 'Solution' },
  role: { fr: 'Développeur' },
  technologies: ['TypeScript'],
  startDate: '2024-01-01',
};

const publishedProject = {
  ...validProject,
  status: 'published' as const,
  title: { fr: 'Projet de démo', en: 'Demo project' },
  summary: { fr: 'Résumé', en: 'Summary' },
  problem: { fr: 'Problème', en: 'Problem' },
  solution: { fr: 'Solution', en: 'Solution' },
  role: { fr: 'Développeur', en: 'Developer' },
  seo: {
    title: { fr: 'Titre SEO', en: 'SEO title' },
    description: { fr: 'Description SEO', en: 'SEO description' },
    image: { path: 'images/demo.svg', decorative: true, type: 'image' as const },
  },
};

describe('projectSchema', () => {
  it('accepte un cas valide minimal en draft', () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  it('rejette technologies vide', () => {
    expect(projectSchema.safeParse({ ...validProject, technologies: [] }).success).toBe(false);
  });

  it('rejette un type hors enum', () => {
    expect(projectSchema.safeParse({ ...validProject, type: 'internal' }).success).toBe(false);
  });

  it('accepte le statut archived (spécifique à Project)', () => {
    expect(projectSchema.safeParse({ ...validProject, status: 'archived' }).success).toBe(true);
  });

  it('rejette endDate antérieure à startDate', () => {
    expect(
      projectSchema.safeParse({ ...validProject, startDate: '2024-06-01', endDate: '2024-01-01' })
        .success,
    ).toBe(false);
  });

  it('accepte endDate postérieure ou égale à startDate', () => {
    expect(
      projectSchema.safeParse({ ...validProject, startDate: '2024-01-01', endDate: '2024-06-01' })
        .success,
    ).toBe(true);
  });

  it('rejette published sans seo', () => {
    const withoutSeo: Record<string, unknown> = { ...publishedProject };
    delete withoutSeo.seo;
    expect(projectSchema.safeParse(withoutSeo).success).toBe(false);
  });

  it('accepte published avec seo et toutes les traductions complètes', () => {
    expect(projectSchema.safeParse(publishedProject).success).toBe(true);
  });

  it('bloque published si results est présent sans en', () => {
    expect(
      projectSchema.safeParse({ ...publishedProject, results: { fr: ['Résultat'] } }).success,
    ).toBe(false);
  });

  it('accepte results absent sans erreur en published', () => {
    expect(projectSchema.safeParse(publishedProject).success).toBe(true);
  });

  it('rejette un média non-decorative sans alt dans media[]', () => {
    expect(
      projectSchema.safeParse({
        ...validProject,
        media: [{ path: 'images/demo.svg', decorative: false, type: 'image' }],
      }).success,
    ).toBe(false);
  });
});
