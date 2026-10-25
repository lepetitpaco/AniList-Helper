// Renders the extension icons and the store visuals with Chromium (Playwright).
// Run through store/render.sh (Docker), from anywhere.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const STORE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(STORE);
const url = file => 'file://' + path.join(ROOT, file);
fs.mkdirSync(path.join(STORE, 'build'), { recursive: true });
fs.mkdirSync(path.join(STORE, 'screenshots'), { recursive: true });

const browser = await chromium.launch();

// Manifest icons, transparent background
for (const size of [16, 32, 48, 128]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  const svg = fs.readFileSync(path.join(STORE, 'icon.svg'), 'utf8').replace('<svg ', `<svg width="${size}" height="${size}" `);
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style>${svg}`);
  await page.screenshot({ path: path.join(ROOT, `icons/icon-${size}.png`), omitBackground: true });
  await page.close();
}

// The real extension popup, with a mocked browser API
const popup = await browser.newPage({ viewport: { width: 320, height: 600 }, deviceScaleFactor: 2 });
await popup.addInitScript(() => {
  const area = data => ({
    get: async key => (key in data ? { [key]: data[key] } : {}),
    set: async items => Object.assign(data, items),
  });
  window.chrome = {
    storage: { sync: area({}), local: area({}), onChanged: { addListener() {} } },
  };
});
await popup.goto(url('popup.html'));
await popup.waitForTimeout(300);
const height = await popup.evaluate(() => document.body.scrollHeight);
await popup.screenshot({ path: path.join(STORE, 'build/popup.png'), clip: { x: 0, y: 0, width: 320, height } });
await popup.close();

// Store scenes
const scenes = [
  ['hero', 1280, 800, 'screenshots/1-your-anilist-remembered.png'],
  ['filters', 1280, 800, 'screenshots/2-shareable-filters.png'],
  ['bookmarks', 1280, 800, 'screenshots/3-bookmarks.png'],
  ['preferences', 1280, 800, 'screenshots/4-remembered-preferences.png'],
  ['popup', 1280, 800, 'screenshots/5-settings.png'],
  ['promo', 440, 280, 'promo-small-440x280.png'],
  ['marquee', 1400, 560, 'promo-marquee-1400x560.png'],
];
for (const [scene, width, height, out] of scenes) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url('store/scenes.html') + '#' + scene);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(STORE, out) });
  await page.close();
}

await browser.close();
console.log('rendered');
