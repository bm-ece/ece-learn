# Architecture cible — ECE Learning Platform

> Statut : **proposition validée sur le principe, migration non commencée**. Branche de travail : `develop/multicourse-platform`. Le dépôt et le site publics restent `linux-nexus` / Linux Nexus tant qu'aucune décision de renommage n'est prise.

## 1. Vision et périmètre

Faire évoluer Linux Nexus vers une plateforme pédagogique ECE multi-matières, hébergée statiquement, tout en préservant l'expérience Linux actuelle. Un portail commun propose plusieurs matières ; chaque matière possède ses données, activités et outils spécialisés. Les composants transversaux (navigation, design, progression, tests) sont mutualisés.

**Contraintes :** ne pas altérer l'apparence actuelle (charte ECE, logo, favicon, colonnes), les 79 fiches Linux, les 7 laboratoires, les simulateurs, le terminal, les URL étudiantes ni les données sauvegardées. Pas de réécriture en framework ni de backend imposé dans cette phase. Conserver GitHub Pages et une application statique HTML/CSS/JavaScript.

## 2. Arborescence cible

```text
linux-nexus/
├── index.html                     # Point d'entrée, shell applicatif
├── assets/                        # Logo officiel, favicon, médias
├── css/
│   ├── tokens.css                 # Variables visuelles ECE
│   ├── layout.css                 # Structure responsive
│   └── components.css             # Cartes, formulaires, navigation
├── js/
│   ├── app.js                     # Initialisation, routage
│   ├── catalog.js                 # Catalogue des matières
│   ├── storage.js                 # Compatibilité et migrations
│   └── progress.js                # Progression et XP
├── components/
│   ├── lesson.js                  # Les cinq cartes pédagogiques
│   ├── quiz.js
│   └── navigation.js
├── courses/
│   └── linux/
│       ├── course.json            # Métadonnées, domaines, ordre
│       ├── syllabus/              # Référence pédagogique
│       ├── lessons/               # 79 fiches structurées
│       ├── labs/                  # 7 laboratoires
│       ├── simulators/            # Simulateurs Linux
│       └── terminal/              # Shell et FS simulés
├── tests/                         # Tests unitaires, intégration, E2E
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PLAN-MIGRATION.md
│   └── DEPLOIEMENT-PREVIEW.md
├── .github/workflows/             # CI et déploiements isolés
└── README.md
```

Les dossiers des futures matières (ex. `courses/networks/`, `courses/programming/`) seront créés **seulement lorsque leur contenu sera prêt** ; ne pas publier de fausses fiches ou activités.

## 3. Contrats de données proposés

Une matière définit un identifiant stable (`linux`), un titre, une version de contenu, ses domaines, ses ressources et les outils qu'elle active. Les notions conservent leur identité et leur ordre actuels durant la migration, y compris leur indice historique pour la progression. Une fiche pourra ensuite stocker : `id`, `domainId`, `title`, `description`, `understand`, `observe`, `quiz`, `practice`, `remember`. Les missions définissent des critères de validation explicites, séparés de l'affichage.

**Important :** les exemples ci-dessus constituent un schéma cible à affiner après inventaire du code existant. Ne pas modifier les clés localStorage, les identifiants de fiches ou les règles de notation sans stratégie de migration et tests de non-régression.

## 4. Séparation des responsabilités

- **Contenu** : syllabus, fiches, exemples, questions, corrections, laboratoires.
- **Présentation** : design ECE, navigation, cartes pédagogiques et accessibilité.
- **Moteurs interactifs** : terminal Linux, simulateurs et atelier Bash ; aucun moteur Linux n'est imposé aux autres matières.
- **Services communs** : catalogue, progression, persistance, suivi des validations.
- **Tests** : contrôle du contenu, du rendu, des interactions et de la compatibilité des données.

## 5. Principes techniques

1. JavaScript natif avec modules ES si compatibles avec GitHub Pages ; pas de framework ajouté sans nécessité démontrée.
2. Chemins relatifs compatibles avec `/linux-nexus/` (éviter les chemins racine `/assets/...`).
3. Aucun appel réseau requis pour l'usage normal des fiches déjà chargées, sauf ressources statiques hébergées sur le même site.
4. Contenu textuel échappé lors du rendu ; pas d'injection HTML provenant des données de cours.
5. Identifiants de cours et de notions stables ; données de progression isolées par matière à terme, avec lecture rétrocompatible des données Linux.
6. Accessibilité : titres hiérarchiques, clavier, focus, contrastes et annonces des résultats de quiz.
7. Une modification structurelle par étape, avec tests et comparaison visuelle avant validation.

## 6. Déploiement et sécurité

`main` demeure la branche de production. `develop/multicourse-platform` est la branche d'intégration. La prévisualisation doit être déployée **séparément** (autre site ou autre cible de publication) ; changer la source GitHub Pages du dépôt existant risquerait de remplacer la production. Voir `docs/DEPLOIEMENT-PREVIEW.md`.

## 7. Critères de réussite

- Les 79 fiches, leurs cinq cartes et leurs évaluations restent accessibles.
- Les 7 laboratoires, les simulateurs et le terminal fonctionnent comme avant.
- La progression existante est conservée après mise à jour et rechargement, y compris sur les profils déjà enregistrés.
- L'interface mobile et ordinateur est visuellement équivalente.
- Les tests automatisés passent ; les scénarios manuels critiques sont documentés.
- Une seconde matière peut être ajoutée sans recopier le terminal ou le code de l'application Linux.
- Aucun changement n'atteint `main` avant validation explicite.
