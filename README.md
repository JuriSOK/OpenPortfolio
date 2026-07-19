# OpenPortfolio

Portfolio open source administrable en langage naturel : un dépôt Git structuré, maintenu et fait évoluer par instructions données à Claude Code selon des procédures contrôlées et auditables.

> **Statut** : Phase 0 — gouvernance du dépôt et configuration Claude Code. Aucun code applicatif n'existe encore. Voir [docs/product/OpenPortfolio_Dossier_MOA_Specifications_v1.0.md](docs/product/OpenPortfolio_Dossier_MOA_Specifications_v1.0.md) pour la référence fonctionnelle complète.

## Principes

- **Repository-first** : le contenu et la configuration restent lisibles, versionnés et exportables. Git est la seule source de vérité — jamais l'IA.
- **Human-in-the-loop** : aucune fusion sur `main` ni déploiement sans validation humaine explicite.
- **Simple avant scalable** : pas de base de données, d'authentification ou de back-office sans exigence approuvée.

## Documentation

| Ressource | Emplacement |
|---|---|
| Spécifications produit | [docs/product/](docs/product/) |
| Décisions d'architecture (ADR) | [docs/decisions/](docs/decisions/) |
| Organisation de l'architecture | [docs/architecture/](docs/architecture/) |
| Matrice de traçabilité | [docs/product/traceability-matrix.md](docs/product/traceability-matrix.md) |
| Règles Claude Code ciblées | [.claude/rules/](.claude/rules/) |
| Instructions permanentes Claude Code | [CLAUDE.md](CLAUDE.md) |

## Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md). Toute modification de contenu ou de code passe par une branche dédiée et une pull request — jamais de fusion directe sur `main`.

## Sécurité

Voir [SECURITY.md](SECURITY.md).

## Licence

MIT — voir [LICENSE](LICENSE).
