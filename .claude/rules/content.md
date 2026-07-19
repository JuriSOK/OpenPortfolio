---
scope: content/**
---

# Règles de contenu

Ces règles s'appliquent à toute entité de contenu (`Profile`, `Project`, `Experience`, `Education`, `Certification`, `Skill`, `Hobby`, `Media`) une fois le dossier `content/` créé, et à leur validation.

## Source et véracité

- Ne jamais inventer une expérience, un résultat, une métrique, une date ou un lien.
- Les résultats non chiffrés sont présentés comme qualitatifs — jamais de chiffre non sourcé.
- Pour un travail collectif, le rôle personnel doit être explicite et distinct du résultat d'équipe.
- Les contenus générés par IA sont des propositions : ils doivent être revus par le Product Owner avant publication.

## Schéma et validation

- Chaque type de contenu est validé par un schéma explicite avant build (champs obligatoires, enums, formats, relations).
- Un slug est unique à l'intérieur de sa collection, stable, en kebab-case.
- Une relation vers une entité inexistante bloque la validation.
- Le message d'erreur de validation identifie le fichier et le champ en cause.

## Statuts

- Statuts supportés au minimum : `draft`, `review`, `published` (`archived` en complément selon schéma `Project`).
- Seul `published` est exposé en production ; `review` peut apparaître en prévisualisation.
- Un brouillon n'est jamais routable en production.
- Le changement de statut est visible dans Git (diff explicite).

## Confidentialité

- Aucune donnée confidentielle d'entreprise, chiffre interne non autorisé ou capture confidentielle.
- Un mécanisme `private`/`exclude` peut marquer un brouillon local non publié — à confirmer par entité lors de la définition des schémas (cf. incohérence relevée en Phase 0 : le flag n'est explicite que pour `Experience`).

## Traduction (FR/EN)

- Le français est la langue par défaut initiale.
- Une traduction obligatoire manquante bloque la publication du contenu concerné.
- Les champs non traduisibles (identifiants techniques, enums) restent partagés entre langues.

## Médias

- Chaque image informative possède un texte alternatif ; une image décorative doit être explicitement marquée comme telle.
- Une image manquante est détectée avant déploiement, pas après.
- Les noms de fichiers suivent une convention stable (à documenter avec le schéma `Media`).
