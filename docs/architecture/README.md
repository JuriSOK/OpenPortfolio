# Architecture — point d'entrée

## Statut actuel

Le socle applicatif de la PR 1 (fondation du dépôt) est en place : Next.js App Router, TypeScript strict, export statique, Tailwind CSS v4, routage i18n `/fr`/`/en`, pipeline de contenu YAML validé par Zod. La PR 2 ajoute les 7 schémas métier détaillés (`Profile`, `Project`, `Experience`, `Education`, `Certification`, `Skill`, `Hobby` — `Media` reste un objet embarqué, pas une 8e collection) et étend le pipeline de validation aux références croisées entre entités et à la complétude conditionnelle des traductions (ADR-0011). La PR 3 ajoute la couche d'accès en lecture typée au contenu (`lib/content/getContent.ts` et ses modules purs associés) : filtrage par statut, exclusion des expériences `private`, tri déterministe, résolution des relations sortantes déclarées et contrôles d'intégrité de défense en profondeur (doublon de slug, cardinalité du singleton `Profile`, relation vers un slug inexistant), utile en `npm run dev` où le hook `prebuild` n'est pas déclenché. Aucune page métier ni composant de présentation designé (Header/Hero/ProjectCard...) n'existe encore, ni de skill `add-project` — ces éléments restent l'objet de PR dédiées, fondées sur les spécifications fonctionnelles complètes (dossier produit §11, §13.2).

## Où sont documentées les décisions d'architecture

- **Décisions structurantes** (stack, style, i18n, format de contenu, plateforme de déploiement, budgets de performance) : consignées comme ADR dans [docs/decisions/](../decisions/), suivies dans [docs/decisions/README.md](../decisions/README.md). ADR 0003 à 0006 et 0011 acceptées ; ADR 0007 (canal de contact), 0008 (plateforme de déploiement/CI-CD), 0009 (budgets de performance chiffrés) et 0010 (portée E2E réelle) restent en attente.
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
├── profile/                 # collections officielles, schéma actif, contenu réel non ajouté (hors scope)
├── projects/
├── experiences/
├── education/
├── certifications/
├── skills/
└── hobbies/
schemas/                     # common.ts, media.ts + un schéma par entité métier (profile, project, experience,
                              # education, certification, skill, hobby) — Media reste un objet embarqué, pas
                              # une 8e collection
lib/content/
├── readCollection.ts, validateContent.ts, checkRelations.ts, checkMediaReferences.ts
│                             # pipeline de VALIDATION build-time (PR 2, inchangé)
├── registry.ts               # registre unique des 7 collections (schéma, singleton, relations),
│                              # importé par scripts/validate-content.ts et lib/content/getContent.ts
├── errors.ts                 # ContentIntegrityError (contenu invalide), ContentConfigurationError (contentDir absent)
├── locale.ts, filter.ts, sort.ts, relations.ts
│                             # helpers purs : résolution de locale (fallback en->fr), visibilité par statut,
│                              # tri déterministe, index par slug et résolution de relations
├── repository.ts             # IO : charge et valide une collection, détecte doublons de slug et contentDir absent
└── getContent.ts              # point d'entrée public en lecture (getProfile, getProjects, getProjectBySlug,
                                # getExperiences, getEducation, getCertifications, getSkills, getHobbies)
scripts/validate-content.ts  # CLI de validation, exécuté avant chaque build (npm run prebuild)
public/
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

## Flux de validation du contenu

`content/<collection>/<slug>.yml` → parsing YAML (`lib/content/readCollection.ts`) → validation Zod (schéma enregistré dans `scripts/validate-content.ts`, avec complétude conditionnelle des traductions selon le statut, cf. ADR-0011) → détection de slug dupliqué, de cardinalité pour les collections singleton (`Profile`), de référence média manquante (`lib/content/checkMediaReferences.ts`) et de référence croisée invalide entre collections (`lib/content/checkRelations.ts`, ex. `Project.skills` → `content/skills/`). Un contenu invalide bloque `npm run build` (hook `prebuild`) et la CI (NFR-REL-01).

