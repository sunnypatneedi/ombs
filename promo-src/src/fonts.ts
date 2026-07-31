/**
 * Fonts are loaded from files vendored in this repo (video/assets/fonts, copied to
 * promo-src/public/fonts) rather than from a CDN. A render that reaches the network for type
 * is a render that can silently come back in a fallback face, and nobody looks at 600 frames
 * to notice.
 *
 * `delayRender` holds every frame until the faces are ready, so frame 0 is never the fallback.
 */

import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

const FACES: { family: string; file: string; weight: string }[] = [
  { family: "Plus Jakarta Sans", file: "PlusJakartaSans-400.ttf", weight: "400" },
  { family: "Plus Jakarta Sans", file: "PlusJakartaSans-500.ttf", weight: "500" },
  { family: "Plus Jakarta Sans", file: "PlusJakartaSans-600.ttf", weight: "600" },
  { family: "Plus Jakarta Sans", file: "PlusJakartaSans-700.ttf", weight: "700" },
  { family: "Plus Jakarta Sans", file: "PlusJakartaSans-800.ttf", weight: "800" },
  { family: "JetBrains Mono", file: "JetBrainsMono-700.ttf", weight: "700" },
];

let started = false;

export const loadFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("Loading Plus Jakarta Sans + JetBrains Mono");
  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)})`, {
        weight: f.weight,
        style: "normal",
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
};
