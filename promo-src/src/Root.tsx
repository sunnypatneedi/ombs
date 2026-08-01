import React from "react";
import { Composition } from "remotion";
import { Promo } from "./Promo";
import { DURATION, FPS, VERTICAL, WIDE } from "./tokens";
import { loadFonts } from "./fonts";

loadFonts();

/**
 * Two cuts of one video. They share every component, the whole script and all the copy; what
 * differs is the width of the viewport being recreated, which is the only honest difference
 * between a phone and a desktop looking at the same page.
 *
 * `withAudio` stays false until the operator has run `scripts/gen-vo.mjs`. `scripts/render-promo.mjs`
 * passes it as true once `docs/promo/vo.mp3` exists, because Remotion cannot mount a
 * `staticFile` that is not on disk.
 */

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="DemoPromoVertical"
      component={Promo}
      durationInFrames={DURATION}
      fps={FPS}
      width={VERTICAL.width}
      height={VERTICAL.height}
      defaultProps={{ format: VERTICAL, withAudio: false }}
    />
    <Composition
      id="DemoPromoWide"
      component={Promo}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDE.width}
      height={WIDE.height}
      defaultProps={{ format: WIDE, withAudio: false }}
    />
  </>
);
