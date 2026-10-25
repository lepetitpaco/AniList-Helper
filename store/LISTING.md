# Store listings (Chrome Web Store and Firefox Add-ons)

Copy-paste ready. Visuals live in `store/` and are rebuilt by `store/render.sh`.

| Visual | File | Where |
|---|---|---|
| Icon 128 | `icons/icon-128.png` | Chrome: store icon; Firefox: icon |
| Screenshots 1280x800 | `store/screenshots/1..5-*.png` | Chrome: screenshots (5 max); Firefox: screenshots |
| Small promo tile 440x280 | `store/promo-small-440x280.png` | Chrome: "Small promo tile" |
| Marquee 1400x560 | `store/promo-marquee-1400x560.png` | Chrome: "Marquee promo tile" |
| Packages | `packages/anilist-helper-{chrome,firefox}.zip` | built by `scripts/package.sh` |

---

## Name (both stores)

```
AniList Helper
```

## Summary

Chrome reads `description` from the manifest (132 characters max). Firefox: "Summary" field (250 max).

Chrome (125 characters, already in the manifest):
```
Quality-of-life tweaks for AniList: persistent list filters, remembered preferences, bookmarks and quick links. No API calls.
```

Firefox (213 characters):
```
Your AniList, remembered: list filters that survive a reload and can be shared as links, one-click bookmarks, and remembered stats sorting, voice actor language and role sorting. No AniList API calls, no tracking.
```

## Category

- Chrome: Tools
- Firefox: Other (and "Appearance" as second category)

## Description (Chrome, "Description" field)

```
Your AniList, remembered.

AniList forgets a lot every time you reload: the filters of your anime list, the voice actor language you picked, how you sorted your stats… AniList Helper keeps all of it, adds bookmarks, and lets you turn each tweak on or off.

★ PERSISTENT, SHAREABLE LIST FILTERS
• Search, format, status, genres, country, year and sort of anime and manga lists survive a reload
• Filters are written to the URL (?format=TV&genres=Action,Comedy): send the link and other AniList Helper users see the list exactly like you
• A Reset button next to "Filters" clears everything in one click

★ BOOKMARKS & QUICK LINKS
• One-click bookmark button next to the heart on anime, manga, character, staff and studio pages
• A Bookmarks menu in AniList's top bar (or Alt+B) with your bookmarks, your own pages and handy shortcuts (This Season, Trending, Top 100…)
• Bookmark any page, even a search or a filtered list
• On small screens, a floating button stacked above AniList's own menu button
• Choose where the buttons show up, or hide them all

★ REMEMBERED PREFERENCES
• Voice actor language on the Characters tab and on character pages
• Count / Time Watched / Mean Score sorting and the anime/characters switch of each stats page
• Sort order and "On my list" on staff and character pages

★ PRIVATE BY DESIGN
• No AniList API calls, nothing changed on your account
• No tracking, no analytics, no ads, no account
• Everything stays in your browser
• Open source: github.com/lepetitpaco/AniList-Helper

AniList Helper is an independent project, not affiliated with or endorsed by AniList.
```

## Description (Firefox, "Description" field, limited Markdown)

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

## Links

- Homepage: `https://lepetitpaco.github.io/AniList-Helper/`
- Support / issues: `https://github.com/lepetitpaco/AniList-Helper/issues`
- Privacy policy: `https://lepetitpaco.github.io/AniList-Helper/privacy.html`

---

## French (Français)

AMO: already filled in on the listing (Localize for: Français), including screenshot captions.
Chrome Web Store: Store listing → language selector → add "French", then paste:

Summary: Chrome uses the manifest description in every language, only the description is localized.

