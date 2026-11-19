# Plan de route validé — Dépôt de prévisualisation Linux Nexus

**Décision validée :** utiliser un second dépôt GitHub, `bm-ece/linux-nexus-preview`, exclusivement pour visualiser et tester la branche `develop/multicourse-platform` du dépôt source `bm-ece/linux-nexus`.

**Statut :** branche et documentation prêtes ; première protection de stockage ajoutée sur la branche de développement. Dépôt de prévisualisation et automatisation **pas encore créés**.

## 1. Les deux dépôts et leurs rôles

| Élément | Source de développement / production | Publication de test |
| --- | --- | --- |
| Dépôt | `bm-ece/linux-nexus` | `bm-ece/linux-nexus-preview` |
| Branche de développement | `develop/multicourse-platform` | Reçoit les fichiers générés depuis cette branche |
| Branche de production | `main` (protégée par notre processus de validation) | Branche de publication à configurer |
| Site | https://bm-ece.github.io/linux-nexus/ | https://bm-ece.github.io/linux-nexus-preview/ (URL **prévue**, non encore active) |
| Usage | Développer, tester, revoir le code et, après accord, publier | Consulter la version expérimentale sur PC et téléphone |

Le second dépôt est une **cible de publication**, pas un deuxième lieu de développement. Les modifications de l'application se font exclusivement dans `linux-nexus`, sur la branche `develop/multicourse-platform`.

## 2. Circuit de travail

```text
bm-ece/linux-nexus
├── main  ────────────────────────────────> Site officiel des étudiants
└── develop/multicourse-platform
       │
       ├── développement + tests + revue
       │
       └── publication contrôlée ────────> bm-ece/linux-nexus-preview
                                              │
                                              └── Site de test indépendant

Après recette complète ET autorisation explicite :
develop/multicourse-platform ── Pull Request ──> main
```

**Interdiction :** ne jamais changer la source GitHub Pages de `linux-nexus` vers la branche de développement. Ne jamais fusionner automatiquement la branche de développement dans `main`.

## 3. Mise en place : étapes détaillées

### Étape A — Préparer la cible

- [ ] Vérifier que le nom `bm-ece/linux-nexus-preview` est disponible.
- [ ] Créer le dépôt sous le compte GitHub `bm-ece` ; déterminer sa visibilité (un site GitHub Pages public peut être consulté par toute personne connaissant son URL).
- [ ] Configurer GitHub Pages sur le dépôt de prévisualisation (branche et dossier de publication, ou workflow Pages selon la méthode retenue).
- [ ] Confirmer l'URL réellement attribuée par GitHub Pages ; ne pas supposer qu'elle fonctionne avant vérification.

### Étape B — Mettre en place la synchronisation

- [ ] Ajouter dans `linux-nexus` un workflow de publication **déclenché uniquement** par les changements de `develop/multicourse-platform`, ou manuellement.
- [ ] Exécuter les tests du dépôt source avant toute publication ; bloquer la publication en cas d'échec.
- [ ] Construire/copier les fichiers statiques nécessaires (HTML, CSS, JS, JSON, images, favicon, ressources des cours) vers le dépôt `linux-nexus-preview`.
- [ ] Utiliser un mécanisme d'authentification GitHub à **permissions minimales** pour écrire uniquement dans le dépôt de preview ; aucun jeton personnel dans le code, les logs ou les pages.
- [ ] Conserver la traçabilité : SHA du commit source, date et statut de déploiement.
- [ ] Prévoir un retour à la version de preview précédente en cas de régression.

### Étape C — Contrôler la publication

- [ ] Ouvrir la preview depuis un PC et un téléphone.
- [ ] Tester la page d'accueil, la navigation, les cinq cartes des 79 fiches, les 7 laboratoires, le terminal et les simulateurs.
- [ ] Contrôler le logo ECE, le favicon, les feuilles de style, les scripts et les chemins relatifs sous `/linux-nexus-preview/`.
- [ ] Vérifier la sauvegarde/relecture de progression sur la preview, sans modifier les données de la production.
- [ ] Tester les rafraîchissements, le cache et les éventuelles erreurs de chargement.
- [ ] Vérifier que https://bm-ece.github.io/linux-nexus/ reste inchangé.

