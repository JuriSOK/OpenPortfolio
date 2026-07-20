import { describe, expect, it } from 'vitest';
import {
  isVisibleExperience,
  isVisibleProjectStatus,
  isVisibleStatus,
} from '../../../lib/content/filter';

describe('isVisibleStatus', () => {
  it('expose toujours published', () => {
    expect(isVisibleStatus('published')).toBe(true);
    expect(isVisibleStatus('published', { includeReview: true })).toBe(true);
  });

  it('exclut review par défaut, l’inclut avec includeReview', () => {
    expect(isVisibleStatus('review')).toBe(false);
    expect(isVisibleStatus('review', { includeReview: false })).toBe(false);
    expect(isVisibleStatus('review', { includeReview: true })).toBe(true);
  });

  it('exclut toujours draft, même avec includeReview', () => {
    expect(isVisibleStatus('draft')).toBe(false);
    expect(isVisibleStatus('draft', { includeReview: true })).toBe(false);
  });
});

describe('isVisibleProjectStatus', () => {
  it('exclut toujours archived, même avec includeReview', () => {
    expect(isVisibleProjectStatus('archived')).toBe(false);
    expect(isVisibleProjectStatus('archived', { includeReview: true })).toBe(false);
  });

  it('applique les mêmes règles que isVisibleStatus pour les autres statuts', () => {
    expect(isVisibleProjectStatus('published')).toBe(true);
    expect(isVisibleProjectStatus('review')).toBe(false);
    expect(isVisibleProjectStatus('review', { includeReview: true })).toBe(true);
    expect(isVisibleProjectStatus('draft', { includeReview: true })).toBe(false);
  });
});

describe('isVisibleExperience', () => {
  it('exclut toujours private, même published et includeReview', () => {
    expect(isVisibleExperience({ status: 'published', private: true })).toBe(false);
    expect(
      isVisibleExperience({ status: 'published', private: true }, { includeReview: true }),
    ).toBe(false);
  });

  it('applique les règles de statut standard quand private est false', () => {
    expect(isVisibleExperience({ status: 'published', private: false })).toBe(true);
    expect(isVisibleExperience({ status: 'review', private: false })).toBe(false);
    expect(isVisibleExperience({ status: 'review', private: false }, { includeReview: true })).toBe(
      true,
    );
    expect(isVisibleExperience({ status: 'draft', private: false }, { includeReview: true })).toBe(
      false,
    );
  });
});
