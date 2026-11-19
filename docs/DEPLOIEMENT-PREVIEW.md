# Prévisualisation de la branche de développement

## Objectif

Publier `develop/multicourse-platform` sur une URL **distincte** du site public actuel `https://bm-ece.github.io/linux-nexus/`, sans fusion vers `main`.

## Point de vigilance GitHub Pages

Un dépôt GitHub Pages possède une configuration de publication ; **basculer sa source de `main` vers la branche de développement remplacerait la version de production**. Ce n'est pas le comportement souhaité. Une simple création de branche ne génère pas automatiquement une seconde URL.

## Stratégies possibles

**Option A — dépôt GitHub dédié à la preview (préférée si l'on veut rester entièrement sur GitHub).** Créer un second dépôt de publication, par exemple `bm-ece/linux-nexus-preview`, puis y déployer automatiquement les fichiers statiques de la branche de développement. URL distincte sous GitHub Pages ; accès public si le dépôt est public. Configurer les chemins relatifs pour le nouveau préfixe et éviter toute écriture de données dans la production.

**Option B — hébergement de prévisualisation externe.** Cloudflare Pages, Netlify ou service équivalent, connecté à la branche de développement. Vérifier les permissions du service, les URLs de preview, les quotas et la politique ECE avant configuration.

## Conditions avant mise en service

- Valider le fournisseur, le dépôt ou domaine de preview et les droits d'accès.
- Prévoir une séparation de stockage par origine (URLs sur origines distinctes) et/ou des clés localStorage propres à l'environnement si nécessaire.
- Exécuter les tests CI avant chaque publication de preview.
- Vérifier le chargement des fichiers `assets/`, du favicon, des modules JS et des données JSON sous le chemin de preview.
- Conserver `main` et la source de production GitHub Pages inchangés.
- Ne jamais importer de véritables données étudiantes dans la preview sans besoin et accord explicite.

**Statut :** stratégie documentée, aucune preview configurée ou déployée à ce stade.