### Étape D — Cycle d'amélioration

1. Modifier le code dans `develop/multicourse-platform`.
2. Lancer les tests et corriger les erreurs.
3. Publier la branche vers le dépôt de preview.
4. Vérifier le site de test sur téléphone et PC.
5. Recueillir les retours, corriger et recommencer.
6. Une fois toutes les étapes du plan de migration validées, demander l'autorisation explicite de fusionner dans `main`.

## 4. Séparation des données

Les deux URLs GitHub Pages ont généralement la **même origine** (`https://bm-ece.github.io`) et des chemins différents. **Le localStorage n'est pas isolé par chemin URL : il est partagé à l'échelle de l'origine.** Il ne faut donc pas compter sur les seuls noms de dépôts pour séparer la progression.

**Exigence bloquante avant publication :** inspecter les clés de stockage utilisées par l'application et mettre en place une isolation fiable des données de preview (préfixe de clés propre à l'environnement et tests de migration), ou héberger la preview sur une origine différente. Ne jamais écrire dans les clés de production depuis la preview. Ne jamais importer de données réelles d'étudiants dans l'environnement de test sans accord.

## 5. Risques et parades

| Risque | Mesure prévue |
| --- | --- |
| Production remplacée par la version de test | Deux dépôts, aucune modification de la source Pages de production |
| Données étudiantes altérées | Audit localStorage, clés de preview distinctes et tests avant mise en ligne |
| Ressources cassées sur la preview | Tests des chemins relatifs, images, CSS, JS et JSON |
| Déploiement d'un code défaillant | Tests bloquants avant synchronisation |
| Fuite d'un jeton d'accès | Secrets GitHub et droits minimaux ; aucun secret dans le dépôt |
| Preview périmée | Afficher/consigner le SHA de la version publiée et vérifier sa concordance |
| Modifications divergentes entre dépôts | Dépôt preview traité comme sortie générée, jamais modifié à la main |

## 6. Critères d'acceptation

La phase « prévisualisation indépendante » est terminée seulement lorsque :

- l'URL de test est accessible depuis un PC et un téléphone ;
- le contenu correspond au commit de la branche de développement ;
- les ressources et fonctionnalités essentielles fonctionnent ;
- la progression de la preview ne peut pas altérer celle du site officiel ;
- le site officiel est inchangé ;
- les tests et le processus de mise à jour sont documentés et reproductibles.

## 7. Ce qui reste inchangé

Les 79 notions, les 7 laboratoires, le terminal, les simulateurs, le logo officiel, le favicon, les couleurs et la disposition des colonnes ne sont pas modifiés par cette documentation.

**Prochaine action opérationnelle :** audit du stockage et des workflows existants, puis création/configuration du dépôt `linux-nexus-preview`. La documentation seule ne crée ni le dépôt ni le site.

## 8. Audit du stockage effectué

Le code actuel lit et écrit une unique clé `linux_nexus_complete_2026` (progression, laboratoires, tentatives et système de fichiers simulé). Un changement minimal, effectué uniquement dans `develop/multicourse-platform`, sélectionne désormais `linux_nexus_preview_complete_2026` quand le chemin de la page commence par `/linux-nexus-preview/`. Sur le chemin de production `/linux-nexus/`, la clé historique est conservée. **Cette protection doit encore être vérifiée dans un navigateur et lors du premier déploiement.**

## 9. Action nécessitant la création du dépôt

Le connecteur GitHub utilisé pour cette étape ne propose pas la création de nouveaux dépôts. Le propriétaire doit créer `linux-nexus-preview` sous `bm-ece` dans GitHub (`New repository`), sans ajouter de workflow non validé à la production. Une fois ce dépôt disponible, la configuration de publication et de synchronisation pourra être réalisée et testée.
