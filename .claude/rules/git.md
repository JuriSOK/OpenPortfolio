---
scope: toutes tâches de livraison
---

# Règles Git

- `main` est une branche protégée : aucune fusion directe, aucun force-push.
- Une branche dédiée par fonctionnalité ou changement cohérent.
- Pull request obligatoire pour tout changement significatif.
- Commits atomiques et messages conventionnels (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`...).
- Checks obligatoires avant fusion, une fois définis : validation contenu, lint, typecheck, tests, build.
- `git commit` et `git push` requièrent une confirmation explicite (cf. `.claude/settings.json`, catégorie `ask`).
- Claude ne fusionne jamais `main`, ne supprime jamais de branche distante et ne déploie jamais manuellement sans instruction explicite.
- Avant toute modification non triviale, vérifier l'état Git (`git status`, `git diff`) et créer ou confirmer la branche de travail.
