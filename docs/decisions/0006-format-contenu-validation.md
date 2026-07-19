# 0006 — Format de contenu et validation

## Statut

Accepté

## Contexte

Le dossier produit (§14.1, §11) demande un format de contenu lisible, versionnable et modifiable par IA (MDX/YAML/JSON + Zod), validé par schéma explicite avant build (champs obligatoires, enums, formats, relations, slugs uniques). Le schéma fonctionnel `Project` (§11.2) comporte plusieurs champs de texte enrichi distincts (`problem`, `solution`, `role`, `results`), et non un corps de texte unique. Les règles de contenu et de sécurité interdisent toute injection HTML non maîtrisée.

## Décision

**YAML par entité**, un fichier par collection et par slug : `content/<collection>/<slug>.yml`.

- Un fichier = une entité = toutes les locales, via des sous-objets `{ fr: ..., en: ... }` sur les champs localisés — évite la dérive entre deux fichiers `.fr.yml`/`.en.yml` qui pourraient diverger de structure.
- Les champs de texte enrichi sont écrits en **Markdown simple** (bloc littéral YAML `|`), rendu via un moteur Markdown standard (`remark`/`rehype`) sans plugin MDX/JSX, avec échappement HTML par défaut (NFR-SEC-03).
- Validation exhaustive par schémas **Zod** (`schemas/*.ts`, un par entité : Profile, Project, Experience, Education, Certification, Skill, Hobby, Media, plus un schéma de champ localisé réutilisable), exécutée par `scripts/validate-content.ts` avant tout build : champs obligatoires, enums, relations (slugs référencés existants), contrôle de complétude des traductions.

MDX a été écarté : une entité `Project` a plusieurs champs de texte enrichi distincts, incompatible avec le modèle « un corps MDX par fichier » propre au blogging, et l'exécution de JSX arbitraire dans du contenu complique le contrôle « pas d'injection HTML non maîtrisée ». JSON a été écarté au profit de YAML : structure équivalente, mais moins lisible à l'édition manuelle (pas de blocs multi-lignes natifs, pas de commentaires).

## Conséquences

- `schemas/*.ts` définit un schéma Zod par entité, appliqué à la lecture de chaque fichier YAML.
- `scripts/validate-content.ts` échoue avec un message identifiant le fichier et le champ en cause (règle de contenu).
- Aucun composant interactif n'est embarqué dans le contenu au MVP, cohérent avec la séparation moteur/contenu/exemples (§14.2) et l'absence de fonctions IA embarquées dans le site public.
- Un besoin futur de contenu riche interactif (ex. composant embarqué dans un projet) nécessiterait un nouvel ADR de remplacement.
- La convention du bloc littéral `|` pour les champs Markdown multi-lignes sera documentée dans `.claude/rules/content.md` lors de la définition des schémas.
