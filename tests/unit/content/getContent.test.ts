import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ContentIntegrityError } from '../../../lib/content/errors';
import { createContentRepository } from '../../../lib/content/getContent';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '../fixtures');

function repositoryFor(fixtureName: string) {
  return createContentRepository({ contentDir: join(FIXTURES_DIR, fixtureName, 'content') });
}

describe('getProjects', () => {
  const repository = repositoryFor('content-read');

  it('exclut draft, review et archived par défaut', () => {
    const slugs = repository.getProjects().map((p) => p.slug);
    expect(slugs).not.toContain('proj-draft');
    expect(slugs).not.toContain('proj-review');
    expect(slugs).not.toContain('proj-archived');
  });

  it('inclut review avec includeReview, mais exclut toujours draft et archived', () => {
    const slugs = repository.getProjects({ includeReview: true }).map((p) => p.slug);
    expect(slugs).toContain('proj-review');
    expect(slugs).not.toContain('proj-draft');
    expect(slugs).not.toContain('proj-archived');
  });

  it('trie par featuredRank asc, puis startDate desc, puis slug asc (tie-break)', () => {
    const slugs = repository.getProjects().map((p) => p.slug);
    // proj-featured-a (rank 1) < proj-featured-b (rank 2) < projets sans rank
    // (tri par startDate desc puis slug asc entre eux) : proj-no-rank
    // (2025) avant proj-tie-a/proj-tie-b (2022, égalité -> slug asc).
    expect(slugs).toEqual([
      'proj-featured-a',
      'proj-featured-b',
      'proj-no-rank',
      'proj-tie-a',
      'proj-tie-b',
    ]);
  });
});

describe('getProjectBySlug', () => {
  const repository = repositoryFor('content-read');

  it('retourne null pour un slug inexistant', () => {
    expect(repository.getProjectBySlug('inconnu')).toBeNull();
  });

  it('retourne null pour un projet existant mais non visible (draft)', () => {
    expect(repository.getProjectBySlug('proj-draft')).toBeNull();
  });

  it('hydrate les skills visibles et omet silencieusement le skill en draft', () => {
    const result = repository.getProjectBySlug('proj-featured-a');
    expect(result).not.toBeNull();
    expect(result?.skills.map((s) => s.slug)).toEqual(['skill-published']);
  });

  it('inclut un skill en review seulement si includeReview est activé', () => {
    const withoutPreview = repository.getProjectBySlug('proj-featured-b');
    expect(withoutPreview?.skills.map((s) => s.slug)).toEqual(['skill-published']);

    const withPreview = repository.getProjectBySlug('proj-featured-b', { includeReview: true });
    expect(withPreview?.skills.map((s) => s.slug).sort()).toEqual([
      'skill-published',
      'skill-review',
    ]);
  });

  it('lève ContentIntegrityError si un skill référencé n’existe dans aucune entrée de la collection', () => {
    const missingRelationRepository = repositoryFor('content-read-missing-relation');
    expect(() => missingRelationRepository.getProjectBySlug('proj-missing-skill')).toThrow(
      ContentIntegrityError,
    );
  });

  it('lève ContentIntegrityError si la collection skills référencée contient un doublon de slug', () => {
    const duplicateSkillRepository = repositoryFor('content-read-duplicate-skill-slug');
    expect(() => duplicateSkillRepository.getProjectBySlug('proj-ref')).toThrow(
      ContentIntegrityError,
    );
  });
});

describe('getExperiences', () => {
  const repository = repositoryFor('content-read');

  it('exclut toujours private, même avec includeReview', () => {
    const slugs = repository.getExperiences({ includeReview: true }).map((e) => e.slug);
    expect(slugs).not.toContain('exp-private');
  });

  it('exclut draft, inclut review seulement avec includeReview', () => {
    expect(repository.getExperiences().map((e) => e.slug)).not.toContain('exp-draft');
    expect(repository.getExperiences().map((e) => e.slug)).not.toContain('exp-review');
    expect(repository.getExperiences({ includeReview: true }).map((e) => e.slug)).toContain(
      'exp-review',
    );
  });

  it('trie par startDate desc avec tie-break par slug asc', () => {
    const slugs = repository.getExperiences().map((e) => e.slug);
    expect(slugs).toEqual(['exp-recent', 'exp-tie-a', 'exp-tie-b', 'exp-old']);
  });
});

