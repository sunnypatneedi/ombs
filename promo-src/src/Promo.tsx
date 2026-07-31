/**
 * The composition.
 *
 * A recreated viewport at a real CSS width (540px for the phone cut, 1280px for the desktop
 * cut), scaled to the output frame. Inside it: the demo's page in normal document flow, its
 * sticky masthead, a camera that translates the page, and one pointer.
 *
 * There is not a slide in this file. Every visible value comes from `useCurrentFrame()` by way
 * of `script.ts`; there is no CSS transition, no keyframe animation and no animation class
 * anywhere in this project, because none of the three render.
 */

import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, type Format } from "./tokens";
import { CAMERA, EV, LEGS, cameraLerp, press, pressAt, sliderHeld } from "./script";
import { AnchorProvider, useAnchorRef, useAnchors } from "./ui/anchors";
import { Cursor } from "./ui/Cursor";
import { FormatProvider, useFormat, wrapStyle } from "./stage/format";
import { Header } from "./stage/Header";
import { Hero } from "./stage/Hero";
import { SetupCard } from "./stage/SetupCard";
import { Dimensions } from "./stage/Dimensions";
import { Explorer, useDragPoint } from "./stage/Explorer";
import { NotAScore } from "./stage/NotAScore";
import { Footer } from "./stage/Footer";
import { EndCard } from "./stage/EndCard";

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The camera, in document CSS px. One definition, read by both the page and the pointer.
 *
 * Placement is measured against the area *below* the masthead, not against the raw viewport.
 * The masthead is opaque and pinned; a keyframe that ignores it aims controls at pixels the
 * viewer cannot see. `chrome` is the masthead's own untransformed wrapper, so its measured
 * height is the header's height, in the same units as every other anchor.
 *
 * Called once per frame, in `Viewport`, and handed down. See the note on `Page`.
 */
const useScroll = () => {
  const frame = useCurrentFrame();
  const anchors = useAnchors();
  const { cssH } = useFormat();

  const end = anchors["pageend"];
  const maxScroll = end ? Math.max(0, end.y + end.h - cssH) : 0;
  const headerH = anchors["chrome"]?.h ?? 0;
  const free = Math.max(1, cssH - headerH);

  const targetFor = (k: (typeof CAMERA)[number]) => {
    const r = anchors[k.anchor];
    if (!r) return 0;
    const y = k.top !== undefined ? r.y - headerH - k.top : r.cy - headerH - free * (k.mid ?? 0.5);
    return clamp(y, 0, maxScroll);
  };

  const { a, b, t } = cameraLerp(frame);
  return lerp(targetFor(a), targetFor(b), t);
};

/** Where the pointer is this frame, in viewport CSS px. */
const usePointer = (scroll: number) => {
  const frame = useCurrentFrame();
  const anchors = useAnchors();
  const { cssW, cssH } = useFormat();
  const drag = useDragPoint(frame);

  // Enters from below the fold and off to the right, the way a hand arrives at a screen.
  const origin = { x: cssW * 0.82, y: cssH * 1.14 };

  const resolve = (target: string): { x: number; y: number } => {
    if (target.startsWith("vp:")) {
      const [fx, fy] = target.slice(3).split(",").map(Number);
      return { x: cssW * fx, y: cssH * fy };
    }
    const r = anchors[target === "tab" ? "tabbox:OMBS.S.AI" : target];
    return r ? { x: r.cx, y: r.cy - scroll } : origin;
  };

  // While the slider is held the pointer is the drag: it moves continuously along the track
  // while the value snaps behind it. That gap is what a step-1 range actually looks like.
  if (sliderHeld(frame) && drag) {
    return { x: drag.x, y: drag.y - scroll };
  }

  let from = origin;
  let to = origin;
  let t = 1;
  for (let i = 0; i < LEGS.length; i++) {
    const leg = LEGS[i];
    if (frame < leg.from) break;
    from = i === 0 ? origin : resolve(LEGS[i - 1].target);
    to = resolve(leg.target);
    t = interpolate(frame, [leg.from, leg.to], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.32, 0, 0.13, 1),
    });
  }

  // A pointer does not travel in a straight line. One shallow arc, peaking mid-leg.
  const span = Math.hypot(to.x - from.x, to.y - from.y);
  const arc = Math.sin(t * Math.PI) * Math.min(26, span * 0.16);

  return { x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) - arc };
};

