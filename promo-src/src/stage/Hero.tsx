/**
 * The demo's hero, word for word (docs/demo/index.html L430-433; CSS L116-130).
 *
 * "making" carries Making orange and "building" carries Building green, in the -dark shades the
 * demo uses so both clear AA on the --bg field. That pairing is the first thing the page teaches
 * and the video does not get to restate it in its own words.
 *
 * The subline is the tool's own privacy sentence — Ground truth 9.
 */

import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../tokens";
import { useAnchorRef } from "../ui/anchors";
import { useBreak, useFormat } from "./format";

export const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cssW } = useFormat();
  const { under700 } = useBreak();
  const ref = useAnchorRef("hero");

  // The one page-load reveal in the piece. Everything after this is caused by the pointer.
  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 26 });
  const sub = spring({ frame: frame - 8, fps, config: { damping: 200 }, durationInFrames: 26 });

  const h1 = Math.min(Math.max(32, cssW * 0.05), 52);

  return (
    <div
      ref={ref}
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: under700 ? "32px 0 24px" : "48px 0 32px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: h1,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: "-1px",
          textWrap: "balance",
          margin: "0 0 19.2px",
          color: C.s900,
          opacity: rise,
          transform: `translateY(${(1 - rise) * 10}px)`,
        }}
      >
        What does <span style={{ color: C.orangeDark }}>making</span> and{" "}
        <span style={{ color: C.greenDark }}>building</span> well look like at your child&rsquo;s age?
      </h1>
      <p
        style={{
          margin: 0,
          fontSize: 17.6,
          color: C.s600,
          fontWeight: 500,
          lineHeight: 1.65,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 8}px)`,
        }}
      >
        Grounded in the open OMBS standard. Free, no account, nothing saved.
      </p>
    </div>
  );
};
