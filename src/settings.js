// Toggleable features, shared by the popup and the isolated-world content scripts.
// Uses `var` and global functions: Firefox doesn't share `const` between content scripts.
var AH_FEATURES = [
  {
    id: 'persistentFilters',
    label: 'Persistent list filters',
    description: 'Keeps anime/manga list filters after a reload and adds them to the URL so you can share them.',
    default: true,
  },
  {
    id: 'statsSort',
    label: 'Remember stats sorting',
    description: 'Keeps the sort order and the anime/characters switch of each stats page.',
    default: true,
  },
  {
    id: 'voiceActorLanguage',
    label: 'Remember voice actor language',
    description: 'Keeps the voice actor language you picked on anime and character pages.',
    default: true,
  },
  {
    id: 'rolesSort',
    label: 'Remember role sorting',
    description: 'Keeps the sort order and the "On my list" filter on staff and character pages.',
    default: true,
  },
  {
    id: 'bookmarks',
    label: 'Bookmarks & quick links',
    description: 'Your bookmarks and shortcuts to useful pages, one click away (Alt+B).',
    default: true,
    // Where the bookmark buttons show up
    options: [
      { id: 'bookmarksNav', label: 'Bookmarks menu in the top bar', default: true },
      { id: 'bookmarksHeart', label: 'One-click button next to the heart', default: true },
      { id: 'bookmarksFab', label: 'Floating button on small screens (or when the top bar menu is off)', default: true },
    ],
  },
];

function ahApi() {
  return globalThis.browser ?? globalThis.chrome;
}

function ahDefaultSettings() {
  return Object.fromEntries(
    AH_FEATURES.flatMap(f => [f, ...(f.options || [])]).map(item => [item.id, item.default])
  );
}

async function ahLoadSettings() {
  const { settings } = await ahApi().storage.sync.get('settings');
  return { ...ahDefaultSettings(), ...settings };
}

async function ahSaveSettings(settings) {
  await ahApi().storage.sync.set({ settings });
}
