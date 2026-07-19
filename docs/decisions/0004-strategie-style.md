# 0004 — Stratégie de style

## Statut

Accepté

## Contexte

Le dossier produit (§14.1) propose Tailwind CSS ou CSS Modules structurés. Les règles frontend exigent des thèmes clair/sombre sans flash au chargement, des contrastes conformes WCAG 2.2 AA, des animations réductibles (`prefers-reduced-motion`), et une vitesse de build/itération compatible avec la contrainte MacBook Air M2. Un CSS-in-JS runtime a été écarté d'emblée : il ajoute une dépendance d'exécution non alignée avec la contrainte de légèreté et les budgets de performance (NFR-PERF-01/02).

## Décision

**Tailwind CSS** est retenu, avec :

- les tokens de thème (couleurs, espacement, typographie) centralisés dans `tailwind.config.ts` ;
- la gestion clair/sombre via la stratégie `class`, activée par un script inline minimal exécuté avant hydratation pour éviter tout flash ;
- l'usage du variant `dark:` pour garantir la cohérence du thème sombre sur l'ensemble des composants.

Tailwind est préféré aux CSS Modules structurés pour sa rapidité d'itération (pas de convention de nommage à inventer), sa cohérence de design system imposée par la configuration centralisée, et sa meilleure compatibilité avec la génération de code par Claude Code (Tailwind est très représenté dans les templates Next.js officiels et les données d'entraînement, ce qui réduit les erreurs de génération et facilite la revue de diff).

## Conséquences

- Ajout de dépendances de build (`tailwindcss`, `postcss`, `autoprefixer`), justifiées explicitement lors de l'installation (règle sécurité §dépendances).
- Toute valeur de design (couleur, espacement, typographie) doit passer par les tokens définis dans `tailwind.config.ts`, jamais en valeur arbitraire non justifiée.
- Une convention courte de nommage des tokens et d'usage de `dark:` sera documentée dans `docs/architecture/README.md` une fois l'arborescence du dépôt actée.
- La verbosité des classes utilitaires dans le JSX est mitigée par l'extraction de sous-composants plutôt que par du CSS-in-JS.
