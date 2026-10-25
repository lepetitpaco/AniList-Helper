// AniList Helper — persistent filters on anime/manga lists.
//
// AniList's Vue 2 "MediaList" component keeps the left column filters in its data
// (entryFilters, sort) and never persists them. This script:
//  - mirrors the active filters into the URL (?format=…&genres=…), so links can be shared;
//  - saves them to anilist.co's localStorage, so they survive a reload;
//  - applies them again on load, from the URL first, otherwise from what was saved.
// The selected list (Watching, Completed…) isn't handled here: AniList already keeps
// it in the path (/animelist/Watching).
// No network calls, nothing written on AniList's side: everything stays in the browser.
(() => {
  'use strict';

  const { isEnabled, onChange } = window.AniListHelper;

  // /user/<name>/animelist or /mangalist, optionally followed by /<section>
  const LIST_PATH = /^(\/user\/[^/]+\/(?:animelist|mangalist))(\/[^/]+)?\/?$/;
  const STORAGE_PREFIX = 'anilist-helper:filters:';
  const SYNC_DELAY = 300;
  // Year slider minimum: AniList sets it on mount and it filters nothing
  const YEAR_SLIDER_MIN = 1950;

  // Handled URL parameters, and how they map to the component state.
  // `empty` = MediaList.data() value when the filter is off.
  const FIELDS = {
    search:  { read: vm => vm.entryFilters.title,   entry: 'title',   empty: null },
    format:  { read: vm => vm.entryFilters.format,  entry: 'format',  empty: null },
    status:  { read: vm => vm.entryFilters.status,  entry: 'status',  empty: null },
    genres:  { read: vm => vm.entryFilters.genres,  entry: 'genres',  empty: [], list: true },
    country: { read: vm => vm.entryFilters.country, entry: 'country', empty: null },
    year:    {
      read: vm => (vm.entryFilters.year === YEAR_SLIDER_MIN ? null : vm.entryFilters.year),
      entry: 'year',
      empty: null,
      number: true,
    },
    sort:    { read: vm => vm.sort, write: (vm, v) => { vm.sort = v; }, empty: null },
  };

  let current = null; // { vm, unwatch, href }
  let resetButton = null;
  let syncTimer = null;

  function readState(vm) {
    const state = {};
    for (const [key, field] of Object.entries(FIELDS)) {
      const value = field.read(vm);
      state[key] = Array.isArray(value) ? [...value] : value;
    }
    return state;
  }

  function writeState(vm, state) {
    const entryFilters = { ...vm.entryFilters };
    for (const [key, field] of Object.entries(FIELDS)) {
      if (!(key in state)) continue;
      if (field.entry) entryFilters[field.entry] = state[key];
      else field.write(vm, state[key]);
    }
    vm.entryFilters = entryFilters;
  }

  function isEmpty(field, value) {
    return value == null || value === '' || (field.list && value.length === 0);
  }

  // State -> parameters, active filters only
  function toParams(state) {
    const params = new URLSearchParams();
    for (const [key, field] of Object.entries(FIELDS)) {
      const value = state[key];
      if (isEmpty(field, value)) continue;
      params.set(key, field.list ? value.join(',') : String(value));
    }
    return params;
  }

  // Parameters -> full state: a filter missing from the parameters is off
  function fromParams(params) {
    const state = {};
    for (const [key, field] of Object.entries(FIELDS)) {
      const raw = params.get(key);
      if (!raw) state[key] = field.list ? [] : field.empty;
      else if (field.list) state[key] = raw.split(',').filter(Boolean);
      else if (field.number) state[key] = Number.isFinite(Number(raw)) ? Number(raw) : null;
      else state[key] = raw;
    }
    return state;
  }

  function hasManagedParams(params) {
    return Object.keys(FIELDS).some(key => params.get(key));
  }

  function storageKey(basePath) {
    return STORAGE_PREFIX + basePath.toLowerCase();
  }

  function loadSaved(basePath) {
    try {
      return localStorage.getItem(storageKey(basePath));
    } catch {
      return null;
    }
  }

  function save(basePath, params) {
    try {
      const query = params.toString();
      if (query) localStorage.setItem(storageKey(basePath), query);
      else localStorage.removeItem(storageKey(basePath));
    } catch {
      // storage unavailable (strict private browsing): the URL is enough
    }
  }

  // Mirrors the current state into the URL and storage
  function sync() {
    clearTimeout(syncTimer);
    syncTimer = null;
    if (!current) return;
    const match = location.pathname.match(LIST_PATH);
    if (!match) return;

    const params = toParams(readState(current.vm));
    save(match[1], params);

    const url = new URL(location.href);
    for (const key of Object.keys(FIELDS)) url.searchParams.delete(key);
    for (const [key, value] of params) url.searchParams.set(key, value);
    // keep commas readable in the link (?genres=Action,Comedy)
    const href = url.href.replace(/%2C/gi, ',');
    if (href !== location.href) {
      // keep history.state so vue-router doesn't lose its key
      history.replaceState(history.state, '', href);
    }
    current.href = location.href;
    updateResetButton(params);
  }

  // "Reset" next to the "Filters" heading of the left column, shown while a filter is on
  function updateResetButton(params) {
    const heading = [...document.querySelectorAll('.filters .group-header')]
      .find(el => el.firstChild?.textContent.trim() === 'Filters');
    if (!heading) return;
    if (!resetButton) {
      injectStyles();
      resetButton = document.createElement('button');
      resetButton.type = 'button';
      resetButton.className = 'ah-reset-filters';
      resetButton.textContent = 'Reset';
      resetButton.title = 'Clear the filters of this list';
      resetButton.addEventListener('click', () => {
        if (!current) return;
        writeState(current.vm, fromParams(new URLSearchParams()));
        sync();
      });
    }
    if (resetButton.parentElement !== heading) heading.append(resetButton);
    resetButton.hidden = !params.toString();
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .ah-reset-filters {
        float: right;
        padding: 0;
        border: 0;
        background: none;
        color: rgb(var(--color-blue));
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }
      .ah-reset-filters:hover { text-decoration: underline; }
      .ah-reset-filters[hidden] { display: none; }
    `;
    document.head.append(style);
  }

  function scheduleSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sync, SYNC_DELAY);
  }

  // Applies the filters again: the URL's (shared link), otherwise the ones saved
  // for this list (shared by all its sections)
  function restore(vm) {
    const match = location.pathname.match(LIST_PATH);
    let params = new URLSearchParams(location.search);
    if (!hasManagedParams(params)) {
      params = new URLSearchParams(loadSaved(match[1]) || '');
    }
    if (hasManagedParams(params)) writeState(vm, fromParams(params));
  }

  function attach(vm) {
    detach();
    restore(vm);
    const unwatch = vm.$watch(
      () => [vm.entryFilters, vm.sort],
      scheduleSync,
      { deep: true }
    );
    current = { vm, unwatch, href: null };
    sync();
  }

  function detach() {
    if (current) current.unwatch();
    current = null;
    clearTimeout(syncTimer);
    if (resetButton) resetButton.hidden = true;
  }

  function findMediaList() {
    const el = document.querySelector('.medialist');
    let vm = el && el.__vue__;
    while (vm && !(vm.$data && 'entryFilters' in vm.$data)) vm = vm.$parent;
    return vm || null;
  }

  // AniList is a SPA: watch for the component showing up (or being replaced),
  // and for route changes that reuse it
  function check() {
    if (!LIST_PATH.test(location.pathname) || !isEnabled('persistentFilters')) {
      detach();
      return;
    }
    const vm = findMediaList();
    if (!vm) return;
    if (!current || current.vm !== vm) {
      attach(vm);
    } else if (location.href !== current.href) {
      // Other user, shared link or click on a section: AniList resets the filters
      // (beforeRouteUpdate) or drops the query, so apply them again
      restore(vm);
      sync();
    }
    // The left column may render after the filters were applied
    if (current) updateResetButton(toParams(readState(current.vm)));
  }

  onChange(check);
})();
