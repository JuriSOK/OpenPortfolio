# Architecture — point d'entrée

## Statut actuel : Phase 0

Aucune architecture applicative n'est actée à ce stade. Ce dépôt ne contient, pour l'instant, que la gouvernance du projet et la configuration Claude Code (`.claude/`, `CLAUDE.md`, `docs/`). Aucun `package.json`, aucune dépendance, aucun code Next.js n'existe encore.

## Où seront documentées les décisions d'architecture

- **Décisions structurantes** (stack, style, i18n, format de contenu, plateforme de déploiement, budgets de performance) : consignées comme ADR dans [docs/decisions/](../decisions/), suivies dans [docs/decisions/README.md](../decisions/README.md).
- **Cible fonctionnelle** (vision, périmètre MVP, modèle de données fonctionnel, exigences non fonctionnelles) : [docs/product/OpenPortfolio_Dossier_MOA_Specifications_v1.0.md](../product/OpenPortfolio_Dossier_MOA_Specifications_v1.0.md), notamment ses sections 9 (architecture fonctionnelle), 11 (modèle de données), 12 (NFR) et 14 (cible technique).
- **Traçabilité exigences → modules → tests** : [docs/product/traceability-matrix.md](../product/traceability-matrix.md).

## Organisation prévue une fois les ADR de stack tranchés

Une fois les ADR 0003 à 0006 (stack, style, i18n, format de contenu) acceptés, cette page sera complétée avec :

1. L'arborescence réelle du dépôt (`app/`, `components/`, `content/`, `schemas/`, `lib/`, `public/`, `tests/`, `scripts/`).
2. Les diagrammes ou descriptions de flux (demande utilisateur → qualification Claude → modification sur branche → validation → revue humaine → PR → fusion → déploiement).
3. Les conventions de nommage et les frontières entre moteur générique, contenu personnel et données d'exemple (principe de séparation, dossier produit §7.3/§14.2).

Aucune section de ce document ne doit anticiper une décision non actée par ADR — en cas de doute, se référer à la règle CLAUDE.md §4.8 : privilégier la simplicité et demander validation plutôt que d'introduire une complexité anticipée.
