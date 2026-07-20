import { describe, expect, it } from 'vitest';
import { ContentConfigurationError, ContentIntegrityError } from '../../../lib/content/errors';

describe('ContentIntegrityError', () => {
  it('porte le bon nom et message', () => {
    const error = new ContentIntegrityError('contenu invalide');
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ContentIntegrityError');
    expect(error.message).toBe('contenu invalide');
  });
});

describe('ContentConfigurationError', () => {
  it('porte le bon nom et message', () => {
    const error = new ContentConfigurationError('contentDir introuvable');
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ContentConfigurationError');
    expect(error.message).toBe('contentDir introuvable');
  });
});

describe('distinction des deux classes', () => {
  it('ContentIntegrityError et ContentConfigurationError ne sont pas confondues', () => {
    const integrity = new ContentIntegrityError('a');
    const configuration = new ContentConfigurationError('b');
    expect(integrity).not.toBeInstanceOf(ContentConfigurationError);
    expect(configuration).not.toBeInstanceOf(ContentIntegrityError);
  });
});
