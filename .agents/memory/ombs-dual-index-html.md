---
name: OMBS has two divergent index.html copies
description: The repo root and docs/ each hold a separate hand-maintained copy of the viewer page; only docs/ is published, and edits to one never reach the other.
---

# Two divergent copies of the viewer page

`index.html` (repo root) and `docs/index.html` are **not** generated from a shared
source and are **not** kept in sync by anything. They are two hand-maintained
copies of the same page that have drifted apart.

- **`docs/index.html` is the published one.** GitHub Pages serves this repo from
  `/docs`, so this is what visitors at `https://sunnypatneedi.github.io/ombs`
  actually get.
- **The root copy is what the local preview shows.** `server.js` serves from the
  repo root, so `/` in the Replit preview renders the *root* copy.

**Why this matters:** the local preview does not reflect what is published. A fix
verified in preview can be absent from the live site, and vice versa.

Observed drift (they differ by more than their fetch paths):

- The docs copy resolves its version badge from the data at runtime
  (`vBadge.textContent = 'v' + standardsData.version`). The root copy has a
  hardcoded badge with no `id`, so it is frozen at whatever was typed.
- Their `fetch()` paths differ by necessity: the root copy requests
  `/standards.json` (which `server.js` rewrites to the newest version
  directory), the docs copy requests `./standards.json` (a committed copy that
  sits beside it in `docs/`).

**How to apply:** when changing the viewer page, decide explicitly whether the
change belongs in one copy or both, and say which. Never assume editing one
propagates. When verifying a fix that will be published, check `docs/` directly
(e.g. request `/docs/` from the local server) rather than trusting `/`.

Related trap: version strings are hardcoded in several places in both copies
(the About block and the citation snippet), independent of the version the data
declares. Grep for `v0\.` across both files before claiming a version bump is
complete.
