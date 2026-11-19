# Déploiement de la prévisualisation — méthode simplifiée

## Décision

Nous utilisons deux dépôts GitHub :

- **Source :** `bm-ece/linux-nexus`, branche de travail `develop/multicourse-platform`.
- **Site de test :** `bm-ece/linux-nexus-preview`, branche `main`.
- **Site officiel :** `https://bm-ece.github.io/linux-nexus/`, publié depuis la branche `main` du dépôt source, inchangée jusqu'à validation.

La prévisualisation doit fonctionner comme le site officiel : **chaque push sur `main` du dépôt `linux-nexus-preview` déclenche le déploiement GitHub Pages**, une fois la source Pages configurée sur **Deploy from a branch**, branche **main**, dossier **/(root)**.

## Fonctionnement quotidien

1. Développer uniquement sur `develop/multicourse-platform` dans `bm-ece/linux-nexus`.
2. Vérifier les changements et les tests.
3. Copier les fichiers statiques nécessaires dans `bm-ece/linux-nexus-preview` sur `main` et effectuer le commit/push.
4. GitHub Pages publie automatiquement le site de test à partir de ce push ; aucune exécution manuelle de workflow n'est nécessaire.
5. Tester le site sur ordinateur et téléphone, corriger si nécessaire.
6. **Uniquement après validation explicite**, proposer une pull request de la branche de développement vers `main` du dépôt officiel.

**Limite assumée :** un push sur `develop/multicourse-platform` dans le dépôt source ne déclenche pas automatiquement une copie vers l'autre dépôt. L'étape 3 est réalisée lors de la publication de la preview. Le déploiement Pages, lui, est automatique après le push dans le dépôt Preview.

## Configuration unique à vérifier

Dans `bm-ece/linux-nexus-preview` → **Settings → Pages** :

- Source : **Deploy from a branch**.
- Branche : **main**.
- Dossier : **/(root)**.
- Enregistrer.

Adresse prévue après publication : `https://bm-ece.github.io/linux-nexus-preview/` (à vérifier dans GitHub Pages).

## Séparation des données étudiantes

Les deux URLs sont sur la même origine `https://bm-ece.github.io`. Le `localStorage` est donc partagé entre les deux chemins.

L'application de développement choisit :

- `linux_nexus_complete_2026` sur `/linux-nexus/` (clé historique conservée).
- `linux_nexus_preview_complete_2026` sur `/linux-nexus-preview/` (clé distincte).

Ne jamais remplacer les données de production par celles de la preview. Tester le comportement dans le navigateur avant de déclarer la recette terminée.

## État de réalisation

- [x] Branche `develop/multicourse-platform` créée dans le dépôt source.
- [x] Dépôt public `bm-ece/linux-nexus-preview` créé.
- [x] Première copie de `index.html`, `assets/favicon.svg` et `assets/ece-logo.jpg` publiée dans le dépôt de test.
- [x] Workflows de synchronisation inter-dépôts supprimés ; aucun jeton ni secret requis.
- [ ] Vérifier **Settings → Pages → Deploy from a branch → main → /(root)**.
- [ ] Vérifier l'URL publique de la preview sur PC et téléphone.
- [ ] Tester l'isolation de la progression et les fonctionnalités de la plateforme.
- [ ] Poursuivre la migration modulaire par petits commits, puis republier les fichiers sur le dépôt de test.

**Règle :** ne jamais fusionner dans la branche `main` de `bm-ece/linux-nexus` sans autorisation explicite.
