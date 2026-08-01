/**
 * The done state. The press on the footer link resolves here.
 *
 * Four lines, and every one of them is checkable against the tool itself:
 *   · the masthead and version — standards.json
 *   · the address — where the demo is served from
 *   · "never a score, never a level, never a rank" — the standing callout, Ground truth 8
 *   · "nothing saved · no account · the name never leaves your browser" — Ground truth 9
 *   · the licence — the demo's own footer line
 *
 * No button, no offer, no waitlist. OMBS has nothing to sign up for and the video is not going
 * to imply that it does.
 */

import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../tokens";
import { VERSION } from "../standard";
import { EV } from "../script";
import { useFormat } from "./format";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cssW, cssH, safe } = useFormat();

  const rise = spring({
    frame: frame - EV.endEnter,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  if (rise <= 0.001) return null;

  const line = (i: number) =>
    spring({
      frame: frame - EV.endEnter - 4 - i * 4,
      fps,
      config: { damping: 200 },
      durationInFrames: 22,
    });

  // The two cuts get the same five lines in the same order, sized for the room each one has.
  // The phone cut has 960 CSS px of height for a block that is 330 tall at desktop sizes, so
  // it takes a bigger promise line and a wider rhythm rather than floating in a field of grey.
  const portrait = cssH > cssW;
  const g = portrait ? 1.7 : 1.15; // vertical rhythm multiplier
  const logo = portrait ? 60 : 52;
  const urlSize = Math.min(Math.max(19, cssW * 0.048), 34);
  const promiseSize = Math.min(Math.max(16, cssW * (portrait ? 0.046 : 0.032)), portrait ? 26 : 28);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: cssW,
        height: cssH,
        background: C.bg,
        opacity: rise,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: safe + 12,
        boxSizing: "border-box",
        textAlign: "center",
        zIndex: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: line(0),
          transform: `translateY(${(1 - line(0)) * 10}px)`,
        }}
      >
        <div
          style={{
            width: logo,
            height: logo,
            background: C.s900,
            color: C.white,
            borderRadius: logo / 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: logo * 0.233,
            letterSpacing: "-0.5px",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.1)",
          }}
        >
          OMBS
        </div>
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: portrait ? 22 : 19,
              letterSpacing: "-0.4px",
              color: C.s900,
            }}
          >
            Open Making &amp; Building Standard
          </div>
          <div style={{ marginTop: 3.2 }}>
            <span
              style={{
                background: C.s200,
                color: C.s700,
                fontSize: portrait ? 13 : 11.5,
                fontWeight: 700,
                padding: "2.4px 8px",
                borderRadius: 20,
              }}
            >
              v{VERSION}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 30 * g,
          fontFamily: FONT.mono,
          fontSize: urlSize,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: C.s900,
          background: C.white,
          border: `2px solid ${C.s200}`,
          borderRadius: 16,
          padding: "14px 20px",
          boxShadow: "4px 4px 0 rgba(0,0,0,0.06)",
          maxWidth: "100%",
          overflowWrap: "anywhere",
          opacity: line(1),
          transform: `translateY(${(1 - line(1)) * 12}px)`,
        }}
      >
        sunnypatneedi.github.io/ombs/demo/
      </div>

      <div
        style={{
          marginTop: 26 * g,
          fontSize: promiseSize,
          fontWeight: 800,
          color: C.s900,
          letterSpacing: "-0.3px",
          maxWidth: portrait ? 460 : 620,
          textWrap: "balance",
          opacity: line(2),
          transform: `translateY(${(1 - line(2)) * 10}px)`,
        }}
      >
        Never a score, never a level, never a rank.
      </div>

      <div
        style={{
          marginTop: 12 * g,
          fontSize: portrait ? 16.8 : 15.2,
          fontWeight: 500,
          color: C.s600,
          lineHeight: 1.6,
          maxWidth: 560,
          textWrap: "balance",
          opacity: line(3),
        }}
      >
        Nothing saved · no account · the name never leaves your browser
      </div>

      <div
        style={{
          marginTop: 22 * g,
          fontSize: portrait ? 14 : 13,
          fontWeight: 500,
          color: C.s500,
          opacity: line(4),
        }}
      >
        Free to use, adapt and share under CC BY-SA 4.0
      </div>
    </div>
  );
};
