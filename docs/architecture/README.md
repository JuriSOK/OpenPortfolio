# Architecture — point d'entrée

## Statut actuel

Le socle applicatif de la PR 1 (fondation du dépôt) est en place : Next.js App Router, TypeScript strict, export statique, Tailwind CSS v4, routage i18n `/fr`/`/en`, pipeline de contenu YAML validé par Zod. Aucune page métier, composant de présentation designé (Header/Hero/ProjectCard...), skill `add-project`, ni schéma métier détaillé (`Profile`, `Project`, `Experience`, `Education`, `Certification`, `Skill`, `Hobby`) n'existe encore — ces éléments font l'objet de PR dédiées, fondées sur les spécifications fonctionnelles complètes (dossier produit §11, §13.2).

## Où sont documentées les décisions d'architecture

- **Décisions structurantes** (stack, style, i18n, format de contenu, plateforme de déploiement, budgets de performance) : consignées comme ADR dans [docs/decisions/](../decisions/), suivies dans [docs/decisions/README.md](../decisions/README.md). ADR 0003 à 0006 acceptées ; ADR 0007 (canal de contact), 0008 (plateforme de déploiement/CI-CD), 0009 (budgets de performance chiffrés) et 0010 (portée E2E réelle) restent en attente.
- **Cible fonctionnelle** (vision, périmètre MVP, modèle de données fonctionnel, exigences non fonctionnelles) : [docs/product/OpenPortfolio_Dossier_MOA_Specifications_v1.0.md](../product/OpenPortfolio_Dossier_MOA_Specifications_v1.0.md), notamment ses sections 9, 11, 12 et 14.
- **Traçabilité exigences → modules → tests** : [docs/product/traceability-matrix.md](../product/traceability-matrix.md).

## Arborescence réelle

```
app/
├── (root)/                # groupe de routes racine indépendant (voir "i18n" ci-dessous)
│   ├── layout.tsx          # <html lang="fr">, aucune UI localisée
│   └── page.tsx             # "/" : redirection statique vers "/fr"
├── [locale]/               # racine indépendante pour le contenu localisé
│   ├── layout.tsx           # <html lang={locale}>, generateStaticParams(['fr','en']), script anti-flash thème
│   └── page.tsx              # placeholder technique (aucune page métier)
└── globals.css              # Tailwind v4 (@import, @theme, @custom-variant dark)
components/                  # composants UI réutilisables — vide (aucun composant réel dans cette PR)
content/
├── example/                 # collection de démonstration fictive (pipeline YAML → Zod), à supprimer
├── profile/                 # collections officielles vides, en attente de leur schéma métier
├── projects/
├── experiences/
├── education/
├── certifications/
├── skills/
└── hobbies/
schemas/                     # common.ts, media.ts, example.ts (schémas métier : PR dédiée)
lib/content/                 # lecture YAML, validation, vérification des références médias
scripts/validate-content.ts  # CLI de validation, exécuté avant chaque build (npm run prebuild)
public/
├── images/examples/         # médias de démonstration
└── documents/
tests/
├── unit/                    # Vitest : schémas, pipeline de validation, fixtures
└── e2e/                     # réservé — activation conditionnée à l'ADR-0010
.github/workflows/ci.yml     # lint, typecheck, validate-content, test, build
```

## i18n et redirection de "/" (ADR-0005)

Le routage i18n toujours préfixé (`/fr/...`, `/en/...`) impose que le `lang` de `<html>` dépende du segment `[locale]` courant. En export statique, un layout imbriqué ne peut pas modifier le `<html>` défini par un layout racine partagé : la structure utilise donc la technique Next.js des **racines multiples** (`app/(root)/layout.tsx` et `app/[locale]/layout.tsx` sont chacun leur propre layout racine, sans `app/layout.tsx` commun), documentée officiellement pour ce cas d'usage.

Conséquence : la route `/` ne peut pas utiliser `redirect()` de `next/navigation` ni `redirects()` de `next.config.ts` (mécanismes serveur, indisponibles en `output: 'export'`). `/` est donc une page HTML statique avec une balise `<meta http-equiv="refresh" content="0; url=/fr">` (vérifiée dans `out/index.html` après build) et un lien de secours accessible (`next/link`, donc un `<a href>` HTML classique). **Ce n'est pas une redirection HTTP 301/302** : une redirection au niveau de l'hébergeur pourra être ajoutée une fois l'ADR-0008 (plateforme de déploiement) tranché.