Description:
```
Votre AniList n'oublie plus rien.

AniList oublie beaucoup de choses à chaque rechargement : les filtres de votre liste d'anime, la langue des doubleurs que vous aviez choisie, le tri de vos stats… AniList Helper garde tout ça en mémoire, ajoute des favoris, et chaque réglage s'active ou se désactive à part.

★ FILTRES DE LISTE PERSISTANTS ET PARTAGEABLES
• Recherche, format, statut, genres, pays, année et tri des listes d'anime et de manga survivent au rechargement
• Les filtres sont écrits dans l'URL (?format=TV&genres=Action,Comedy) : envoyez le lien et les autres utilisateurs d'AniList Helper voient la liste exactement comme vous
• Un bouton Reset à côté de « Filters » efface tout en un clic

★ FAVORIS ET LIENS RAPIDES
• Un bouton favori en un clic à côté du cœur sur les pages d'anime, de manga, de personnage, de staff et de studio
• Un menu Bookmarks dans la barre du haut d'AniList (ou Alt+B) avec vos favoris, vos propres pages et des raccourcis pratiques (This Season, Trending, Top 100…)
• N'importe quelle page peut devenir un favori, même une recherche ou une liste filtrée
• Sur petit écran, un bouton flottant placé au-dessus du bouton de menu d'AniList
• Vous choisissez où les boutons apparaissent, ou vous les masquez tous

★ PRÉFÉRENCES MÉMORISÉES
• La langue des doubleurs sur l'onglet Characters et sur les pages de personnage
• Le tri Count / Time Watched / Mean Score et la bascule anime/personnages de chaque page de stats
• L'ordre de tri et « On my list » sur les pages de staff et de personnage

★ RESPECT DE LA VIE PRIVÉE
• Aucun appel à l'API d'AniList, rien n'est modifié sur votre compte
• Aucun pistage, aucune statistique, aucune pub, aucun compte
• Tout reste dans votre navigateur
• Open source : github.com/lepetitpaco/AniList-Helper

L'interface de l'extension est en anglais, comme celle d'AniList.

AniList Helper est un projet indépendant, sans lien avec AniList et non approuvé par AniList.
```

Firefox summary (231 characters, already on AMO):
```
Votre AniList n'oublie plus rien : des filtres de liste qui tiennent au rechargement et se partagent par lien, des favoris en un clic, et le tri des stats, la langue des doubleurs et le tri des rôles mémorisés. Sans API ni pistage.
```

Screenshot captions (AMO, EN / FR):
1. Your list filters survive a reload and live in the URL / Les filtres de votre liste tiennent au rechargement et sont dans l'URL
2. Share a filtered list: it opens the same way for other AniList Helper users / Partagez une liste filtrée : elle s'ouvre pareil chez les autres utilisateurs d'AniList Helper
3. One-click bookmarks and a Bookmarks menu in the top bar / Des favoris en un clic et un menu Bookmarks dans la barre du haut
4. Voice actor language and stats sorting are remembered / La langue des doubleurs et le tri des stats sont mémorisés
5. Turn any feature on or off, and choose where the bookmark buttons show up / Activez ou désactivez chaque fonction, et choisissez où apparaissent les boutons favoris

---

## Chrome Web Store: privacy practices tab

### Single purpose

```
Improve the usability of the AniList website (anilist.co): keep list filters and page preferences across reloads, make filtered lists shareable through the URL, and add bookmarks with quick links.
```

### Permission justifications

`storage`:
```
Saves the user's settings (which features are on) and their bookmarks locally. Nothing is sent anywhere.
```

Host permission `https://anilist.co/*` (content scripts):
```
The extension only works on anilist.co: its content scripts read the state of AniList's list filters and page settings to save and restore them, write the active filters to the page URL, and add the bookmark buttons and menu to the page. It does not run on any other site.
```

### Remote code

```
No, I am not using remote code. All code is bundled in the package; no external script is loaded or evaluated.
```

### Data usage

Check nothing in "What user data do you plan to collect": the extension collects no user data. Then certify the three statements (no selling or transfer to third parties, no use unrelated to the single purpose, no use for creditworthiness or lending).

---

## Firefox Add-ons: notes for reviewers

```
No build step, no minification, no remote code: the package contains the source files as they are in the repository (https://github.com/lepetitpaco/AniList-Helper).

The page scripts in src/page/ run in the page's world ("world": "MAIN", Firefox 128+) because they need to reach AniList's Vue components (element.__vue__) to read and restore list filters and page preferences. They don't use any extension API; settings reach them through a data attribute set by src/bridge.js.

background.js only handles a development-only reload message and does nothing unless the add-on is installed temporarily (management.getSelf().installType === "development").

The add-on makes no network requests and collects no data (data_collection_permissions: none).
```
