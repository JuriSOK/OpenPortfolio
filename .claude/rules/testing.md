---
scope: tests/**, et tout changement fonctionnel
---

# Règles de test

## Pyramide de tests

| Niveau | Objet | Déclenchement |
|---|---|---|
| Validation de schéma | Données, enums, relations, slugs | À chaque changement de contenu |
| Tests unitaires | Fonctions de tri, filtres, mapping, i18n | À chaque PR |
| Tests composants | États critiques et accessibilité de base | À chaque PR UI |
| Tests E2E | Navigation, projet, langue, thème, contact | À chaque PR / release, limités aux parcours critiques |

## Interdictions

- Ne jamais masquer, ignorer ou désactiver un test pour obtenir un résultat vert.
- Ne jamais présenter une tâche comme terminée si un test n'a pas été exécuté ou a échoué — le signaler explicitement dans le rapport final.
- Un test instable (flaky) n'est pas acceptable : il doit être corrigé ou retiré avec justification documentée, jamais ignoré silencieusement.

## Portée E2E

- Les tests E2E se limitent aux parcours critiques identifiés dans le dossier produit (§18.2 : accueil mobile, filtre projets, fiche en anglais, contenu draft non publié, slug dupliqué, média manquant, exécution de skill, permission `.env` bloquée, persistance du thème, navigation clavier).
- La portée réelle de la couverture E2E, compte tenu de la contrainte matérielle (MacBook Air M2), sera confirmée par ADR avant le Lot 3.

## Rapport

Tout changement fonctionnel doit indiquer dans le rapport final : commandes exécutées, résultats, tests non exécutés (et pourquoi), anomalies avec sévérité.
