#!/usr/bin/env node
/**
 * Render both cuts of the /demo promo into docs/promo/.
 *
 *   node scripts/render-promo.mjs            # both cuts
 *   node scripts/render-promo.mjs vertical   # one cut (vertical | wide)
 *
 * The work happens in promo-src/scripts/render.mjs, because that is where @remotion/* is
 * installed. This launcher exists so the command is the same shape as every other script in
 * this repository, and so `node scripts/render-promo.mjs` from the repository root works.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(ROOT, "promo-src", "scripts", "render.mjs");

if (!existsSync(path.join(ROOT, "promo-src", "node_modules"))) {
  console.error("promo-src/node_modules is missing. Run:  cd promo-src && pnpm install");
  process.exit(1);
}

spawn(process.execPath, [target, ...process.argv.slice(2)], { stdio: "inherit" }).on("exit", (c) =>
  process.exit(c ?? 1),
);
