/**
 * The standing callout — docs/demo/index.html L479-482, CSS L328-336.
 *
 * Ground truth 8. It is not a disclaimer the video appends at the end; it is a permanent block
 * on the page, and the only 4px ink border anywhere in the tool. It carries no domain colour
 * because it belongs to no domain.
 *
 * The body personalises with the name (L694), which is why the sentence about not placing a
 * child against other children says "Lio" by the time the camera reaches it.
 */

import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../tokens";
import { who } from "../script";
import { useAnchorRef } from "../ui/anchors";
import { useFormat } from "./format";

export const NotAScore: React.FC = () => {
  const frame = useCurrentFrame();
  const { calloutMin } = useFormat();
  const ref = useAnchorRef("notascore");
  const name = who(frame);

  return (
    <div
      ref={ref}
      style={{
        background: C.white,
        border: `4px solid ${C.s900}`,
        borderRadius: 20,
        padding: "20px 24px",
        marginTop: 24,
        boxShadow: "4px 4px 0 rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ margin: "0 0 6.4px", fontSize: 16.8, fontWeight: 800, color: C.s900 }}>
        This is not a score, and OMBS never produces one.
      </h3>
      {/* Floor reserved for the pre-name wording, which is the longer one ("your child" vs
          "Lio") and therefore the taller. Everything below this block is placed by measured
          layout; a callout that loses a line when the name is typed moves the footer. */}
      <p
        style={{
          margin: 0,
          minHeight: calloutMin,
          fontSize: 14.4,
          color: C.s700,
          fontWeight: 500,
          lineHeight: 1.6,
        }}
      >
        OMBS records that a practice happened, tied to real work — never how well, never a level,
        never a rank. Nothing here places {name} against other children, and nothing here is a test.
      </p>
    </div>
  );
};
