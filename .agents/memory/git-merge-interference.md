---
name: Git merge/rebase interference in the Replit workspace
description: Merges here can be silently interrupted — MERGE_HEAD dropped, or a rebase onto origin/main auto-started underneath you. How to detect and recover.
---

# Git merge/rebase interference

Multi-step git merges in this workspace are not reliably atomic. Observed failure modes:

1. **`MERGE_HEAD` disappears mid-merge.** A `git pull` conflicts, but by the time you run
   `checkout --ours` / `add` / `commit`, the merge state is gone. The commit then records
   **one parent instead of two** and often contains **zero file changes** — an empty commit
   that silently leaves the branch still diverged.
2. **A rebase gets auto-started underneath you**, replaying every local commit onto
   `origin/main`. Symptoms: `.git/rebase-merge/` exists, HEAD is detached at origin/main,
   files you already resolved re-appear as `AA` (both added), and working-tree files contain
   raw `<<<<<<<` conflict markers that are NOT in the committed version.

## How to apply

- **Prefer a single-command merge** so there is no window to interfere:
  `git merge -X theirs origin/main -m "..."`, then fix any over-taken files in a normal
  follow-up commit. Avoid multi-step conflict resolution when it can be avoided.
- **Always verify a merge actually happened** — a merge commit must show two `parent` lines:
  `git cat-file -p HEAD | head -4`
- **Distinguish committed state from working-tree scratch state.** `cat file` can show
  conflict markers while `git show HEAD:file` is clean. Trust `git show HEAD:<path>`.
- **`git status` counts lie during a rebase.** HEAD is detached at the rebase `onto` target,
  so `git rev-list --left-right --count origin/main...HEAD` compares origin/main to itself
  and reports `0 0`. Check `ls -d .git/rebase-merge` before believing any ahead/behind count.
- **Recovery is cheap:** `.git/rebase-merge/orig-head` holds the pre-rebase commit and the
  branch ref itself is left undamaged. `git rebase --abort` restores it; if that errors,
  `git rebase --quit && git checkout -f <branch>` reaches the same place.

**Why:** these interruptions come from the workspace's own git-safety/checkpoint tooling, not
from anything in the repo, so nothing in the code explains them and they recur unpredictably.

## Related: pushes are blocked from the main agent

`git push` (and other writes) fail from the agent with "Destructive git operations are not
allowed in the main agent." The user must push from their own terminal or the Git pane.
A shallow/grafted clone (`.git/shallow` present, merge-base shown as `(grafted)`) also makes
merge bases unreliable — `git fetch --unshallow origin` first.
