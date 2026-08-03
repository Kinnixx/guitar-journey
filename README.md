# GuitarJourney

GuitarJourney est un journal de pratique personnel destiné aux guitaristes qui souhaitent suivre leur régularité, leurs morceaux en cours et leur progression. L’application rassemble dans une interface unique les sessions de travail, les vitesses atteintes, le niveau de maîtrise estimé et le ressenti après chaque séance.

Le projet privilégie une approche simple : rendre les progrès visibles sans transformer la pratique en compétition.

## Fonctionnalités actuelles

Le prototype propose actuellement :

- un tableau de bord avec le temps de pratique enregistré, le nombre de sessions, la maîtrise moyenne, la motivation moyenne et la série de jours consécutifs ;
- un répertoire de morceaux avec artiste, progression, vitesse stable et vitesse cible ;
- l’ajout et la suppression de morceaux ;
- l’enregistrement d’une session avec sa date, sa durée, son morceau, son tempo, sa progression, sa motivation et des notes libres ;
- un historique chronologique des sessions ;
- une vue de progression présentant la maîtrise par morceau, la régularité et l’évolution récente de la motivation ;
- un objectif hebdomadaire exprimé en minutes ;
- une persistance locale des morceaux et des sessions dans le navigateur avec `localStorage`.

Des données initiales sont fournies pour permettre de découvrir immédiatement l’interface. Il n’existe actuellement ni compte utilisateur, ni synchronisation entre appareils, ni stockage côté serveur.

## Technologies utilisées

- [Next.js](https://nextjs.org/) 16 avec App Router ;
- [React](https://react.dev/) 19 ;
- [TypeScript](https://www.typescriptlang.org/) en mode strict ;
- CSS natif pour l’ensemble de l’interface ;
- ESLint avec la configuration recommandée pour Next.js et TypeScript ;
- API Web `localStorage` pour la persistance locale.

## Prérequis

- Node.js 22.13.0 ou une version ultérieure ;
- npm, fourni avec Node.js.

## Installation

Cloner le dépôt, se placer dans son répertoire, puis installer les dépendances :

```bash
npm install
```

## Lancement en développement

```bash
npm run dev
```

L’application est ensuite accessible par défaut à l’adresse [http://localhost:3000](http://localhost:3000).

## Vérifications et build

Vérifier la qualité du code avec ESLint :

```bash
npm run lint
```

Vérifier les types TypeScript :

```bash
npm run typecheck
```

Créer le build de production :

```bash
npm run build
```

Après la création du build, lancer le serveur de production :

```bash
npm start
```

## Statut du projet

GuitarJourney est un prototype fonctionnel en cours de développement. Les principales vues et interactions sont utilisables, mais le produit n’est pas encore destiné à un usage en production. Certaines dates, tendances et visualisations sont encore alimentées par des valeurs de démonstration, tandis que les données créées par l’utilisateur restent limitées au navigateur courant.

## Feuille de route

Les prochaines étapes envisagées sont :

- calculer toutes les statistiques, visualisations et séries de pratique à partir des sessions réellement enregistrées ;
- permettre la modification et la suppression des sessions, ainsi que la modification des morceaux ;
- créer une vue détaillée pour chaque morceau avec son historique, sa progression et l’évolution de son tempo ;
- permettre de suivre séparément les différentes sections d’un morceau ;
- améliorer la gestion des dates, des objectifs hebdomadaires et de la régularité ;
- ajouter des états vides, des confirmations et des messages d’erreur pour fiabiliser les interactions ;
- permettre l’exportation et l’importation des données afin de sauvegarder les informations stockées localement ;
- renforcer l’accessibilité et l’adaptation aux différents formats d’écran ;
- ajouter des tests automatisés pour sécuriser les calculs et les principaux parcours utilisateur ;
- mettre en place une intégration continue pour vérifier automatiquement le lint, le typage, les tests et le build ;
- concevoir une persistance côté serveur et une synchronisation optionnelle entre appareils ;
- préparer le déploiement public de l’application.