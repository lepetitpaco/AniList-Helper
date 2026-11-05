# CLAUDE.md — AniList Helper

Extension Chrome/Firefox qui fait retenir à AniList ce qu'il oublie au rechargement (filtres de liste, tris, langue des doubleurs) et ajoute des favoris. Fonctionnement, structure et commandes : voir `README.md`. Livraison : `RELEASE.md`.

## Règles

- **Aucun appel à l'API AniList**, rien de modifié sur le compte de l'utilisateur. Exigence de départ (peur d'un bannissement) : tout passe par le DOM et les composants Vue de la page.
- **Tout en anglais** : interface, code, commentaires, README, textes des stores.
- Chaque fonction est déclarée dans `src/settings.js` (`AH_FEATURES`, avec ses options) et désactivable depuis le popup. Une nouvelle fonction suit le même modèle.
- Commits : jamais de ligne `Co-Authored-By` ni de mention d'un assistant IA dans les commits, PR ou tags.

## AniList côté technique

- AniList est en Vue 2 : on atteint les composants par `element.__vue__`. Liste : `.medialist.__vue__` (`entryFilters`, `sort`).
- Au changement de route, `beforeRouteUpdate` remet les filtres à zéro : `filters.js` les réapplique.
- La liste choisie (Watching, Planning…) est déjà dans le chemin `/animelist/<Section>` : pas besoin de la mettre dans la query.
- Année 1950 = minimum du curseur = pas de filtre d'année (`YEAR_SLIDER_MIN`).
- Les scripts de `src/page/` tournent en `world: MAIN` et ne voient pas l'API storage : ils lisent les réglages sur `<html data-anilist-helper>`, posé par `src/bridge.js`.
- Le bouton flottant des favoris se place au-dessus de `.mobile-nav` (petits écrans).

## Tester

- Recharger un build non empaqueté sans passer par `chrome://extensions` : depuis un onglet AniList, `document.dispatchEvent(new Event('anilist-helper:dev-reload'))`, puis recharger la page. Utile pour un agent qui pilote Chrome, car il ne peut pas ouvrir `chrome://`.
- Ouvrir son propre onglet de test : Paco navigue parfois dans le même onglet.
- **AniList limite vite le débit** (Cloudflare, erreur 1015). Enchaîner des chargements bloque l'IP quelques minutes. Espacer les pages.
- Le Chrome piloté par agent (MCP) bloque les résultats JS contenant `?`, `&` ou `=` (« Cookie/query string data ») : les remplacer avant de renvoyer une URL.

## Visuels des stores

- Vraies captures seulement (`store/capture.mjs`, Playwright avec l'extension chargée), jamais de maquette d'interface dessinée.
- `capture.mjs` espace les pages de 8 s et s'arrête si AniList limite. `ONLY=stats,popup store/render.sh` refait certaines captures, `NO_CAPTURE=1 store/render.sh` ne fait que re-rendre.
- AniList sert sa version mobile à « HeadlessChrome » : forcer un user-agent desktop (déjà fait dans `capture.mjs`).

## État

- v1.0.0 publiée en release GitHub, avec les zips (`packages/` n'est pas suivi par git).
- Dépôt public, site en ligne sur GitHub Pages. Le workflow Pages s'ignore si le dépôt redevient privé.
- Stores : textes prêts dans `store/CHROME.md` et `store/FIREFOX.md`. Le README annonce les fiches « on their way ».
