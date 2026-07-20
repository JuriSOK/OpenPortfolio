import { describe, expect, it } from 'vitest';
import type { Project } from '../../../schemas/project';
import { compareByDateDesc, compareBySlugAsc, compareProjects } from '../../../lib/content/sort';

function project(overrides: Partial<Project> & { slug: string; startDate: string }): Project {
  return {
    status: 'published',
    type: 'personal',
    title: { fr: 'x' },
    summary: { fr: 'x' },
    problem: { fr: 'x' },
    solution: { fr: 'x' },
    role: { fr: 'x' },
    technologies: ['TypeScript'],
    ...overrides,
  } as Project;
}

describe('compareBySlugAsc', () => {
  it('trie par slug croissant', () => {
    const list = [{ slug: 'b' }, { slug: 'a' }].sort(compareBySlugAsc);
    expect(list.map((entry) => entry.slug)).toEqual(['a', 'b']);
  });
});

describe('compareProjects', () => {
  it('priorise featuredRank asc sur la date', () => {
    const a = project({ slug: 'a', featuredRank: 2, startDate: '2025-01-01' });
    const b = project({ slug: 'b', featuredRank: 1, startDate: '2020-01-01' });
    expect([a, b].sort(compareProjects).map((p) => p.slug)).toEqual(['b', 'a']);
  });

  it('place les projets sans featuredRank après les projets rankés', () => {
    const ranked = project({ slug: 'ranked', featuredRank: 1, startDate: '2020-01-01' });
    const unranked = project({ slug: 'unranked', startDate: '2099-01-01' });
    expect([unranked, ranked].sort(compareProjects).map((p) => p.slug)).toEqual([
      'ranked',
      'unranked',
    ]);
  });

  it('trie par startDate décroissante à featuredRank égal', () => {
    const older = project({ slug: 'older', startDate: '2020-01-01' });
    const newer = project({ slug: 'newer', startDate: '2024-01-01' });
    expect([older, newer].sort(compareProjects).map((p) => p.slug)).toEqual(['newer', 'older']);
  });

  it('départage par slug croissant à featuredRank et date strictement égaux', () => {
    const a = project({ slug: 'proj-tie-a', startDate: '2022-01-01' });
    const b = project({ slug: 'proj-tie-b', startDate: '2022-01-01' });
    expect([b, a].sort(compareProjects).map((p) => p.slug)).toEqual(['proj-tie-a', 'proj-tie-b']);
  });
});

describe('compareByDateDesc', () => {
  it('trie par date décroissante avec tie-break par slug', () => {
    const compare = compareByDateDesc<{ slug: string; date: string }>((entry) => entry.date);
    const entries = [
      { slug: 'exp-old', date: '2020-01-01' },
      { slug: 'exp-tie-b', date: '2023-06-01' },
      { slug: 'exp-tie-a', date: '2023-06-01' },
      { slug: 'exp-recent', date: '2024-01-01' },
    ];

    expect(entries.sort(compare).map((entry) => entry.slug)).toEqual([
      'exp-recent',
      'exp-tie-a',
      'exp-tie-b',
      'exp-old',
    ]);
  });
});
