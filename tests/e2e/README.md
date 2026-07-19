# Tests E2E — dossier réservé

Ce dossier est réservé à la suite de tests end-to-end (parcours critiques du dossier produit §18.2 : accueil mobile, filtre projets, fiche en anglais, thème, navigation clavier, etc.).

Aucun test E2E n'est ajouté dans cette PR : l'ADR-0010 (portée E2E réelle vs contrainte matérielle MacBook Air M2) n'est pas encore tranché. Installer `@playwright/test` avant cette décision serait une dépendance non justifiée et anticiperait une décision d'architecture non actée (cf. CLAUDE.md §4.8).

## Convention prévue

Une fois l'ADR-0010 accepté :

- `tests/e2e/*.spec.ts`, exécutés avec Playwright.
- `playwright.config.ts` à la racine du dépôt.
- Un scénario par cas de recette prioritaire identifié au §18.2 du dossier produit.
