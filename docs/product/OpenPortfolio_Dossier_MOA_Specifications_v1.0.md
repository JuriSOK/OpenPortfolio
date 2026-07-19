**OPENPORTFOLIO**

**DOSSIER DE CADRAGE PRODUIT  
& SPÉCIFICATIONS FONCTIONNELLES**

| **Portfolio open source administrable en langage naturel** |
|------------------------------------------------------------|

| **Commanditaire / Product Owner** | Arnaud Boss                                                |
|-----------------------------------|------------------------------------------------------------|
| **Rôle de rédaction**             | MOA IT Senior – Product Requirements                       |
| **Version**                       | 1.0                                                        |
| **Statut**                        | Base de validation avant lancement du build                |
| **Date**                          | 19 juillet 2026                                            |
| **Classification**                | Projet personnel / Open source – données sensibles exclues |

*Décision attendue : validation du périmètre MVP, des exigences
prioritaires et du cadre d’exécution Claude Code.*

# Gestion documentaire

| **Version** | **Date**   | **Auteur**    | **Nature de l’évolution**         | **Statut** |
|-------------|------------|---------------|-----------------------------------|------------|
| 0.1         | 19/07/2026 | MOA IT Senior | Structuration initiale du besoin  | Brouillon  |
| 1.0         | 19/07/2026 | MOA IT Senior | Dossier complet prêt à validation | À valider  |

## Circuit de validation recommandé

| **Rôle**             | **Responsabilité**                                                           | **Décision attendue**         |
|----------------------|------------------------------------------------------------------------------|-------------------------------|
| Product Owner        | Valide la vision, le périmètre, les priorités et les critères d’acceptation. | GO / GO avec réserves / NO GO |
| MOE / Lead Developer | Valide la faisabilité, l’architecture cible et les estimations.              | Faisable / À arbitrer         |
| UX/UI                | Valide les parcours, composants et règles d’interface.                       | Conforme / À revoir           |
| QA                   | Valide la stratégie de tests et la testabilité des exigences.                | Testable / Non testable       |
| Security reviewer    | Valide les permissions Claude, la gestion des secrets et les dépendances.    | Acceptable / Risque à traiter |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Règle de gouvernance</strong><br />
Ce document constitue la référence fonctionnelle initiale. Toute
modification de périmètre doit être enregistrée dans le backlog, évaluée
en impact et validée par le Product Owner avant implémentation.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# Sommaire

> **1.** 1. Synthèse décisionnelle
>
> **2.** 2. Fiche produit
>
> **3.** 3. Contexte, problème et opportunité
>
> **4.** 4. Vision, objectifs et indicateurs
>
> **5.** 5. Parties prenantes et personas
>
> **6.** 6. Périmètre produit
>
> **7.** 7. Principes, hypothèses et contraintes
>
> **8.** 8. Parcours utilisateurs cibles
>
> **9.** 9. Architecture fonctionnelle
>
> **10.** 10. Spécifications fonctionnelles détaillées
>
> **11.** 11. Modèle de données fonctionnel
>
> **12.** 12. Exigences non fonctionnelles
>
> **13.** 13. Spécifications UX/UI
>
> **14.** 14. Cible technique et règles d’architecture
>
> **15.** 15. Modèle opératoire IA / Claude Code
>
> **16.** 16. Sécurité et gestion des permissions
>
> **17.** 17. Backlog et roadmap
>
> **18.** 18. Stratégie de recette
>
> **19.** 19. Gouvernance de delivery
>
> **20.** 20. Risques et plans de mitigation
>
> **21.** 21. Definition of Ready / Definition of Done
>
> **22.** 22. Kit de remise au build
>
> **23.** 23. Paramétrage Claude Code avant démarrage
>
> **24.** Annexes : modèles, fichiers de configuration et prompts
> initiaux

# 1. Synthèse décisionnelle

OpenPortfolio est un portfolio personnel et un produit open source
permettant de créer, maintenir et publier un portfolio professionnel par
instructions en langage naturel. Le produit doit démontrer une
utilisation maîtrisée de l’IA dans un cycle logiciel réel : cadrage,
génération contrôlée, validation, tests, Git et déploiement.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Proposition de valeur</strong><br />
Un utilisateur décrit la modification souhaitée ; Claude Code applique
la procédure du projet, modifie les données ou le code, exécute les
contrôles, produit un résumé vérifiable et prépare une contribution
Git.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Décisions proposées pour le MVP

> • **Architecture initiale :** application statique ou hybride Next.js,
> contenu versionné dans le dépôt, sans base de données obligatoire.
>
> • **Utilisateur administrateur :** une seule personne au démarrage ;
> le visiteur public n’a pas de compte.
>
> • **Source de vérité :** Git et les fichiers structurés du dépôt. L’IA
> n’est jamais la source de vérité.
>
> • **Mode de modification :** Claude Code agit sur une branche dédiée
> et ne fusionne jamais automatiquement dans la branche principale.
>
> • **Multilingue :** français et anglais dès le MVP, avec contrôle de
> complétude.
>
> • **Mise en ligne :** déploiement automatique uniquement après
> validation des tests et fusion approuvée.
>
> • **Open source :** préparé dès le départ, mais publication générique
> après stabilisation du portfolio personnel.

## Décision de lancement

| **Critère**        | **Position MOA**                                                  | **Condition de GO**                                                      |
|--------------------|-------------------------------------------------------------------|--------------------------------------------------------------------------|
| Valeur utilisateur | Forte : réduit le coût de maintenance d’un portfolio.             | Cas d’usage « ajouter un projet » validé de bout en bout.                |
| Faisabilité        | Élevée : technologies standard et contenu structuré.              | Architecture simple, schémas de données validés.                         |
| Risque             | Maîtrisable : principal risque lié aux actions autonomes de l’IA. | Permissions restrictives, revue Git et secrets exclus.                   |
| Différenciation    | Forte : le portfolio est aussi la démonstration du système IA.    | Workflow reproductible documenté et visible.                             |
| Recommandation     | GO pour un MVP incrémental.                                       | Aucun ajout de back-office ou multi-utilisateur avant validation du MVP. |

# 2. Fiche produit

| **Rubrique**              | **Définition**                                                                                                                                                             |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Nom de travail            | OpenPortfolio                                                                                                                                                              |
| Catégorie                 | Portfolio professionnel, générateur de site, outil de gestion de contenu assisté par IA                                                                                    |
| Vision                    | Rendre la création et la maintenance d’un portfolio accessibles par langage naturel, tout en conservant un niveau professionnel de contrôle, de qualité et de traçabilité. |
| Cible primaire            | Étudiants en informatique/data/IA, alternants, développeurs juniors, jeunes diplômés.                                                                                      |
| Cible secondaire          | Freelances, consultants, designers, profils en reconversion.                                                                                                               |
| Problème                  | Les portfolios sont longs à construire, difficiles à maintenir et deviennent rapidement obsolètes.                                                                         |
| Solution                  | Un portfolio structuré dont le contenu et certaines évolutions peuvent être pilotés avec Claude Code selon des procédures contrôlées.                                      |
| Promesse                  | « Un portfolio qui se met à jour en discutant avec une IA. »                                                                                                               |
| Canal                     | Site web public responsive ; gestion via dépôt Git et Claude Code.                                                                                                         |
| Modèle initial            | Open source, auto-hébergé ou déployé sur une plateforme compatible.                                                                                                        |
| Critère de succès central | Ajouter un projet complet, bilingue et conforme, lancer les contrôles et préparer une PR à partir d’une instruction naturelle.                                             |

## 2.1 Positionnement

> • Un portfolio personnel professionnel immédiatement utile.
>
> • Un projet vitrine démontrant les compétences produit, IA,
> automatisation, développement et Git.
>
> • Une base open source réutilisable, mais non un SaaS
> multi-utilisateur dans le MVP.
>
> • Un système de gestion de contenu « repository-first », transparent
> et réversible.

## 2.2 Différenciateurs

| **Différenciateur**               | **Manifestation attendue**                                                                |
|-----------------------------------|-------------------------------------------------------------------------------------------|
| Administration en langage naturel | Des procédures standardisées transforment une demande en changements contrôlés.           |
| Traçabilité                       | Chaque évolution est visible dans Git, expliquée et réversible.                           |
| Qualité intégrée                  | Schémas, lint, tests, vérification visuelle, accessibilité et SEO.                        |
| Contenu fondé sur des preuves     | Chaque compétence peut être liée à un projet, une expérience ou une certification.        |
| Architecture extensible           | Le MVP reste simple tout en préparant l’import GitHub, la génération de CV et les thèmes. |
| Apprentissage visible             | Le dépôt documente CLAUDE.md, skills, agents, hooks et décisions d’architecture.          |

# 3. Contexte, problème et opportunité

## 3.1 Constat

> • Le contenu d’un portfolio évolue fréquemment : projets, expériences,
> compétences, certifications et objectifs.
>
> • La maintenance manuelle exige de retrouver les bons composants,
> traductions, images et métadonnées.
>
> • Les portfolios statiques se dégradent : liens morts, contenus
> incohérents, versions linguistiques désynchronisées.
>
> • Les assistants IA savent modifier du code, mais sans règles projet
> ils peuvent créer de la dette, contourner les conventions ou exposer
> des secrets.

## 3.2 Besoin métier

Le produit doit permettre de **déléguer l’exécution sans déléguer la
décision.** L’utilisateur conserve la responsabilité du contenu, des
choix de design et de la mise en production ; Claude exécute les tâches
dans un cadre borné, contrôlé et auditable.

## 3.3 Opportunité

> • Créer une vitrine différenciante pour un profil orienté IA et
> gestion de projet.
>
> • Transformer les pratiques Claude Code en composants open source
> réutilisables.
>
> • Établir une méthode reproductible de « développement assisté par
> agent » adaptée aux petits produits.
>
> • Produire un socle exploitable ultérieurement pour une offre
> générique ou un starter kit.

# 4. Vision, objectifs et indicateurs

