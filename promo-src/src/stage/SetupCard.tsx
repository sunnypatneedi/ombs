/**
 * The setup card — docs/demo/index.html L435-449, CSS L133-187.
 *
 * Three real controls: a first-name field (Ground truth 1), an age field whose value is what
 * derives the grade band (Ground truth 2), and the interest chips (Ground truth 3).
 *
 * The chips are the only place in the tool where the colour rule is taught rather than stated:
 * pick Building things and they turn Building green. That is why the tint is mixed in over the
 * press rather than simply being present.
 */

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../tokens";
import { mix } from "../color";
import { INTERESTS, leanFor } from "../standard";
import { CHILD_AGE, EV, nameFocused, picksAt, pickFrameOf, press, typedName, who } from "../script";
import { useAnchorRef, useRegister } from "../ui/anchors";
import { useFormat } from "./format";

const Label: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.s700, marginBottom: 6.4 }}>
    {children}
    {hint ? <span style={{ fontWeight: 500, color: C.s500 }}> {hint}</span> : null}
  </div>
);

/** The demo's form field (L146-154), with its focus treatment expressed as a mix. */
const fieldBox = (focus: number): React.CSSProperties => ({
  width: "100%",
  boxSizing: "border-box",
  fontFamily: FONT.sans,
  fontSize: 15.2,
  fontWeight: 600,
  padding: "11.2px 13.6px",
  borderRadius: 16,
  background: C.white,
  color: C.s900,
  border: `2px solid ${mix(C.s200, C.blue, focus)}`,
  outline: focus > 0 ? `2px solid ${C.blue}` : "none",
  outlineOffset: 1,
  minHeight: 46,
});

export const SetupCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { leanMin } = useFormat();
  const setupRef = useAnchorRef("setup");
  const nameRef = useAnchorRef("name");
  const chipsRef = useAnchorRef("chips");
  const register = useRegister();

  const typed = typedName(frame);
  const namePress = press(frame, EV.nameTap);
  // The ring is not animated in — a focus ring has to be there the instant focus is.
  const focus = nameFocused(frame) ? 1 : 0;
  const picks = picksAt(frame);
  const capped = picks.length >= 3;
  const lean = leanFor(picks, who(frame));

  // Frame-driven caret: a real one does not survive a screenshot. ~530ms, the platform blink.
  const caretOn = focus > 0 && Math.floor((frame - EV.nameTap) / 16) % 2 === 0;

  const lastPick = picks.length ? pickFrameOf(picks[picks.length - 1]) : null;
  const leanIn =
    lastPick === null
      ? 0
      : spring({ frame: frame - lastPick, fps, config: { damping: 200 }, durationInFrames: 20 });

  return (
    <div
      ref={setupRef}
      style={{
        background: C.white,
        border: `2px solid ${C.s200}`,
        borderRadius: 20,
        padding: 24,
        boxShadow: "4px 4px 0 rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 170 }}>
          <Label hint="optional">Your child&rsquo;s first name</Label>
          <div
            ref={nameRef}
            style={{
              ...fieldBox(focus),
              display: "flex",
              alignItems: "center",
              transform: `scale(${1 - namePress * 0.012})`,
            }}
          >
            <span style={{ color: typed ? C.s900 : C.s500 }}>{typed || "Lio"}</span>
            {caretOn ? (
              <span
                style={{
                  display: "inline-block",
                  width: 1.6,
                  height: 18,
                  background: C.s900,
                  marginLeft: 1.5,
                }}
              />
            ) : null}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 170 }}>
          <Label>How old are they?</Label>
          {/* A real <select>, so the disclosure arrow is the browser's and not a drawing. */}
          <select
            defaultValue={String(CHILD_AGE)}
            tabIndex={-1}
            style={{ ...fieldBox(0), display: "block", lineHeight: "22px" }}
          >
            <option value={String(CHILD_AGE)}>{CHILD_AGE} years old</option>
          </select>
        </div>
      </div>

      <Label hint="pick up to three">What do they like to make right now?</Label>

      <div ref={chipsRef} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {INTERESTS.map((it) => {
          const at = pickFrameOf(it.id);
          const on = picks.includes(it.id);
          const tint =
            on && at !== null
              ? spring({ frame: frame - at, fps, config: { damping: 200 }, durationInFrames: 14 })
              : 0;
          const p = at !== null ? press(frame, at) : 0;
          // Capped at three: the demo disables the rest (L603). Ground truth 3.
          const dimmed =
            !on && capped
              ? interpolate(frame, [EV.chipTaps.comics, EV.chipTaps.comics + 10], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;

          const d =
            it.lean === "B"
              ? { light: C.greenLight, dark: C.greenDark }
              : { light: C.orangeLight, dark: C.orangeDark };

          return (
            <div
              key={it.id}
              ref={(el) => register(`chip:${it.id}`, el)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                fontFamily: FONT.sans,
                fontSize: 13.1,
                fontWeight: 700,
                padding: "7.2px 16px",
                borderRadius: 20,
                boxSizing: "border-box",
                background: mix(C.white, d.light, tint),
                color: mix(C.s500, d.dark, tint),
                border: `2px solid ${mix(C.s200, d.dark, tint)}`,
                opacity: 1 - dimmed * 0.5,
                transform: `scale(${1 - p * 0.05 + tint * (1 - tint) * 0.12})`,
              }}
            >
              {it.label}
            </div>
          );
        })}
      </div>

      {/* The demo's `.lean:empty` reserves no space before a pick (L186). Here the row is
          reserved and the sentence fades into it, because everything below this card is placed
          by measured layout and a card that grows two lines mid-shot moves the footer link out
          from under the pointer that presses it. Same rule as the Explorer's glossMin. */}
      <div
        style={{
          marginTop: 16,
          minHeight: leanMin,
          fontSize: 14.4,
          color: C.s600,
          fontWeight: 500,
          opacity: lean ? leanIn : 0,
          transform: `translateY(${(1 - (lean ? leanIn : 1)) * 6}px)`,
        }}
      >
        {lean ? (
          <>
            What {lean.who} picked leans toward{" "}
            <b style={{ color: C.s900, fontWeight: 800 }}>{lean.word}</b>
            {lean.tail}.
          </>
        ) : null}
      </div>
    </div>
  );
};
