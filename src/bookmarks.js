// AniList Helper — bookmarks and quick links.
//
// Three ways in:
//  - a "bookmarks" entry in AniList's top navigation (desktop) opens the panel below it;
//  - on narrow screens, where that navigation doesn't exist, a floating button stacked
//    above AniList's own mobile menu button opens it;
//  - a one-click bookmark button next to the favourite heart on anime, manga,
//    character, staff and studio pages.
// Bookmarks live in the extension's local storage; nothing is sent anywhere. Links
// navigate inside the SPA (through common.js, which can reach the router) unless
// opened in a new tab.
(() => {
  'use strict';

  const STORAGE_KEY = 'bookmarks';
  const FAB_SIZE = 44;

  const GLOBAL_LINKS = [
    { label: 'This Season', path: '/search/anime/this-season' },
    { label: 'Next Season', path: '/search/anime/next-season' },
    { label: 'Trending Anime', path: '/search/anime/trending' },
    { label: 'Top 100 Anime', path: '/search/anime/top-100' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Forum', path: '/forum/overview' },
  ];

  const userLinks = name => [
    { label: 'Anime List', path: `/user/${name}/animelist` },
    { label: 'Manga List', path: `/user/${name}/mangalist` },
    { label: 'Stats', path: `/user/${name}/stats/anime/overview` },
    { label: 'Favorites', path: `/user/${name}/favorites` },
    { label: 'Social', path: `/user/${name}/social` },
  ];

  // /anime/16498/Attack-on-Titan/watch -> anime 16498: one bookmark per entry, whatever the tab
  const ENTITY_PATH = /^\/(anime|manga|character|staff|studio)\/(\d+)/;

  const BOOKMARK_ICON = 'M6 2h12a1 1 0 0 1 1 1v19l-7-4.5L5 22V3a1 1 0 0 1 1-1z';
  const BOOKMARK_OUTLINE_ICON = 'M6 2h12a1 1 0 0 1 1 1v19l-7-4.5L5 22V3a1 1 0 0 1 1-1zm1 2v14.3l5-3.2 5 3.2V4z';

  // AniList theme colors are "r,g,b" custom properties on :root, inherited by the shadow tree
  const PANEL_STYLES = `
    :host { all: initial; }
    * { box-sizing: border-box; }
    .fab {
      position: fixed;
      right: var(--ah-right, 20px);
      bottom: var(--ah-bottom, 20px);
      z-index: 2147483000;
      width: ${FAB_SIZE}px;
      height: ${FAB_SIZE}px;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: 50%;
      background: rgb(var(--color-blue, 61,180,242));
      color: #fff;
      box-shadow: 0 4px 14px rgba(var(--color-shadow-dark, 6,13,34), .35);
      cursor: pointer;
      transition: transform .15s;
    }
    .fab[hidden] { display: none; }
    .fab:hover { transform: scale(1.06); }
    .fab:focus-visible { outline: 2px solid rgb(var(--color-text-bright, 237,241,245)); outline-offset: 2px; }
    .fab svg { width: 20px; height: 20px; }
    .panel {
      position: fixed;
      z-index: 2147483000;
      width: min(340px, calc(100vw - 32px));
      max-height: min(70vh, 600px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 6px;
      background: rgb(var(--color-foreground, 21,31,46));
      color: rgb(var(--color-text, 159,173,189));
      box-shadow: 0 14px 30px rgba(var(--color-shadow-dark, 6,13,34), .35);
      font: 13px/1.4 Overpass, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .panel.from-fab { right: 16px; bottom: calc(var(--ah-bottom, 20px) + ${FAB_SIZE + 12}px); }
    .panel.from-nav { top: var(--ah-top, 60px); left: var(--ah-left, 16px); }
    .panel[hidden] { display: none; }
    .head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid rgba(var(--color-text, 159,173,189), .15);
    }
    .title { flex: 1; font-weight: 700; color: rgb(var(--color-text-bright, 237,241,245)); }
    .toggle-bookmark {
      border: 0;
      border-radius: 4px;
      padding: 6px 10px;
      background: rgb(var(--color-blue, 61,180,242));
      color: #fff;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .toggle-bookmark.saved { background: rgba(var(--color-text, 159,173,189), .2); color: inherit; }
    .body { overflow-y: auto; padding: 6px 0 10px; }
    h2 {
      margin: 10px 14px 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .04em;
      text-transform: uppercase;
      color: rgb(var(--color-text-lighter, 146,153,161));
    }
    .links { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 14px; }
    .chip {
      padding: 4px 9px;
      border-radius: 4px;
      background: rgba(var(--color-text, 159,173,189), .12);
      color: inherit;
      text-decoration: none;
      font-size: 12px;
    }
    .chip:hover { color: rgb(var(--color-blue, 61,180,242)); }
    ul { list-style: none; margin: 0; padding: 0; }
    li { display: flex; align-items: center; gap: 8px; padding: 0 8px 0 14px; }
    li:hover { background: rgba(var(--color-text, 159,173,189), .08); }
    li a {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      color: inherit;
      text-decoration: none;
    }
    li a:hover .name { color: rgb(var(--color-blue, 61,180,242)); }
    .thumb {
      flex: none;
      width: 30px;
      height: 42px;
      border-radius: 3px;
      object-fit: cover;
      background: rgba(var(--color-text, 159,173,189), .15);
    }
    .text { min-width: 0; }
    .name, .meta { display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
    .name { color: rgb(var(--color-text-bright, 237,241,245)); }
    .meta { font-size: 11px; color: rgb(var(--color-text-lighter, 146,153,161)); text-transform: capitalize; }
    .remove {
      flex: none;
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 4px;
      background: none;
      color: inherit;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      opacity: .45;
    }
    .remove:hover, .remove:focus-visible { opacity: 1; background: rgba(var(--color-text, 159,173,189), .15); }
    .empty { margin: 4px 14px; font-size: 12px; color: rgb(var(--color-text-lighter, 146,153,161)); }
  `;

  // Styles for the elements added to AniList's own DOM
  const PAGE_STYLES = `
    .ah-bookmark-button {
      width: 35px;
      height: 35px;
      display: grid;
      place-items: center;
      flex: none;
      border: 0;
      border-radius: 5px;
      background: rgb(var(--color-blue));
      color: #fff;
      cursor: pointer;
    }
    .ah-bookmark-button svg { width: 15px; height: 15px; }
    .ah-bookmark-button:not(.saved) { background: rgba(var(--color-blue), .25); color: rgb(var(--color-blue)); }
    .ah-bookmark-button:hover { filter: brightness(1.1); }
    .actions > .ah-bookmark-button, .header > .ah-bookmark-button { margin-left: 10px; }
    .actions[data-ah-grid] { grid-template-columns: minmax(0, 1fr) 35px 35px !important; }
    .actions[data-ah-grid] > .ah-bookmark-button { margin-left: 0; }
    .ah-nav-link { cursor: pointer; }
  `;

  let enabled = false;
  // Where the buttons show up (popup options of the "bookmarks" feature)
  let placement = { nav: true, heart: true, fab: true };
  let host = null;
  let panel = null;
  let fab = null;
  let anchor = null; // element the panel is open from
  let bookmarks = [];
  let renderedHref = null; // page the open panel was rendered for

  function svgIcon(d) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', d);
    svg.append(path);
    return svg;
  }

  function element(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function isVisible(el) {
    return !!el && el.getClientRects().length > 0 && getComputedStyle(el).display !== 'none';
  }

  // ---------------------------------------------------------------- current page

  function entityMatch() {
    return location.pathname.match(ENTITY_PATH);
  }

  // Bookmark path of the current page: the entry itself on entity pages, else the full URL
  function pagePath() {
    const match = entityMatch();
    return match ? `/${match[1]}/${match[2]}/` : location.pathname + location.search;
  }

  function pageBookmark() {
    const match = entityMatch();
    const heading = match && document.querySelector('.header h1, .name-wrapper h1, .container h1');
    const image = match && document.querySelector('.cover-wrap-inner img.cover, .header .container > img.image');
    return {
      path: pagePath(),
      title: heading?.textContent.trim() || document.title.replace(/\s*·\s*AniList\s*$/, '').trim() || location.pathname,
      type: match ? match[1] : null,
      image: image?.src || null,
      addedAt: Date.now(),
    };
  }

  // Logged-in user, read from the "Anime List" link of AniList's navigation
  // (desktop .nav or mobile .mobile-nav, only one is rendered)
  function currentUserName() {
    const link = document.querySelector(
      '.nav a[href^="/user/"][href$="/animelist"], .mobile-nav a[href^="/user/"][href$="/animelist"]'
    );
    return link ? link.getAttribute('href').split('/')[2] : null;
  }

  // ---------------------------------------------------------------- storage

  async function loadBookmarks() {
    const data = await ahApi().storage.local.get(STORAGE_KEY);
    bookmarks = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
  }

  function isBookmarked(path) {
    return bookmarks.some(item => item.path === path);
  }

  // Both re-read the stored list first: another tab may have changed it
  async function toggleBookmark() {
    await loadBookmarks();
    const bookmark = pageBookmark();
    if (isBookmarked(bookmark.path)) bookmarks = bookmarks.filter(item => item.path !== bookmark.path);
    else bookmarks.unshift(bookmark);
    await ahApi().storage.local.set({ [STORAGE_KEY]: bookmarks });
    refresh(true);
  }

  async function removeBookmark(path) {
    await loadBookmarks();
    bookmarks = bookmarks.filter(item => item.path !== path);
    await ahApi().storage.local.set({ [STORAGE_KEY]: bookmarks });
    refresh(true);
  }

  // ---------------------------------------------------------------- panel

  function navigate(path) {
    document.documentElement.dataset.anilistHelperNavigate = path;
    document.dispatchEvent(new Event('anilist-helper:navigate'));
  }

  function link(path, className, children) {
    const a = element('a', className);
    a.href = path;
    a.append(...children);
    a.addEventListener('click', event => {
      // Let the browser handle new tab / new window clicks
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      close();
      navigate(path);
    });
    return a;
  }

  function section(title, content) {
    return [element('h2', '', title), content];
  }

  function chips(links) {
    const wrap = element('div', 'links');
    wrap.append(...links.map(item => link(item.path, 'chip', [item.label])));
    return wrap;
  }

  function bookmarkList() {
    if (!bookmarks.length) {
      return element('p', 'empty', 'No bookmarks yet. Use the bookmark button next to the heart on any anime, manga, character or staff page, or "Bookmark" above for any page.');
    }
    const list = element('ul');
    for (const bookmark of bookmarks) {
      const thumb = element(bookmark.image ? 'img' : 'span', 'thumb');
      if (bookmark.image) {
        thumb.src = bookmark.image;
        thumb.alt = '';
        thumb.loading = 'lazy';
      }
      const text = element('span', 'text');
      text.append(
        element('span', 'name', bookmark.title),
        element('span', 'meta', bookmark.type || decodeURIComponent(bookmark.path))
      );

      const remove = element('button', 'remove', '×');
      remove.type = 'button';
      remove.title = 'Remove bookmark';
      remove.setAttribute('aria-label', `Remove ${bookmark.title}`);
      remove.addEventListener('click', () => removeBookmark(bookmark.path));

      const item = element('li');
      item.append(link(bookmark.path, '', [thumb, text]), remove);
      list.append(item);
    }
    return list;
  }

  function renderPanel() {
    renderedHref = location.href;
    const saved = isBookmarked(pagePath());
    const toggle = panel.querySelector('.toggle-bookmark');
    toggle.textContent = saved ? 'Bookmarked' : 'Bookmark';
    toggle.classList.toggle('saved', saved);
    toggle.title = saved ? 'Remove this page from your bookmarks' : 'Save this page to your bookmarks';

    const user = currentUserName();
    panel.querySelector('.body').replaceChildren(
      ...section('Bookmarks', bookmarkList()),
      ...(user ? section('My pages', chips(userLinks(user))) : []),
      ...section('Browse', chips(GLOBAL_LINKS))
    );
  }

  function isOpen() {
    return !!panel && !panel.hidden;
  }

  // Below the nav entry; AniList hides its navigation when scrolling down, the panel
  // then sticks to the top of the screen
  function positionPanel() {
    if (!anchor || anchor === fab) return;
    const rect = anchor.getBoundingClientRect();
    // Use the panel's CSS width, it may still be hidden: min(340px, 100vw - 32px)
    const viewport = document.documentElement.clientWidth;
    const left = Math.min(rect.left, viewport - Math.min(340, viewport - 32) - 16);
    host.style.setProperty('--ah-top', `${Math.round(Math.max(16, rect.bottom + 4))}px`);
    host.style.setProperty('--ah-left', `${Math.round(Math.max(16, left))}px`);
  }

  function open(from) {
    anchor = from;
    const fromNav = from !== fab;
    panel.classList.toggle('from-nav', fromNav);
    panel.classList.toggle('from-fab', !fromNav);
    positionPanel();
    renderPanel();
    panel.hidden = false;
    from.setAttribute('aria-expanded', 'true');
  }

  function close() {
    if (!isOpen()) return;
    panel.hidden = true;
    anchor?.setAttribute('aria-expanded', 'false');
    anchor = null;
  }

  function toggle(from) {
    if (isOpen() && anchor === from) close();
    else open(from);
  }

  function mountPanel() {
    host = document.createElement('anilist-helper-bookmarks');
    const root = host.attachShadow({ mode: 'open' });

    const style = element('style');
    style.textContent = PANEL_STYLES;

    fab = element('button', 'fab');
    fab.type = 'button';
    fab.title = 'Bookmarks & quick links (Alt+B)';
    fab.setAttribute('aria-label', 'Bookmarks and quick links');
    fab.setAttribute('aria-expanded', 'false');
    fab.hidden = true;
    fab.append(svgIcon(BOOKMARK_ICON));
    fab.addEventListener('click', () => toggle(fab));

    const toggleButton = element('button', 'toggle-bookmark');
    toggleButton.type = 'button';
    toggleButton.addEventListener('click', toggleBookmark);
    const head = element('div', 'head');
    head.append(element('span', 'title', 'Bookmarks'), toggleButton);

    panel = element('div', 'panel');
    panel.hidden = true;
    panel.append(head, element('div', 'body'));

    root.append(style, panel, fab);
    document.body.append(host);
  }

  // ---------------------------------------------------------------- AniList DOM additions

  // Desktop: "bookmarks" entry at the end of the top navigation. Copies the data-v-*
  // attributes of AniList's own links so their scoped styles apply.
  function ensureNavLink() {
    if (!placement.nav) {
      document.querySelectorAll('.ah-nav-link').forEach(el => el.remove());
      return;
    }
    const links = document.querySelector('.nav .links');
    if (!links || links.querySelector('.ah-nav-link')) return;
    const model = links.querySelector('a.link');
    if (!model) return;
    const navLink = element('a', 'link ah-nav-link', 'bookmarks');
    for (const attribute of model.attributes) {
      if (attribute.name.startsWith('data-v-')) navLink.setAttribute(attribute.name, '');
    }
    navLink.href = '#';
    navLink.setAttribute('role', 'button');
    navLink.setAttribute('aria-expanded', 'false');
    navLink.title = 'Bookmarks & quick links (Alt+B)';
    navLink.addEventListener('click', event => {
      event.preventDefault();
      toggle(navLink);
    });
    // Right after the last navigation link: logged out, Login / Sign Up follow in the same row
    [...links.querySelectorAll(':scope > a.link')].pop().after(navLink);
  }

  // One-click bookmark button next to the favourite heart
  function ensureHeaderButton() {
    if (!placement.heart) {
      document.querySelectorAll('.ah-bookmark-button').forEach(el => el.remove());
      document.querySelectorAll('[data-ah-grid]').forEach(el => delete el.dataset.ahGrid);
      return;
    }
    const heart = document.querySelector('.actions > .favourite, .header > .favourite');
    if (!heart || !entityMatch()) return;
    let button = heart.parentElement.querySelector('.ah-bookmark-button');
    if (!button) {
      button = element('button', 'ah-bookmark-button');
      button.type = 'button';
      button.addEventListener('click', toggleBookmark);
      heart.after(button);
      // Anime/manga pages lay the list button and the heart out on a 2-column grid
      if (getComputedStyle(heart.parentElement).display === 'grid') heart.parentElement.dataset.ahGrid = '';
    }
    const saved = isBookmarked(pagePath());
    if (button.dataset.saved !== String(saved)) {
      button.dataset.saved = String(saved);
      button.classList.toggle('saved', saved);
      button.title = saved ? 'Remove from bookmarks' : 'Add to bookmarks';
      button.setAttribute('aria-label', button.title);
      button.replaceChildren(svgIcon(saved ? BOOKMARK_ICON : BOOKMARK_OUTLINE_ICON));
    }
  }

  // Narrow screens: show the floating button, right above AniList's mobile menu button,
  // and hide it while that menu is open (it would cover its entries)
  function updateFab() {
    const mobileNav = document.querySelector('.mobile-nav');
    const hamburger = mobileNav?.querySelector('.hamburger');
    const desktopNav = document.querySelector('.nav .ah-nav-link');
    const mobile = isVisible(mobileNav);

    // Only on AniList's app pages (not on error or maintenance pages)
    const appPage = !!document.querySelector('#app');
    fab.hidden = !appPage || !placement.fab || (isVisible(desktopNav) && !mobile) || (mobile && !isVisible(hamburger));
    if (fab.hidden && anchor === fab) close();
    if (fab.hidden || !mobile) {
      host.style.removeProperty('--ah-right');
      host.style.removeProperty('--ah-bottom');
      return;
    }
    const rect = mobileNav.getBoundingClientRect();
    const right = document.documentElement.clientWidth - rect.right + (rect.width - FAB_SIZE) / 2;
    host.style.setProperty('--ah-right', `${Math.round(right)}px`);
    host.style.setProperty('--ah-bottom', `${Math.round(window.innerHeight - rect.top + 12)}px`);
  }

  // `bookmarksChanged`: redraw the open panel even if the page didn't change
  function refresh(bookmarksChanged = false) {
    if (!enabled) return;
    ensureNavLink();
    ensureHeaderButton();
    updateFab();
    if (isOpen()) {
      positionPanel();
      if (bookmarksChanged || location.href !== renderedHref) renderPanel();
    }
  }

  function mount() {
    enabled = true;
    const style = element('style');
    style.id = 'anilist-helper-bookmarks-style';
    style.textContent = PAGE_STYLES;
    document.head.append(style);
    mountPanel();
    refresh();
  }

  function unmount() {
    enabled = false;
    host?.remove();
    host = panel = fab = anchor = null;
    document.getElementById('anilist-helper-bookmarks-style')?.remove();
    document.querySelectorAll('.ah-nav-link, .ah-bookmark-button').forEach(el => el.remove());
    document.querySelectorAll('[data-ah-grid]').forEach(el => delete el.dataset.ahGrid);
  }

  // ---------------------------------------------------------------- events

  let refreshQueued = false;
  function scheduleRefresh() {
    if (refreshQueued || !enabled) return;
    refreshQueued = true;
    requestAnimationFrame(() => {
      refreshQueued = false;
      refresh();
    });
  }

  function onKeyDown(event) {
    if (!enabled) return;
    if (event.key === 'Escape' && isOpen()) {
      close();
      return;
    }
    if (event.altKey && !event.ctrlKey && !event.metaKey && event.code === 'KeyB') {
      const target = event.composedPath()[0];
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      event.preventDefault();
      // Without any visible entry point, the panel opens from the (hidden) floating button's corner
      toggle((fab.hidden && document.querySelector('.ah-nav-link')) || fab);
    }
  }

  function onPointerDown(event) {
    if (!isOpen()) return;
    const path = event.composedPath();
    if (!path.includes(host) && !path.includes(anchor)) close();
  }

  async function applySettings() {
    const settings = await ahLoadSettings();
    placement = { nav: settings.bookmarksNav, heart: settings.bookmarksHeart, fab: settings.bookmarksFab };
    if (settings.bookmarks && !enabled) mount();
    else if (!settings.bookmarks && enabled) unmount();
    else refresh();
  }

  async function init() {
    await loadBookmarks();
    await applySettings();
    new MutationObserver(scheduleRefresh).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    // AniList's mobile menu opens and closes on click without adding/removing nodes
    document.addEventListener('click', () => setTimeout(scheduleRefresh, 50), true);
    window.addEventListener('resize', scheduleRefresh, { passive: true });
    window.addEventListener('scroll', () => isOpen() && requestAnimationFrame(positionPanel), { passive: true });
    window.addEventListener('popstate', scheduleRefresh);
    ahApi().storage.onChanged.addListener(async (changes, area) => {
      if (area === 'sync' && changes.settings) applySettings();
      if (area === 'local' && changes[STORAGE_KEY]) {
        // Bookmarks edited from another tab
        await loadBookmarks();
        refresh(true);
      }
    });
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init, { once: true });
})();