## 4.1 Vision produit

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Vision à 24 mois</strong><br />
Toute personne disposant d’un dépôt et d’un compte compatible peut
initialiser un portfolio professionnel, importer ses informations, le
personnaliser et le maintenir par langage naturel, sans perdre le
contrôle sur les données ni le code.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 4.2 Objectifs du MVP

| **ID** | **Objectif**                                | **Mesure cible**                                                                           |
|--------|---------------------------------------------|--------------------------------------------------------------------------------------------|
| OBJ-01 | Publier un portfolio complet et responsive. | 100 % des sections MVP disponibles sur mobile et desktop.                                  |
| OBJ-02 | Industrialiser l’ajout d’un projet.         | Un projet complet ajouté en moins de 15 minutes de travail humain hors rédaction initiale. |
| OBJ-03 | Garantir la cohérence du contenu.           | 0 contenu invalide au build ; 100 % des champs obligatoires contrôlés.                     |
| OBJ-04 | Garantir la synchronisation bilingue.       | Aucune fiche publiée avec traduction obligatoire manquante.                                |
| OBJ-05 | Sécuriser l’usage de Claude.                | Aucun secret lu ou commité ; aucune fusion automatique sur main.                           |
| OBJ-06 | Préparer l’open source.                     | Installation documentée et données d’exemple séparées des données personnelles.            |

## 4.3 Indicateurs produit

| **KPI**                         | **Définition**                                                                      | **Cible MVP**                    |
|---------------------------------|-------------------------------------------------------------------------------------|----------------------------------|
| Taux de réussite du workflow IA | Demandes « ajouter/modifier un contenu » aboutissant sans reprise manuelle de code. | ≥ 80 %                           |
| Temps de mise à jour            | Temps humain entre la demande et la PR prête à revue.                               | ≤ 15 min pour une fiche standard |
| Taux de défaut en recette       | Anomalies bloquantes détectées après fusion.                                        | 0                                |
| Complétude du contenu           | Champs obligatoires renseignés sur les entités publiées.                            | 100 %                            |
| Performance perçue              | Pages principales respectant les budgets définis.                                   | Conforme aux seuils NFR          |
| Accessibilité                   | Critères AA retenus sans anomalie bloquante.                                        | 100 % sur parcours critiques     |
| Adoption open source – post-MVP | Clones, forks, installations ou contributions.                                      | Mesure exploratoire              |

# 5. Parties prenantes et personas

## 5.1 Parties prenantes

| **Acteur**                                | **Attentes**                                             | **Responsabilités**                                                  |
|-------------------------------------------|----------------------------------------------------------|----------------------------------------------------------------------|
| Product Owner / propriétaire du portfolio | Valeur, cohérence, rapidité de mise à jour.              | Priorisation, validation du contenu, acceptation des livrables.      |
| Visiteur / recruteur                      | Comprendre rapidement le profil et accéder aux preuves.  | Consulte, filtre, contacte, télécharge le CV.                        |
| Contributeur open source                  | Installation claire, conventions explicites.             | Propose correctifs, thèmes, documentation.                           |
| Claude Code                               | Contexte précis, outils autorisés, procédures testables. | Exécute dans le périmètre ; ne prend pas de décision produit finale. |
| Plateforme Git / CI                       | Entrées déterministes et tests fiables.                  | Versionne, contrôle et déploie.                                      |

## 5.2 Personas

| **Persona**               | **Situation**                                            | **Besoins clés**                                              | **Frustrations actuelles**                   |
|---------------------------|----------------------------------------------------------|---------------------------------------------------------------|----------------------------------------------|
| P1 – Étudiant IA / Data   | Dispose de plusieurs projets académiques et personnels.  | Valoriser les compétences, mettre à jour vite, être crédible. | Portfolio générique, contenu peu structuré.  |
| P2 – Développeur junior   | Cherche une alternance ou un premier CDI.                | Présenter GitHub, stack, responsabilités et résultats.        | Mise à jour technique chronophage.           |
| P3 – Profil peu technique | Souhaite une vitrine professionnelle personnalisée.      | Guidage, modèles, langage naturel.                            | Dépendance à un développeur.                 |
| P4 – Contributeur         | Veut réutiliser le starter ou proposer une amélioration. | Documentation, exemples, tests, licence.                      | Projets personnels difficiles à généraliser. |

# 6. Périmètre produit

## 6.1 Périmètre MVP – IN

> • Site public responsive avec accueil, à propos, expériences, projets,
> études, compétences, centres d’intérêt et contact.
>
> • Fiches détaillées pour projets personnels, universitaires et
> hackathons.
>
> • Contenu structuré, versionné et validé par schéma.
>
> • Français et anglais avec règles de complétude.
>
> • Recherche et filtres simples sur les projets.
>
> • Thème clair et sombre.
>
> • Métadonnées SEO essentielles, sitemap et aperçu social.
>
> • Workflow Claude Code pour ajouter/modifier un projet ou une
> expérience.
>
> • Tests unitaires ciblés, tests end-to-end des parcours critiques et
> contrôles de build.
>
> • Déploiement continu depuis la branche principale après validation.
>
> • Documentation d’installation et de contribution.

## 6.2 Hors périmètre MVP – OUT

> • SaaS multi-utilisateur, facturation et gestion d’abonnements.
>
> • Back-office visuel complet.
>
> • Application mobile native.
>
> • Marketplace de thèmes ou plugins.
>
> • Import automatique complet depuis LinkedIn ou PDF.
>
> • Génération de CV adaptée à une offre.
>
> • Analytics avancés et personnalisation comportementale.
>
> • Publication automatique sans revue humaine.
>
> • Base de données distante obligatoire.

## 6.3 Périmètre ultérieur

| **Lot** | **Fonctionnalités candidates**                      | **Condition d’entrée**                        |
|---------|-----------------------------------------------------|-----------------------------------------------|
| V1.1    | Import GitHub, génération de CV, analytics simples. | MVP stable et workflow IA ≥ 80 % de réussite. |
| V1.2    | Interface d’administration légère, gestion médias.  | Besoin utilisateur confirmé.                  |
| V2      | Starter multi-profils, thèmes, onboarding guidé.    | Adoption open source démontrée.               |
| V3      | Option SaaS et collaboration.                       | Business model et exigences sécurité dédiées. |

# 7. Principes, hypothèses et contraintes

## 7.1 Principes produit

> • **Repository-first :** les contenus publiés et la configuration
> restent lisibles, versionnés et exportables.
>
> • **Human-in-the-loop :** aucune évolution importante n’est publiée
> sans validation humaine.
>
> • **Progressive disclosure :** la page d’accueil synthétise ; les
> fiches détaillées apportent la preuve.
>
> • **Evidence-based skills :** une compétence doit pouvoir être reliée
> à une réalisation.
>
> • **Accessible by default :** navigation clavier, contrastes,
> sémantique et alternatives textuelles intégrés dès le départ.
>
> • **Simple before scalable :** la complexité n’est ajoutée qu’après
> validation d’un besoin réel.

## 7.2 Hypothèses

> • Le Product Owner maîtrise Git à un niveau débutant/intermédiaire ou
> utilise une interface graphique.
>
> • Le contenu initial est préparé en français puis traduit avec revue
> humaine.
>
> • Les médias sont optimisés et libres d’utilisation.
>
> • Le déploiement cible accepte les frameworks JavaScript modernes.
>
> • Le dépôt ne contient aucune donnée confidentielle d’entreprise.

## 7.3 Contraintes

| **Contrainte**    | **Conséquence**                                                                               |
|-------------------|-----------------------------------------------------------------------------------------------|
| MacBook Air M2    | Privilégier une stack légère et des commandes locales raisonnables.                           |
| Budget personnel  | Éviter les services payants non nécessaires au MVP.                                           |
| Projet vitrine    | La qualité du dépôt, des commits et de la documentation est aussi importante que l’interface. |
| Open source futur | Séparer données personnelles, moteur générique et exemples.                                   |
| Usage IA          | Limiter les autorisations, interdire les secrets et exiger une revue des diffs.               |

# 8. Parcours utilisateurs cibles

## 8.1 Parcours visiteur – découverte du profil

> **1.** Le visiteur arrive sur l’accueil et comprend le positionnement
> en moins de 10 secondes.
>
> **2.** Il consulte les projets mis en avant et filtre éventuellement
> par domaine ou technologie.
>
> **3.** Il ouvre une fiche et visualise le contexte, la contribution,
> les résultats et les preuves.
>
> **4.** Il consulte les expériences et compétences associées.
>
> **5.** Il télécharge le CV, visite GitHub/LinkedIn ou utilise le canal
> de contact.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Résultat attendu</strong><br />
Le visiteur peut répondre à trois questions : qui est la personne, ce
qu’elle sait faire et quelles preuves démontrent ces compétences.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 8.2 Parcours administrateur – ajout d’un projet avec Claude

> **1.** Le Product Owner ouvre une branche ou demande à Claude d’en
> créer une.
>
> **2.** Il fournit les informations brutes, liens et médias du projet.
>
> **3.** Claude vérifie la complétude et signale uniquement les blocages
> indispensables.
>
> **4.** Claude crée les contenus français et anglais selon le schéma.
>
> **5.** Claude met à jour les index, métadonnées et relations de
> compétences.
>
> **6.** Claude exécute formatage, validation, tests et build.
>
> **7.** Claude présente le résumé, les hypothèses, les fichiers
> modifiés et les résultats des contrôles.
>
> **8.** Le Product Owner inspecte le site et le diff, puis crée ou
> valide la pull request.

## 8.3 Parcours contributeur open source

> **1.** Le contributeur clone le dépôt et suit le guide d’installation.
>
> **2.** Il charge les données d’exemple ou crée son profil.
>
> **3.** Il utilise les commandes/skills documentées.
>
> **4.** Il exécute les contrôles locaux.
>
> **5.** Il propose une pull request conforme au modèle de contribution.

# 9. Architecture fonctionnelle

