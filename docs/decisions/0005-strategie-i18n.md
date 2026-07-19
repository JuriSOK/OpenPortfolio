# 0005 — Stratégie i18n

## Statut

Accepté

## Contexte

Le dossier produit (F05-001/F05-002) exige le français par défaut, le français et l'anglais obligatoires sur les pages critiques, un sélecteur qui conserve le contexte de navigation, des balises de langue correctes et un contrôle de complétude des traductions bloquant au build. L'ADR-0003 retient l'export statique Next.js, qui exclut tout middleware serveur : la stratégie i18n doit donc reposer uniquement sur le routage par segments et la génération statique.

## Décision

Routage par sous-chemin **toujours préfixé** : `/fr/...` et `/en/...`, sans locale par défaut non préfixée.

- Toutes les routes de `app/` sont imbriquées sous `app/[locale]/...`.
- `generateStaticParams` liste explicitement `['fr', 'en']`.
- La racine `/` est une page statique minimale qui redirige vers `/fr` (français par défaut).
- Les balises `lang` et `hreflang` sont générées à partir du segment `[locale]` courant (NFR-SEO-01).
- Les dictionnaires d'interface sont typés (TypeScript), organisés par domaine fonctionnel ; le contenu métier localisé est porté par les champs `Translation`/localized string du modèle de données (structure de fichier définie par l'ADR-0006).

Une locale par défaut non préfixée (`/...` = FR) a été écartée : elle nécessite habituellement un middleware de détection/redirection, indisponible en export statique. Une détection par cookie/préférence navigateur sans distinction d'URL a également été écartée : elle ne permet pas de satisfaire le hreflang et l'accessibilité d'une URL stable par langue.

## Conséquences

- Le préfixe est systématique, y compris pour le français : légèrement moins « propre » que l'absence de préfixe par défaut, mais élimine toute ambiguïté et toute dépendance à un middleware indisponible.
- `scripts/validate-content.ts` doit vérifier, pour chaque entité marquée `translationRequired`, la présence des deux locales avant d'autoriser `status: published` (F05-002).
- Une future détection automatique de la langue navigateur devra se faire côté client après le premier chargement, jamais via redirection serveur.
