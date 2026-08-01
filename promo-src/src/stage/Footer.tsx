/**
 * The footer — docs/demo/index.html L490-493, CSS L369-374.
 *
 * Ground truth 7. The count sentence is not typed here; it is assembled by `builtLine()` from
 * standards.json using the demo's own arithmetic, so if the standard grows the video's number
 * is wrong only in the sense that it needs a re-render, never in the sense that it lied.
 *
 * The link is the demo's own, including its wording. It is what the pointer presses at the end.
 */

import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../tokens";
import { builtLine } from "../standard";
import { ctaHovered } from "../script";
import { useAnchorRef } from "../ui/anchors";

export const Footer: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useAnchorRef("footer");
  const ctaRef = useAnchorRef("cta");
  const hovered = ctaHovered(frame);

  return (
    <div
      ref={ref}
      style={{
        margin: "48px 0 56px",
        paddingTop: 22.4,
        borderTop: `2px solid ${C.s200}`,
        fontSize: 13.4,
        color: C.s500,
        fontWeight: 500,
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: 8 }}>{builtLine()}</div>
      <div>
        Free to use, adapt and share under CC BY-SA 4.0 ·{" "}
        <span
          ref={ctaRef}
          style={{
            color: C.blue,
            fontWeight: 600,
            // The demo underlines on hover (L50). Instant, because a hover state that fades in
            // reads as lag.
            textDecoration: hovered ? "underline" : "none",
            textUnderlineOffset: 2,
          }}
        >
          explore the open standard
        </span>
      </div>
    </div>
  );
};