describe('getEducation', () => {
  const repository = repositoryFor('content-read');

  it('exclut draft et trie par startDate desc', () => {
    const slugs = repository.getEducation().map((e) => e.slug);
    expect(slugs).toEqual(['edu-recent', 'edu-old']);
  });
});

describe('getCertifications', () => {
  const repository = repositoryFor('content-read');

  it('exclut review par défaut, l’inclut avec includeReview, trie par issueDate desc', () => {
    expect(repository.getCertifications().map((c) => c.slug)).toEqual(['cert-recent', 'cert-old']);
    expect(repository.getCertifications({ includeReview: true }).map((c) => c.slug)).toEqual([
      'cert-recent',
      'cert-review',
      'cert-old',
    ]);
  });
});

describe('getSkills', () => {
  const repository = repositoryFor('content-read');

  it('exclut draft, trie par slug asc, inclut review avec includeReview', () => {
    expect(repository.getSkills().map((s) => s.slug)).toEqual([
      'skill-alpha',
      'skill-published',
      'skill-zulu',
    ]);
    expect(repository.getSkills({ includeReview: true }).map((s) => s.slug)).toEqual([
      'skill-alpha',
      'skill-published',
      'skill-review',
      'skill-zulu',
    ]);
  });
});

describe('getHobbies', () => {
  const repository = repositoryFor('content-read');

  it('exclut draft et trie par slug asc', () => {
    expect(repository.getHobbies().map((h) => h.slug)).toEqual(['hobby-alpha', 'hobby-zeta']);
  });
});

describe('getProfile', () => {
  it('retourne le profil published visible', () => {
    const repository = repositoryFor('content-read');
    expect(repository.getProfile()?.status).toBe('published');
  });

  it('retourne null quand aucun fichier profile n’existe', () => {
    const repository = repositoryFor('content-read-profile-empty');
    expect(repository.getProfile()).toBeNull();
  });

  it('retourne null pour un profil review sans includeReview', () => {
    const repository = repositoryFor('content-read-profile-review');
    expect(repository.getProfile()).toBeNull();
  });

  it('retourne le profil review avec includeReview: true', () => {
    const repository = repositoryFor('content-read-profile-review');
    expect(repository.getProfile({ includeReview: true })?.status).toBe('review');
  });

  it('lève ContentIntegrityError si deux profils existent, quels que soient leurs statuts', () => {
    const repository = repositoryFor('content-read-profile-duplicate-mixed');
    // Un seul des deux profils (published) serait visible par défaut : le
    // contrôle de cardinalité doit s'appliquer AVANT le filtrage par statut,
    // donc lever malgré tout, pas retourner silencieusement le seul visible.
    expect(() => repository.getProfile()).toThrow(ContentIntegrityError);
    expect(() => repository.getProfile({ includeReview: true })).toThrow(ContentIntegrityError);
  });
});

describe('doublons de slug détectés à la lecture', () => {
  it('getProjects lève ContentIntegrityError si deux projets partagent le même slug (published + draft)', () => {
    const repository = repositoryFor('content-read-duplicate-project-slug');
    expect(() => repository.getProjects()).toThrow(ContentIntegrityError);
  });
});

describe('indépendance vis-à-vis de this (fonctions déstructurées)', () => {
  it('une fonction déstructurée de createContentRepository fonctionne sans son objet receveur', () => {
    const { getProjects } = createContentRepository({
      contentDir: join(FIXTURES_DIR, 'content-read', 'content'),
    });

    // Appel direct de la fonction déstructurée, hors de toute référence à
    // l'objet d'origine : ne doit pas dépendre d'un `this` lié.
    const slugs = getProjects().map((p) => p.slug);
    expect(slugs).toContain('proj-featured-a');
  });
});