Le pipeline de démonstration (`content/example/`, `schemas/example.ts`, `public/images/examples/`) a été retiré lors de l'ajout des schémas métier réels (PR 2) : la preuve de bout en bout du pipeline est désormais portée uniquement par les fixtures de test (`tests/unit/fixtures/`), pas par du contenu versionné dans `content/`.

## Flux de lecture applicative (PR 3)

`content/<collection>/<slug>.yml` (déjà validé par `prebuild`) → `lib/content/getContent.ts` → futures pages (PR dédiées). Pour chaque appel : `repository.ts` charge et parse la collection (`readCollection` + `schema.safeParse`), `relations.ts` (`indexBySlug`) détecte un éventuel doublon de slug **avant** tout filtrage, `filter.ts` applique la visibilité (`published` toujours ; `review` seulement avec `includeReview` ; `draft` et `archived` (Project) toujours exclus ; `private` (Experience) toujours exclu), `sort.ts` applique un tri déterministe avec tie-break par slug, et `relations.ts` (`resolveSlugs`) hydrate les relations sortantes déclarées (uniquement `Project.skills` dans cette PR, via `getProjectBySlug`) — une relation vers un slug absent de toute entrée cible lève `ContentIntegrityError`, une relation vers une entité existante mais non visible est omise silencieusement. `getProfile` revérifie la cardinalité singleton à la lecture (utile en `npm run dev`, qui ne déclenche pas `prebuild`).

Cette couche reste volontairement en lecture seule et sans hydratation générique des relations inverses (ex. Skill → Projects qui la référencent) : ce besoin sera traité par la PR qui introduira la première page le nécessitant réellement.

## Périmètre Prettier

`npm run format` / `npm run format:check` ciblent explicitement les chemins du socle applicatif (`app/`, `components/`, `content/`, `lib/`, `schemas/`, `scripts/`, `tests/`, `.github/workflows/`, et les fichiers de config à la racine), pas tout le dépôt. La documentation historique (`docs/`, `README.md`, `.claude/`, `.github/ISSUE_TEMPLATE/`) n'a jamais été passée dans Prettier et n'est donc, pour l'instant, ni vérifiée ni exclue — juste hors périmètre de ces deux scripts. `next-env.d.ts` est également hors périmètre : généré par Next.js (jamais suivi par Git, voir `.gitignore`), le reformater serait sans effet durable.

## Vulnérabilité connue — PostCSS (risque accepté temporairement)

`npm audit` signale `postcss@8.4.31` (< 8.5.10) comme modérément vulnérable ([GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) — XSS via `</style>` non échappé dans la sortie stringifiée, CVSS 6.1). Cette copie est portée en interne par `next@16.2.10` (outillage de build uniquement, jamais exécutée dans `out/` ni côté navigateur) ; nos propres usages (`@tailwindcss/postcss`, `vitest`/`vite`) résolvent déjà en `postcss@8.5.20`, non vulnérable. Exploitabilité jugée quasi nulle : la faille suppose du CSS non fiable traité puis réinjecté en HTML, ce qui n'existe pas dans ce projet (pas de CMS/back-office acceptant du style utilisateur, interdit par le périmètre MVP).

`next@16.2.10` est déjà la dernière version stable publiée (vérifié le 2026-07-20) ; aucune version stable plus récente ne corrige cette dépendance interne à ce jour. **Aucune correction n'est appliquée** (ni `npm audit fix`, ni override `postcss`) : risque accepté temporairement, à réexaminer avant chaque montée de version de Next.js et avant toute release.

## À documenter dans une prochaine PR

- Diagramme de flux complet (demande utilisateur → qualification Claude → modification sur branche → validation → revue humaine → PR → fusion → déploiement), une fois l'ADR-0008 tranché.
- Composants UI réutilisables et pages publiques consommant `lib/content/getContent.ts` (routage par statut, affichage localisé via `resolveLocalizedString`/`resolveLocalizedStringList`, résolution des relations inverses type Skill → Projects/Experiences).
- Harmonisation Prettier de la documentation historique (`docs/`, `README.md`, `.claude/`, `.github/ISSUE_TEMPLATE/`) dans un changement dédié, à valider par le Product Owner (`.claude/settings.json` étant un fichier sensible).

Aucune section de ce document n'anticipe une décision non actée par ADR — en cas de doute, se référer à CLAUDE.md §4.8.
