---
name: add-project
description: Ajoute ou met à jour un projet OpenPortfolio (et, si nécessaire, les compétences qu'il référence) à partir d'informations validées par le Product Owner, sans jamais éditer le YAML à la main.
allowed-tools: Read, Edit, Write, Bash
---

# Objectif

Créer ou mettre à jour une fiche `Project` bilingue conforme à `schemas/project.ts`, ainsi que les éventuelles fiches `Skill` (`schemas/skill.ts`) qu'elle référence, sans jamais inventer de fait, de métrique, de résultat, de lien ou de média.

# Entrées attendues

- create ou update (et, si update, le slug ou titre du projet cible)
- statut visé (draft par défaut, ou review/published si demandé explicitement)
- type de projet (`personal` | `academic` | `hackathon`)
- titre (fr)
- contexte / problème, solution, rôle personnel
- technologies (texte libre)
- compétences associées (slugs de `content/skills/`)
- période (startDate, endDate optionnelle)
- résultats validés par l'utilisateur (jamais déduits)
- liens, médias (chemins déjà existants sous `public/`)
- featuredRank (optionnel)
- métadonnées SEO (si le statut visé est `published`)

# Procédure

1. Lire `schemas/project.ts`, `schemas/skill.ts`, `schemas/media.ts`.
2. Demander create ou update. En update, lire `content/projects/<slug>.yml` s'il existe ; sinon signaler l'absence et proposer une création à la place. **Le slug est immuable en update** — toute demande de renommage est refusée avec explication, différée à un workflow dédié futur.
3. Avant toute action sur le disque : exécuter `git status`. Si `content/projects/<slug>.yml` ou une fiche `content/skills/*.yml` potentiellement concernée porte déjà des modifications non commitées, s'arrêter et demander confirmation explicite avant de continuer — ne jamais empiler silencieusement sur un état déjà modifié.
4. Demander le statut visé (draft par défaut) tôt dans la conversation : il conditionne si `seo` et les traductions `en` seront obligatoires.
5. Demander type, titre (fr), puis proposer un slug via `tsx scripts/slugify.ts "<titre>"`. **Valider systématiquement ce slug avec `slugSchema` avant toute construction de chemin** (c'est ce que fait `scripts/check-project-draft.ts` en interne) et le faire confirmer explicitement par l'utilisateur avant de continuer.
6. Recueillir le contenu français : résumé, problème, solution, rôle personnel (distinct du résultat d'équipe si le projet est collectif), technologies (texte libre — ne jamais en déduire ou en inventer, même par analogie avec un lien ou une capture), dates.
7. Compétences (`skills`) : proposer les slugs déjà présents sous `content/skills/`. Si un slug référencé n'existe nulle part (ni sur disque, ni parmi des compétences candidates déjà proposées dans cette même exécution), signaler et proposer explicitement l'un des choix suivants — jamais de création silencieuse :
   - proposer une nouvelle fiche `Skill` candidate (`status: draft` par défaut, `name.fr` et `category` obligatoires, rien d'inventé pour `category`, `level` ou sa justification, `en` facultatif en draft) ;
   - corriger le slug voulu ;
   - retirer la référence.
   Une compétence candidate dont le slug existe déjà sur disque, ou qui duplique une autre candidate de la même exécution, est bloquante (à corriger avant de continuer).
8. **Cohérence de visibilité** : si le statut visé du projet est `published`, chaque compétence référencée (existante ou candidate) doit elle-même être `published`. Si ce n'est pas le cas, signaler explicitement (« la compétence X est en draft/review, elle ne sera pas visible publiquement si ce projet est publié ») et proposer un choix explicite : finaliser la compétence avec confirmation dédiée (jamais de publication automatique d'une Skill), conserver le projet en draft/review, ou retirer la relation.
9. Recueillir résultats (qualitatifs par défaut ; un chiffre n'est retenu que si l'utilisateur le fournit lui-même — jamais déduit ni inventé), liens, médias (chemins déjà existants sous `public/`, texte alternatif obligatoire sauf média explicitement décoratif — ne jamais créer de média fictif), `featuredRank`.
10. Si l'utilisateur le souhaite, proposer une traduction anglaise : la rédiger, la présenter champ par champ, et attendre une validation explicite avant de l'inclure dans quoi que ce soit d'écrit.
11. Demander les métadonnées SEO si le statut visé est `published` (sinon, les proposer en option sans les imposer).
12. **En mise à jour uniquement** : capturer le contenu original du fichier en mémoire (texte exact), construire le patch (uniquement les champs explicitement modifiés), puis appeler `tsx scripts/merge-project-patch.ts` avec `{"existing": <objet Project actuel>, "patch": <champs modifiés>}` sur stdin. **Ne jamais réimplémenter cette fusion à la main.** Si le CLI signale un champ dans `staleTranslationFields` (ex. `results.en`, `title.en`, `seo.title.en`), poser explicitement la question de la fidélité de la traduction anglaise existante avant de continuer — jamais de blocage automatique, jamais de silence.
13. Dry-run final : appeler `tsx scripts/check-project-draft.ts` avec `{"mode": "create"|"update", "slug": "<slug>", "candidate": <objet Project complet>, "candidateSkills": [<compétences candidates éventuelles>]}` sur stdin. Ce CLI est strictement read-only (il n'écrit jamais sur le disque) et réutilise directement les schémas Zod existants — ne jamais contourner cette étape ni la considérer facultative.
14. Présenter explicitement un avant/après en langage naturel (obligatoire même pour un `Edit`, qui est auto-approuvé par `.claude/settings.json` et ne déclenche donc aucune pause système de revue) et attendre une confirmation utilisateur avant d'écrire quoi que ce soit.
15. Capturer, juste avant d'écrire, la liste exacte des fichiers qui vont être touchés (le projet et chaque compétence candidate à créer).
16. Écrire : `Write` pour tout nouveau fichier (projet et/ou compétences candidates confirmées), `Edit` ciblé bloc par bloc pour une mise à jour — à partir du `merged` renvoyé par `scripts/merge-project-patch.ts`, jamais une réécriture complète du fichier.
17. Exécuter, dans cet ordre : `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run validate-content`, `npm run test`, `npm run build`.
18. En cas d'échec à une étape quelconque : appliquer le rollback (voir Interdictions ci-dessous) avant tout nouveau rapport ou toute tentative de commit.
19. Rapport pré-commit : exécuter `git status --short`, `git ls-files --others --exclude-standard`, `git diff --check`, `git diff --stat`, `git diff`. Confirmer explicitement dans le rapport que seuls les fichiers prévus sont modifiés/créés, qu'aucun fichier inattendu n'apparaît, que rien n'est staged, et qu'aucun commit ni push n'a été effectué.
20. Produire le rapport final (format CLAUDE.md §8), aligné sur `.github/pull_request_template.md` (à référencer, pas à dupliquer).
21. Ne commiter, pousser, ouvrir une PR ou changer un statut vers `published` que sur confirmation explicite et distincte de l'utilisateur.

# Interdictions

- Ne jamais inventer une métrique, un résultat, une date, un lien, un rôle ou une technologie non fournis par l'utilisateur.
- Ne jamais créer de média fictif ; un média référencé doit déjà exister sous `public/`.
- Ne jamais publier automatiquement une compétence pour résoudre une incohérence de visibilité.
- Ne jamais renommer un slug en mode update ; refuser toute demande de renommage avec explication.
- Ne jamais réimplémenter à la main la génération de slug, la validation ou la fusion de patch : utiliser exclusivement `tsx scripts/slugify.ts`, `tsx scripts/check-project-draft.ts` et `tsx scripts/merge-project-patch.ts`.
- Ne jamais utiliser `git checkout -- <path>`, `git restore`, `git reset` ou `git clean` pour annuler un changement — ces commandes peuvent écraser des modifications locales antérieures non liées à cette exécution. Le rollback se fait uniquement ainsi :
  - fichier **créé** (projet et/ou compétence) : suppression via `rm <chemin exact>` — une commande ciblée par fichier, jamais générique ni récursive (soumise à la confirmation déjà exigée par `.claude/settings.json`) ;
  - fichier **mis à jour** : restauration via `Write` du contenu original exactement capturé à l'étape 15 — jamais via l'index Git ;
  - si une suppression est refusée par l'utilisateur : arrêt immédiat, aucun commit, rapport précis des fichiers restant à restaurer manuellement ;
  - le rollback est toujours transactionnel (projet et toutes les compétences créées dans la même exécution), jamais partiel ou silencieux.
- Ne jamais commiter, pousser, fusionner ou déployer sans confirmation explicite distincte ; ne jamais toucher directement à `main`.
- Ne jamais installer de dépendance, modifier un schéma métier (`schemas/*.ts`) ou `.claude/settings.json`.
- Ne jamais mentionner Claude ou Anthropic dans un message de commit ou une description de pull request.
- Ne jamais utiliser les vrais dossiers `content/projects/` ou `content/skills/` pour une recette de test ou une démonstration — toujours un dossier temporaire ou une fixture dédiée.

# Sortie

Rapport structuré (CLAUDE.md §8, aligné sur `.github/pull_request_template.md`) : résultat, fichiers créés/modifiés, hypothèses et choix éditoriaux, commandes exécutées et résultats, compétences candidates créées le cas échéant, traductions potentiellement obsolètes signalées et résolues, risques ou limites, actions manuelles restantes (y compris toute compétence à finaliser hors périmètre de cette skill).
