---
scope: global
---

# Règles de sécurité

## Secrets

- Lecture interdite de `.env`, `.env.*`, `secrets/`, `private/`, `config/credentials*` et de `.claude/settings.local.json`.
- Aucun secret n'est jamais commité, loggé ou reproduit dans une réponse.
- Un scan de secrets est exécuté avant toute release (une fois la CI en place).

## Dépendances

- Toute nouvelle dépendance est justifiée (besoin, taille, maintenance, alternative écartée) avant que l'installation soit confirmée.
- `npm install`/`npm uninstall` (ou équivalent) requiert une confirmation explicite.
- Dépendances minimales, versionnées et auditables.

## Entrées utilisateur

- Toute entrée utilisateur (formulaire de contact, filtres, recherche) est validée et échappée.
- Pas d'injection HTML non maîtrisée.

## Permissions

- Principe du moindre privilège : lecture/édition du dépôt autorisées avec revue de diff ; commandes destructrices (`rm`, force-push, fusion `main`, déploiement) soumises à confirmation ou interdites.
- Aucun mode de contournement global des permissions Claude Code sur ce projet.
- Les permissions `deny` de `.claude/settings.json` priment sur toute autorisation.

## Vie privée

- Collecte minimale de données visiteur ; aucun tracker non nécessaire sans consentement et documentation explicite.
