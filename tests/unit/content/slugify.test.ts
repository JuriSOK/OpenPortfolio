import { describe, expect, it } from 'vitest';
import { slugSchema } from '../../../schemas/common';
import { slugify } from '../../../lib/content/slugify';

describe('slugify', () => {
  it('supprime les accents français', () => {
    expect(slugify('Développeur Full-Stack')).toBe('developpeur-full-stack');
  });

  it('gère les apostrophes et esperluettes', () => {
    expect(slugify("L'Oréal & Moi")).toBe('l-oreal-moi');
  });

  it('met en minuscule', () => {
    expect(slugify('PROJET DE DÉMONSTRATION')).toBe('projet-de-demonstration');
  });

  it('réduit les espaces multiples en un seul tiret', () => {
    expect(slugify('  Espaces   multiples  ')).toBe('espaces-multiples');
  });

  it('réduit les tirets déjà multiples', () => {
    expect(slugify('déjà---pris')).toBe('deja-pris');
  });

  it('retire les tirets de début et de fin', () => {
    expect(slugify('-Titre-')).toBe('titre');
  });

  it('conserve les chiffres', () => {
    expect(slugify('Projet 2024 v2')).toBe('projet-2024-v2');
  });

  it('produit systématiquement une sortie conforme à slugSchema', () => {
    const titles = [
      'Développeur Full-Stack',
      "L'Oréal & Moi",
      'Café à Paris — Été 2024',
      'Projet 2024 v2',
      '  Espaces   multiples  ',
    ];

    for (const title of titles) {
      expect(slugSchema.safeParse(slugify(title)).success).toBe(true);
    }
  });
});
