// Helpers shared by the scripts running in the page's world (world: MAIN), where
// AniList's Vue 2 components can be reached through `element.__vue__`.
window.AniListHelper = (() => {
  'use strict';

  const listeners = [];
  let queued = false;

  // Settings published by bridge.js: page scripts can't reach the storage API
  function isEnabled(feature) {
    try {
      const settings = JSON.parse(document.documentElement.dataset.anilistHelper || 'null');
      return settings?.[feature] === true;
    } catch {
      return false;
    }
  }

  function rootVm() {
    const app = document.querySelector('#app');
    return (app && app.__vue__) || null;
  }

  function eachComponent(callback) {
    const root = rootVm();
    if (!root) return;
    const stack = [root];
    while (stack.length) {
      const vm = stack.pop();
      callback(vm);
      stack.push(...vm.$children);
    }
  }

  // Called (at most once per frame) after DOM changes, route changes and settings changes
  function onChange(callback) {
    listeners.push(callback);
    callback();
  }

  function notify() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      for (const listener of listeners) listener();
    });
  }

  new MutationObserver(notify).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', notify);
  document.addEventListener('anilist-helper:settings', notify);

  // In-app navigation requested by bookmarks.js (isolated world, no access to the router)
  document.addEventListener('anilist-helper:navigate', () => {
    const path = document.documentElement.dataset.anilistHelperNavigate;
    delete document.documentElement.dataset.anilistHelperNavigate;
    if (!path) return;
    const router = rootVm()?.$router;
    if (!router) {
      location.assign(path);
      return;
    }
    const pending = router.push(path);
    // vue-router rejects when navigating to the current page: nothing to do
    if (pending && pending.catch) pending.catch(() => {});
  });

  return { isEnabled, eachComponent, onChange };
})();
