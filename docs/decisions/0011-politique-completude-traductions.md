# 0011 — Politique de complétude des traductions (translationRequired)

## Statut

Accepté

## Contexte

L'ADR-0005 (stratégie i18n) prévoit que `scripts/validate-content.ts` « doit vérifier, pour chaque entité marquée `translationRequired`, la présence des deux locales avant d'autoriser `status: published` » (F05-002), sans préciser le mécanisme exact ni son interaction avec les statuts `draft`/`review`. L'ADR-0001 interdit de modifier un ADR après acceptation : cette précision est donc formalisée dans un nouvel ADR, qui référence et complète l'ADR-0005 sans le remplacer.

Avant la PR#2, `schemas/common.ts` (`localizedString()`, `localizedRichText()`, `localizedStringList()`) exigeait `fr` et `en` systématiquement, quel que soit le statut — un comportement plus strict que F05-002, mais qui empêchait de rédiger un brouillon dans une seule langue en attendant sa traduction.

## Décision

- `fr` (langue par défaut) reste obligatoire dès `draft`, sur tout champ localisé.
- `en` devient **optionnel** en `draft`/`review` : un contenu en cours de traduction reste validable.
- `en` devient **obligatoire** pour tout champ localisé **présent** dès que `status === 'published'` — vérifié par un `.superRefine()` explicite dans chaque schéma d'entité (`schemas/project.ts`, `profile.ts`, `experience.ts`, `education.ts`, `certification.ts`, `skill.ts`, `hobby.ts`), qui appelle des helpers de bas niveau exportés par `schemas/common.ts` : `checkLocalizedStringTranslation`, `checkLocalizedListTranslation`, `checkBilingualMediaTranslation`.
- Un champ **optionnel totalement absent** n'est jamais en erreur, à aucun statut (un projet sans `results`, un profil sans `values`/`objectives`, ne sont jamais bloqués pour cette seule raison).
- La règle s'applique aux champs simples (`title`, `summary`, `name`...), aux champs imbriqués (`seo.title`, `seo.description`, `level.justification`), aux éléments de tableau (`socialLinks[].label`), aux listes localisées (`results`, `missions`, `values`, `objectives` via `checkLocalizedListTranslation` — qui refuse par ailleurs tout tableau vide ou élément vide/composé uniquement d'espaces, pour `fr` toujours et pour `en` s'il est fourni), et au cas particulier `Profile.cv` (paire de médias bilingue : `cv.fr` obligatoire dès que `cv` existe, `cv.en` requis en `published` via `checkBilingualMediaTranslation`).
- Portée volontairement limitée : cette politique ne s'étend pas à `mediaSchema.alt` (texte alternatif d'une image) — F04-003 exige uniquement la présence d'un alt, pas sa bilingualité avant publication.

## Conséquences

- `schemas/common.ts` modifie une primitive utilisée depuis la PR#1 : `en` passe d'obligatoire à conditionnel sur `localizedString()`/`localizedRichText()`/`localizedStringList()`. `tests/unit/schemas/common.test.ts` est mis à jour en conséquence.
- Chaque schéma d'entité porte sa propre logique de vérification par statut (pas de mécanisme générique déclaratif par nom de champ), pour couvrir correctement les champs imbriqués et les tableaux sans ambiguïté de chemin.
- Un futur besoin de complétude conditionnelle plus fine (ex. bilingualité obligatoire des textes alternatifs avant publication) nécessiterait une extension de cette politique, pas un nouvel ADR de remplacement.