| **Couche fonctionnelle**  | **Responsabilité**                                                       |
|---------------------------|--------------------------------------------------------------------------|
| Expérience publique       | Navigation, consultation, recherche, filtres, contact et téléchargement. |
| Présentation              | Pages, composants, thèmes, responsive, accessibilité et animations.      |
| Contenu                   | Entités métier, traductions, médias, taxonomie et relations.             |
| Orchestration IA          | CLAUDE.md, règles, skills, agents, hooks et prompts.                     |
| Qualité                   | Validation des schémas, lint, tests, build, audit visuel, liens et SEO.  |
| Versionnement / livraison | Branches, pull requests, CI, déploiement et rollback.                    |

## 9.1 Vue de flux

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Demande utilisateur<br />
↓<br />
Qualification par Claude (type de changement + impacts)<br />
↓<br />
Lecture des règles du projet et du schéma concerné<br />
↓<br />
Modification des contenus / composants sur branche dédiée<br />
↓<br />
Validation automatique : schéma → lint → types → tests → build<br />
↓<br />
Prévisualisation et revue humaine du diff<br />
↓<br />
Pull request approuvée<br />
↓<br />
Fusion contrôlée et déploiement</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 10. Spécifications fonctionnelles détaillées

La priorité utilise MoSCoW : MUST = indispensable au MVP ; SHOULD =
fortement souhaité ; COULD = optionnel ; WON’T = exclu du lot.

## 10.1 Epic F01 – Présentation publique

**F01-001 — Page d’accueil structurée \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le système affiche une page d’accueil présentant l’identité, le
positionnement, les actions principales et une sélection de
réalisations.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Une seule proposition de valeur principale doit être visible
au-dessus de la ligne de flottaison.<br />
• Les appels à l’action prioritaires sont « Voir les projets » et «
Télécharger le CV » ou « Me contacter ».<br />
• Les informations sont issues du modèle Profile, pas écrites en dur
dans plusieurs composants.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• La page est lisible sur largeur mobile et desktop.<br />
• Le visiteur accède aux projets en un clic.<br />
• La suppression d’un projet mis en avant ne casse pas la page.<br />
• Les textes français et anglais sont disponibles.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F01 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F01-002 — Navigation globale \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le système propose une navigation cohérente vers les sections
principales et une indication de langue et de thème.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• La navigation mobile doit être accessible au clavier.<br />
• Le lien actif est identifiable autrement que par la couleur
seule.<br />
• Le logo ou nom renvoie à l’accueil.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Toutes les destinations principales sont atteignables.<br />
• Le menu se ferme après sélection sur mobile.<br />
• Aucun lien de navigation ne retourne d’erreur.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F01 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F01-003 — Page À propos \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>La page présente le parcours, les objectifs, l’approche de travail
et des éléments personnels sélectionnés.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Le contenu personnel reste professionnel et non sensible.<br />
• Le texte peut comporter des blocs réutilisables : résumé, valeurs,
objectifs.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Le contenu est administrable depuis les données structurées.<br />
• La page existe dans les deux langues.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F01 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F01-004 — Contact et liens externes \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le visiteur peut accéder aux réseaux professionnels, au CV et à un
moyen de contact.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Les adresses et liens sont configurables.<br />
• Un formulaire, s’il existe, doit appliquer validation, anti-spam et
consentement adapté.<br />
• Dans le MVP, un lien mailto peut remplacer un formulaire si aucun
backend sécurisé n’est retenu.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Les liens s’ouvrent correctement.<br />
• Les erreurs de formulaire sont compréhensibles.<br />
• Aucune donnée de contact n’est envoyée à un tiers non documenté.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F01 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

## 10.2 Epic F02 – Catalogue de réalisations