## Thème clair/sombre (ADR-0004)

Tailwind **v4** est utilisé (voir addendum dans [docs/decisions/0004-strategie-style.md](../decisions/0004-strategie-style.md)) : les tokens se déclarent dans `app/globals.css` via `@theme { ... }` (aucun token de marque défini dans cette PR — hors périmètre) plutôt que dans `tailwind.config.ts`. La stratégie `class` est activée par `@custom-variant dark (&:where(.dark, .dark *));`, combinée à un script inline (`app/[locale]/layout.tsx`) qui lit `localStorage`/`prefers-color-scheme` et pose la classe `dark` sur `<html>` avant hydratation, pour éviter tout flash. Aucun composant de bascule (`ThemeToggle`) n'existe encore : seule la mécanique est en place.

## Convention de contenu de démonstration

`content/example/` distingue son contenu fictif du contenu réel par trois marquages cumulés : préfixe `example-` (nom de fichier et slug), bannière YAML explicite en tête de fichier, et `status: draft` systématique. Cette collection et son schéma (`schemas/example.ts`) seront supprimés lors de la PR ajoutant les schémas métier réels.

## Flux de validation du contenu

`content/<collection>/<slug>.yml` → parsing YAML (`lib/content/readCollection.ts`) → validation Zod (schéma enregistré dans `scripts/validate-content.ts`) → détection de slug dupliqué et de référence média manquante (`lib/content/validateContent.ts`, `checkMediaReferences.ts`). Un contenu invalide bloque `npm run build` (hook `prebuild`) et la CI (NFR-REL-01).

## Périmètre Prettier

`npm run format` / `npm run format:check` ciblent explicitement les chemins du socle applicatif (`app/`, `components/`, `content/`, `lib/`, `schemas/`, `scripts/`, `tests/`, `.github/workflows/`, et les fichiers de config à la racine), pas tout le dépôt. La documentation historique (`docs/`, `README.md`, `.claude/`, `.github/ISSUE_TEMPLATE/`) n'a jamais été passée dans Prettier et n'est donc, pour l'instant, ni vérifiée ni exclue — juste hors périmètre de ces deux scripts. `next-env.d.ts` est également hors périmètre : généré par Next.js (jamais suivi par Git, voir `.gitignore`), le reformater serait sans effet durable.

## Vulnérabilité connue — PostCSS (risque accepté temporairement)

`npm audit` signale `postcss@8.4.31` (< 8.5.10) comme modérément vulnérable ([GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) — XSS via `</style>` non échappé dans la sortie stringifiée, CVSS 6.1). Cette copie est portée en interne par `next@16.2.10` (outillage de build uniquement, jamais exécutée dans `out/` ni côté navigateur) ; nos propres usages (`@tailwindcss/postcss`, `vitest`/`vite`) résolvent déjà en `postcss@8.5.20`, non vulnérable. Exploitabilité jugée quasi nulle : la faille suppose du CSS non fiable traité puis réinjecté en HTML, ce qui n'existe pas dans ce projet (pas de CMS/back-office acceptant du style utilisateur, interdit par le périmètre MVP).

`next@16.2.10` est déjà la dernière version stable publiée (vérifié le 2026-07-20) ; aucune version stable plus récente ne corrige cette dépendance interne à ce jour. **Aucune correction n'est appliquée** (ni `npm audit fix`, ni override `postcss`) : risque accepté temporairement, à réexaminer avant chaque montée de version de Next.js et avant toute release.

## À documenter dans une prochaine PR

- Diagramme de flux complet (demande utilisateur → qualification Claude → modification sur branche → validation → revue humaine → PR → fusion → déploiement), une fois l'ADR-0008 tranché.
- Schémas métier détaillés et modèle de données réel (`schemas/profile.ts`, `project.ts`, etc.).
- Composants UI réutilisables et pages publiques.
- Harmonisation Prettier de la documentation historique (`docs/`, `README.md`, `.claude/`, `.github/ISSUE_TEMPLATE/`) dans un changement dédié, à valider par le Product Owner (`.claude/settings.json` étant un fichier sensible).

Aucune section de ce document n'anticipe une décision non actée par ADR — en cas de doute, se référer à CLAUDE.md §4.8.
