# Index des décisions d'architecture (ADR)

Format et process définis par [0001-record-architecture-decisions.md](0001-record-architecture-decisions.md).

## Décisions actées

| ADR | Sujet | Statut |
|---|---|---|
| [0001](0001-record-architecture-decisions.md) | Adoption du process ADR | Accepté |
| [0002](0002-license-mit.md) | Licence open source — MIT | Accepté |

## Décisions en attente

Identifiées lors du cadrage Phase 0 (voir aussi les incohérences/ambiguïtés relevées dans le dossier produit). À rédiger avant d'ouvrir le lot correspondant — aucun code applicatif ne doit être écrit tant que l'ADR associé n'est pas accepté.

| ADR (prévisionnel) | Sujet | Urgence / lot cible |
|---|---|---|
| 0003 | Stack applicative cible (confirmation Next.js + TypeScript, gestionnaire de paquets) | Avant Lot 0 technique |
| 0004 | Style : Tailwind CSS vs CSS Modules structurés | Avant Lot 0 technique |
| 0005 | Stratégie i18n (routage FR/EN : sous-chemin / sous-domaine / cookie, langue par défaut) | Avant Lot 0 technique |
| 0006 | Format de contenu et validation (MDX/YAML/JSON + Zod), disposition de `content/**` | Avant définition des schémas |
| 0007 | Canal de contact MVP (mailto vs formulaire + service tiers) | Avant Lot 1 (F01-004) |
| 0008 | Plateforme de déploiement / CI-CD, compatible NFR-OPEN-01 (pas de service propriétaire obligatoire) | Avant Lot 4, structure CI dès que possible |
| 0009 | Budgets de performance chiffrés (JS initial, seuils Lighthouse) pour rendre NFR-PERF-01/02 testables | Avant Lot 2 |
| 0010 | Portée E2E réelle vs contrainte matérielle (MacBook Air M2) | Avant Lot 3 |

Cette liste est mise à jour à chaque nouvelle décision structurante identifiée ; elle ne préjuge pas de l'issue de chaque ADR.
