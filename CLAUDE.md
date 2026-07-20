# OpenPortfolio — Instructions permanentes

## 1. Mission

Construire et maintenir un portfolio professionnel open source administrable par langage naturel. Le dépôt et ses données structurées sont la source de vérité — jamais l'IA.

## 2. Références

- Spécifications produit : `docs/product/OpenPortfolio_Dossier_MOA_Specifications_v1.0.md`
- Décisions d'architecture : `docs/decisions/`
- Organisation de l'architecture : `docs/architecture/`
- Matrice de traçabilité : `docs/product/traceability-matrix.md`
- Règles ciblées : `.claude/rules/`

## 3. Périmètre MVP

- Site public responsive (accueil, à propos, expériences, projets, formation, compétences, hobbies, contact)
- Français et anglais avec contrôle de complétude
- Thèmes clair/sombre
- Contenu versionné et validé par schéma
- Workflow Claude pour ajouter/modifier un contenu

Ne pas ajouter de SaaS multi-utilisateur, base de données, authentification ou back-office sans exigence approuvée.

## 4. Règles absolues

1. Ne jamais inventer une expérience, un résultat, une métrique ou un lien.
2. Ne jamais lire ou exposer `.env`, `secrets/`, `private/` ou des identifiants.
3. Ne jamais fusionner dans `main`, forcer un push ou déployer sans instruction explicite.
4. Pour une tâche non triviale, produire un plan et identifier les impacts avant modification.
5. Faire des changements minimaux ; éviter les refactorings non demandés.
6. Toute donnée publiée doit respecter le schéma et être disponible dans les langues requises.
7. Signaler tout test non exécuté ou échoué. Ne jamais présenter une tâche incomplète comme terminée.
8. En cas de doute sur une décision produit, UX ou architecture, privilégier la simplicité et demander validation plutôt que d'introduire une complexité anticipée.

## 5. Architecture

Socle technique en place (Next.js App Router, TypeScript strict, export statique, Tailwind CSS v4, i18n `/fr` `/en`, contenu YAML validé par Zod — ADR 0003 à 0006). Détail complet de l'arborescence et des flux dans `docs/architecture/README.md`.

Points d'attention :

- `content/example/` est une collection de démonstration fictive (pipeline YAML → Zod), pas du contenu réel — elle sera supprimée quand les schémas métier seront ajoutés.
- Les 7 collections officielles (`content/profile/`, `content/projects/`, `content/experiences/`, `content/education/`, `content/certifications/`, `content/skills/`, `content/hobbies/`) sont encore vides : leurs schémas métier détaillés (`schemas/*.ts`) et le contenu réel font l'objet d'une PR dédiée.
- Aucune page métier ni composant de présentation designé (Header/Hero/ProjectCard...) n'existe encore ; la skill `add-project` (`.claude/skills/add-project/`) est disponible.

## 6. Commandes

- `npm run dev` — serveur de développement Next.js.
- `npm run lint` — ESLint (flat config, `next/core-web-vitals` + `next/typescript`).
- `npm run typecheck` — vérification TypeScript strict (`tsc --noEmit`).
- `npm run validate-content` — validation Zod du contenu (`content/**/*.yml`), exécutée automatiquement avant `build` (`prebuild`).
- `npm run test` — tests unitaires Vitest.
- `npm run build` — export statique Next.js (`out/`), bloqué si le contenu est invalide.
- `npm run format` / `npm run format:check` — Prettier.

## 7. Workflow

1. Lire la demande et les règles pertinentes (`.claude/rules/`).
2. Vérifier l'état Git (`git status`, `git diff`).
3. Planifier si la tâche n'est pas triviale.
4. Modifier uniquement les fichiers requis.
5. Exécuter les contrôles adaptés une fois disponibles.
6. Inspecter le rendu pour tout changement UI, une fois qu'une UI existe.
7. Fournir le rapport final standard (§8).

## 8. Rapport final obligatoire

- Résultat
- Fichiers modifiés
- Hypothèses / décisions
- Tests et commandes exécutés
- Résultats
- Risques ou limites
- Actions manuelles restantes
