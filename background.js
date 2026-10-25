// Development helper: lets an unpacked build be reloaded from an AniList tab
// (document event "anilist-helper:dev-reload"). Does nothing in store builds.
const api = globalThis.browser ?? globalThis.chrome;

api.runtime.onMessage.addListener(message => {
  if (message?.type !== 'dev-reload') return;
  api.management.getSelf().then(self => {
    if (self.installType === 'development') api.runtime.reload();
  });
});
