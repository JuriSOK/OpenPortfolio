# 0003 — Stack applicative cible

## Statut

Accepté

## Contexte

Le dossier produit (§14.1) pose Next.js + React + TypeScript comme cible de référence, sans trancher le mode de rendu ni le gestionnaire de paquets. Le projet n'a ni base de données, ni authentification, ni back-office (CLAUDE.md §3) ; tout le contenu est versionné dans Git et lu au build. La portabilité sans service propriétaire obligatoire (NFR-OPEN-01) et la légèreté de la stack (contrainte MacBook Air M2, dossier produit §7.3) sont des exigences MUST.

## Décision

- **Framework** : Next.js, **App Router**, TypeScript strict.
- **Mode de rendu** : **export statique** (`output: 'export'`) — aucune route API serveur, aucun Server Action au MVP.
- **Gestionnaire de paquets** : **npm** (déjà utilisé dans les exemples du dossier produit — §23, annexes — zéro outillage supplémentaire, compatibilité par défaut avec GitHub Actions).

L'App Router est retenu plutôt que le Pages Router (historique) pour sa Metadata API native (SEO/hreflang) et sa meilleure représentation dans la documentation Next.js actuelle, donc dans la génération de code par Claude Code. Un rendu hybride avec Server Actions a été écarté : aucun besoin fonctionnel MVP ne requiert de traitement serveur, et cela lierait le déploiement à une plateforme avec runtime Node, au risque de compromettre NFR-OPEN-01.

## Conséquences

- Aucune API route serveur Next.js utilisable au MVP.
- Le canal de contact (F01-004) devra être compatible statique (mailto ou service tiers côté client) — à confirmer par l'ADR-0007 en connaissance de cette contrainte.
- L'internationalisation (ADR-0005) doit fonctionner sans middleware Next.js, indisponible en export statique.
- Une future fonctionnalité dynamique nécessiterait une migration hors export statique et un nouvel ADR.
- npm est le seul gestionnaire de paquets du projet ; toute dépendance ajoutée passe par `npm install` avec confirmation explicite (règle sécurité).
