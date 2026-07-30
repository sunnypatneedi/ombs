#!/usr/bin/env bash
#
# Runs automatically after a task branch is merged into main.
#
# The repo root is a plain static site -- server.js has no dependencies and
# there is deliberately no root package.json, because this repo publishes to
# GitHub Pages and a stray root manifest would be noise. Everything that needs
# installing lives in a self-contained subproject with its own lockfile.
#
# Keep this idempotent, non-interactive and fast: it runs while the user waits,
# and stdin is closed, so anything that prompts will fail on EOF.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# A merged task can add, remove or rename a subproject, so probe rather than
# assume. Add new entries here when a subproject with a manifest appears.
projects=(
  video
  artifacts/mockup-sandbox
)

for project in "${projects[@]}"; do
  if [ ! -f "$project/package.json" ]; then
    echo "==> skip $project (no package.json)"
    continue
  fi

  if [ ! -f "$project/package-lock.json" ]; then
    echo "==> npm install in $project (no lockfile)"
    ( cd "$project" && npm install --no-audit --no-fund )
    continue
  fi

  # npm ci is exact and reproducible, but it wipes node_modules first, so only
  # pay that cost when the installed tree does not match the lockfile.
  #
  # Compare a hash of the lockfile against a stamp written after the last
  # successful install. Do NOT compare mtimes: node_modules' directory mtime
  # changes for unrelated reasons and can tie at filesystem granularity, so it
  # both misses real changes and triggers spurious reinstalls.
  stamp="$project/node_modules/.post-merge-lock-hash"
  want="$(sha256sum "$project/package-lock.json" | cut -d' ' -f1)"
  have="$(cat "$stamp" 2>/dev/null || true)"

  if [ -d "$project/node_modules" ] && [ "$want" = "$have" ]; then
    echo "==> $project already up to date"
    continue
  fi

  echo "==> npm ci in $project"
  ( cd "$project" && npm ci --no-audit --no-fund )
  # Written only after a clean install, so an aborted run reinstalls next time.
  printf '%s\n' "$want" > "$stamp"
done

echo "post-merge setup complete"
