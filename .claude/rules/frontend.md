---
scope: app/**, components/**
---

# Règles frontend

Ces règles s'appliquent une fois l'architecture applicative (`app/`, `components/`) créée. Aucune décision de stack n'est actée en Phase 0 — voir `docs/decisions/README.md` pour les ADR en attente (style CSS, i18n, etc.).

## Principes d'expérience

- Hiérarchie nette : identité → réalisations → preuves → contact.
- Une seule proposition de valeur principale visible au-dessus de la ligne de flottaison sur l'accueil.
- Les informations proviennent du modèle de données (`Profile`, `Project`, ...), jamais écrites en dur dans plusieurs composants.
- Densité modérée, textes scannables, CTA limités.
- Animations courtes et fonctionnelles ; jamais bloquantes pour la lecture ; réductibles selon la préférence utilisateur (`prefers-reduced-motion`).

## Composants

- Composants de présentation indépendants de la source de données.
- Pas de duplication de données métier dans les composants.
- États à couvrir a minima : desktop/mobile, hover/focus, vide/erreur, image absente (cf. inventaire de composants du dossier produit §13.2).

## Accessibilité (WCAG 2.2 AA — parcours critiques)

- Structure de titres cohérente et sémantique HTML correcte.
- Focus visible sur tout élément interactif.
- Navigation complète au clavier, y compris menu mobile (fermeture après sélection).
- Le lien de navigation actif est identifiable autrement que par la couleur seule.
- Libellés explicites pour tout contrôle et formulaire.

## Responsive et thème

- Responsive à partir de 320px.
- Le thème clair/sombre respecte la préférence OS par défaut et persiste après rechargement, sans flash de thème au chargement.
- Contrastes conformes dans les deux thèmes.

## Performance (à quantifier par ADR — cf. incohérence Phase 0 sur NFR-PERF-01/02)

- Pas de dépendance lourde sans justification explicite.
- Images responsives, lazy loading hors zone visible, polices optimisées.
- Les seuils chiffrés (budget JS, LCP, etc.) seront fixés par ADR avant le Lot 2 et documentés ici.
