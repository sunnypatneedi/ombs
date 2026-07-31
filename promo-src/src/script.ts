/**
 * The beat sheet. Every visible state in the video is a pure function of the frame, and every
 * one of those functions lives here. Components read state; they never own it.
 *
 * This is also the honesty ledger. Each beat carries the numbered Ground-truth item it depicts
 * (see the brief). A beat with no `truth` entry may not be animated.
 *
 * 30fps · 600 frames · 20.00s
 */

import { Easing, interpolate } from "remotion";
import { BANDS, bandForAge } from "./standard";

export const CHILD_NAME = "Lio"; // stand-in. The demo's own placeholder, docs/demo/index.html L439.
export const CHILD_AGE = 9; // the demo's own default, L575.
export const HOME_BAND = bandForAge(CHILD_AGE); // 1 → "3–5"

export type Beat = {
  id: string;
  label: string;
  from: number;
  to: number;
  /** Numbered Ground-truth items this beat depicts. Empty is not allowed. */
  truth: number[];
  moves: string;
};

export const BEATS: Beat[] = [
  {
    id: "open",
    label: "The tool, at rest",
    from: 0,
    to: 40,
    truth: [9],
    moves:
      "The demo's own hero paints: the OMBS masthead with the version pill read from standards.json, " +
      "the question headline with 'making' in Making orange and 'building' in Building green, and the " +
      "subline 'Free, no account, nothing saved'. A pointer enters from below the fold.",
  },
  {
    id: "name",
    label: "Type a first name",
    from: 40,
    to: 142,
    truth: [1, 2],
    moves:
      "The pointer taps the name field; the field takes the demo's blue focus ring and a caret. " +
      "L·i·o types in. Copy personalises live: the explorer sub-head becomes 'Lio is 9' and the " +
      "band pill becomes '▲ Lio is in this band'. The age field already reads 9 years old, which is " +
      "what put the marker on 3–5.",
  },
  {
    id: "chips",
    label: "Pick what they like to make",
    from: 142,
    to: 254,
    truth: [3],
    moves:
      "Three chips are tapped: Robots, Games, Comics. Each tints on press — Building green, Building " +
      "green, Making orange — teaching the colour rule by using it. On the third pick the remaining " +
      "chips go disabled, because the control is capped at three. The lean sentence resolves underneath.",
  },
  {
    id: "tabs",
    label: "Switch practice",
    from: 254,
    to: 342,
    truth: [4, 6],
    moves:
      "The pointer taps the AI-Independence tab. The tab presses, the white selected pill travels " +
      "across the trough, and the descriptor underneath swaps — plain-English line, the standard's " +
      "verbatim text, and the component code.",
  },
  {
    id: "slider",
    label: "Drag the four bands",
    from: 342,
    to: 444,
    truth: [5, 6],
    moves:
      "The pointer grabs the thumb and drags right. The thumb snaps band to band the way a step-1 " +
      "range does — 3–5, 6–8, 9–12 — then settles back on 6–8. Every stop rewrites the heading, the " +
      "plain line, the verbatim and the code. The band pill refuses to re-place the child: it reads " +
      "\"Lio's band is 3–5 — you're looking at 6–8\".",
  },
  {
    id: "notascore",
    label: "Never a score",
    from: 444,
    to: 498,
    truth: [8],
    moves:
      "The page scrolls under a still pointer to the standing callout, which the demo carries at all " +
      "times: 'This is not a score, and OMBS never produces one.'",
  },
  {
    id: "cta",
    label: "Tap the standard",
    from: 498,
    to: 546,
    truth: [7],
    moves:
      "The footer's live count is on screen — descriptors, dimensions and the evidence layer, all read " +
      "from standards.json. The pointer hovers the footer link, which underlines, then presses it.",
  },
  {
    id: "end",
    label: "Resolved",
    from: 546,
    to: 600,
    truth: [7, 8, 9],
    moves:
      "The press resolves to the done state: the address of the tool, the licence line, and the three " +
      "things that are true of it — nothing saved, no account, the name never leaves the browser.",
  },
];

export const beatAt = (f: number) => BEATS.find((b) => f >= b.from && f < b.to) ?? BEATS[BEATS.length - 1];

/* ────────────────────────────────────────────────────────────────────────────
   Event frames. Named so the storyboard and the components agree on one number.
   ──────────────────────────────────────────────────────────────────────────── */

