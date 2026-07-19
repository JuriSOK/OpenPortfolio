---
name: bootstrap-project
description: Génère le socle applicatif OpenPortfolio (structure de dossiers, configuration technique) sans contenu personnel.
allowed-tools: Read, Edit, Bash
status: documentée — exécution non autorisée avant validation d'une phase dédiée
---

# Objectif

Générer le socle applicatif du dépôt (structure de dossiers, configuration TypeScript/lint/format, schémas de données vides, jeu de données d'exemple minimal) une fois les décisions d'architecture actées, **sans jamais inclure de contenu personnel réel**.

# Statut

Cette skill est **documentée en Phase 0 mais non exécutée**. Son exécution est conditionnée à :

1. La validation des ADR de stack (`docs/decisions/README.md` : ADR-0003 stack, ADR-0004 style, ADR-0005 i18n, ADR-0006 format de contenu).
2. Un plan explicite soumis et approuvé par le Product Owner pour cette exécution précise, conformément à la règle « pour une tâche non triviale, produire un plan avant modification » (CLAUDE.md §4.4).

# Entrées attendues (une fois exécutable)

- Choix de stack confirmés (ADR-0003 à ADR-0006)
- Emplacement du jeu de données d'exemple (séparé des données personnelles, cf. principe open source du dossier produit §2.2)

# Procédure prévue

1. Lire les ADR de stack validés et `docs/architecture/README.md`.
2. Créer la structure de dossiers cible (`app/`, `components/`, `content/`, `schemas/`, `lib/`, `public/`, `tests/`, `scripts/`) conforme à la cible du dossier produit (§14.3).
3. Configurer TypeScript strict, lint, formatage et scripts de contrôle (`npm run lint/typecheck/test/build`).
4. Créer les schémas de données vides (`Profile`, `Project`, `Experience`, `Education`, `Certification`, `Skill`, `Hobby`, `Media`) sans contenu personnel.
5. Ajouter un jeu de données d'exemple minimal, clairement distinct des données personnelles réelles.
6. Mettre à jour `CLAUDE.md` §5–6 (architecture, commandes) avec les valeurs réelles.
7. Exécuter les contrôles disponibles (lint, typecheck, tests, build).
8. Produire le rapport final standard (CLAUDE.md §8).

# Interdictions

- Ne pas exécuter cette skill sans plan validé au préalable (cf. Statut ci-dessus).
- Ne pas inclure de contenu personnel réel (expériences, projets, coordonnées).
- Ne pas installer de dépendance sans confirmation explicite.
- Ne pas introduire de base de données, authentification ou back-office.

# Sortie

Rapport avec fichiers créés, hypothèses, validations exécutées, erreurs et actions restantes.
