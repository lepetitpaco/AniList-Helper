# Chrome Web Store

Dashboard: https://chrome.google.com/webstore/devconsole · item ID `cocpljilbejenbjhfkikmldabolfdoci`

Follows the dashboard tabs in order. Labels in **bold** are the field names as the French
dashboard shows them; the text to paste is in the code blocks.

---

## 1. Package

Upload `packages/anilist-helper-chrome.zip` (rebuild with `scripts/package.sh`).

---

## 2. Fiche Play Store (Store listing)

**Titre / Résumé issus du package**: filled automatically from the manifest, nothing to do.

**Description** (English):
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

**Catégorie**: `Outils` (Tools)

**Langue**: `anglais` (English)

### Éléments graphiques (Graphic assets)

| Field | File |
|---|---|
| **Icône du magasin** (128 x 128) | `store/chrome-store-icon-128.png` |
| **Captures d'écran** (1280 x 800, up to 5, in this order) | `store/screenshots/1-your-anilist-remembered.png`<br>`store/screenshots/2-shareable-filters.png`<br>`store/screenshots/3-bookmarks.png`<br>`store/screenshots/4-remembered-preferences.png`<br>`store/screenshots/5-settings.png` |
| **Petite image promotionnelle** (440 x 280) | `store/promo-small-440x280.png` |
| **Image promotionnelle en haut de la page** (1400 x 560) | `store/promo-marquee-1400x560.png` |
| **Vidéo promotionnelle internationale** | leave empty |

All of them are 24-bit PNG without alpha, as Chrome requires (the icon keeps its transparency, which is allowed).

### Champs supplémentaires (Additional fields)

**URL officielle**: `Aucune` (it needs a site verified in Google Search Console).

**URL de la page d'accueil**:
```
https://lepetitpaco.github.io/AniList-Helper/
```

**URL de l'assistance**:
```
https://github.com/lepetitpaco/AniList-Helper/issues
```

**Contenu réservé aux adultes**: leave unchecked.

### French version of the listing (optional)

The language selector at the top of the listing lets you add **français**: the title and summary
stay those of the package, only the description changes:

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

---

## 3. Confidentialité (Privacy)

**Description de l'objectif unique**:
```
Improve the usability of the AniList website (anilist.co): keep list filters and page preferences across reloads, make filtered lists shareable through the URL, and add bookmarks with quick links.
```

**Justification de l'autorisation storage**:
```
Saves the user's settings (which features are on) and their bookmarks locally. Nothing is sent anywhere.
```

**Justification de l'autorisation Autorisation d'accès à l'hôte**:
```
The extension only works on anilist.co: its content scripts read the state of AniList's list filters and page settings to save and restore them, write the active filters to the page URL, and add the bookmark buttons and menu to the page. It does not run on any other site.
```

The dashboard warns that a host permission means a longer review: expected, the extension can't work without access to anilist.co.

**Utilisez-vous code distant ?**: `Non, je n'utilise pas "Code distant"` (no justification needed).

**Consommation des données**: check **none** of the data types. AniList Helper collects nothing.

Then check the three certifications:
- `Je ne vends ni ne transfère les données des utilisateurs à des tiers…`
- `Je n'utilise ni ne transfère les données des utilisateurs à des fins sans rapport…`
- `Je n'utilise ni ne transfère les données des utilisateurs pour déterminer leur solvabilité…`

**URL des règles de confidentialité**:
```
https://lepetitpaco.github.io/AniList-Helper/privacy.html
```

---

## 4. Distribution

- **Paiements**: `Sans frais` (free)
- **Visibilité**: `Public`
- **Distribution**: `Toutes les régions` (all regions)

---

## 5. Accès / Instructions de test

No account is needed to test. If the dashboard asks for test instructions:
```
No login needed. Open any public AniList list, for example https://anilist.co/user/lepetitpaco/animelist, change the filters in the left column and reload the page: the filters stay, and the URL contains them. On an anime page (e.g. https://anilist.co/anime/16498/), the bookmark button next to the heart saves the page; the Bookmarks entry in the top bar lists it.
```

---

## 6. Submit

"Envoyer pour examen" (Submit for review) at the top right once every tab shows no error.
