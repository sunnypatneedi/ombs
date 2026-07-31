/**
 * The explorer — docs/demo/index.html L451-477, CSS L193-321.
 *
 * Six practice tabs (Ground truth 4), a four-band slider (Ground truth 5), and the standard's
 * verbatim descriptor with its component code (Ground truth 6). All three read from
 * standards.json; none of the text on this panel is authored for the video except the
 * plain-English line, which the panel labels as such in the demo's own words.
 *
 * The selected-tab pill is a single element that travels between measured tab positions, which
 * is what the demo's class swap looks like once it has a frame axis to move along.
 */

import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../tokens";
import { mix } from "../color";
import { BANDS, GLOSS, PRACTICES, componentsFor, practice } from "../standard";
import {
  CHILD_AGE,
  EV,
  HOME_BAND,
  bandAt,
  dragPointer,
  lastSwap,
  practiceAt,
  press,
  sliderHeld,
  who,
} from "../script";
import { useAnchorRef, useAnchors, useRegister } from "../ui/anchors";
import { useBreak, useFormat } from "./format";

/** The demo's slider geometry (L256-276): 24px thumb on a 6px track inside a 32px hit area. */
export const THUMB = 24;
export const TRACK_H = 6;
export const TRACK_BOX = 32;

export const Explorer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cssW, glossMin, verbatimMin } = useFormat();
  const { under700 } = useBreak();
  const anchors = useAnchors();
  const register = useRegister();

  const explorerRef = useAnchorRef("explorer");
  // The band heading is the camera's anchor for the whole explorer beat: it is the largest
  // thing on the panel that the slider rewrites, so a frame that cuts it off shows the drag
  // without showing what the drag does.
  const exbandRef = useAnchorRef("exband");
  const troughRef = useAnchorRef("tabtrough");
  const trackRef = useAnchorRef("track");
  const thumbRef = useAnchorRef("thumb");

  const anchor = practiceAt(frame);
  const dim = practice(anchor);
  const band = bandAt(frame);
  const bandId = BANDS[band].id;
  const comps = componentsFor(anchor, bandId);
  const gloss = GLOSS[anchor]?.[bandId] ?? dim.anchorStatement;
  const name = who(frame);

  const swap = lastSwap(frame);
  const swapIn =
    swap < 0
      ? 1
      : spring({ frame: frame - swap, fps, config: { damping: 200 }, durationInFrames: 16 });

  const tabPress = press(frame, EV.tabTap);
  const held = sliderHeld(frame);

  // The travelling pill. Both tab rects are measured, so the pill lands on the tab rather than
  // on a number that happened to be right at one width.
  const trough = anchors["tabtrough"];
  const fromTab = anchors["tabbox:OMBS.S.DF"];
  const toTab = anchors["tabbox:OMBS.S.AI"];
  const slide = spring({
    frame: frame - EV.tabTap,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const pill =
    trough && fromTab && toTab
      ? {
          x: fromTab.x + (toTab.x - fromTab.x) * slide - trough.x,
          y: fromTab.y + (toTab.y - fromTab.y) * slide - trough.y,
          w: fromTab.w + (toTab.w - fromTab.w) * slide,
          h: fromTab.h,
        }
      : null;

  // Slider: the pointer moves freely, the value snaps. Both are drawn.
  const track = anchors["track"];
  const usable = track ? track.w - THUMB : 0;
  const thumbLeft = (usable * band) / 3;

  const exbandSize = Math.min(Math.max(28, cssW * 0.04), 36);
  const glossSize = Math.min(Math.max(18.4, cssW * 0.024), 22.4);

  return (
    <div
      ref={explorerRef}
      style={{
        background: C.white,
        border: `2px solid ${C.s200}`,
        borderRadius: under700 ? 24 : 32,
        padding: under700 ? "24px 20px" : 32,
        boxShadow: "4px 4px 0 rgba(0,0,0,0.04)",
        marginTop: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: C.blue,
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 17.6,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          S
        </div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: C.s900 }}>
            Shared Practices
          </h2>
          <div style={{ fontSize: 12.8, color: C.s500, fontWeight: 500, marginTop: 1.6 }}>
            Slide through the grade bands · {name} is {CHILD_AGE}
          </div>
        </div>
      </div>

      <div
        ref={exbandRef}
        style={{
          fontSize: exbandSize,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: "-0.6px",
          textWrap: "balance",
          marginBottom: 22.4,
          color: C.s900,
        }}
      >
        <span style={{ display: "inline-block", opacity: swapIn }}>Grades {BANDS[band].label}</span>
        <small
          style={{
            fontFamily: FONT.sans,
            fontSize: 13.6,
            fontWeight: 500,
            color: C.s500,
            letterSpacing: 0,
            display: "block",
            marginTop: 5.6,
            lineHeight: 1.5,
            opacity: swapIn,
          }}
        >
          {BANDS[band].ages} · how this practice grows as they get older
        </small>
      </div>

      {/* ── practice tabs ─────────────────────────────────────────────────── */}
      <div
        ref={troughRef}
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          rowGap: 4,
          width: "fit-content",
          maxWidth: "100%",
          background: C.s100,
          padding: 6,
          borderRadius: 20,
          marginBottom: 25.6,
        }}
      >
        {pill ? (
          <div
            style={{
              position: "absolute",
              left: pill.x,
              top: pill.y,
              width: pill.w,
              height: pill.h,
              background: C.white,
              borderRadius: 14,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          />
        ) : null}

        {PRACTICES.map((d) => {
          const p = d.anchor === "OMBS.S.AI" ? tabPress : 0;
          // Ink crossfades with the pill so the label under it is never the wrong weight of grey.
          const lit =
            d.anchor === "OMBS.S.AI" ? slide : d.anchor === "OMBS.S.DF" ? 1 - slide : 0;
          return (
            <div
              key={d.anchor}
              ref={(el) => register(`tabbox:${d.anchor}`, el)}
              style={{
                position: "relative",
                fontFamily: FONT.sans,
                fontSize: 13.4,
                fontWeight: 700,
                padding: "8px 17.6px",
                borderRadius: 14,
                color: mix(C.s600, C.s900, lit),
                whiteSpace: "nowrap",
                transform: `scale(${1 - p * 0.04})`,
              }}
            >
              {d.name}
            </div>
          );
        })}
      </div>

      {/* ── four-band slider ──────────────────────────────────────────────── */}
      <div style={{ position: "relative", margin: "0 4px 8px" }}>
        <div
          ref={trackRef}
          style={{ position: "relative", height: TRACK_BOX, margin: "6px 0" }}
        >
          <div
            style={{
              position: "absolute",
              top: (TRACK_BOX - TRACK_H) / 2,
              left: 0,
              right: 0,
              height: TRACK_H,
              background: C.s200,
              borderRadius: 20,
            }}
          />
          <div
            ref={thumbRef}
            style={{
              position: "absolute",
              top: (TRACK_BOX - THUMB) / 2,
              left: thumbLeft,
              width: THUMB,
              height: THUMB,
              borderRadius: 8,
              background: C.s900,
              border: `3px solid ${C.white}`,
              boxSizing: "border-box",
              // Resting ring is the demo's; the wider ring is the grabbed state.
              boxShadow: held
                ? `0 0 0 2px ${C.s900}, 0 0 0 6px rgba(15,23,42,0.14)`
                : `0 0 0 2px ${C.s900}`,
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, gap: 4 }}>
          {BANDS.map((b, i) => (
            <span
              key={b.id}
              style={{
                fontSize: 12.8,
                // `.here` marks the child's own band, and it never moves while the slider does.
                color: i === HOME_BAND ? C.s900 : C.s500,
                fontWeight: i === HOME_BAND ? 800 : 700,
              }}
            >
              {b.label}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "inline-block",
            marginTop: 12,
            background: C.s100,
            color: C.s900,
            fontSize: 12.8,
            fontWeight: 700,
            padding: "4.8px 12.8px",
            borderRadius: 20,
          }}
        >
          {band === HOME_BAND
            ? `▲ ${name} is in this band`
            : `${name}'s band is ${BANDS[HOME_BAND].label} — you're looking at ${BANDS[band].label}`}
        </div>
      </div>

      {/* ── what it says ──────────────────────────────────────────────────── */}
      <div
        style={{
          fontSize: glossSize,
          fontWeight: 600,
          lineHeight: 1.5,
          color: C.s900,
          textWrap: "pretty",
          margin: "24px 0 20px",
          minHeight: glossMin,
          opacity: swapIn,
          transform: `translateY(${(1 - swapIn) * 6}px)`,
        }}
      >
        {gloss}
      </div>

      <div
        style={{
          background: C.s50,
          border: `2px solid ${C.s100}`,
          borderRadius: 12,
          padding: "16px 17.6px",
          minHeight: verbatimMin,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 11.2,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: C.s500,
            fontWeight: 700,
            marginBottom: 9.6,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          In the standard&rsquo;s own words
          <code
            style={{
              fontFamily: FONT.mono,
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: 0,
              background: C.blueLight,
              color: C.blueDark,
              border: `1px solid ${C.blueBorder}`,
              padding: "2.4px 7.2px",
              borderRadius: 6,
              textTransform: "none",
              opacity: swapIn,
            }}
          >
            {comps.map((c) => c.id).join(" · ")}
          </code>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 15.2,
            color: C.s700,
            fontWeight: 500,
            lineHeight: 1.6,
            whiteSpace: "pre-line",
            opacity: swapIn,
            transform: `translateY(${(1 - swapIn) * 5}px)`,
          }}
        >
          {comps.map((c) => c.descriptor).join("\n\n")}
        </p>
      </div>

      <div style={{ fontSize: 12.5, color: C.s500, fontWeight: 500, marginTop: 14.4 }}>
        The large line above is a plain-English paraphrase written for this page. The quoted text
        is the standard itself.
      </div>
    </div>
  );
};

/** Where the pointer is while it drags, in document CSS px. Used by the pointer layer. */
export const useDragPoint = (frame: number) => {
  const anchors = useAnchors();
  const track = anchors["track"];
  if (!track) return null;
  const usable = track.w - THUMB;
  return {
    x: track.x + THUMB / 2 + (usable * dragPointer(frame)) / 3,
    y: track.cy,
  };
};
