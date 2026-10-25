// Takes real screenshots of anilist.co with the extension loaded (Chromium, new headless
// mode, which supports extensions). The store scenes (scenes.html) frame these captures.
// Run through store/render.sh (Docker). `ONLY=bookmarks,stats store/render.sh` retakes
// some captures only.
//
// AniList rate limits aggressively (Cloudflare error 1015): pages are loaded one at a
// time with a pause in between, and the script stops as soon as it gets rate limited.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';

const STORE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(STORE);
const OUT = path.join(STORE, 'captures');
const USER = 'lepetitpaco';
const PAUSE = 8000;
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',')) : null;
fs.mkdirSync(OUT, { recursive: true });

// Chrome build of the extension in a temporary folder
const extension = fs.mkdtempSync(path.join(os.tmpdir(), 'ext-'));
for (const item of ['src', 'icons', 'popup.html', 'popup.js', 'background.js']) {
  fs.cpSync(path.join(ROOT, item), path.join(extension, item), { recursive: true });
}
fs.copyFileSync(path.join(ROOT, 'manifest-chrome.json'), path.join(extension, 'manifest.json'));

const context = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(), 'profile-')), {
  channel: 'chromium',
  headless: true,
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
  colorScheme: 'dark',
  // AniList serves its mobile layout to "HeadlessChrome"
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
  args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
});

// Only AniList and its fonts: no ads, no trackers in the screenshots
await context.route('**/*', route => {
  const host = new URL(route.request().url()).hostname;
  const allowed = /(^|\.)anilist\.co$|(^|\.)anili\.st$|fonts\.(googleapis|gstatic)\.com$/.test(host);
  return allowed ? route.continue() : route.abort();
});
// Dark theme, as most screenshots of the site
await context.addInitScript(() => {
  try { localStorage.setItem('site-theme', 'dark'); } catch {}
});

let [worker] = context.serviceWorkers();
if (!worker) worker = await context.waitForEvent('serviceworker');
const extensionId = new URL(worker.url()).host;

const page = context.pages()[0] || (await context.newPage());
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function open(url, ready) {
  await sleep(PAUSE);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  if (await page.getByText('You are being rate limited').count()) {
    throw new Error(`Rate limited by AniList on ${url}: wait a while before running again`);
  }
  if (ready) {
    await page.waitForSelector(ready, { timeout: 30000 }).catch(async error => {
      await page.screenshot({ path: path.join(OUT, 'debug.png') });
      throw error;
    });
  }
  await page.waitForTimeout(1500);
}

async function shot(name) {
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log('captured', name);
}

async function scrollTo(selector, offset = 20) {
  await page.evaluate(([sel, off]) => {
    const el = document.querySelector(sel);
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off);
  }, [selector, offset]);
  await page.waitForTimeout(500);
}

const steps = {
  // Filtered list from a shared link
  async list() {
    await open(`https://anilist.co/user/${USER}/animelist?format=TV&genres=Action,Comedy&sort=score`, '.medialist .entry .title a');
    await scrollTo('.medialist', 70);
    await shot('list-filters');
  },

  // Planning list, still airing, by popularity
  async planning() {
    await open(`https://anilist.co/user/${USER}/animelist/Planning?status=RELEASING&sort=popularity`, '.medialist .entry .title a');
    await scrollTo('.medialist', 70);
    await shot('list-planning');
  },

  // One click next to the heart on a few pages, then the panel from the top bar
  async bookmarks() {
    for (const url of [
      'https://anilist.co/staff/95185/',
      'https://anilist.co/character/40/',
      'https://anilist.co/anime/21/',
      'https://anilist.co/anime/16498/',
    ]) {
      await open(url, '.ah-bookmark-button');
      await page.click('.ah-bookmark-button');
      await page.waitForTimeout(400);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('.ah-nav-link');
    await shot('bookmarks-panel');
    await page.keyboard.press('Escape');
  },

  // Voice actor language, picked in AniList's own menu
  async voices() {
    await open('https://anilist.co/anime/21/characters', '.media-characters .el-select');
    await page.click('.media-characters .el-select');
    await page.waitForTimeout(400);
    await page.click('.el-select-dropdown__item:has-text("French")');
    await scrollTo('.media-characters', 90);
    await shot('voice-actors');
  },

  // Stats sorting
  async stats() {
    await open(`https://anilist.co/user/${USER}/stats/anime/genres`, 'text=Mean Score');
    await page.getByText('Mean Score', { exact: true }).first().click();
    await page.waitForTimeout(800);
    await scrollTo('.content.container', 20);
    await shot('stats');
  },

  // Settings popup (no network)
  async popup() {
    const popup = await context.newPage();
    await popup.setViewportSize({ width: 320, height: 760 });
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await popup.waitForTimeout(500);
    const height = await popup.evaluate(() => document.body.scrollHeight);
    await popup.screenshot({ path: path.join(OUT, 'popup.png'), clip: { x: 0, y: 0, width: 320, height } });
    await popup.close();
    console.log('captured popup');
  },
};

try {
  for (const [name, step] of Object.entries(steps)) {
    if (!ONLY || ONLY.has(name)) await step();
  }
} finally {
  await context.close();
}