/**
 * The page. `scroll` arrives as a prop rather than being read again here, and that is a
 * correctness constraint rather than a style preference: the page and the pointer have to
 * travel on one number. When each computed its own, the two could render a frame apart — the
 * page would settle at the clamped bottom of the document while the pointer still held the
 * position from the previous layout, and the tap at the end of the video landed 258px under
 * the link it was supposed to be pressing. It reproduced in the encoded video and not in a
 * still, which is exactly the class of bug that a contact sheet cannot see.
 *
 * The masthead is `position: sticky; top: 0` on the real page. Sticky cannot fire here because
 * the page is translated rather than scrolled, so it stays in the flow — reserving its own
 * height, needing no spacer and no measured state — and an inner wrapper counter-translates it
 * by the same scroll. That is what sticky does, written out. The outer wrapper is untransformed,
 * so `chrome` measures the header's real height, which is what the camera subtracts before
 * placing anything: no keyframe can aim at a pixel the masthead covers.
 */
const Page: React.FC<{ rootRef: React.RefObject<HTMLDivElement | null>; scroll: number }> = ({
  rootRef,
  scroll,
}) => {
  const { cssW } = useFormat();
  const endRef = useAnchorRef("pageend");
  const chromeRef = useAnchorRef("chrome");

  return (
    <div
      ref={rootRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: cssW,
        transform: `translate3d(0, ${-scroll}px, 0)`,
      }}
    >
      <div ref={chromeRef} style={{ position: "relative", zIndex: 20 }}>
        <div style={{ transform: `translate3d(0, ${scroll}px, 0)` }}>
          <Header />
        </div>
      </div>
      <div style={wrapStyle(cssW)}>
        <Hero />
        <SetupCard />
        <Explorer />
        <NotAScore />
        <Dimensions />
        <Footer />
      </div>
      <div ref={endRef} style={{ height: 1 }} />
    </div>
  );
};

const Viewport: React.FC<{ rootRef: React.RefObject<HTMLDivElement | null> }> = ({ rootRef }) => {
  const frame = useCurrentFrame();
  const { cssW, cssH } = useFormat();
  const scroll = useScroll();
  const p = usePointer(scroll);

  // One ring per real press. Nothing ambient, nothing on a loop.
  const contact = Math.max(
    press(frame, EV.nameTap, 0, 16),
    press(frame, EV.chipTaps.robots, 0, 16),
    press(frame, EV.chipTaps.games, 0, 16),
    press(frame, EV.chipTaps.comics, 0, 16),
    press(frame, EV.tabTap, 0, 16),
    press(frame, EV.ctaPress, 0, 16),
  );

  const pointerOut = interpolate(frame, [EV.endEnter, EV.endEnter + 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: cssW,
        height: cssH,
        overflow: "hidden",
        background: C.bg,
        fontFamily: FONT.sans,
        lineHeight: 1.6,
        color: C.s900,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <Page rootRef={rootRef} scroll={scroll} />
      <EndCard />
      {pointerOut > 0.01 ? (
        <div style={{ opacity: pointerOut }}>
          <Cursor
            x={p.x}
            y={p.y}
            press={pressAt(frame)}
            contact={contact > 0 ? 1 - contact : 0}
          />
        </div>
      ) : null}
    </div>
  );
};

export type PromoProps = { format: Format; withAudio: boolean };

export const Promo: React.FC<PromoProps> = ({ format, withAudio }) => (
  <FormatProvider format={format}>
    <AbsoluteFill style={{ background: C.bg }}>
      {withAudio ? <Audio src={staticFile("vo.mp3")} /> : null}
      <div
        style={{
          width: format.cssW,
          height: format.cssH,
          transform: `scale(${format.scale})`,
          transformOrigin: "top left",
        }}
      >
        <AnchorProvider scale={format.scale}>
          {(rootRef) => <Viewport rootRef={rootRef} />}
        </AnchorProvider>
      </div>
    </AbsoluteFill>
  </FormatProvider>
);
