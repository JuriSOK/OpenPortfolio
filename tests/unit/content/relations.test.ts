import { describe, expect, it } from 'vitest';
import { ContentIntegrityError } from '../../../lib/content/errors';
import { indexBySlug, resolveSlugs } from '../../../lib/content/relations';

interface Entry {
  slug: string;
  visible: boolean;
}

describe('indexBySlug', () => {
  it('construit un index valide quand les slugs sont différents', () => {
    const index = indexBySlug('skills', [{ slug: 'a' }, { slug: 'b' }]);
    expect(index.size).toBe(2);
    expect(index.get('a')).toEqual({ slug: 'a' });
    expect(index.get('b')).toEqual({ slug: 'b' });
  });

  it('lève ContentIntegrityError sur un doublon de slug, avec le nom de collection et le slug', () => {
    expect(() => indexBySlug('projects', [{ slug: 'dup' }, { slug: 'dup' }])).toThrow(
      ContentIntegrityError,
    );
    try {
      indexBySlug('projects', [{ slug: 'dup' }, { slug: 'dup' }]);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ContentIntegrityError);
      expect((error as Error).message).toContain('projects');
      expect((error as Error).message).toContain('dup');
    }
  });

  it("n'écrase jamais silencieusement une entrée existante dans la Map", () => {
    // Doublon dont une seule entrée serait "visible" au sens métier : le
    // doublon doit rester une erreur, jamais un choix silencieux de l'une
    // des deux entrées (indexBySlug ne connaît même pas la notion de statut).
    expect(() =>
      indexBySlug('projects', [
        { slug: 'dup', status: 'published' },
        { slug: 'dup', status: 'draft' },
      ]),
    ).toThrow(ContentIntegrityError);
  });
});

describe('resolveSlugs', () => {
  const context = {
    sourceCollection: 'projects',
    sourceSlug: 'proj-a',
    field: 'skills',
    targetCollection: 'skills',
  };

  it('retourne [] si slugs est undefined', () => {
    const empty = new Map<string, Entry>();
    expect(resolveSlugs(undefined, empty, empty, context)).toEqual([]);
  });

  it('inclut un slug existant et visible', () => {
    const visible: Entry = { slug: 'react', visible: true };
    const allIndex = new Map([['react', visible]]);
    const visibleIndex = new Map([['react', visible]]);
    expect(resolveSlugs(['react'], allIndex, visibleIndex, context)).toEqual([visible]);
  });

  it('omet silencieusement un slug existant mais non visible (draft, ou review sans includeReview)', () => {
    const invisible: Entry = { slug: 'draft-skill', visible: false };
    const allIndex = new Map([['draft-skill', invisible]]);
    const visibleIndex = new Map<string, Entry>(); // vide : rien de visible

    expect(resolveSlugs(['draft-skill'], allIndex, visibleIndex, context)).toEqual([]);
  });

  it('inclut un slug en review quand includeReview est pris en compte dans visibleIndex', () => {
    const reviewEntry: Entry = { slug: 'review-skill', visible: true };
    const allIndex = new Map([['review-skill', reviewEntry]]);
    // visibleIndex simule un appel avec includeReview: true
    const visibleIndex = new Map([['review-skill', reviewEntry]]);

    expect(resolveSlugs(['review-skill'], allIndex, visibleIndex, context)).toEqual([reviewEntry]);
  });

  it("n'inclut jamais un slug en draft, même si visibleIndex représente includeReview: true", () => {
    const draftEntry: Entry = { slug: 'draft-skill', visible: false };
    const allIndex = new Map([['draft-skill', draftEntry]]);
    // draft n'apparaît jamais dans visibleIndex, quel que soit includeReview.
    const visibleIndex = new Map<string, Entry>();

    expect(resolveSlugs(['draft-skill'], allIndex, visibleIndex, context)).toEqual([]);
  });

  it("lève ContentIntegrityError si le slug n'existe dans aucune entrée cible", () => {
    const allIndex = new Map<string, Entry>();
    const visibleIndex = new Map<string, Entry>();

    expect(() => resolveSlugs(['ghost'], allIndex, visibleIndex, context)).toThrow(
      ContentIntegrityError,
    );
    try {
      resolveSlugs(['ghost'], allIndex, visibleIndex, context);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ContentIntegrityError);
      const message = (error as Error).message;
      expect(message).toContain('projects');
      expect(message).toContain('proj-a');
      expect(message).toContain('skills');
      expect(message).toContain('ghost');
    }
  });

  it('préserve l’ordre des slugs déclarés', () => {
    const a: Entry = { slug: 'a', visible: true };
    const b: Entry = { slug: 'b', visible: true };
    const allIndex = new Map([
      ['a', a],
      ['b', b],
    ]);
    const visibleIndex = new Map([
      ['a', a],
      ['b', b],
    ]);
    expect(resolveSlugs(['b', 'a'], allIndex, visibleIndex, context)).toEqual([b, a]);
  });
});
