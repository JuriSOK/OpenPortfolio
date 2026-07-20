import { describe, expect, it } from 'vitest';
import { resolveLocalizedString, resolveLocalizedStringList } from '../../../lib/content/locale';

describe('resolveLocalizedString', () => {
  it('retourne fr quand la locale demandée est fr', () => {
    expect(resolveLocalizedString({ fr: 'Bonjour', en: 'Hello' }, 'fr')).toBe('Bonjour');
  });

  it('retourne en quand la locale demandée est en et que la traduction est présente', () => {
    expect(resolveLocalizedString({ fr: 'Bonjour', en: 'Hello' }, 'en')).toBe('Hello');
  });

  it('replie sur fr quand la locale demandée est en et que la traduction est absente', () => {
    expect(resolveLocalizedString({ fr: 'Bonjour' }, 'en')).toBe('Bonjour');
  });

  it('ne replie jamais fr vers en', () => {
    // fr est demandé : même si en existe, il ne doit jamais être utilisé.
    expect(resolveLocalizedString({ fr: 'Bonjour', en: 'Hello' }, 'fr')).toBe('Bonjour');
  });

  it('retourne undefined si la valeur elle-même est absente', () => {
    expect(resolveLocalizedString(undefined, 'en')).toBeUndefined();
  });
});

describe('resolveLocalizedStringList', () => {
  it('retourne fr quand la locale demandée est fr', () => {
    expect(resolveLocalizedStringList({ fr: ['a', 'b'], en: ['x', 'y'] }, 'fr')).toEqual([
      'a',
      'b',
    ]);
  });

  it('retourne en quand la locale demandée est en et que la traduction est présente', () => {
    expect(resolveLocalizedStringList({ fr: ['a', 'b'], en: ['x', 'y'] }, 'en')).toEqual([
      'x',
      'y',
    ]);
  });

  it('replie sur fr quand la locale demandée est en et que la traduction est absente', () => {
    expect(resolveLocalizedStringList({ fr: ['a', 'b'] }, 'en')).toEqual(['a', 'b']);
  });

  it('replie sur fr quand en est un tableau vide', () => {
    expect(resolveLocalizedStringList({ fr: ['a', 'b'], en: [] }, 'en')).toEqual(['a', 'b']);
  });

  it('ne replie jamais fr vers en', () => {
    expect(resolveLocalizedStringList({ fr: ['a'], en: ['x'] }, 'fr')).toEqual(['a']);
  });

  it('retourne undefined si la valeur elle-même est absente', () => {
    expect(resolveLocalizedStringList(undefined, 'fr')).toBeUndefined();
  });
});
