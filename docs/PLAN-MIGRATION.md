# Plan de migration contrôlée — Linux Nexus vers ECE Learn

**Branche d'intégration :** `develop/multicourse-platform`  
**Production :** `main`, inchangée jusqu'à validation finale  
**Principe :** petits commits, tests à chaque étape, possibilité de retour arrière.

## Phase 0 — Documentation et état initial

- [x] Créer la branche de travail à partir de `main`.
- [x] Documenter l'architecture cible et le plan.
- [ ] Terminer l'inventaire des scripts et workflows CI existants (premier inventaire : `docs/INVENTAIRE-TECHNIQUE.md`).
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

- [x] Extraire sans modifier les règles la feuille de style monolithique vers `css/styles.css` et publier sur la preview.
- [ ] Centraliser les variables de thème ECE.
- [ ] Conserver le logo et le favicon actuels sans conversion ni perte de qualité.
- [ ] Vérifier rendu et responsive sur mobile et desktop après extraction (recette visuelle).

**Livrable :** affichage strictement équivalent.

## Phase 3 — Extraction des services communs

- [x] Extraire le bloc de routage vers `js/routing.js` sur la branche de développement ; tests automatisés verts au commit `8cfce1f` (validation Preview de cette extraction encore à effectuer).
- [ ] Vérifier l'extraction du routage sur Preview et valider les parcours dans le navigateur.
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

## Phase 5 — Socle multi-matières et URL publiques

- [ ] Créer le portail racine `index.html` et le point d'entrée statique `linux/index.html` (GitHub Pages, sans réécriture serveur).
- [ ] Implémenter le contrat d'URL : `/linux-nexus/<cours>/` et `?view=learn&notion=<id>` ; le chemin du cours est obligatoire pour les activités.
- [ ] Vérifier le chargement direct et le rafraîchissement des URL sous `/linux-nexus/` et `/linux-nexus-preview/`.
- [ ] Faire de la racine un portail qui ignore les anciens paramètres pédagogiques, **sans redirection de compatibilité** (option B).
- [ ] Créer un registre des matières et leurs métadonnées.
- [ ] Prévoir la navigation par matière et les composants pédagogiques réutilisables.
- [ ] Isoler la progression par matière **sans casser les données de progression Linux existantes** ; ne pas confondre persistance et anciennes URL.
- [ ] Vérifier par un module de test interne qu'une seconde matière peut être chargée ; ne pas publier de contenu fictif.

**Livrable :** architecture extensible et stable.

## Phase 6 — Recette et validation

- [ ] Tests syntaxiques et unitaires.
- [ ] Tests d'intégration sur terminal, simulateurs, ateliers, laboratoires et progression.
- [ ] Contrôles des 79 fiches, des QCM et des missions.
- [ ] Tests sur appareils mobiles et ordinateur.
- [ ] Contrôle accessibilité, navigation clavier, performance et chemins GitHub Pages, notamment accès direct à `/linux/` et `/linux/?view=learn&notion=12`.
- [ ] Vérifier l'absence de confusion entre les notions portant le même numéro dans deux matières (lorsqu'une seconde matière réelle existe).
- [ ] Revue des différences visuelles avec l'existant.
- [ ] Validation explicite du propriétaire du projet.

**Livrable :** procès-verbal de recette, anomalies connues et décision go/no-go.

## Phase 7 — Identité ECE Learn et renommage final (avant publication, après recette)

- [x] Choisir le nom de plateforme **ECE Learn** et la signature « Votre espace d'apprentissage interactif ».
- [x] Définir les rubriques envisagées : Linux, Réseaux, Programmation, Cybersécurité ; ne publier que les cours réellement disponibles.
- [ ] Adapter le portail à l'identité ECE Learn et aux descriptions des matières, sans changer l'apparence Linux existante sans validation.
- [ ] Vérifier que les chemins de base des scripts, styles, liens et données ne dépendent pas d'un nom de dépôt codé en dur.
- [ ] Préparer le renommage cible du dépôt `bm-ece/linux-nexus` vers `bm-ece/ece-learn` et du chemin public `/linux-nexus/` vers `/ece-learn/` ; vérifier GitHub Pages, workflows, liens et accès directs.
- [ ] Vérifier la conservation de la progression Linux historique malgré le changement de chemin et de nom ; tester Preview et les migrations de données si nécessaires.
- [ ] Faire valider explicitement le renommage effectif et le calendrier de publication ; **ne pas renommer le dépôt pendant les refactorisations**.

**Livrable :** identité et changement d'adresse vérifiés, sans impact non validé sur la production.

## Phase 8 — Fusion et publication (uniquement après accord)

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

## Décisions d'architecture validées

- **Identité finale :** ECE Learn — « Votre espace d'apprentissage interactif » ; dépôt cible `ece-learn`, URL cible `/ece-learn/`. Le dépôt actuel `linux-nexus` reste en place jusqu'à l'étape de renommage explicitement autorisée. Les chemins `/linux-nexus/` ci-dessous décrivent la **phase de transition**, pas l'adresse finale.

- **Option B :** aucune compatibilité avec les anciennes URL pédagogiques de la racine ; la plateforme n'a pas encore été distribuée aux étudiants.
- **Chemins par matière :** `/linux-nexus/linux/`, `/linux-nexus/networks/` lorsque disponible ; fiche : `/linux-nexus/linux/?view=learn&notion=12`.
- **Points d'entrée statiques :** `<cours>/index.html`, sans duplication de l'application et compatibles avec GitHub Pages.
- **Simplicité :** mutualiser les composants et services, garder les moteurs spécifiques dans chaque cours, ne pas créer de matières fictives ni ajouter de framework inutile.
- **Données :** préserver la progression Linux existante ; isoler environnement Preview/production puis progression par matière.
- **Validation :** tests CI verts, publication Preview, contrôle fonctionnel et visuel, autorisation explicite avant tout changement sur `main` de la source.

## Décisions à valider ultérieurement

- Validation navigateur des nouvelles URL de cours sur `https://bm-ece.github.io/linux-nexus-preview/` après implémentation.
- Le nom **ECE Learn** est décidé ; restent à valider le calendrier et les modalités techniques du renommage du dépôt et du site.
- Schéma final des contenus pédagogiques et des données de progression.
- Organisation éditoriale et calendrier d'ajout des autres matières.

## Étape transversale — Filtrage par niveau ING1 à ING3

- [x] Valider le périmètre initial ING1, ING2, ING3 et l'affectation Linux à ING3.
- [x] Ajouter `levels` au catalogue ; laisser les niveaux des autres matières non attribués.
- [x] Ajouter au portail un choix de niveau mémorisé localement, sans compte étudiant.
- [x] Masquer les matières non pertinentes ; afficher un état vide pour ING1 et ING2.
- [x] Ajouter des tests navigateur desktop/mobile pour le filtrage et la persistance du choix.
- [ ] Confirmer la CI verte sur le commit final de cette étape.
- [ ] Synchroniser Preview **après** CI verte, puis obtenir la validation visuelle et fonctionnelle de l'utilisateur.
- [ ] Attribuer les futurs cours à leurs niveaux uniquement sur décision pédagogique explicite.

**Règle :** le niveau sélectionné filtre l'affichage du portail ; il ne modifie ni les URL directes, ni l'accès aux cours, ni la progression Linux. Le choix est enregistré dans `ece_learn_selected_level`, séparément de la sauvegarde Linux. Aucun compte, contrôle d'accès ou distinction par spécialité n'est ajouté dans cette phase. Voir `docs/ARCHITECTURE.md`, section 11.
