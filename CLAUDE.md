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

Aucune architecture applicative n'est encore actée (Phase 0 : gouvernance et configuration Claude Code uniquement). Les décisions de stack, style, i18n et format de contenu sont suivies dans `docs/decisions/README.md` et seront tranchées par ADR avant tout code applicatif. Une fois validée, l'arborescence cible sera documentée ici et dans `docs/architecture/README.md`.

## 6. Commandes

Aucune commande de build/lint/test n'existe encore (pas de `package.json`). Cette section sera complétée dès que le Lot 0 technique (stack, schémas) sera validé.

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
