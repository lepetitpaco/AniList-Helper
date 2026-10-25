#!/bin/bash
# Génère packages/anilist-helper-chrome.zip et packages/anilist-helper-firefox.zip
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

mkdir -p packages
for browser in chrome firefox; do
  tmp="$(mktemp -d)"
  cp "manifest-$browser.json" "$tmp/manifest.json"
  cp -r src icons popup.html popup.js background.js "$tmp/"
  rm -f "packages/anilist-helper-$browser.zip"
  (cd "$tmp" && zip -qr - .) > "packages/anilist-helper-$browser.zip"
  rm -rf "$tmp"
  echo "packages/anilist-helper-$browser.zip"
done
