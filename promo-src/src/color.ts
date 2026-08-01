/**
 * Hex mixing, so a state change can be *interpolated* rather than switched.
 *
 * The demo does this with `transition: all 0.15s`. CSS transitions do not exist inside a
 * frame-addressed renderer — every frame is a fresh paint with no previous state to transition
 * from — so the same 150ms is expressed as a mix driven by `useCurrentFrame()`.
 *
 * Both endpoints are always brand tokens; nothing here can invent a colour outside the palette,
 * and at t=0 and t=1 the output is byte-identical to the token it came from.
 */

const hex = (c: string) => {
  const h = c.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ] as const;
};

export const mix = (from: string, to: string, t: number) => {
  if (t <= 0) return from;
  if (t >= 1) return to;
  const a = hex(from);
  const b = hex(to);
  const ch = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${ch(0)}, ${ch(1)}, ${ch(2)})`;
};
