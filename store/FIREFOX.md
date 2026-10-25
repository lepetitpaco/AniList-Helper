# Firefox Add-ons (AMO)

Developer page: https://addons.mozilla.org/developers/addon/anilist-helper/edit
Public page (once approved): https://addons.mozilla.org/firefox/addon/anilist-helper/

**Status**: version 1.0.0 submitted on 2026-10-25, listing filled in English and French
(summary, description, screenshot captions), icon and 5 screenshots uploaded, homepage set.
This file is the reference for future updates.

---

## Package

Upload `packages/anilist-helper-firefox.zip` (rebuild with `scripts/package.sh`).
Compatible with **Firefox** only (desktop, 140+); Firefox for Android stays unchecked: untested.
Validation: 0 errors, 1 warning about Firefox for Android (ignored, Android isn't targeted).

## Describe Add-on

**Name**: `AniList Helper` (same in French)

**Summary** (English, 213/250):
```
Your AniList, remembered: list filters that survive a reload and can be shared as links, one-click bookmarks, and remembered stats sorting, voice actor language and role sorting. No AniList API calls, no tracking.
```

**Summary** (Français, 231/250):
```
Votre AniList n'oublie plus rien : des filtres de liste qui tiennent au rechargement et se partagent par lien, des favoris en un clic, et le tri des stats, la langue des doubleurs et le tri des rôles mémorisés. Sans API ni pistage.
```

**Description** (English, limited Markdown):
```
**Your AniList, remembered.**

AniList forgets a lot every time you reload: the filters of your anime list, the voice actor language you picked, how you sorted your stats… AniList Helper keeps all of it, adds bookmarks, and lets you turn each tweak on or off.

**Persistent, shareable list filters**

- Search, format, status, genres, country, year and sort of anime and manga lists survive a reload
- Filters are written to the URL (`?format=TV&genres=Action,Comedy`): send the link and other AniList Helper users see the list exactly like you
- A Reset button next to "Filters" clears everything in one click

**Bookmarks & quick links**

- One-click bookmark button next to the heart on anime, manga, character, staff and studio pages
- A Bookmarks menu in AniList's top bar (or Alt+B) with your bookmarks, your own pages and handy shortcuts (This Season, Trending, Top 100…)
- Bookmark any page, even a search or a filtered list
- On small screens, a floating button stacked above AniList's own menu button
- Choose where the buttons show up, or hide them all

**Remembered preferences**

- Voice actor language on the Characters tab and on character pages
- Count / Time Watched / Mean Score sorting and the anime/characters switch of each stats page
- Sort order and "On my list" on staff and character pages

**Private by design**

- No AniList API calls, nothing changed on your account
- No tracking, no analytics, no ads, no account
- Everything stays in your browser
- Open source: [github.com/lepetitpaco/AniList-Helper](https://github.com/lepetitpaco/AniList-Helper)

AniList Helper is an independent project, not affiliated with or endorsed by AniList.
```

**Description** (Français, "Localize for: Français"):
```
**Votre AniList n'oublie plus rien.**

AniList oublie beaucoup de choses à chaque rechargement : les filtres de votre liste d'anime, la langue des doubleurs que vous aviez choisie, le tri de vos stats… AniList Helper garde tout ça en mémoire, ajoute des favoris, et chaque réglage s'active ou se désactive à part.

**Filtres de liste persistants et partageables**

- Recherche, format, statut, genres, pays, année et tri des listes d'anime et de manga survivent au rechargement
- Les filtres sont écrits dans l'URL (`?format=TV&genres=Action,Comedy`) : envoyez le lien et les autres utilisateurs d'AniList Helper voient la liste exactement comme vous
- Un bouton Reset à côté de « Filters » efface tout en un clic

**Favoris et liens rapides**

- Un bouton favori en un clic à côté du cœur sur les pages d'anime, de manga, de personnage, de staff et de studio
- Un menu Bookmarks dans la barre du haut d'AniList (ou Alt+B) avec vos favoris, vos propres pages et des raccourcis pratiques (This Season, Trending, Top 100…)
- N'importe quelle page peut devenir un favori, même une recherche ou une liste filtrée
- Sur petit écran, un bouton flottant placé au-dessus du bouton de menu d'AniList
- Vous choisissez où les boutons apparaissent, ou vous les masquez tous

**Préférences mémorisées**

- La langue des doubleurs sur l'onglet Characters et sur les pages de personnage
- Le tri Count / Time Watched / Mean Score et la bascule anime/personnages de chaque page de stats
- L'ordre de tri et « On my list » sur les pages de staff et de personnage

**Respect de la vie privée**

- Aucun appel à l'API d'AniList, rien n'est modifié sur votre compte
- Aucun pistage, aucune statistique, aucune pub, aucun compte
- Tout reste dans votre navigateur
- Open source : [github.com/lepetitpaco/AniList-Helper](https://github.com/lepetitpaco/AniList-Helper)

L'interface de l'extension est en anglais, comme celle d'AniList.

AniList Helper est un projet indépendant, sans lien avec AniList et non approuvé par AniList.
```

**Categories**: Bookmarks, Appearance
**Support website**: `https://github.com/lepetitpaco/AniList-Helper/issues` · **Support email**: none
**License**: MIT
**Privacy policy**: the text of `site/privacy.html` (AMO wants the text, not a link)

## Images

- **Add-on icon**: `icons/icon-128.png`
- **Screenshots**: `store/screenshots/1..5-*.png`, with these captions (English / Français):
  1. Your list filters survive a reload and live in the URL / Les filtres de votre liste tiennent au rechargement et sont dans l'URL
  2. Share a filtered list: it opens the same way for other AniList Helper users / Partagez une liste filtrée : elle s'ouvre pareil chez les autres utilisateurs d'AniList Helper
  3. One-click bookmarks and a Bookmarks menu in the top bar / Des favoris en un clic et un menu Bookmarks dans la barre du haut
  4. Voice actor language and stats sorting are remembered / La langue des doubleurs et le tri des stats sont mémorisés
  5. Turn any feature on or off, and choose where the bookmark buttons show up / Activez ou désactivez chaque fonction, et choisissez où apparaissent les boutons favoris

## Additional Details

**Homepage**: `https://lepetitpaco.github.io/AniList-Helper/` · **Tags**: none (AMO's fixed list has nothing about AniList)

## Notes to Reviewer

```
No build step, no minification, no remote code: the package contains the source files as they are in the repository (https://github.com/lepetitpaco/AniList-Helper).

The page scripts in src/page/ run in the page's world ("world": "MAIN") because they need to reach AniList's Vue components (element.__vue__) to read and restore list filters and page preferences. They don't use any extension API; settings reach them through a data attribute set by src/bridge.js.

background.js only handles a development-only reload message and does nothing unless the add-on is installed temporarily (management.getSelf().installType === "development").

The add-on makes no network requests and collects no data (data_collection_permissions: none). No account is needed to test it: open any public list such as https://anilist.co/user/lepetitpaco/animelist and change the filters in the left column, then reload.
```

## New version

Bump `version` in both manifests, `scripts/package.sh`, then on AMO: "Upload New Version" and
fill in the version notes (the field may be hidden: fill it through the page if needed).
