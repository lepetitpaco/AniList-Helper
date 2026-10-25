// Bridge between the extension (storage, isolated world) and the page scripts
// (world: MAIN, no extension APIs). Settings go through an attribute on <html>
// rather than an event's detail, which page scripts can't read on Firefox.
(() => {
  'use strict';

  function publish(settings) {
    document.documentElement.dataset.anilistHelper = JSON.stringify(settings);
    document.dispatchEvent(new Event('anilist-helper:settings'));
  }

  ahLoadSettings().then(publish);

  ahApi().storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.settings) ahLoadSettings().then(publish);
  });

  // Development only: background.js ignores this outside an unpacked build
  document.addEventListener('anilist-helper:dev-reload', () => {
    ahApi().runtime.sendMessage({ type: 'dev-reload' });
  });
})();