**F02-001 — Liste des projets \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le système affiche les projets publiés sous forme de cartes avec
titre, résumé, type, technologies et visuel.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Seules les entités status=published sont visibles en
production.<br />
• L’ordre est déterminé par featuredRank puis date.<br />
• Une image de remplacement est disponible.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• La liste ne contient aucun brouillon.<br />
• Les cartes renvoient vers une fiche valide.<br />
• L’ordre correspond aux règles.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F02 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F02-002 — Fiche détaillée de projet \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Chaque projet possède une page détaillée présentant le problème, la
solution, le rôle, la démarche, les résultats, les technologies, les
difficultés et les apprentissages.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Le rôle personnel doit être explicite pour les travaux
collectifs.<br />
• Les résultats non chiffrés doivent être présentés comme
qualitatifs.<br />
• Les liens vers dépôt ou démonstration sont optionnels mais validés
s’ils existent.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Une fiche complète peut être générée depuis un fichier de
contenu.<br />
• Les sections vides ne sont pas affichées.<br />
• Les liens externes invalides sont signalés lors du contrôle.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F02 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F02-003 — Catégories de réalisation \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le système distingue au minimum projet personnel, projet
universitaire et hackathon.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Le type est obligatoire et appartient à une liste contrôlée.<br />
• Le modèle de base reste commun ; certaines sections peuvent être
conditionnelles.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Chaque type est filtrable.<br />
• Le libellé est traduit.<br />
• Un nouveau type non autorisé bloque la validation.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F02 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F02-004 — Recherche et filtres \[SHOULD · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le visiteur peut filtrer par type, domaine, technologie et année ;
une recherche textuelle simple est disponible.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Les filtres peuvent être combinés.<br />
• Le résultat vide propose une action de réinitialisation.<br />
• L’état des filtres peut être reflété dans l’URL si simple à
maintenir.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Le nombre de résultats est exact.<br />
• La réinitialisation restaure la liste complète.<br />
• Les filtres restent utilisables au clavier.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F02 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

## 10.3 Epic F03 – Expériences, formation et compétences

**F03-001 — Expériences professionnelles \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le système affiche les expériences avec organisation, rôle, période,
contexte, missions, résultats et technologies.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• La date de fin peut être « en cours ».<br />
• Les données confidentielles ou chiffres internes non autorisés sont
interdits.<br />
• Les missions doivent être rédigées sous forme orientée impact.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• L’ordre chronologique est correct.<br />
• Les périodes en cours sont identifiées.<br />
• Les contenus confidentiels peuvent être marqués private et exclus du
build.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F03 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F03-002 — Formation et certifications \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le système présente diplômes, établissements, périodes,
spécialisations et certifications.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Les certifications peuvent inclure un lien de vérification.<br />
• Les entrées sont triées par date décroissante.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Les dates sont cohérentes.<br />
• Les liens de vérification facultatifs sont contrôlés.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F03 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F03-003 — Référentiel de compétences \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Les compétences sont structurées par catégorie et reliées à des
preuves.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Une compétence peut référencer plusieurs projets ou
expériences.<br />
• Un niveau auto-déclaré n’est affiché que si une échelle et une
justification sont définies.<br />
• Le MVP privilégie les preuves plutôt que des jauges arbitraires.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Chaque compétence affichée appartient à une catégorie.<br />
• Les relations vers des entités inexistantes bloquent la
validation.<br />
• Le visiteur peut accéder aux preuves associées si l’interface le
prévoit.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F03 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

## 10.4 Epic F04 – Contenu structuré et médias

**F04-001 — Schémas de contenu \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Chaque type de contenu est validé par un schéma explicite avant
build.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Les champs obligatoires, formats, enums et relations sont
définis.<br />
• Le message d’erreur doit identifier le fichier et le champ.<br />
• La validation s’exécute localement et en CI.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Un champ obligatoire absent fait échouer le contrôle.<br />
• Un slug dupliqué est détecté.<br />
• Une relation invalide est détectée.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F04 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F04-002 — Gestion des statuts \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Les contenus supportent au minimum draft, review et published.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Seul published est exposé en production.<br />
• review peut apparaître en prévisualisation.<br />
• Le changement de statut doit être visible dans Git.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Un brouillon n’est pas routable en production.<br />
• La prévisualisation affiche les contenus autorisés.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F04 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F04-003 — Gestion des médias \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Les images et documents sont référencés avec métadonnées
minimales.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Chaque image informative possède un texte alternatif.<br />
• Les formats et tailles maximales sont documentés.<br />
• Les noms de fichiers utilisent une convention stable.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Une image manquante est détectée avant déploiement.<br />
• L’alternative textuelle est obligatoire sauf image décorative
explicitement marquée.<br />
• Le CV téléchargeable existe dans les langues prévues.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F04 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

## 10.5 Epic F05 – Internationalisation

**F05-001 — Langues française et anglaise \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le site et les contenus essentiels sont disponibles en français et
en anglais.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Le français est la langue par défaut initiale.<br />
• Les routes ou la stratégie de locale sont cohérentes.<br />
• La langue choisie est conservée pendant la navigation.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Toutes les pages critiques existent dans les deux langues.<br />
• Le sélecteur change le contenu sans perdre le contexte.<br />
• Les balises de langue sont correctes.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F05 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F05-002 — Contrôle de complétude des traductions \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le pipeline détecte les traductions obligatoires manquantes ou
obsolètes.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Une traduction manquante bloque la publication d’un contenu marked
translationRequired.<br />
• Les champs non traduisibles restent partagés.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Le build échoue avec un message actionnable si une traduction
requise manque.<br />
• Un contenu partiellement traduit ne devient pas published.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F05 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

## 10.6 Epic F06 – Thème, SEO et qualité de présentation

**F06-001 — Thème clair et sombre \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le visiteur peut choisir un thème clair ou sombre ; le système
respecte le thème OS par défaut.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Le choix utilisateur persiste localement.<br />
• Les contrastes restent conformes dans les deux thèmes.<br />
• Aucun flash de thème majeur au chargement.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Le thème est appliqué sur toutes les pages.<br />
• La préférence persiste après rechargement.<br />
• Les composants restent lisibles.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F06 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F06-002 — Métadonnées SEO \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Chaque page publique dispose d’un titre, d’une description et des
métadonnées sociales appropriées.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Les contenus draft/review ne doivent pas être indexés.<br />
• Les URLs canoniques suivent la stratégie de langue.<br />
• Un sitemap et un robots.txt sont générés.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Les pages de projet ont un titre unique.<br />
• Les aperçus sociaux utilisent une image valide.<br />
• Le sitemap n’inclut aucun brouillon.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F06 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F06-003 — Accessibilité fonctionnelle \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Les parcours critiques sont utilisables au clavier et avec
technologies d’assistance.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Structure de titres cohérente.<br />
• Focus visible.<br />
• Libellés explicites pour contrôles et formulaires.<br />
• Animations réductibles selon la préférence utilisateur.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Navigation complète au clavier.<br />
• Aucune erreur automatique bloquante sur les pages critiques.<br />
• Les images informatives ont une alternative pertinente.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F06 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

## 10.7 Epic F07 – Administration par Claude Code

**F07-001 — Ajout d’un projet par skill \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Une skill standardisée permet de créer une fiche projet complète à
partir d’informations brutes.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• La skill vérifie le schéma, le slug, les traductions, les médias,
les relations et les tests.<br />
• Elle ne fabrique pas de résultat chiffré non fourni.<br />
• Elle signale clairement les hypothèses éditoriales.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• La commande crée tous les fichiers attendus.<br />
• Le build et les tests passent.<br />
• Le résumé final liste les fichiers, hypothèses et contrôles.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F07 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F07-002 — Modification contrôlée d’un contenu \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Claude peut mettre à jour une entité existante sans réécrire des
zones non concernées.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Claude doit lire le schéma et l’entité avant modification.<br />
• Les changements doivent être minimaux.<br />
• Les traductions liées sont mises à jour ou signalées.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Le diff ne contient pas de reformattage massif non
nécessaire.<br />
• Les relations et index restent valides.<br />
• Le résumé distingue changements demandés et changements
techniques.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F07 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F07-003 — Rapport de fin de tâche \[MUST · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Après chaque tâche, Claude fournit un rapport standard.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Le rapport indique : objectif, fichiers modifiés, décisions,
hypothèses, commandes exécutées, résultats, risques et actions
manuelles.<br />
• Une tâche échouée ne doit pas être présentée comme terminée.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Le rapport est présent dans la réponse finale.<br />
• Tout test non exécuté est explicitement signalé.<br />
• Les erreurs bloquantes sont listées en premier.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F07 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F07-004 — Préparation de pull request \[SHOULD · MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Claude prépare le commit et le descriptif de PR, sans fusion
automatique.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Le message de commit suit la convention du projet.<br />
• La PR inclut description, captures si UI, tests et impacts.<br />
• La branche main est protégée.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• La PR est compréhensible sans relire toute la conversation.<br />
• Les checks obligatoires sont listés.<br />
• Aucune donnée sensible n’est incluse.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F07 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

## 10.8 Epic F08 – Fonctions post-MVP

**F08-001 — Génération de CV depuis les données \[COULD · Post-MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le système génère un CV cohérent à partir du référentiel de
contenu.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• Aucune information ne doit être inventée.<br />
• Le CV peut appliquer un profil de sélection, par exemple IA ou
data.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Le document est généré sans doublon.<br />
• Les dates et intitulés correspondent au portfolio.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F08 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

**F08-002 — Import GitHub \[COULD · Post-MVP\]**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Description</strong></th>
<th>Le système peut proposer une fiche à partir d’un dépôt GitHub
sélectionné.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Règles métier</strong></td>
<td>• L’import crée un brouillon nécessitant validation.<br />
• Les informations de contribution personnelle doivent être
confirmées.</td>
</tr>
<tr class="even">
<td><strong>Critères d’acceptation</strong></td>
<td>• Aucun projet n’est publié automatiquement.<br />
• Les technologies détectées sont modifiables.</td>
</tr>
<tr class="odd">
<td><strong>Traçabilité</strong></td>
<td>Epic associé : F08 | Responsable de validation : Product Owner</td>
</tr>
</tbody>
</table>

# 11. Modèle de données fonctionnel

## 11.1 Entités principales

| **Entité**    | **Finalité**                                   | **Identifiant** | **Relations principales**            |
|---------------|------------------------------------------------|-----------------|--------------------------------------|
| Profile       | Identité, résumé, positionnement, coordonnées. | singleton       | Skills, SocialLinks, Media           |
| Project       | Projet personnel, universitaire ou hackathon.  | slug            | Skills, Media, Experience éventuelle |
| Experience    | Expérience professionnelle ou associative.     | slug            | Skills, Projects                     |
| Education     | Diplôme ou formation.                          | slug            | Skills, Projects                     |
| Certification | Certification ou badge.                        | slug            | Skills                               |
| Skill         | Compétence catégorisée.                        | slug            | Projects, Experiences, Education     |
| Hobby         | Centre d’intérêt sélectionné.                  | slug            | Media                                |
| Media         | Image, vidéo, document ou lien.                | id/path         | Toute entité                         |
| Translation   | Valeurs localisées.                            | locale + entity | Entité source                        |

## 11.2 Schéma fonctionnel Project

| **Champ**         | **Type**            | **Obligatoire**  | **Règle**                                 |
|-------------------|---------------------|------------------|-------------------------------------------|
| slug              | string              | Oui              | Unique, stable, kebab-case.               |
| status            | enum                | Oui              | draft \| review \| published \| archived. |
| type              | enum                | Oui              | personal \| academic \| hackathon.        |
| title             | localized string    | Oui              | Titre court et distinctif.                |
| summary           | localized string    | Oui              | Résumé de carte, longueur cible définie.  |
| problem           | localized rich text | Oui              | Problème traité, sans surpromesse.        |
| solution          | localized rich text | Oui              | Approche et fonctionnalités.              |
| role              | localized string    | Oui              | Contribution personnelle explicite.       |
| results           | localized list      | Conditionnel     | Quantitatifs uniquement si sourcés.       |
| technologies      | string\[\]          | Oui              | Référentiel contrôlé.                     |
| skills            | slug\[\]            | Oui              | Relations valides.                        |
| startDate/endDate | date                | Oui/Non          | Cohérence chronologique.                  |
| links             | object\[\]          | Non              | repo, demo, article ; URL valide.         |
| media             | media\[\]           | Non              | Alt requis si informatif.                 |
| featuredRank      | integer             | Non              | Ordre de mise en avant.                   |
| seo               | object              | Oui si published | Title, description, social image.         |

## 11.3 Règles transverses de données

> • Tous les slugs sont uniques à l’intérieur de leur collection.
>
> • Les dates utilisent un format ISO dans les fichiers source.
>
> • Les valeurs affichées sont localisées ; les identifiants techniques
> ne le sont pas.
>
> • Une relation vers une entité inexistante bloque le contrôle.
>
> • Les champs confidentiels sont interdits ; un mécanisme
> private/exclude peut servir aux brouillons locaux non publiés.
>
> • Les contenus générés par IA sont traités comme des propositions et
> doivent être revus.
>
> • Les changements de schéma nécessitent une migration des contenus
> existants.

# 12. Exigences non fonctionnelles

| **ID**      | **Domaine**    | **Priorité** | **Exigence**                                                                                         | **Contrôle**                                  |
|-------------|----------------|--------------|------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| NFR-PERF-01 | Performance    | MUST         | Budget page initiale : JavaScript et images maîtrisés ; pas de dépendance lourde sans justification. | Mesure automatisée en CI ou audit de release. |
| NFR-PERF-02 | Chargement     | MUST         | Images responsives, lazy loading hors zone visible, polices optimisées.                              | Contrôle Lighthouse et inspection réseau.     |
| NFR-SEC-01  | Secrets        | MUST         | Aucun secret dans le dépôt ; .env ignorés et lecture interdite à Claude.                             | Scan secrets + règles permissions.            |
| NFR-SEC-02  | Dépendances    | MUST         | Dépendances minimales, versionnées, auditables et mises à jour raisonnablement.                      | Audit package manager et alertes Git.         |
| NFR-SEC-03  | Entrées        | MUST         | Toute entrée utilisateur est validée et échappée ; pas d’injection HTML non maîtrisée.               | Tests ciblés et revue.                        |
| NFR-A11Y-01 | Accessibilité  | MUST         | Objectif WCAG 2.2 niveau AA sur parcours critiques.                                                  | Tests automatiques + revue clavier.           |
| NFR-COMP-01 | Compatibilité  | MUST         | Deux dernières versions stables des navigateurs majeurs ; responsive 320 px et plus.                 | Matrice de recette.                           |
| NFR-SEO-01  | Indexation     | MUST         | HTML sémantique, métadonnées uniques, sitemap, robots, hreflang si pertinent.                        | Contrôle build.                               |
| NFR-REL-01  | Fiabilité      | MUST         | Build reproductible ; une erreur de contenu invalide bloque le déploiement.                          | CI obligatoire.                               |
| NFR-MNT-01  | Maintenabilité | MUST         | Composants réutilisables, TypeScript strict, architecture documentée, dette limitée.                 | Revue code + règles.                          |
| NFR-OBS-01  | Observabilité  | SHOULD       | Journal de build clair, suivi des erreurs front si solution gratuite adaptée.                        | Vérification release.                         |
| NFR-PRIV-01 | Vie privée     | MUST         | Collecte minimale ; aucun tracker non nécessaire sans consentement/documentation.                    | Revue configuration.                          |
| NFR-OPEN-01 | Portabilité    | MUST         | Le projet peut être cloné, configuré et déployé sans service propriétaire obligatoire.               | Test d’installation propre.                   |

## 12.1 Budgets et seuils cibles

| **Mesure**      | **Cible**                                                          | **Tolérance / décision**                                    |
|-----------------|--------------------------------------------------------------------|-------------------------------------------------------------|
| Build           | Aucun avertissement bloquant ; TypeScript et validation conformes. | Échec = pas de fusion.                                      |
| Pages critiques | Score d’audit élevé et aucun défaut critique accessibilité/SEO.    | Dérogation documentée.                                      |
| Images          | Formats modernes et dimensions adaptées.                           | Image non optimisée = correction avant publication.         |
| Liens           | 0 lien interne cassé.                                              | Lien externe instable peut être accepté avec justification. |
| Tests E2E       | 100 % des scénarios critiques verts.                               | Flaky test = non acceptable.                                |

# 13. Spécifications UX/UI

## 13.1 Principes d’expérience

> • Priorité à la compréhension du profil, pas à l’effet visuel.
>
> • Hiérarchie nette : identité → réalisations → preuves → contact.
>
> • Densité modérée, textes scannables, CTA limités.
>
> • Animations courtes et fonctionnelles ; aucune animation ne bloque la
> lecture.
>
> • Composants cohérents entre pages et catégories.
>
> • Les informations clés d’un projet sont visibles avant les détails
> techniques.

## 13.2 Inventaire de composants

| **Composant**       | **Usage**                                | **États à prévoir**                         |
|---------------------|------------------------------------------|---------------------------------------------|
| Header / navigation | Navigation globale, langue, thème.       | Desktop, mobile, ouvert, focus.             |
| Hero                | Positionnement et CTA.                   | Avec/sans portrait, longueurs de texte.     |
| Project Card        | Résumé d’une réalisation.                | Default, hover/focus, image absente.        |
| Filter Bar          | Recherche et filtres.                    | Actif, vide, reset, mobile.                 |
| Timeline            | Expériences et formation.                | En cours, passée, détails.                  |
| Skill Evidence      | Compétence et preuves.                   | Avec plusieurs liens, sans preuve publique. |
| Media Gallery       | Captures et médias.                      | Image, vidéo, légende, erreur.              |
| Callout             | Décision, résultat ou apprentissage.     | Info, succès, alerte.                       |
| Contact Block       | Liens et formulaire éventuel.            | Valide, erreur, succès.                     |
| Footer              | Navigation secondaire, licence, réseaux. | Toutes langues et thèmes.                   |

## 13.3 Règles éditoriales

> • Privilégier les verbes d’action et les résultats démontrables.
>
> • Éviter les superlatifs non justifiés et le jargon inutile.
>
> • Pour les projets collectifs, distinguer résultat de l’équipe et
> contribution personnelle.
>
> • Ne pas exposer de données internes, noms de clients ou captures
> confidentielles.
>
> • Conserver un ton professionnel, direct et cohérent entre langues.

# 14. Cible technique et règles d’architecture

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Position MOA</strong><br />
Les choix ci-dessous constituent une cible de référence, pas une
contrainte absolue. Toute alternative proposée par la MOE doit démontrer
un gain clair sans compromettre simplicité, portabilité, sécurité et
maintenabilité.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 14.1 Stack cible

| **Domaine**          | **Choix cible**                            | **Justification produit**                              |
|----------------------|--------------------------------------------|--------------------------------------------------------|
| Framework            | Next.js + React + TypeScript               | SEO, routage, génération statique/hybride, écosystème. |
| Style                | Tailwind CSS ou CSS Modules structurés     | Vitesse de build et cohérence.                         |
| Contenu              | MDX/YAML/JSON validé par Zod               | Lisible, versionnable, modifiable par IA.              |
| Internationalisation | Routage localisé et dictionnaires typés    | Contrôle de complétude.                                |
| Tests                | Vitest + Testing Library + Playwright      | Couverture logique et parcours critiques.              |
| Qualité              | ESLint + Prettier + TypeScript strict      | Automatisation et réduction de dette.                  |
| CI/CD                | GitHub Actions + plateforme de déploiement | Contrôles obligatoires et prévisualisations.           |
| Médias               | Optimisation native du framework           | Performance et responsive.                             |

## 14.2 Règles d’architecture

> • Séparer moteur générique, contenu personnel et exemples.
>
> • Interdire les données métier dupliquées dans les composants.
>
> • Valider les données au plus tôt, idéalement au chargement/build.
>
> • Conserver les composants de présentation indépendants de la source
> de données.
>
> • Documenter toute dépendance structurante par une décision
> d’architecture.
>
> • Ne pas introduire de base de données, CMS ou authentification sans
> exigence approuvée.
>
> • Les fonctions IA ne sont pas embarquées dans le site public au MVP ;
> Claude Code agit sur le dépôt de développement.

## 14.3 Structure de dépôt cible

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>openportfolio-ai/<br />
├── app/ # routes et pages<br />
├── components/ # composants UI réutilisables<br />
├── content/<br />
│ ├── profile/<br />
│ ├── projects/<br />
│ ├── experiences/<br />
│ ├── education/<br />
│ ├── certifications/<br />
│ ├── skills/<br />
│ └── hobbies/<br />
├── schemas/ # schémas et validations<br />
├── lib/ # lecture contenu, i18n, utilitaires<br />
├── public/<br />
│ ├── images/<br />
│ └── documents/<br />
├── tests/<br />
├── docs/<br />
│ ├── product/<br />
│ ├── architecture/<br />
│ └── decisions/<br />
├── scripts/<br />
├── .claude/<br />
│ ├── agents/<br />
│ ├── skills/<br />
│ ├── rules/<br />
│ └── settings.json<br />
├── CLAUDE.md<br />
├── README.md<br />
└── package.json</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 15. Modèle opératoire IA / Claude Code

## 15.1 Rôles et responsabilités

| **Acteur**            | **Autorisé**                                                     | **Interdit / validation requise**                     |
|-----------------------|------------------------------------------------------------------|-------------------------------------------------------|
| Product Owner         | Prioriser, valider contenu, accepter les compromis.              | Ne pas fusionner un changement non testé.             |
| Claude principal      | Analyser, planifier, modifier, exécuter les contrôles autorisés. | Inventer des faits, lire les secrets, fusionner main. |
| Subagent Product/Spec | Contrôler conformité au besoin et aux critères.                  | Modifier le code si configuré read-only.              |
| Subagent Frontend     | Implémenter des composants selon la spec.                        | Changer le périmètre fonctionnel.                     |
| Subagent QA           | Créer/exécuter tests, rapporter les écarts.                      | Masquer un test échoué.                               |
| Subagent Security     | Examiner permissions, dépendances et entrées.                    | Accéder aux secrets réels.                            |
| CI                    | Bloquer la fusion en cas d’échec.                                | Contourner les checks sans décision explicite.        |

## 15.2 Workflow de changement standard

> **1.** Qualifier la demande : contenu, design, fonctionnalité,
> correction ou architecture.
>
> **2.** Lire les sections pertinentes de la spécification, CLAUDE.md et
> règles ciblées.
>
> **3.** Produire un plan d’impact avant toute modification non
> triviale.
>
> **4.** Créer ou vérifier une branche dédiée.
>
> **5.** Appliquer le changement minimal.
>
> **6.** Exécuter les contrôles adaptés.
>
> **7.** Inspecter le rendu si l’interface est modifiée.
>
> **8.** Fournir le rapport de fin de tâche.
>
> **9.** Préparer une PR ; attendre validation avant fusion.

## 15.3 Hiérarchie des instructions

| **Niveau**      | **Contenu**                                                 | **Exemple**                                            |
|-----------------|-------------------------------------------------------------|--------------------------------------------------------|
| CLAUDE.md       | Faits permanents, architecture, commandes, règles globales. | Toujours valider les schémas avant build.              |
| .claude/rules/  | Règles ciblées par domaine ou chemin.                       | Règles applicables aux fichiers content/projects/\*\*. |
| Skills          | Procédures multi-étapes réutilisables.                      | Ajouter un projet, auditer le portfolio.               |
| Subagents       | Rôles spécialisés avec contexte et outils bornés.           | QA read-only, frontend editor.                         |
| Hooks           | Contrôles déterministes avant/après outils.                 | Bloquer la lecture de .env, lancer formatage.          |
| Prompt de tâche | Objectif ponctuel, entrées et contraintes.                  | Ajouter le projet X avec ces informations.             |

# 16. Sécurité et gestion des permissions

## 16.1 Politique de sécurité

> • Principe du moindre privilège.
>
> • Aucun mode de contournement global des permissions pour le
> développement quotidien.
>
> • Lecture interdite des fichiers .env, secrets, clés, credentials et
> exports privés.
>
> • Commandes destructrices ou de publication soumises à confirmation
> explicite.
>
> • Aucune fusion, suppression de branche distante ou déploiement manuel
> sans validation.
>
> • Dépendances nouvelles limitées et justifiées.
>
> • Les hooks complètent les instructions ; ils ne reposent pas
> uniquement sur la bonne volonté du modèle.

## 16.2 Matrice de permissions recommandée

| **Action**                        | **Politique MVP**                        | **Justification**                       |
|-----------------------------------|------------------------------------------|-----------------------------------------|
| Lire le code et le contenu public | Autoriser                                | Nécessaire à l’analyse.                 |
| Modifier les fichiers du dépôt    | Autoriser avec revue diff                | Nécessaire au build.                    |
| Lire .env / secrets               | Interdire                                | Réduction du risque d’exposition.       |
| Installer une dépendance          | Demander confirmation                    | Impact sécurité, taille et maintenance. |
| Exécuter tests/lint/build         | Autoriser                                | Contrôles déterministes.                |
| git status/diff/log               | Autoriser                                | Traçabilité.                            |
| git commit                        | Autoriser sur demande ou skill contrôlée | Évite des commits non désirés.          |
| git push                          | Demander confirmation                    | Action externe.                         |
| Fusionner main / déployer         | Interdire à Claude                       | Décision humaine.                       |
| Supprimer fichiers en masse       | Demander confirmation                    | Risque destructif.                      |

# 17. Backlog et roadmap

## 17.1 Backlog priorisé MVP

| **ID**  | **Backlog item**                                       | **Priorité** | **Taille** | **Lot** |
|---------|--------------------------------------------------------|--------------|------------|---------|
| PBI-001 | Initialiser dépôt, qualité, CI et conventions          | MUST         | S          | Lot 0   |
| PBI-002 | Définir schémas Profile, Project, Experience, Skill    | MUST         | M          | Lot 0   |
| PBI-003 | Créer design system minimal et layout global           | MUST         | M          | Lot 1   |
| PBI-004 | Construire accueil et navigation                       | MUST         | M          | Lot 1   |
| PBI-005 | Construire catalogue et fiche projet                   | MUST         | L          | Lot 1   |
| PBI-006 | Construire expériences, formation, compétences         | MUST         | M          | Lot 1   |
| PBI-007 | Ajouter i18n FR/EN et contrôles de complétude          | MUST         | L          | Lot 2   |
| PBI-008 | Ajouter thème clair/sombre                             | MUST         | S          | Lot 2   |
| PBI-009 | Ajouter SEO, sitemap, social cards                     | MUST         | M          | Lot 2   |
| PBI-010 | Créer skill add-project                                | MUST         | M          | Lot 3   |
| PBI-011 | Créer agents QA et Product Reviewer                    | MUST         | M          | Lot 3   |
| PBI-012 | Créer hooks et politique permissions                   | MUST         | M          | Lot 3   |
| PBI-013 | Créer tests E2E critiques et audit release             | MUST         | L          | Lot 3   |
| PBI-014 | Documenter installation, contribution, contenu exemple | MUST         | M          | Lot 4   |
| PBI-015 | Préparer déploiement et release MVP                    | MUST         | M          | Lot 4   |
| PBI-016 | Recherche et filtres avancés                           | SHOULD       | M          | Lot 4   |

## 17.2 Roadmap indicative

| **Lot**                   | **Objectif**                                       | **Sortie attendue**                          |
|---------------------------|----------------------------------------------------|----------------------------------------------|
| Lot 0 – Fondation         | Dépôt, règles, schémas, CI, design direction.      | Socle buildable et spécifications intégrées. |
| Lot 1 – Portfolio cœur    | Pages et contenus principaux.                      | Parcours visiteur complet en français.       |
| Lot 2 – Qualité produit   | Anglais, thème, SEO, accessibilité.                | Version candidate fonctionnelle.             |
| Lot 3 – IA industrialisée | Skills, agents, hooks, recette.                    | Ajout projet de bout en bout par Claude.     |
| Lot 4 – Release           | Documentation, open-source readiness, déploiement. | MVP publié et reproductible.                 |

# 18. Stratégie de recette

## 18.1 Niveaux de tests

| **Niveau**           | **Objet**                                   | **Responsable principal** | **Déclenchement**            |
|----------------------|---------------------------------------------|---------------------------|------------------------------|
| Validation de schéma | Données, enums, relations, slugs.           | MOE / CI                  | À chaque changement contenu. |
| Tests unitaires      | Fonctions de tri, filtres, mapping, i18n.   | MOE                       | À chaque PR.                 |
| Tests composants     | États critiques et accessibilité de base.   | MOE / QA                  | À chaque PR UI.              |
| Tests E2E            | Navigation, projet, langue, thème, contact. | QA                        | À chaque PR / release.       |
| Audit visuel         | Responsive, thèmes, régression.             | PO / QA                   | Avant fusion UI.             |
| Recette métier       | Conformité au besoin et qualité éditoriale. | Product Owner             | Avant release.               |
| Audit sécurité       | Secrets, permissions, dépendances.          | Security reviewer         | Avant release.               |

## 18.2 Scénarios de recette prioritaires

| **ID** | **Scénario**                                | **Résultat attendu**                                             |
|--------|---------------------------------------------|------------------------------------------------------------------|
| REC-01 | Un visiteur ouvre l’accueil sur mobile.     | Contenu lisible, CTA visibles, aucune coupure.                   |
| REC-02 | Le visiteur filtre les projets par IA.      | Seuls les projets correspondants s’affichent ; reset disponible. |
| REC-03 | Le visiteur ouvre une fiche en anglais.     | Toutes les sections obligatoires sont traduites.                 |
| REC-04 | Un contenu draft est ajouté.                | Il n’apparaît pas en production.                                 |
| REC-05 | Un slug dupliqué est introduit.             | La validation échoue avec fichier et champ.                      |
| REC-06 | Une image est supprimée.                    | Le build ou contrôle médias échoue.                              |
| REC-07 | Claude exécute add-project.                 | Fichiers créés, tests verts, rapport complet.                    |
| REC-08 | Claude tente de lire .env.                  | Action bloquée par permission.                                   |
| REC-09 | Le thème est changé puis la page rechargée. | Préférence conservée.                                            |
| REC-10 | Navigation uniquement au clavier.           | Tous les éléments critiques sont accessibles et focus visibles.  |

## 18.3 Conditions de GO production

> • Tous les MUST sont acceptés ou font l’objet d’une dérogation signée.
>
> • Aucun test critique rouge.
>
> • Aucune anomalie bloquante ou majeure ouverte.
>
> • Aucun secret ou contenu confidentiel détecté.
>
> • Le Product Owner valide le contenu français et anglais.
>
> • Le rollback ou redeploy de la version précédente est possible.

# 19. Gouvernance de delivery

## 19.1 Stratégie Git

> • Branche principale protégée.
>
> • Une branche par fonctionnalité ou changement cohérent.
>
> • Pull request obligatoire pour les changements significatifs.
>
> • Checks obligatoires : validation contenu, lint, typecheck, tests et
> build.
>
> • Commits atomiques et messages conventionnels.
>
> • Aucune force-push sur la branche principale.

## 19.2 Gestion des décisions

| **Artefact**    | **Usage**                               | **Emplacement cible**         |
|-----------------|-----------------------------------------|-------------------------------|
| Dossier produit | Référence fonctionnelle.                | docs/product/                 |
| ADR             | Décisions d’architecture structurantes. | docs/decisions/               |
| Backlog         | Priorités et état d’avancement.         | GitHub Issues / Projects      |
| Changelog       | Évolutions visibles par version.        | CHANGELOG.md                  |
| CLAUDE.md       | Contexte permanent de développement.    | Racine                        |
| Skills          | Procédures reproductibles.              | .claude/skills/               |
| Rapports QA     | Résultats de release.                   | docs/quality/ ou artefacts CI |

# 20. Risques et plans de mitigation

| **ID** | **Risque**                             | **Probabilité**  | **Impact** | **Mitigation**                                                    |
|--------|----------------------------------------|------------------|------------|-------------------------------------------------------------------|
| R-01   | Claude modifie trop de fichiers        | Moyenne          | Élevé      | Plan obligatoire, changements minimaux, revue diff, branches.     |
| R-02   | Invention de contenu ou résultats      | Moyenne          | Élevé      | Règle « ne jamais inventer », champs sources, revue PO.           |
| R-03   | Exposition de secrets                  | Faible à moyenne | Critique   | permissions.deny, .gitignore, scan secrets, hooks.                |
| R-04   | Sur-architecture du MVP                | Élevée           | Moyen      | Périmètre OUT, ADR obligatoire, refus des services non requis.    |
| R-05   | Désynchronisation FR/EN                | Moyenne          | Moyen      | Validation de complétude et skill de traduction.                  |
| R-06   | Dépendances excessives                 | Moyenne          | Moyen      | Justification et confirmation avant installation.                 |
| R-07   | Design impressionnant mais peu lisible | Moyenne          | Moyen      | Principes UX, test recruteur, accessibilité.                      |
| R-08   | Open source difficile à généraliser    | Moyenne          | Moyen      | Séparer moteur, exemples et données personnelles.                 |
| R-09   | Tests trop coûteux ou instables        | Moyenne          | Moyen      | Pyramide de tests, E2E limités aux parcours critiques.            |
| R-10   | Projet jamais publié                   | Moyenne          | Élevé      | Roadmap incrémentale, release française avant fonctions avancées. |

# 21. Definition of Ready / Definition of Done

## 21.1 Definition of Ready

> • Objectif utilisateur et valeur attendue explicités.
>
> • Périmètre et exclusions compris.
>
> • Critères d’acceptation testables.
>
> • Maquettes ou règles UX disponibles si nécessaire.
>
> • Données d’entrée et exemples fournis.
>
> • Impacts sur traductions, schémas, SEO et sécurité identifiés.
>
> • Aucune dépendance bloquante non décidée.

## 21.2 Definition of Done

> • Implémentation conforme aux critères d’acceptation.
>
> • Données et types validés.
>
> • Lint, typecheck, tests et build réussis.
>
> • Rendu inspecté sur mobile et desktop si UI.
>
> • Accessibilité critique contrôlée.
>
> • Documentation et changelog mis à jour si pertinent.
>
> • Aucun secret, log temporaire ou TODO bloquant.
>
> • PR relue et approuvée.
>
> • Déploiement de prévisualisation validé.

# 22. Kit de remise au build

## 22.1 Artefacts à fournir à Claude

| **Artefact**                  | **Statut au démarrage** | **Usage**                                      |
|-------------------------------|-------------------------|------------------------------------------------|
| Dossier MOA et spécifications | Présent – ce document   | Comprendre le produit et tracer les exigences. |
| Contenus personnels bruts     | À préparer              | Créer les entités réelles.                     |
| Inventaire médias             | À préparer              | Images, captures, CV, logos.                   |
| Direction artistique          | À décider               | Couleurs, typographies, références.            |
| CLAUDE.md                     | À initialiser           | Règles globales du dépôt.                      |
| Schémas de données            | À implémenter           | Validation déterministe.                       |
| Backlog GitHub                | À créer                 | Découper les lots et suivre les décisions.     |
| Règles Git / CI               | À configurer            | Protéger la qualité.                           |

## 22.2 Ordre de build recommandé

> **1.** Initialiser le dépôt et la gouvernance Git.
>
> **2.** Copier les spécifications dans docs/product/.
>
> **3.** Créer CLAUDE.md et les règles de sécurité.
>
> **4.** Définir le modèle de données et les schémas.
>
> **5.** Créer un jeu de données d’exemple minimal.
>
> **6.** Construire le layout et le design system.
>
> **7.** Construire les parcours publics principaux.
>
> **8.** Ajouter la langue anglaise, le thème et le SEO.
>
> **9.** Créer la skill add-project et les agents QA/Product.
>
> **10.** Ajouter hooks, CI et tests de release.
>
> **11.** Intégrer les contenus personnels réels.
>
> **12.** Recetter puis publier le MVP.

# 23. Paramétrage Claude Code avant démarrage

Cette section décrit la configuration recommandée au 19 juillet 2026.
Elle doit être appliquée progressivement : sécurité et contexte d’abord,
automatisations ensuite.

## 23.1 Installation et mode de travail

> **1.** Installer Claude Code avec la méthode officielle adaptée à
> macOS et se connecter avec le compte autorisé.
>
> **2.** Travailler depuis le terminal intégré de VS Code ou l’extension
> VS Code, en conservant Git comme source de vérité.
>
> **3.** Lancer les tâches non triviales en mode plan, relire le plan,
> puis passer à l’implémentation.
>
> **4.** Utiliser le modèle par défaut du compte pour commencer ;
> sélectionner un modèle plus capable uniquement pour architecture,
> refactorings complexes ou revue finale.
>
> **5.** Ne jamais activer un mode de contournement global des
> permissions pour ce projet.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Réglage conseillé</strong><br />
Mode quotidien : permissions par défaut ou acceptation des éditions
après confiance. Mode plan pour toute fonctionnalité dépassant un petit
changement local. Validation manuelle obligatoire avant installation,
push, suppression importante ou publication.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 23.2 Scopes de configuration

| **Fichier / emplacement**   | **Contenu recommandé**                                            | **Versionné** |
|-----------------------------|-------------------------------------------------------------------|---------------|
| ~/.claude/settings.json     | Préférences personnelles, modèle initial, status line éventuelle. | Non           |
| .claude/settings.json       | Permissions et configuration partagées du projet.                 | Oui           |
| .claude/settings.local.json | Exceptions locales et outils propres à la machine.                | Non           |
| CLAUDE.md                   | Architecture, commandes et règles permanentes.                    | Oui           |
| .claude/rules/\*.md         | Règles ciblées par chemin ou domaine.                             | Oui           |
| .claude/skills/\*/SKILL.md  | Procédures réutilisables.                                         | Oui           |
| .claude/agents/\*.md        | Sous-agents spécialisés.                                          | Oui           |

## 23.3 Configuration utilisateur minimale

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>{<br />
"model": "default",<br />
"permissions": {<br />
"defaultMode": "default"<br />
}<br />
}</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Le modèle « default » laisse Claude Code utiliser le modèle prévu pour
le type de compte. Le choix initial peut ensuite être changé par session
; il ne constitue pas une politique de sécurité.

## 23.4 Configuration projet recommandée

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>{<br />
"permissions": {<br />
"allow": [<br />
"Read(./**)",<br />
"Edit(./**)",<br />
"Bash(npm run lint)",<br />
"Bash(npm run typecheck)",<br />
"Bash(npm run test*)",<br />
"Bash(npm run build)",<br />
"Bash(git status)",<br />
"Bash(git diff*)",<br />
"Bash(git log*)"<br />
],<br />
"ask": [<br />
"Bash(npm install*)",<br />
"Bash(npm uninstall*)",<br />
"Bash(git commit*)",<br />
"Bash(git push*)",<br />
"Bash(rm *)"<br />
],<br />
"deny": [<br />
"Read(./.env)",<br />
"Read(./.env.*)",<br />
"Read(./secrets/**)",<br />
"Read(./private/**)",<br />
"Read(./config/credentials*)",<br />
"Bash(git push --force*)",<br />
"Bash(git checkout main &amp;&amp; git merge*)"<br />
]<br />
}<br />
}</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Note : les patterns exacts doivent être testés avec la version installée
de Claude Code et ajustés aux commandes réelles du dépôt. Les
permissions « deny » ont priorité sur les autorisations.

## 23.5 CLAUDE.md – contenu obligatoire

> • Vision du produit et périmètre MVP.
>
> • Architecture et structure de dossiers.
>
> • Commandes exactes d’installation, développement, validation et
> build.
>
> • Règles de contenu : ne rien inventer, confidentialité, langues,
> statuts.
>
> • Règles de code : TypeScript strict, composants, conventions de
> nommage.
>
> • Workflow Git et interdictions.
>
> • Checklist avant fin de tâche.
>
> • Lien vers le dossier de spécifications et les ADR.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Règle de taille</strong><br />
CLAUDE.md doit rester concis et permanent. Une procédure longue devient
une skill ; une règle ciblée devient un fichier dans
.claude/rules/.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 23.6 Règles ciblées à créer dès le départ

| **Fichier** | **Portée**                             | **Contenu**                                                        |
|-------------|----------------------------------------|--------------------------------------------------------------------|
| content.md  | content/\*\*                           | Schémas, sources, traduction, confidentialité, statuts.            |
| frontend.md | app/\*\*, components/\*\*              | Composants, responsive, accessibilité, design system.              |
| testing.md  | tests/\*\* et changements fonctionnels | Pyramide de tests, critères E2E, interdiction de masquer un échec. |
| git.md      | Toutes tâches de livraison             | Branches, commits, PR, pas de fusion automatique.                  |
| security.md | Global                                 | Secrets, dépendances, entrées et permissions.                      |

## 23.7 Skills initiales

| **Skill**           | **Objectif**                                                                  | **Priorité**   |
|---------------------|-------------------------------------------------------------------------------|----------------|
| add-project         | Créer une fiche projet bilingue, médias, relations, SEO et tests.             | MVP – immédiat |
| add-experience      | Créer ou mettre à jour une expérience sans divulguer d’informations internes. | MVP            |
| content-audit       | Vérifier schémas, traductions, relations, liens et médias.                    | MVP            |
| release-check       | Exécuter l’ensemble des contrôles et produire un rapport.                     | MVP            |
| generate-case-study | Transformer des notes validées en étude de cas structurée.                    | Après socle    |
| translate-content   | Créer ou synchroniser les contenus localisés avec revue.                      | Après i18n     |

## 23.8 Sous-agents initiaux

| **Agent**         | **Mode recommandé**    | **Outils**                | **Mission**                                                        |
|-------------------|------------------------|---------------------------|--------------------------------------------------------------------|
| product-reviewer  | Read-only / plan       | Read, Search              | Contrôler conformité aux exigences et signaler les écarts.         |
| frontend-builder  | Édition limitée        | Read, Edit, Bash tests    | Implémenter les pages et composants sans changer le périmètre.     |
| content-editor    | Édition contenu        | Read, Edit, validation    | Structurer, traduire et vérifier les contenus sans inventer.       |
| qa-reviewer       | Read-only + Bash tests | Read, Bash                | Exécuter tests, inspecter résultats et produire le rapport.        |
| security-reviewer | Read-only              | Read hors secrets, Search | Vérifier dépendances, permissions, entrées et fuites potentielles. |

## 23.9 Hooks à introduire

| **Moment**        | **Hook**     | **Comportement**                                                       |
|-------------------|--------------|------------------------------------------------------------------------|
| Avant outil       | PreToolUse   | Bloquer secrets, commandes destructrices ou publication non approuvée. |
| Après édition     | PostToolUse  | Lancer formatage ciblé ou validation légère.                           |
| Avant fin         | Stop         | Vérifier qu’un rapport final mentionne tests et erreurs.               |
| Avant sortie plan | ExitPlanMode | S’assurer que le plan contient tests, impacts et fichiers.             |

Les hooks doivent rester rapides et déterministes. Les contrôles lourds
appartiennent au script release-check ou à la CI.

## 23.10 MCP – stratégie progressive

> • **Phase 0 :** aucun MCP obligatoire. Commencer avec le dépôt local,
> Git et les outils natifs.
>
> • **Phase 1 :** connexion GitHub si elle simplifie réellement issues,
> PR et revue.
>
> • **Phase 2 :** navigateur/Chrome pour vérifier l’application rendue.
>
> • **Phase 3 :** Figma ou autres outils uniquement lorsqu’un flux de
> travail récurrent le justifie.
>
> • **Principe :** chaque MCP augmente la surface d’outils et le
> contexte ; installer seulement ce qui résout un besoin précis.

## 23.11 Paramètres VS Code et Git

> • Activer formatage à l’enregistrement et utiliser la même
> configuration que la CI.
>
> • Installer uniquement les extensions nécessaires : ESLint, Prettier,
> Git, Claude Code.
>
> • Protéger main sur GitHub et exiger les checks.
>
> • Ajouter un modèle de pull request avec captures, tests et risques.
>
> • Ajouter .env\*, private/, secrets/ et fichiers locaux au .gitignore.
>
> • Activer les checkpoints/revert proposés par l’interface Claude
> lorsque disponibles, sans remplacer Git.

## 23.12 Séquence de préparation avant le premier build

> **1.** Créer le dépôt vide et la branche de travail.
>
> **2.** Ajouter ce document dans docs/product/.
>
> **3.** Créer .gitignore, README minimal et politique de sécurité.
>
> **4.** Créer .claude/settings.json avec permissions restrictives.
>
> **5.** Créer CLAUDE.md initial à partir du modèle en annexe.
>
> **6.** Créer les règles content, security, git et testing.
>
> **7.** Lancer Claude Code puis /init pour analyser le socle ; relire
> et fusionner uniquement les améliorations pertinentes.
>
> **8.** Créer les agents product-reviewer et qa-reviewer.
>
> **9.** Créer la skill bootstrap-project qui génère le socle sans
> contenu personnel.
>
> **10.** Demander un plan d’architecture et une matrice de traçabilité
> avant toute génération de code.

ANNEXES

# Annexe A – Modèle de CLAUDE.md initial

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th># OpenPortfolio — Instructions permanentes<br />
<br />
## 1. Mission<br />
Construire et maintenir un portfolio professionnel open source
administrable<br />
par langage naturel. Le dépôt et ses données structurées sont la source
de vérité.<br />
<br />
## 2. Références<br />
- Spécifications produit : docs/product/<br />
- Décisions d’architecture : docs/decisions/<br />
- Règles ciblées : .claude/rules/<br />
<br />
## 3. Périmètre MVP<br />
- Site public responsive<br />
- Projets, expériences, formation, compétences, hobbies et contact<br />
- Français et anglais<br />
- Thèmes clair/sombre<br />
- Contenu versionné et validé<br />
- Workflow Claude pour ajouter/modifier un contenu<br />
Ne pas ajouter de SaaS multi-utilisateur, base de données,
authentification ou<br />
back-office sans exigence approuvée.<br />
<br />
## 4. Règles absolues<br />
1. Ne jamais inventer une expérience, un résultat, une métrique ou un
lien.<br />
2. Ne jamais lire ou exposer .env, secrets/, private/ ou
credentials.<br />
3. Ne jamais fusionner dans main, forcer un push ou déployer sans
instruction explicite.<br />
4. Pour une tâche non triviale, produire un plan et identifier les
impacts.<br />
5. Faire des changements minimaux ; éviter les refactorings non
demandés.<br />
6. Toute donnée publiée doit respecter le schéma et être disponible dans
les langues requises.<br />
7. Signaler tout test non exécuté ou échoué. Ne jamais présenter une
tâche incomplète comme terminée.<br />
<br />
## 5. Architecture<br />
[À compléter après décision technique]<br />
- app/ : routes<br />
- components/ : composants UI<br />
- content/ : données<br />
- schemas/ : validation<br />
- lib/ : services internes<br />
- tests/ : tests<br />
- docs/ : produit, architecture, qualité<br />
<br />
## 6. Commandes<br />
[À remplacer par les commandes réelles]<br />
- Installer : npm install<br />
- Développer : npm run dev<br />
- Lint : npm run lint<br />
- Types : npm run typecheck<br />
- Tests : npm run test<br />
- E2E : npm run test:e2e<br />
- Build : npm run build<br />
- Contrôle complet : npm run check<br />
<br />
## 7. Workflow<br />
1. Lire la demande et les règles pertinentes.<br />
2. Vérifier l’état Git.<br />
3. Planifier si nécessaire.<br />
4. Modifier uniquement les fichiers requis.<br />
5. Exécuter les contrôles adaptés.<br />
6. Inspecter le rendu pour tout changement UI.<br />
7. Fournir le rapport final standard.<br />
<br />
## 8. Rapport final obligatoire<br />
- Résultat<br />
- Fichiers modifiés<br />
- Hypothèses / décisions<br />
- Tests et commandes exécutés<br />
- Résultats<br />
- Risques ou limites<br />
- Actions manuelles restantes</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# Annexe B – Modèle de skill add-project

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>---<br />
name: add-project<br />
description: Ajoute ou met à jour un projet OpenPortfolio à partir
d’informations validées.<br />
allowed-tools: Read, Edit, Bash<br />
---<br />
<br />
# Objectif<br />
Créer une fiche projet bilingue conforme au schéma, sans inventer de
faits.<br />
<br />
# Entrées attendues<br />
- type de projet<br />
- titre<br />
- contexte / problème<br />
- solution<br />
- rôle personnel<br />
- technologies<br />
- période<br />
- résultats validés<br />
- liens<br />
- médias<br />
- compétences associées<br />
<br />
# Procédure<br />
1. Lire les schémas Project, Media et Skill.<br />
2. Vérifier les projets existants et l’unicité du slug.<br />
3. Identifier les données manquantes bloquantes.<br />
4. Créer ou modifier le contenu français.<br />
5. Créer la version anglaise fidèle.<br />
6. Ajouter les médias et textes alternatifs.<br />
7. Mettre à jour les relations de compétences.<br />
8. Générer les métadonnées SEO.<br />
9. Exécuter validation, lint, types, tests et build.<br />
10. Produire le rapport final.<br />
<br />
# Interdictions<br />
- Ne pas inventer de métrique, résultat, date ou rôle.<br />
- Ne pas publier si un champ obligatoire est inconnu.<br />
- Ne pas installer de dépendance.<br />
- Ne pas modifier le design global.<br />
<br />
# Sortie<br />
Rapport avec fichiers, hypothèses, validations, erreurs et actions
restantes.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# Annexe C – Modèle d’agent Product Reviewer

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>---<br />
name: product-reviewer<br />
description: Vérifie la conformité d’un changement aux spécifications
OpenPortfolio.<br />
tools: Read, Grep, Glob<br />
permissionMode: plan<br />
---<br />
<br />
Tu es un analyste produit / MOA senior en lecture seule.<br />
<br />
Pour chaque revue :<br />
1. Identifie les exigences et critères d’acceptation concernés.<br />
2. Compare le changement aux spécifications.<br />
3. Signale les écarts classés Bloquant / Majeur / Mineur /
Suggestion.<br />
4. Vérifie les impacts contenu, i18n, accessibilité, SEO, sécurité et
tests.<br />
5. Ne propose pas de nouvelle fonctionnalité hors périmètre.<br />
6. Termine par une recommandation : ACCEPTABLE, ACCEPTABLE AVEC RÉSERVES
ou NON ACCEPTABLE.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# Annexe D – Modèle d’agent QA Reviewer

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>---<br />
name: qa-reviewer<br />
description: Exécute et analyse les contrôles qualité du projet.<br />
tools: Read, Bash, Grep, Glob<br />
permissionMode: default<br />
---<br />
<br />
Tu es responsable QA. Tu ne modifies pas le produit sauf demande
explicite.<br />
<br />
1. Déduis les contrôles requis à partir des fichiers modifiés.<br />
2. Exécute validation contenu, lint, typecheck, tests et build si
applicables.<br />
3. Pour une modification UI, demande ou réalise une inspection du rendu
disponible.<br />
4. N’ignore jamais un échec et ne désactive jamais un test pour obtenir
du vert.<br />
5. Rapporte les commandes, résultats, anomalies, sévérité et étapes de
reproduction.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# Annexe E – Prompt de lancement du projet

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Tu interviens comme Lead Developer et architecte sous contrôle d’un
Product Owner.<br />
<br />
Contexte :<br />
- Le produit est OpenPortfolio.<br />
- Les spécifications de référence sont dans docs/product/.<br />
- CLAUDE.md et .claude/rules/ sont obligatoires.<br />
- Le MVP doit rester simple, repository-first et sans back-office ni
base de données.<br />
<br />
Mission de cette session :<br />
1. Lis l’intégralité des spécifications et résume les décisions
structurantes.<br />
2. Propose l’architecture cible et les alternatives réellement
pertinentes.<br />
3. Crée une matrice de traçabilité entre exigences, modules et
tests.<br />
4. Découpe le build en lots et pull requests de taille maîtrisée.<br />
5. Identifie les décisions nécessitant un ADR.<br />
6. Ne génère aucun code tant que le plan n’est pas présenté.<br />
7. Signale toute incohérence ou exigence non testable.<br />
8. Termine par une recommandation de première PR, avec fichiers prévus
et critères de validation.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# Annexe F – Prompt de première PR

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>Implémente uniquement la PR 1 : fondation du dépôt.<br />
<br />
Périmètre :<br />
- Initialiser la stack validée.<br />
- Configurer TypeScript strict, lint, formatage et scripts de
contrôle.<br />
- Créer la structure de dossiers.<br />
- Ajouter les premiers schémas de données sans contenu personnel.<br />
- Ajouter un jeu de données d’exemple minimal.<br />
- Configurer CI pour lint, typecheck, tests et build.<br />
- Ajouter README de développement et ADR initial.<br />
- Ne pas construire les pages métier complètes.<br />
<br />
Avant modification :<br />
- Présente le plan, les fichiers et les dépendances.<br />
- Justifie chaque dépendance.<br />
- Vérifie l’état Git.<br />
<br />
Après modification :<br />
- Exécute tous les contrôles.<br />
- Fournis le rapport final standard.<br />
- Prépare le descriptif de PR, mais ne pousse et ne fusionne rien sans
demande explicite.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# Annexe G – Matrice de traçabilité initiale

| **Epic** | **Objet**             | **Modules cibles**                              | **Preuves / tests**                   |
|----------|-----------------------|-------------------------------------------------|---------------------------------------|
| F01      | Présentation publique | app/, components/, content/profile              | E2E navigation, responsive, a11y      |
| F02      | Catalogue projets     | content/projects, schemas/project, pages projet | Validation schéma, filtres, E2E fiche |
| F03      | Expériences et skills | content/experiences, content/skills             | Tri, relations, rendu                 |
| F04      | Contenu structuré     | schemas/, scripts/validate-content              | Tests schéma, slugs, médias           |
| F05      | i18n                  | lib/i18n, locales/routes                        | Complétude, switch langue, hreflang   |
| F06      | Thème/SEO/a11y        | theme, metadata, sitemap                        | E2E thème, audit SEO/a11y             |
| F07      | Claude workflows      | .claude/, CLAUDE.md                             | Test de skill, permissions, rapport   |

# Annexe H – Références Claude Code officielles

> • [<u>Claude Code –
> Overview</u>](https://docs.anthropic.com/en/docs/claude-code/overview)
>
> •
> [<u>Settings</u>](https://docs.anthropic.com/en/docs/claude-code/settings)
>
> • [<u>Memory et
> CLAUDE.md</u>](https://docs.anthropic.com/en/docs/claude-code/memory)
>
> •
> [<u>Skills</u>](https://docs.anthropic.com/en/docs/claude-code/skills)
>
> •
> [<u>Subagents</u>](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
>
> • [<u>Hooks</u>](https://docs.anthropic.com/en/docs/claude-code/hooks)
>
> • [<u>MCP</u>](https://docs.anthropic.com/en/docs/claude-code/mcp)
>
> • [<u>Model
> configuration</u>](https://docs.anthropic.com/en/docs/claude-code/model-config)
>
> • [<u>VS Code
> integration</u>](https://docs.anthropic.com/en/docs/claude-code/ide-integrations)

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Fin du document</strong><br />
Prochaine décision : valider ou amender le périmètre MVP, puis ouvrir le
Lot 0 – Fondation avec le prompt de l’Annexe E.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>
