# Plan de migration contrôlée — Linux Nexus vers plateforme mult matières

**Branche d'intégration :** `develop/multicourse-platform`  
**Production :** `main`, inchangée jusqu'à validation finale  
**Principe :** petits commits, tests à chaque étape, possibilité de retour arrière.

## Phase 0 — Documentation et état initial (en cours)

- [x] Créer la branche de travail à partir de `main`.
- [x] Documenter l'architecture cible et le plan.
- [ ] Inventorier les fichiers, les scripts et les workflows CI existants.
- [ ] Relever précisément les clés localStorage et les schémas de données.
- [ ] Capturer les écrans de référence desktop/mobile, les parcours et résultats des tests.
- [ ] Identifier les cas de test manquants et les échecs CI existants.

**Livrable :** état initial reproductible et validé.

## Phase 1 — Prévisualisation indépendante

- [x] Valider la stratégie : dépôt de publication séparé `bm-ece/linux-nexus-preview` (voir `docs/DEPLOIEMENT-PREVIEW.md`).
- [x] Auditer les appels directs localStorage : une clé historique `linux_nexus_complete_2026`, utilisée pour lire et sauvegarder la progression et le système de fichiers simulé.
- [x] Ajouter sur la branche de développement une clé séparée `linux_nexus_preview_complete_2026` lorsque le chemin est `/linux-nexus-preview/`.
- [ ] Tester l'isolation dans le navigateur avec des données existantes avant publication.
- [ ] Créer et configurer le dépôt `bm-ece/linux-nexus-preview` et son GitHub Pages.
- [ ] Déployer la branche de développement sans changer les paramètres de production.
- [ ] Afficher clairement « Environnement de test » sur la preview, si nécessaire.
- [ ] Vérifier les chemins des ressources et l'isolation des données étudiantes.

**Livrable :** URL de prévisualisation accessible, production inchangée.

## Phase 2 — Extraction du CSS et des ressources

- [ ] Déplacer les styles de `index.html` vers `css/` sans modifier les règles.
- [ ] Centraliser les variables de thème ECE.
- [ ] Conserver le logo et le favicon actuels sans conversion ni perte de qualité.
- [ ] Vérifier rendu et responsive sur mobile et desktop.

**Livrable :** affichage strictement équivalent.

## Phase 3 — Extraction des services communs

- [ ] Extraire le routage et la navigation.
- [ ] Isoler la progression et le stockage dans des modules testables.
- [ ] Conserver la lecture et l'écriture des données existantes ; prévoir une migration versionnée si indispensable.
- [ ] Ajouter des tests sur le rechargement, la sauvegarde et les anciennes données.

**Livrable :** mêmes parcours, même progression.

## Phase 4 — Modularisation de Linux

- [ ] Extraire le catalogue et les données des 79 notions vers `courses/linux/lessons/`.
- [ ] Conserver les identifiants et l'ordre historique.
- [ ] Extraire les 7 laboratoires sans modifier leurs critères de validation.
- [ ] Isoler le terminal, le système de fichiers simulé et les simulateurs.
- [ ] Tester la génération des cinq cartes de chaque fiche, les quiz et les missions.

**Livrable :** module Linux autonome dans l'application, fonctionnalités conservées.

## Phase 5 — Socle mult matières

- [ ] Créer un registre des matières et leurs métadonnées.
- [ ] Prévoir la navigation par matière et les composants pédagogiques réutilisables.
- [ ] Isoler la progression par matière **sans casser la progression Linux**.
- [ ] Vérifier par un module de test interne qu'une seconde matière peut être chargée ; ne pas publier de contenu fictif.

**Livrable :** architecture extensible et stable.

## Phase 6 — Recette et validation

- [ ] Tests syntaxiques et unitaires.
- [ ] Tests d'intégration sur terminal, simulateurs, ateliers, laboratoires et progression.
- [ ] Contrôles des 79 fiches, des QCM et des missions.
- [ ] Tests sur appareils mobiles et ordinateur.
- [ ] Contrôle accessibilité, navigation clavier, performance et chemins GitHub Pages.
- [ ] Revue des différences visuelles avec l'existant.
- [ ] Validation explicite du propriétaire du projet.

**Livrable :** procès-verbal de recette, anomalies connues et décision go/no-go.

## Phase 7 — Fusion et publication (uniquement après accord)

- [ ] Actualiser la branche avec `main` et résoudre les conflits.
- [ ] Vérifier la CI et la preview sur le commit final.
- [ ] Créer ou finaliser une pull request vers `main`.
- [ ] Obtenir le feu vert explicite.
- [ ] Fusionner et contrôler le déploiement en production.
- [ ] Surveiller la compatibilité des données étudiantes ; conserver un point de retour.

## Règles de non-régression

1. Ne pas réinitialiser le localStorage étudiant ; tester avec des jeux de données existants.
2. Ne pas changer les noms de fichiers médias, les couleurs ou les dimensions visuelles sans validation.
3. Ne pas modifier le moteur du terminal pour réaliser une simple extraction de code.
4. Ne pas considérer « 79 pages générées » comme preuve que les 79 commandes fonctionnent : tests de comportements distincts.
5. Aucun merge automatique de la branche de développement vers `main`.

## Décisions à valider ultérieurement

- URL de preview prévue : `https://bm-ece.github.io/linux-nexus-preview/` (à confirmer après création et activation GitHub Pages).
- Nom définitif du portail mult matières (le nom actuel reste en place).
- Schéma final des contenus pédagogiques et des données de progression.
- Organisation éditoriale et calendrier d'ajout des autres matières.
