/**
 * Bundle the compositions without rendering anything.
 *
 * This is the cheap gate: it type-resolves and webpack-builds the whole project, so a broken
 * import, a missing static file or a component that throws on mount fails here in ~20s rather
 * than 12 minutes into a render.
 *
 *   node scripts/bundle.mjs
 */

import { bundle } from "@remotion/bundler";
import { stageFonts } from "./fonts.mjs";
import { selectComposition } from "@remotion/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

stageFonts();
const serveUrl = await bundle({ entryPoint: path.join(root, "src", "index.ts") });
console.log(`bundled → ${serveUrl}`);

for (const id of ["DemoPromoVertical", "DemoPromoWide"]) {
  const c = await selectComposition({ serveUrl, id, inputProps: {} });
  console.log(
    `  ${c.id.padEnd(20)} ${c.width}×${c.height}  ${c.durationInFrames} frames @ ${c.fps}fps  ` +
      `= ${(c.durationInFrames / c.fps).toFixed(2)}s`,
  );
}
