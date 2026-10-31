# Livrer AniList Helper

Recette suivie par `/test-app`, `/preprod`, `/version` et `/prod`. Lire aussi `README.md`.

## Flux

`/forge` → `/test-app` → commit → `/version` → `/prod` → **toi : Chrome Web Store**

## Test

Claude in Chrome, sur les sites visés, extension chargée non empaquetée. AniList limite vite le débit : espacer les pages, ouvrir son propre onglet.

## Preprod

Aucune.

## Version

1. Relire `README.md` et les textes des stores, en anglais et la fiche des stores : pas de listes de domaines ou de mots clés (Chrome a déjà rejeté une version pour ça). Vraies captures seulement.
2. Numéro dans les manifests et `CHANGELOG.md`. Zip par les scripts de `scripts/`, dans `packages/`.

## Prod

Pas encore sur les stores au dernier passage (voir `README.md`). Demander avant le premier envoi.

**Réservé à la personne : Chrome Web Store**, Claude n'y a pas accès.
