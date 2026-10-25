#!/bin/bash
# Takes the real AniList captures, then renders icons/icon-*.png and the store visuals
# (Chromium in Docker, nothing to install locally).
#   store/render.sh                  everything
#   ONLY=stats,popup store/render.sh  some captures only, then the visuals
#   NO_CAPTURE=1 store/render.sh      visuals only, from the existing captures
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
docker run --rm -e ONLY -e NO_CAPTURE -v "$ROOT":/ext -w /tmp mcr.microsoft.com/playwright:v1.50.0-noble sh -c '
  npm i -s playwright@1.50.0 >/dev/null 2>&1 || exit 1
  for script in capture render; do
    cp /ext/store/$script.mjs /tmp/$script.mjs
    sed -i "s#^const STORE = .*#const STORE = \"/ext/store\";#" /tmp/$script.mjs
  done
  if [ -z "$NO_CAPTURE" ]; then node /tmp/capture.mjs || exit 1; fi
  node /tmp/render.mjs
'
