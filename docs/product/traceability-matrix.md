# Matrice de traçabilité — exigences → modules → tests

Étend la matrice épique de l'Annexe G du dossier de spécifications au niveau exigence, pour les items MUST les plus structurants. Les chemins de modules cités sont **prévisionnels** : ils seront créés une fois les ADR de stack (`docs/decisions/README.md`) acceptés, pas en Phase 0.

| Exigence | Module cible futur | Preuve / test prévu |
|---|---|---|
| F01-001 Accueil | `app/(site)/page.tsx`, `content/profile/` | E2E accueil mobile/desktop ; test « suppression d'un projet featured ne casse pas la page » |
| F01-002 Navigation | `components/header/` | E2E navigation clavier, fermeture menu mobile après sélection |
| F01-003 À propos | `app/(site)/about/`, `content/profile/` | Contrôle FR/EN, validation schéma |
| F01-004 Contact | `components/contact/` | Validation entrées, contrôle liens (cf. ADR-0007 canal de contact) |
| F02-001/002/003 Catalogue & fiches projet | `content/projects/`, `schemas/project.ts`, pages projet | Validation schéma (slug unique, relations), E2E fiche complète, contrôle liens |
| F02-004 Recherche/filtres | `lib/filters/` | Tests unitaires tri/filtre, E2E clavier, résultat vide → reset |
| F03-001 Expériences | `content/experiences/` | Tri chronologique, période « en cours », exclusion `private` du build |
| F03-002 Formation/certifications | `content/education/`, `content/certifications/` | Cohérence des dates, contrôle des liens de vérification |
| F03-003 Compétences | `content/skills/` | Validation des relations, accès aux preuves associées |
| F04-001 Schémas | `schemas/*.ts`, `scripts/validate-content.ts` | Champ manquant → échec, slug dupliqué détecté, relation invalide détectée — **socle en place** (pipeline générique + schéma de démonstration), schémas métier détaillés (Project, Experience, ...) en attente d'une PR dédiée |
| F04-002 Statuts | `schemas/*.ts` | Brouillon non routable en production, prévisualisation `review` |
| F04-003 Médias | `lib/content/checkMediaReferences.ts` | Alt text obligatoire, détection média manquant — **détection de média manquant en place** (REC-06) ; obligation d'alt text par entité à couvrir avec les schémas métier réels |
| F05-001 i18n FR/EN | `lib/i18n/`, routage locale (cf. ADR-0005) | E2E switch langue, balises de langue correctes |
| F05-002 Complétude traduction | `scripts/validate-content.ts` | Build bloquant si traduction requise manquante |
| F06-001 Thème | `lib/theme/` | E2E persistance thème après reload |
| F06-002 SEO | `lib/seo/`, sitemap/robots | Audit build : sitemap sans brouillon, title unique par page |
| F06-003 Accessibilité | composants partagés | Audit clavier automatisé + revue manuelle des parcours critiques |
| F07-001 Skill add-project | `.claude/skills/add-project/` (à créer, Lot 3) | Exécution de bout en bout (REC-07) : fichiers créés, tests verts, rapport complet |
| F07-002 Modification contrôlée | `.claude/rules/content.md`, `.claude/rules/git.md` | Diff minimal, relations/index valides |
| F07-003 Rapport de fin de tâche | `CLAUDE.md` §8 | Présence systématique du rapport, tests non exécutés signalés |
| F07-004 Préparation PR | `.claude/rules/git.md`, `.github/pull_request_template.md` | PR compréhensible sans relire la conversation, aucune donnée sensible |
| NFR-SEC-01/02/03 | `.claude/settings.json`, `.claude/rules/security.md`, CI (à venir) | Scan secrets, audit dépendances, tests entrées (REC-08 : lecture `.env` bloquée) |
| NFR-A11Y-01 | composants partagés | Suite a11y automatisée + revue clavier manuelle |
| NFR-REL-01 | `.github/workflows/ci.yml` | Pipeline bloquant sur contenu invalide — **socle en place** (lint/typecheck/validate-content/test/build sans étape de déploiement, qui reste conditionnée à l'ADR-0008) |
| NFR-OPEN-01 | Choix de plateforme (ADR-0008) | Test d'installation propre sans service propriétaire obligatoire |

## Statut de cette matrice

Document vivant : à mettre à jour à chaque ADR accepté et à chaque nouvelle exigence identifiée. Les chemins de modules seront confirmés ou corrigés une fois `docs/architecture/README.md` complété.