export const EV = {
  cursorEnter: 4,
  nameTap: 62,
  nameChars: [80, 94, 108], // "L" · "Li" · "Lio"
  nameBlur: 150,

  chipTaps: { robots: 166, games: 198, comics: 230 },

  tabTap: 286,

  sliderGrab: 368,
  sliderRelease: 420,

  ctaHover: 514,
  ctaPress: 532,

  endEnter: 546,
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Derived state
   ──────────────────────────────────────────────────────────────────────────── */

/** What the name field contains. Ground truth 1. */
export const typedName = (f: number) => {
  let n = 0;
  for (const at of EV.nameChars) if (f >= at) n += 1;
  return CHILD_NAME.slice(0, n);
};

/** The demo's own `who()` — docs/demo/index.html L566. */
export const who = (f: number) => typedName(f).trim() || "your child";

export const nameFocused = (f: number) => f >= EV.nameTap && f < EV.nameBlur;

/** Chips selected so far, in pick order. Ground truth 3. */
export const picksAt = (f: number) => {
  const out: string[] = [];
  if (f >= EV.chipTaps.robots) out.push("robots");
  if (f >= EV.chipTaps.games) out.push("games");
  if (f >= EV.chipTaps.comics) out.push("comics");
  return out;
};

export const pickFrameOf = (id: string): number | null =>
  id === "robots" ? EV.chipTaps.robots : id === "games" ? EV.chipTaps.games : id === "comics" ? EV.chipTaps.comics : null;

/** The selected Shared Practice. Ground truth 4. */
export const practiceAt = (f: number) => (f >= EV.tabTap ? "OMBS.S.AI" : "OMBS.S.DF");

/**
 * The pointer's continuous position along the four-band track, 0…3.
 * A step-1 range input snaps its value while the pointer moves freely; both are modelled,
 * because the gap between them is what makes a drag read as a drag.
 */
export const dragPointer = (f: number) => {
  if (f < 370) return HOME_BAND;
  if (f < 394)
    return interpolate(f, [370, 394], [HOME_BAND, 3], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  if (f < 402) return 3;
  if (f < 414)
    return interpolate(f, [402, 414], [3, 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  return 2;
};

/** The band the control actually holds. Ground truth 5. */
export const bandAt = (f: number) => Math.round(dragPointer(f));

export const bandIdAt = (f: number) => BANDS[bandAt(f)].id;

export const sliderHeld = (f: number) => f >= EV.sliderGrab && f < EV.sliderRelease;

/**
 * The frame on which the explorer's contents last changed — a tab press or a band snap.
 * Content swaps key their reveal off this, so a snap re-reads as new text rather than as
 * a silent substitution. Scanned rather than tabulated, so it can never drift from the
 * functions above.
 */
export const lastSwap = (f: number) => {
  for (let k = f; k > Math.max(0, f - 48); k--) {
    if (practiceAt(k) !== practiceAt(k - 1)) return k;
    if (bandAt(k) !== bandAt(k - 1)) return k;
  }
  return -999;
};

/* ────────────────────────────────────────────────────────────────────────────
   Press choreography
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * 0 → 1 → 0 across a tap. Down is faster than up, the way a finger is.
 *
 * `down` or `up` may be 0 — the contact ring is called with `down = 0` because a ring appears
 * at the instant of contact and only decays. Those cases are branched rather than interpolated:
 * `interpolate` over a zero-width input range throws, and it throws only on the exact frame the
 * event lands, which a contact sheet of fifteen chosen frames will not find. The render did.
 */
export const press = (f: number, at: number, down = 4, up = 9) => {
  if (f < at - down || f > at + up) return 0;
  if (f <= at)
    return down === 0
      ? 1
      : interpolate(f, [at - down, at], [0, 1], { easing: Easing.bezier(0.3, 0, 0.6, 1) });
  return up === 0
    ? 0
    : interpolate(f, [at, at + up], [1, 0], { easing: Easing.bezier(0.16, 1, 0.3, 1) });
};

/** Any press active this frame, for the pointer's own squash. */
export const pressAt = (f: number) =>
  Math.max(
    press(f, EV.nameTap),
    press(f, EV.chipTaps.robots),
    press(f, EV.chipTaps.games),
    press(f, EV.chipTaps.comics),
    press(f, EV.tabTap),
    press(f, EV.ctaPress),
    sliderHeld(f) ? 1 : 0,
  );

/* ────────────────────────────────────────────────────────────────────────────
   Pointer travel. Each leg names the anchor it arrives on and the frame it lands.
   Between legs the pointer rests. During the drag it is pinned to the thumb.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * A target is either a registered control (`name`, `chip:robots`, `tab`, `thumb`, `cta`) or a
 * point in the viewport itself (`vp:<fx>,<fy>`), which is how the pointer gets out of the way
 * before the page scrolls.
 */
export type Leg = { from: number; to: number; target: string };

export const LEGS: Leg[] = [
  { from: EV.cursorEnter, to: 56, target: "name" },
  { from: 142, to: 162, target: "chip:robots" },
  { from: 178, to: 194, target: "chip:games" },
  { from: 210, to: 226, target: "chip:comics" },
  { from: 254, to: 282, target: "tab" },
  { from: 336, to: 366, target: "thumb" },
  { from: 446, to: 478, target: "vp:0.74,0.56" },
  { from: 502, to: EV.ctaHover, target: "cta" },
];

export const ctaHovered = (f: number) => f >= EV.ctaHover && f < EV.endEnter;

/* ────────────────────────────────────────────────────────────────────────────
   Camera. The page scrolls under the pointer, never the other way round.

   Two rules, and the second one is the expensive one to learn:

   1. Every camera move sits *inside* a pointer travel leg, and every rest sits inside a
      camera hold. A page that scrolls while the pointer is parked on a control drags the
      control out from under it, which is the single thing that makes scripted cursor work
      read as fake.

   2. A keyframe positions a measured anchor inside the area *below the pinned masthead*,
      never inside the raw viewport — the masthead is opaque, so a control placed in the
      top 76-132px is a control nobody can see. `top` puts the anchor's top edge that many
      px under the masthead; `mid` puts its centre at that fraction of the free area.
      Prefer `top`, and prefer a SMALL anchor: centring a 900px-tall card at 0.14 of the
      viewport pushes everything above its midpoint — tabs, slider, band labels — off the
      top of the frame, which is exactly how the first cut lost the drag it was built to
      show. Anchor on the control, not on the card that contains it.
   ──────────────────────────────────────────────────────────────────────────── */

export type CamKey = {
  at: number;
  anchor: string;
  /** The anchor's top edge sits this many CSS px below the masthead. */
  top?: number;
  /** …or its centre sits at this fraction of the area below the masthead. */
  mid?: number;
};

export const CAMERA: CamKey[] = [
  // Frames 0-254 hold at the top of the document. At both formats the masthead, the hero and
  // the whole setup card fit in one viewport, so the name field and every chip the pointer
  // touches are already on screen — there is nothing to scroll to, and scrolling anyway would
  // slice the headline behind the masthead for three seconds.
  { at: 0, anchor: "hero", top: 0 },
  { at: 254, anchor: "hero", top: 0 },

  // One move, on the leg that carries the pointer to the practice tabs. It lands the band
  // heading just under the masthead, which puts the heading, the tabs, the slider, the band
  // labels, the band pill, the plain line and the verbatim block in a single frame — so the
  // tab press AND the whole four-band drag play out without the camera moving again, and
  // every one of the seven things the two controls rewrite is on screen while they do it.
  { at: 282, anchor: "exband", top: 0 },
  { at: 446, anchor: "exband", top: 0 },

  { at: 478, anchor: "notascore", mid: 0.5 },
  { at: 502, anchor: "notascore", mid: 0.5 },
  { at: 514, anchor: "footer", mid: 0.54 },
];

/** Eased 0…1 progress between the two camera keyframes bracketing this frame. */
export const cameraLerp = (f: number) => {
  let i = 0;
  for (let k = 0; k < CAMERA.length; k++) if (f >= CAMERA[k].at) i = k;
  const a = CAMERA[i];
  const b = CAMERA[Math.min(i + 1, CAMERA.length - 1)];
  // Same guard as `press`: the last keyframe, or two keys sharing a frame, would put a
  // zero-width range into interpolate. Both are legal camera scripts; neither may throw.
  if (a === b || a.at === b.at) return { a, b, t: 1 };
  const t = interpolate(f, [a.at, b.at], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.15, 1),
  });
  return { a, b, t };
};
