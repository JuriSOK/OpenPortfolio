import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { checkProjectDraft } from '../../../lib/content/checkProjectDraft';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '../fixtures');

function dirsFor(name: string) {
  const fixtureDir = join(FIXTURES_DIR, name);
  return { contentDir: join(fixtureDir, 'content'), publicDir: join(fixtureDir, 'public') };
}

const minimalDraftProject = (overrides: Record<string, unknown> = {}) => ({
  slug: 'new-project',
  status: 'draft',
  type: 'personal',
  title: { fr: 'Nouveau projet' },
  summary: { fr: 'Résumé' },
  problem: { fr: 'Problème' },
  solution: { fr: 'Solution' },
  role: { fr: 'Développeur' },
  technologies: ['TypeScript'],
  startDate: '2024-01-01',
  ...overrides,
});

describe('checkProjectDraft', () => {
  it('valide un Project referencant une Skill existante (create)', () => {
    const { contentDir, publicDir } = dirsFor('content-valid');
    const result = checkProjectDraft({
      mode: 'create',
      slug: 'new-project',
      contentDir,
      publicDir,
      candidate: minimalDraftProject({ skills: ['react'] }),
    });

    expect(result.errors).toEqual([]);
    expect(result.project?.slug).toBe('new-project');
  });

  it('valide un Project avec une candidate Skill valide (create)', () => {
    const { contentDir, publicDir } = dirsFor('check-project-draft-candidate-skill');
    const result = checkProjectDraft({
      mode: 'create',
      slug: 'new-project',
      contentDir,
      publicDir,
      candidate: minimalDraftProject({ skills: ['brand-new-skill'] }),
      candidateSkills: [
        {
          slug: 'brand-new-skill',
          status: 'draft',
          name: { fr: 'Nouvelle compétence' },
          category: 'Backend',
        },
      ],
    });

    expect(result.errors).toEqual([]);
    expect(result.skills).toHaveLength(1);
    expect(result.skills?.[0]?.slug).toBe('brand-new-skill');
  });

  it('rejette une candidate Skill invalide (category manquante)', () => {
    const { contentDir, publicDir } = dirsFor('check-project-draft-candidate-skill');
    const result = checkProjectDraft({
      mode: 'create',
      slug: 'new-project',
      contentDir,
      publicDir,
      candidate: minimalDraftProject({ skills: ['brand-new-skill'] }),
      candidateSkills: [
        { slug: 'brand-new-skill', status: 'draft', name: { fr: 'Nouvelle compétence' } },
      ],
    });

    expect(result.errors.some((error) => error.field === 'category')).toBe(true);
  });

  it('signale une compétence absente de partout (ni disque, ni candidate)', () => {
    const { contentDir, publicDir } = dirsFor('check-project-draft-unknown-skill');
    const result = checkProjectDraft({
      mode: 'create',
      slug: 'new-project',
      contentDir,
      publicDir,
      candidate: minimalDraftProject({ skills: ['does-not-exist'] }),
    });

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.field).toBe('skills');
    expect(result.errors[0]?.message).toContain('does-not-exist');
  });

  it('rejette un doublon entre une candidate Skill et une Skill existante', () => {
    const { contentDir, publicDir } = dirsFor('check-project-draft-candidate-skill');
    const result = checkProjectDraft({
      mode: 'create',
      slug: 'new-project',
      contentDir,
      publicDir,
      candidate: minimalDraftProject({ skills: ['existing-skill'] }),
      candidateSkills: [
        { slug: 'existing-skill', status: 'draft', name: { fr: 'Doublon' }, category: 'Backend' },
      ],
    });

    expect(
      result.errors.some((error) =>
        error.message.includes('déjà utilisé par une compétence existante'),
      ),
    ).toBe(true);
  });

  it('bloque la création sur un slug déjà pris', () => {
    const { contentDir, publicDir } = dirsFor('check-project-draft-slug-taken');
    const result = checkProjectDraft({
      mode: 'create',
      slug: 'existing-project',
      contentDir,
      publicDir,
      candidate: minimalDraftProject({ slug: 'existing-project' }),
    });

    expect(
      result.errors.some(
        (error) => error.field === 'slug' && error.message.includes('déjà utilisé'),
      ),
    ).toBe(true);
  });

  it('bloque la mise à jour sur une cible absente', () => {
    const { contentDir, publicDir } = dirsFor('check-project-draft-update-missing');
    const result = checkProjectDraft({
      mode: 'update',
      slug: 'ghost-project',
      contentDir,
      publicDir,
      candidate: minimalDraftProject({ slug: 'ghost-project' }),
    });

    expect(result.errors.some((error) => error.message.includes('aucun projet existant'))).toBe(
      true,
    );
  });

  it('bloque en update si le slug cible ne correspond pas au slug interne du candidat', () => {
    const { contentDir, publicDir } = dirsFor('check-project-draft-slug-taken');
    const result = checkProjectDraft({
      mode: 'update',
      slug: 'projet-a',
      contentDir,
      publicDir,
      candidate: minimalDraftProject({ slug: 'projet-b' }),
    });

    expect(
      result.errors.some(
        (error) => error.field === 'slug' && error.message.includes('renommage non supporté'),
      ),
    ).toBe(true);
  });

  it('signale un média référencé absent sous public/', () => {
    const { contentDir, publicDir } = dirsFor('check-project-draft-missing-media');
    const result = checkProjectDraft({
      mode: 'create',
      slug: 'new-project',
      contentDir,
      publicDir,
      candidate: minimalDraftProject({
        media: [{ path: 'images/does-not-exist.svg', type: 'image', decorative: true }],
      }),
    });

    expect(result.errors.some((error) => error.field === 'media.path')).toBe(true);
  });

  describe('cohérence de visibilité Project/Skill', () => {
    const publishedProject = (overrides: Record<string, unknown> = {}) => ({
      slug: 'new-project',
      status: 'published',
      type: 'personal',
      title: { fr: 'Nouveau projet', en: 'New project' },
      summary: { fr: 'Résumé', en: 'Summary' },
      problem: { fr: 'Problème', en: 'Problem' },
      solution: { fr: 'Solution', en: 'Solution' },
      role: { fr: 'Développeur', en: 'Developer' },
      technologies: ['TypeScript'],
      startDate: '2024-01-01',
      seo: {
        title: { fr: 'SEO fr', en: 'SEO en' },
        description: { fr: 'Description fr', en: 'Description en' },
        image: { path: 'images/demo.svg', type: 'image', decorative: true },
      },
      ...overrides,
    });

    it('Project draft + Skill draft : valide', () => {
      const { contentDir, publicDir } = dirsFor('check-project-draft-visibility');
      const result = checkProjectDraft({
        mode: 'create',
        slug: 'new-project',
        contentDir,
        publicDir,
        candidate: minimalDraftProject({ skills: ['skill-draft'] }),
      });

      expect(result.errors).toEqual([]);
    });

    it('Project published + Skill published : valide', () => {
      const { contentDir, publicDir } = dirsFor('check-project-draft-visibility');
      const result = checkProjectDraft({
        mode: 'create',
        slug: 'new-project',
        contentDir,
        publicDir,
        candidate: publishedProject({ skills: ['skill-published'] }),
      });

      expect(result.errors).toEqual([]);
    });

    it('Project published + Skill draft existante : erreur', () => {
      const { contentDir, publicDir } = dirsFor('check-project-draft-visibility');
      const result = checkProjectDraft({
        mode: 'create',
        slug: 'new-project',
        contentDir,
        publicDir,
        candidate: publishedProject({ skills: ['skill-draft'] }),
      });

      expect(
        result.errors.some(
          (error) => error.field === 'skills' && error.message.includes('visible publiquement'),
        ),
      ).toBe(true);
    });

    it('Project published + candidate Skill draft : erreur', () => {
      const { contentDir, publicDir } = dirsFor('check-project-draft-visibility');
      const result = checkProjectDraft({
        mode: 'create',
        slug: 'new-project',
        contentDir,
        publicDir,
        candidate: publishedProject({ skills: ['brand-new-skill'] }),
        candidateSkills: [
          {
            slug: 'brand-new-skill',
            status: 'draft',
            name: { fr: 'Nouvelle' },
            category: 'Backend',
          },
        ],
      });

      expect(
        result.errors.some(
          (error) => error.field === 'skills' && error.message.includes('visible publiquement'),
        ),
      ).toBe(true);
    });

    it('Project published + candidate Skill published mais traduction EN incomplète : erreur Zod propagée', () => {
      const { contentDir, publicDir } = dirsFor('check-project-draft-visibility');
      const result = checkProjectDraft({
        mode: 'create',
        slug: 'new-project',
        contentDir,
        publicDir,
        candidate: publishedProject({ skills: ['brand-new-skill'] }),
        candidateSkills: [
          {
            slug: 'brand-new-skill',
            status: 'published',
            name: { fr: 'Nouvelle' },
            category: 'Backend',
          },
        ],
      });

      expect(result.errors.some((error) => error.field === 'name.en')).toBe(true);
    });

    it("passage d'un Project existant à published avec une Skill review : erreur", () => {
      const { contentDir, publicDir } = dirsFor('check-project-draft-visibility');
      const result = checkProjectDraft({
        mode: 'update',
        slug: 'existing-project',
        contentDir,
        publicDir,
        candidate: publishedProject({ slug: 'existing-project', skills: ['skill-review'] }),
      });

      expect(
        result.errors.some(
          (error) => error.field === 'skills' && error.message.includes('visible publiquement'),
        ),
      ).toBe(true);
    });
  });

  it("refuse l'enveloppe si des clés inconnues sont présentes", () => {
    const { contentDir, publicDir } = dirsFor('content-valid');
    const result = checkProjectDraft({
      mode: 'create',
      slug: 'new-project',
      contentDir,
      publicDir,
      candidate: minimalDraftProject(),
      extraKey: 'not allowed',
    });

    expect(result.errors.length).toBeGreaterThan(0);
  });
});
