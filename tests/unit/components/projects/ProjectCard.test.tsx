import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ProjectCard, { type ProjectCardProps } from '../../../../components/projects/ProjectCard';

// Note technique (voir plan PR6 §8/§9) : next/image hors build Next réel ne
// résout pas sa config comme en production (unoptimized: false par défaut
// faute de process.env.__NEXT_IMAGE_OPTS / ImageConfigContext). Les
// assertions ci-dessous portent donc uniquement sur des attributs stables et
// publics (alt, loading, sous-chaîne du chemin encodé), jamais sur la valeur
// littérale complète de `src`.

// href est volontairement absent ici : la route de fiche détaillée
// (/projects/[slug]) n'existe pas dans cette PR (PR6 réduite à la liste —
// décision PO). C'est l'état réel de tout appel produit par
// mapProjectToView.ts aujourd'hui.
const baseProps: ProjectCardProps = {
  title: 'OpenPortfolio',
  summary: 'Un portfolio open source administrable en langage naturel.',
  typeLabel: 'Projet personnel',
  dateRangeLabel: '2026',
  technologies: ['TypeScript', 'Next.js'],
};

describe('ProjectCard', () => {
  it('rend sans image : pas d’élément image, placeholder décoratif présent', () => {
    const html = renderToStaticMarkup(<ProjectCard {...baseProps} />);
    expect(html).not.toContain('<img');
    expect(html).toContain('aria-hidden="true"');
  });

  it('rend avec image : attributs alt et loading présents, chemin encodé retrouvé', () => {
    const html = renderToStaticMarkup(
      <ProjectCard
        {...baseProps}
        image={{
          src: '/images/projects/openportfolio-cover.png',
          alt: 'Aperçu du tableau de bord',
        }}
      />,
    );
    expect(html).toContain('alt="Aperçu du tableau de bord"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain(encodeURIComponent('/images/projects/openportfolio-cover.png'));
  });

  it('image décorative : alt vide rendu tel quel, sans texte alternatif fabriqué', () => {
    const html = renderToStaticMarkup(
      <ProjectCard {...baseProps} image={{ src: '/images/projects/decor.png', alt: '' }} />,
    );
    expect(html).toContain('alt=""');
  });

  it('affiche titre, résumé, technologies, type et dates', () => {
    const html = renderToStaticMarkup(<ProjectCard {...baseProps} />);
    expect(html).toContain('OpenPortfolio');
    expect(html).toContain('Un portfolio open source administrable en langage naturel.');
    expect(html).toContain('Projet personnel');
    expect(html).toContain('2026');
    expect(html).toContain('TypeScript');
    expect(html).toContain('Next.js');
  });

  it('sans href : rend un article non interactif, aucun lien cassé produit', () => {
    const html = renderToStaticMarkup(<ProjectCard {...baseProps} />);
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('href="');
    expect(html).toContain('<article');
    // Ni faux bouton, ni texte "bientôt disponible" pour compenser l'absence de lien.
    expect(html).not.toContain('<button');
    expect(html).not.toMatch(/bientôt disponible/i);
    expect(html).not.toMatch(/coming soon/i);
  });

  it('avec href fourni (usage futur, fiche projet) : le titre devient un lien focusable unique', () => {
    const html = renderToStaticMarkup(
      <ProjectCard {...baseProps} href="/fr/projects/openportfolio/" />,
    );
    const hrefMatches = html.match(/href="/g) ?? [];
    expect(hrefMatches).toHaveLength(1);
    // next/link résout trailingSlash via process.env.__NEXT_TRAILING_SLASH,
    // injecté au build par Next (webpack DefinePlugin) — absent hors next
    // build/dev, donc le "/" final n'est pas garanti dans ce contexte de
    // test (renderToStaticMarkup nu, sans build Next réel).
    expect(html).toMatch(/href="\/fr\/projects\/openportfolio\/?"/);
  });
});
