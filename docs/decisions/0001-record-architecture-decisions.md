# 0001 — Consigner les décisions d'architecture par ADR

## Statut

Accepté

## Contexte

Le dossier de spécifications (§19.2, §22.1) demande que toute décision structurante soit tracée sous forme d'Architecture Decision Record (ADR) dans `docs/decisions/`, plutôt que dispersée dans des conversations ou des commentaires de code.

## Décision

Chaque décision d'architecture significative (stack, format de contenu, i18n, style, plateforme de déploiement, budgets de performance, etc.) est consignée dans un fichier `docs/decisions/NNNN-titre-court.md`, numéroté séquentiellement, au format suivant :

- **Statut** : Proposé / Accepté / Rejeté / Remplacé par ADR-NNNN
- **Contexte** : le problème ou la question à trancher
- **Décision** : ce qui est retenu
- **Conséquences** : impacts positifs et négatifs, y compris sur le périmètre MVP

L'index de tous les ADR (statut et lot cible) est maintenu dans `docs/decisions/README.md`.

## Conséquences

- Toute alternative technique proposée par la MOE doit démontrer un gain clair sans compromettre simplicité, portabilité, sécurité et maintenabilité (dossier produit §14).
- Un ADR n'est pas modifié après acceptation ; une décision révisée donne lieu à un nouvel ADR qui remplace le précédent.
