# Matrice de traçabilité — exigences → modules → tests

Étend la matrice épique de l'Annexe G du dossier de spécifications au niveau exigence, pour les items MUST les plus structurants. Les chemins de modules cités sont **prévisionnels** : ils seront créés une fois les ADR de stack (`docs/decisions/README.md`) acceptés, pas en Phase 0.

| Exigence | Module cible futur | Preuve / test prévu |
|---|---|---|
| F01-001 Accueil | `app/(site)/page.tsx`, `content/profile/` | E2E accueil mobile/desktop ; test « suppression d'un projet featured ne casse pas la page » |
| F01-002 Navigation | `components/header/` | E2E navigation clavier, fermeture menu mobile après sélection |
| F01-003 À propos | `app/(site)/about/`, `content/profile/` | Contrôle FR/EN, validation schéma |
| F01-004 Contact | `components/contact/` | Validation entrées, contrôle liens (cf. ADR-0007 canal de contact) |
| F02-001/002/003 Catalogue & fiches projet | `content/projects/`, `schemas/project.ts`, `lib/content/getContent.ts` (`getProjects`, `getProjectBySlug`), pages projet | **Validation schéma couverte** (`schemas/project.ts` : type contrôlé, slug unique, relations `skills` validées, `seo` requis si `published`) ; **filtrage par statut, tri déterministe (`featuredRank` puis `startDate` puis `slug`) et hydratation de `skills` implémentés et testés** (`lib/content/getContent.ts`, `tests/unit/content/getContent.test.ts`) ; pages/E2E fiche complète restent à faire (PR dédiée) |
| F02-004 Recherche/filtres | `lib/filters/` | Tests unitaires tri/filtre, E2E clavier, résultat vide → reset |
| F03-001 Expériences | `content/experiences/`, `schemas/experience.ts`, `lib/content/getContent.ts` (`getExperiences`) | **Couvert** : dates cohérentes (`endDate >= startDate`), période « en cours » (`endDate` optionnel) ; **exclusion effective de `private` implémentée et testée, tri par `startDate` décroissant (hypothèse par analogie avec F03-002, non tranchée noir sur blanc dans le dossier MOA — à confirmer) implémenté et testé** (`lib/content/filter.ts`, `lib/content/sort.ts`, `tests/unit/content/getContent.test.ts`) |
| F03-002 Formation/certifications | `content/education/`, `content/certifications/`, `schemas/education.ts`, `schemas/certification.ts`, `lib/content/getContent.ts` (`getEducation`, `getCertifications`) | **Couvert** : cohérence des dates (Education), lien de vérification validé en URL (Certification) ; **tri par date décroissante implémenté et testé** (`lib/content/sort.ts`, `tests/unit/content/getContent.test.ts`) |
| F03-003 Compétences | `content/skills/`, `schemas/skill.ts`, `lib/content/getContent.ts` (`getSkills`) | **Couvert** : catégorie obligatoire, niveau tout-ou-rien (échelle+justification), relations validées côté Project/Experience/Education/Certification (stockage unidirectionnel, cf. `lib/content/checkRelations.ts`) ; **résolution de la relation sortante `Project.skills` implémentée et testée** (`lib/content/relations.ts`, `getProjectBySlug`) ; relations inverses (Skill → Projects/Experiences) explicitement hors périmètre, différées à la première page qui en aura réellement besoin |
| F04-001 Schémas | `schemas/*.ts`, `scripts/validate-content.ts`, `lib/content/checkRelations.ts` | **Couvert** : les 7 schémas métier réels remplacent le pipeline de démonstration ; champ manquant → échec, slug dupliqué détecté, relation invalide détectée (message fichier + champ) |
| F04-002 Statuts | `schemas/*.ts`, `lib/content/filter.ts`, `lib/content/getContent.ts` | Statuts validés par schéma (`archived` spécifique à `Project`) ; **filtrage par statut implémenté et testé à la lecture** (`published` toujours exposé, `review` seulement avec `includeReview`, `draft`/`archived` toujours exclus, cf. `tests/unit/content/filter.test.ts`) ; routage HTTP réel par page reste à faire |
| F04-003 Médias | `schemas/media.ts`, `lib/content/checkMediaReferences.ts` | **Couvert** : alt obligatoire si non-decorative intégré directement dans `mediaSchema` (s'applique à `media[]`, `portrait`, `cv`, `seo.image`) ; détection de média manquant en place (REC-06) ; formats/tailles/nommage non chiffrés dans le dossier MOA → non modélisables (dette produit documentée) |
| F05-001 i18n FR/EN | `lib/i18n/`, routage locale (cf. ADR-0005) | E2E switch langue, balises de langue correctes |
| F05-002 Complétude traduction | `schemas/common.ts`, `schemas/*.ts` | **Couvert** : `en` optionnel en draft/review, requis en published pour tout champ localisé (y compris imbriqué/en tableau), cf. ADR-0011 |
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
