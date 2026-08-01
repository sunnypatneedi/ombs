/**
 * Render a contact sheet of stills, one per named moment in the script, for both formats.
 * The point is to look at them. `remotion still` re-bundles per call, so this bundles once
 * and reuses it.
 *
 *   node scripts/stills.mjs            # every moment, both formats
 *   node scripts/stills.mjs 0 120 300  # specific frames
 */

import { bundle } from "@remotion/bundler";
import { stageFonts } from "./fonts.mjs";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const MOMENTS = [
  [12, "open"],
  [70, "name-tap"],
  [120, "name-typed"],
  [170, "chip-robots"],
  [236, "chip-capped"],
  [250, "chips-settled"],
  [268, "scrolling"],
  [290, "tab-press"],
  [330, "tab-settled"],
  [366, "thumb-grab"],
  [378, "drag-mid"],
  [398, "drag-912"],
  [440, "drag-68"],
  [492, "notascore"],
  [520, "cta-hover"],
  [536, "cta-press"],
  [580, "end"],
];

const argFrames = process.argv.slice(2).map(Number).filter((n) => Number.isFinite(n));
const moments = argFrames.length ? argFrames.map((f) => [f, `f${f}`]) : MOMENTS;

const outDir = path.join(root, "out", "stills");
mkdirSync(outDir, { recursive: true });

console.log("bundling…");
stageFonts();
const serveUrl = await bundle({ entryPoint: path.join(root, "src", "index.ts") });

for (const id of ["DemoPromoVertical", "DemoPromoWide"]) {
  const tag = id === "DemoPromoVertical" ? "v" : "w";
  const composition = await selectComposition({ serveUrl, id, inputProps: {} });
  for (const [frame, name] of moments) {
    const output = path.join(outDir, `${tag}-${String(frame).padStart(3, "0")}-${name}.png`);
    await renderStill({ composition, serveUrl, output, frame, imageFormat: "png", overwrite: true });
    console.log(`  ${path.basename(output)}`);
  }
}

console.log(`\n${moments.length * 2} stills in ${outDir}`);
