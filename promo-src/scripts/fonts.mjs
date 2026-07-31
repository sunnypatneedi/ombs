/**
 * Stage the typefaces the render needs into promo-src/public/.
 *
 * Plus Jakarta Sans and JetBrains Mono already live in this repository, at video/assets/fonts,
 * because the existing explainer video renders with them. Remotion resolves `staticFile()`
 * against promo-src/public, so the faces have to be reachable from there — but committing a
 * second byte-identical copy would give one typeface two homes, and the day they drift is the
 * day two videos of the same project stop matching.
 *
 * So: one source on disk, copied in before every bundle. promo-src/public/fonts is gitignored.
 */

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SRC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.resolve(SRC_DIR, "..");

const FROM = path.join(ROOT, "video", "assets", "fonts");
const TO = path.join(SRC_DIR, "public", "fonts");

/** Mirrors the FACES list in src/fonts.ts. A missing file here is a fallback face on screen. */
export const FACES = [
  "PlusJakartaSans-400.ttf",
  "PlusJakartaSans-500.ttf",
  "PlusJakartaSans-600.ttf",
  "PlusJakartaSans-700.ttf",
  "PlusJakartaSans-800.ttf",
  "JetBrainsMono-700.ttf",
];

export const stageFonts = () => {
  mkdirSync(TO, { recursive: true });
  let copied = 0;
  for (const f of FACES) {
    const from = path.join(FROM, f);
    const to = path.join(TO, f);
    if (!existsSync(from)) {
      throw new Error(
        `${path.relative(ROOT, from)} is missing. The render needs it; without it every frame ` +
          `silently comes back in a fallback face and nobody checks 600 frames to notice.`,
      );
    }
    if (existsSync(to) && statSync(to).size === statSync(from).size) continue;
    copyFileSync(from, to);
    copied += 1;
  }
  if (copied) console.log(`fonts   · staged ${copied} face${copied === 1 ? "" : "s"} from video/assets/fonts`);
};
