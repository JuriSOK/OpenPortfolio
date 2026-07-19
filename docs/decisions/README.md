# Index des décisions d'architecture (ADR)

Format et process définis par [0001-record-architecture-decisions.md](0001-record-architecture-decisions.md).

## Décisions actées

| ADR | Sujet | Statut |
|---|---|---|
| [0001](0001-record-architecture-decisions.md) | Adoption du process ADR | Accepté |
| [0002](0002-license-mit.md) | Licence open source — MIT | Accepté |
| [0003](0003-stack-applicative.md) | Stack applicative cible — Next.js App Router, export statique, npm | Accepté |
| [0004](0004-strategie-style.md) | Style — Tailwind CSS | Accepté |
| [0005](0005-strategie-i18n.md) | Stratégie i18n — sous-chemin toujours préfixé, FR par défaut | Accepté |
| [0006](0006-format-contenu-validation.md) | Format de contenu et validation — YAML + Markdown + Zod | Accepté |

## Décisions en attente

Identifiées lors du cadrage Phase 0 (voir aussi les incohérences/ambiguïtés relevées dans le dossier produit). À rédiger avant d'ouvrir le lot correspondant — aucun code applicatif ne doit être écrit tant que l'ADR associé n'est pas accepté.

| ADR (prévisionnel) | Sujet | Urgence / lot cible |
|---|---|---|
| 0007 | Canal de contact MVP (mailto vs formulaire + service tiers) | Avant Lot 1 (F01-004) |
| 0008 | Plateforme de déploiement / CI-CD, compatible NFR-OPEN-01 (pas de service propriétaire obligatoire) | Avant Lot 4, structure CI dès que possible |
| 0009 | Budgets de performance chiffrés (JS initial, seuils Lighthouse) pour rendre NFR-PERF-01/02 testables | Avant Lot 2 |
| 0010 | Portée E2E réelle vs contrainte matérielle (MacBook Air M2) | Avant Lot 3 |

Cette liste est mise à jour à chaque nouvelle décision structurante identifiée ; elle ne préjuge pas de l'issue de chaque ADR.
