# Politique de sécurité

## Principes

- Principe du moindre privilège pour toute exécution d'agent (Claude Code ou humain).
- Aucun secret n'est stocké dans le dépôt. `.env*`, `secrets/`, `private/` et `config/credentials*` sont exclus par `.gitignore` et interdits en lecture à Claude Code (voir `.claude/settings.json`).
- Aucun mode de contournement global des permissions Claude Code n'est utilisé sur ce projet.
- Toute commande destructive (suppression massive, force-push, fusion sur `main`, déploiement) requiert une confirmation humaine explicite.
- Les nouvelles dépendances doivent être justifiées avant installation (impact sécurité, taille, maintenance).

## Signaler une vulnérabilité

Ce dépôt est un projet personnel en phase de cadrage (aucun code applicatif publié à ce stade). Pour signaler une vulnérabilité une fois le projet en ligne, ouvrir une issue confidentielle ou contacter le mainteneur via le canal indiqué dans le profil GitHub du dépôt — ne jamais divulguer publiquement une faille avant correctif.

## Portée couverte

- Configuration et permissions Claude Code (`.claude/`)
- Contenu versionné du dépôt (`content/`, une fois créé)
- Pipeline CI/CD (une fois configuré)

Toute donnée confidentielle d'entreprise, secret ou identifiant ne doit jamais figurer dans ce dépôt, y compris dans l'historique Git.
