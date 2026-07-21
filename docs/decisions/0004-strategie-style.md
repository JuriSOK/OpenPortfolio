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

## Addendum (bootstrap technique, PR 1)

Tailwind **v4** a été retenu lors de l'implémentation du socle plutôt que v3. Or v4 bascule sur un modèle de configuration CSS-first : les tokens se déclarent dans un bloc `@theme { ... }` au sein de `app/globals.css`, et `tailwind.config.ts` n'est plus le mécanisme par défaut. La centralisation des tokens décrite ci-dessus reste donc valide dans son intention (un point unique de vérité pour les tokens de thème), mais son implémentation se fait via `app/globals.css` (`@theme`) plutôt que via `tailwind.config.ts`. `autoprefixer` n'est plus une dépendance séparée : Tailwind v4 l'embarque via `@tailwindcss/postcss`.

## Addendum (initialisation du thème, hotfix hydratation)

Le script inline anti-flash décrit ci-dessus, posé directement dans `app/[locale]/layout.tsx` (`<script dangerouslySetInnerHTML>`), provoquait une erreur de rendu côté client dans ce dépôt sous React 19 / Next.js 16.2.10. Le remplacement par `next/script` (`strategy="beforeInteractive"`) a été tenté et a reproduit la même erreur. L'initialisation du thème a donc été déplacée vers `instrumentation-client.ts` à la racine du dépôt — un fichier chargé par Next.js avant l'hydratation, sans passer par un composant React ni une balise `<script>` gérée par le framework. La logique de sélection du thème (lecture de `localStorage`, repli sur `prefers-color-scheme`) reste inchangée.

Cette solution garantit une exécution avant l'hydratation, mais **pas nécessairement avant le premier paint** (contrairement à un script inline classique placé dans `<head>`, dont l'exécution est garantie synchrone avant tout rendu). La stratégie définitive d'initialisation du thème, notamment son articulation avec un futur composant `ThemeToggle`, devra être réévaluée lors de la PR de design partagé.
