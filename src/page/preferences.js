// AniList Helper — remembers page preferences AniList forgets on reload: stats
// sorting, voice actor language, staff/character role sorting.
//
// Each preference watches a Vue component's data, saves it to anilist.co's
// localStorage and applies it again the next time the component shows up.
// Values are applied through the component's own methods when it has one, so
// AniList reacts exactly as if the user had clicked.
(() => {
  'use strict';

  const { isEnabled, eachComponent, onChange } = window.AniListHelper;
  const STORAGE_PREFIX = 'anilist-helper:prefs:';

  const has = (vm, ...keys) => vm.$data && keys.every(key => key in vm.$data);

  const roleFields = {
    sort:   { read: vm => vm.sort,   apply: (vm, value) => vm.setSort(value) },
    onList: { read: vm => vm.onList, apply: (vm, value) => vm.setOnList(value) },
  };

  const PREFERENCES = [
    {
      // Stats pages: Count / Time Watched / Mean Score, anime/characters switch
      feature: 'statsSort',
      match: vm => has(vm, 'relationType', 'sort'),
      // One memory per stats page: anime/genres, manga/tags…
      key: () => 'stats:' + (location.pathname.split('/stats/')[1] || '').replace(/\/$/, ''),
      fields: {
        sort: { read: vm => vm.sort, apply: (vm, value) => vm.changeSortOrder(value) },
        relationType: {
          read: vm => vm.relationType,
          // Before the stats load, setting the value is enough: AniList fetches with it
          apply: (vm, value) => (vm.stats ? vm.changeRelationType(value) : (vm.relationType = value)),
        },
      },
    },
    {
      // Anime/manga page, Characters tab
      feature: 'voiceActorLanguage',
      match: vm => has(vm, 'selectedLanguage', 'availableLanguages'),
      key: () => 'voice-actor-language',
      fields: {
        language: { read: vm => vm.selectedLanguage, apply: (vm, value) => { vm.selectedLanguage = value; } },
      },
    },
    {
      // Character page
      feature: 'voiceActorLanguage',
      match: vm => has(vm, 'language', 'availableLanguages', 'onList'),
      key: () => 'voice-actor-language',
      fields: {
        language: { read: vm => vm.language, apply: (vm, value) => vm.setLanguage(value) },
      },
    },
    {
      feature: 'rolesSort',
      match: vm => has(vm, 'displayAnimeStaffRoles', 'sort', 'onList'),
      key: () => 'staff-roles',
      fields: roleFields,
    },
    {
      feature: 'rolesSort',
      match: vm => has(vm, 'language', 'availableLanguages', 'sort', 'onList'),
      key: () => 'character-roles',
      fields: roleFields,
    },
  ];

  // Per preference: component -> { key, unwatch }
  const attached = PREFERENCES.map(() => new WeakMap());

  function load(key) {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PREFIX + key)) || {};
    } catch {
      return {};
    }
  }

  function save(key, values) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(values));
    } catch {
      // storage unavailable (strict private browsing): nothing to remember
    }
  }

  function readValues(vm, pref) {
    return Object.fromEntries(Object.entries(pref.fields).map(([name, field]) => [name, field.read(vm)]));
  }

  function apply(vm, pref, key) {
    const saved = load(key);
    for (const [name, field] of Object.entries(pref.fields)) {
      if (saved[name] !== undefined && saved[name] !== field.read(vm)) field.apply(vm, saved[name]);
    }
  }

  function attach(vm, pref, index, key) {
    apply(vm, pref, key);
    const state = { key, unwatch: null };
    state.unwatch = vm.$watch(
      () => JSON.stringify(readValues(vm, pref)),
      () => save(state.key, readValues(vm, pref))
    );
    attached[index].set(vm, state);
  }

  function check() {
    eachComponent(vm => {
      PREFERENCES.forEach((pref, index) => {
        if (!pref.match(vm)) return;
        const state = attached[index].get(vm);
        if (!isEnabled(pref.feature)) {
          if (state) {
            state.unwatch();
            attached[index].delete(vm);
          }
          return;
        }
        const key = pref.key();
        if (!state) {
          attach(vm, pref, index, key);
        } else if (state.key !== key) {
          // Component reused by the router (e.g. stats genres -> tags)
          state.key = key;
          apply(vm, pref, key);
        }
      });
    });
  }

  onChange(check);
})();
