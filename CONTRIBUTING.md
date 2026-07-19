# Contribuer à OpenPortfolio

## Avant de commencer

- Lire [docs/product/OpenPortfolio_Dossier_MOA_Specifications_v1.0.md](docs/product/OpenPortfolio_Dossier_MOA_Specifications_v1.0.md) pour comprendre la vision, le périmètre MVP et les exclusions.
- Lire [CLAUDE.md](CLAUDE.md) et [.claude/rules/](.claude/rules/) : ces règles s'appliquent aussi bien à un contributeur humain qu'à Claude Code.

## Workflow Git

- `main` est protégée : aucune fusion directe, aucun force-push.
- Une branche dédiée par fonctionnalité ou changement cohérent.
- Pull request obligatoire pour tout changement significatif, avec description, impacts et checks associés.
- Commits atomiques, messages conventionnels (`feat:`, `fix:`, `docs:`, `chore:`, `test:`...).

## Configuration Claude Code locale

- `.claude/settings.json` est versionné et définit les permissions partagées du projet — ne pas l'affaiblir sans revue.
- `.claude/settings.local.json` (non versionné, ignoré par Git) sert aux exceptions propres à votre machine ; ne jamais y placer de secret partagé.
- Ne jamais activer un mode de contournement global des permissions sur ce dépôt.

## Contenu

- Ne jamais inventer une expérience, un résultat, une métrique ou un lien.
- Tout contenu publié doit respecter le schéma applicable et exister dans les langues requises (français et anglais dès le MVP).
- Les données confidentielles ou internes à un tiers sont interdites.

## Avant d'ouvrir une pull request

- Exécuter les contrôles locaux disponibles (validation de contenu, lint, typecheck, tests, build) une fois ces scripts définis.
- Vérifier qu'aucun secret n'est inclus dans le diff.
- Renseigner le modèle de pull request (`.github/pull_request_template.md`).
