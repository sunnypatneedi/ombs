/**
 * The domain dimensions — docs/demo/index.html L484-488, CSS L339-367.
 *
 * This is the second half of Ground truth 3: the chips do not just tint, they narrow the page
 * to the half of the standard that fits what the child makes. Three Building picks, so the
 * heading becomes "Building — the half that fits what they make" and the four Building
 * dimensions replace the eight.
 *
 * Each code chip carries its own domain's colour, taken from the anchor. Nothing here is
 * decorative: green means Building.
 */

import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DOMAIN, FONT } from "../tokens";
import { INTERESTS, dimensionsOf } from "../standard";
import { EV, picksAt } from "../script";
import { useAnchorRef } from "../ui/anchors";

export const Dimensions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useAnchorRef("dimensions");

  /**
   * The card set is resolved from the COMPLETED picks, not from this frame's.
   *
   * On the live tool this section holds all eight dimensions until a lean exists and then
   * narrows to four. In this cut it holds four throughout, and that is a rendering constraint
   * rather than an editorial one. Two reasons, in order of weight:
   *
   *   1. The page below the callout is never on screen before the third chip lands — the camera
   *      is at the top of the document for the whole setup sequence — so the eight-card state is
   *      not a shot here. It is only a page height.
   *
   *   2. As a page height it is 270 CSS px of instability, and this composition MEASURES ITS OWN
   *      LAYOUT: the camera and the pointer are both functions of getBoundingClientRect() on
   *      real controls, and those measurements are taken once, when the composition mounts. A
   *      document that is 270px taller at mount than it is at frame 525 puts the footer link
   *      270px away from the pointer that is pressing it — which is exactly what shipped in the
   *      first cut of this video, visible in the encoded file and invisible in a still.
   *
   * The Explorer already reserves floors for the same reason (`glossMin`, `verbatimMin`). This
   * is that rule applied to the rest of the page.
   */
  const picks = picksAt(Number.MAX_SAFE_INTEGER);
  const picked = INTERESTS.filter((i) => picks.includes(i.id));
  const m = picked.filter((p) => p.lean === "M").length;
  const b = picked.filter((p) => p.lean === "B").length;
  const domainId = picked.length === 0 ? null : b > m ? "B" : m > b ? "M" : null;

  const dims = domainId
    ? dimensionsOf(domainId)
    : [...dimensionsOf("M"), ...dimensionsOf("B")];

  const title = domainId
    ? `${domainId === "B" ? "Building" : "Making"} — the half that fits what they make`
    : "The two halves of the standard";
  const sub = domainId
    ? "The shared practices apply to everything. These four add detail for this kind of work."
    : "Pick what they like making above and this narrows to the half that fits. Until then, here are both.";

  const settle = spring({
    frame: frame - EV.chipTaps.comics,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });

  return (
    <div ref={ref} style={{ marginTop: 32 }}>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "-0.5px",
          margin: "0 0 4px",
          color: C.s900,
        }}
      >
        {title}
      </h2>
      <p style={{ color: C.s600, fontSize: 14.4, fontWeight: 500, margin: "0 0 16px" }}>{sub}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 12,
          opacity: domainId ? 0.4 + settle * 0.6 : 1,
        }}
      >
        {dims.map((d) => {
          const dom = (d.anchor.split(".")[1] ?? "S") as keyof typeof DOMAIN;
          const tri = DOMAIN[dom];
          return (
            <div
              key={d.anchor}
              style={{
                background: C.white,
                border: `2px solid ${C.s200}`,
                borderRadius: 16,
                padding: "17.6px 20px",
                boxShadow: "2px 2px 0 rgba(0,0,0,0.04)",
                minWidth: 0,
              }}
            >
              <code
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "2.4px 7.2px",
                  borderRadius: 6,
                  display: "inline-block",
                  background: tri.light,
                  color: tri.dark,
                  border: `1px solid ${tri.border}`,
                }}
              >
                {d.anchor}
              </code>
              <h4 style={{ margin: "8.8px 0 4.8px", fontSize: 15.2, fontWeight: 800, color: C.s900 }}>
                {d.name}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: 13.4,
                  color: C.s600,
                  fontWeight: 500,
                  lineHeight: 1.55,
                }}
              >
                {d.anchorStatement}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
