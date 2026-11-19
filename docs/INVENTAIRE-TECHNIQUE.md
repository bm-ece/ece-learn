# Inventaire technique initial — Linux Nexus

## Périmètre inspecté

- Branche source : `develop/multicourse-platform`.
- Application statique sans framework, hébergée sur GitHub Pages.
- Avant extraction : `index.html` contenait une unique balise `<style>` de **20 277 caractères**, ainsi qu'un script JavaScript inline contenant les données pédagogiques et la logique interactive.
- Les ressources utilisées directement par le HTML comprennent `assets/favicon.svg` et `assets/ece-logo.jpg`.
- Le contenu Linux comprend **79 notions** regroupées en **7 domaines**, **7 laboratoires**, un terminal simulé, des simulateurs, des quiz et un suivi de progression.

## Persistance

Une seule clé principale est utilisée par le script : `linux_nexus_complete_2026` en production. Les données incluent `done`, `labDone`, `labStarted`, `attempts` et `fs`. Sur le chemin `/linux-nexus-preview/`, le code utilise `linux_nexus_preview_complete_2026` pour éviter de modifier la progression de production sur l'origine commune `bm-ece.github.io`.

## Première extraction CSS

- Fichier créé : `css/styles.css`, copie **exacte** du contenu de l'ancienne balise `<style>` (sans réécriture ni changement des règles).
- `index.html` référence désormais `<link rel="stylesheet" href="css/styles.css">`.
- Tout le reste du document HTML a été conservé à l'identique lors de cette extraction.
- Les deux fichiers ont été copiés dans `bm-ece/linux-nexus-preview` sur sa branche `main` afin de déclencher la publication GitHub Pages classique.

## Contrôles et risques

- [x] Vérification structurelle : une seule balise `<style>` initiale et extraction exacte.
- [x] Vérification structurelle : HTML inchangé hors remplacement de la balise CSS.
- [x] Fichiers `css/styles.css` et `index.html` publiés dans le dépôt Preview.
- [ ] Vérification visuelle sur PC et mobile (comparaison avec le site officiel).
- [ ] Vérifier chargement réseau de `css/styles.css` et absence d'erreurs console.
- [ ] Tester les 79 notions, les cinq cartes pédagogiques, les 7 laboratoires, le terminal, les simulateurs et la sauvegarde.
- [ ] Relever les tests automatisés et workflows existants dans le dépôt source.
- [ ] Préparer l'extraction progressive du JavaScript **après** validation visuelle.

## Règles de migration

Ne pas modifier le design, le logo, le favicon, la disposition en deux colonnes ou les fonctionnalités pendant les extractions techniques. Ne pas fusionner vers `main` du dépôt source sans accord explicite.
