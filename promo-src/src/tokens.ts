/**
 * Hallmark · macrostructure: Recreated Product Surface · tone: plain/precise (the register
 *   of the standard itself) · anchor hue: none — the three domain hues carry meaning, not mood
 * theme: project-owned (identity preservation) · source: docs/demo/index.html :root, L21-41
 * enrichment: none — the interface IS the artifact
 *
 * Every value below is copied, not invented. `docs/demo/index.html` is the shipped tool at
 * sunnypatneedi.github.io/ombs/demo/ and this file is its palette, verbatim. If a value here
 * ever disagrees with that `:root` block, this file is wrong.
 *
 * The domain hues are semantic:
 *   blue   = S · Shared Practices
 *   orange = M · Making
 *   green  = B · Building
 * They are never decorative. There is no fourth accent, and nothing here is a brand gradient.
 */

export const C = {
  // Domain colours (demo L27-29). The *-dark shades clear AA on --bg where the base hues
  // only clear the 3:1 large-text floor; the demo already makes that distinction and so do we.
  blue: "#2563EB",
  blueDark: "#1E40AF",
  blueLight: "#EFF6FF",
  blueBorder: "#BFDBFE",

  orange: "#EA580C",
  orangeDark: "#C2410C",
  orangeLight: "#FFF7ED",
  orangeBorder: "#FED7AA",

  green: "#16A34A",
  greenDark: "#15803D",
  greenLight: "#F0FDF4",
  greenBorder: "#BBF7D0",

  // Neutrals (demo L31-33)
  bg: "#F8FAFC",
  white: "#FFFFFF",
  s900: "#0F172A",
  s700: "#334155",
  s600: "#475569",
  s500: "#64748B",
  s400: "#94A3B8",
  s300: "#CBD5E1",
  s200: "#E2E8F0",
  s100: "#F1F5F9",
  s50: "#F8FAFC",
} as const;

export const FONT = {
  // Plus Jakarta Sans is already the shipped identity of this project (demo L11, and the
  // published site). Identity preservation outranks any greenfield font-selection reflex.
  sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  // The demo's mono is the system stack (SFMono-Regular/Consolas), which is by definition
  // not reproducible in a headless render. JetBrains Mono 700 is the mono this repo already
  // uses for its video output (video/assets/fonts) — same role, deterministic pixels.
  mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
} as const;

// Card treatment measured off the site's .stat-card (demo L38-40).
export const CARD = {
  radius: 20,
  border: `2px solid ${C.s200}`,
  shadow: "4px 4px 0 rgba(0,0,0,0.04)",
} as const;

/** Domain letter → its three-colour triple. Used anywhere a code chip or a lean is painted. */
export const DOMAIN = {
  S: { base: C.blue, dark: C.blueDark, light: C.blueLight, border: C.blueBorder },
  M: { base: C.orange, dark: C.orangeDark, light: C.orangeLight, border: C.orangeBorder },
  B: { base: C.green, dark: C.greenDark, light: C.greenLight, border: C.greenBorder },
} as const;

// The two output formats. Each renders the same components at the viewport the format
// implies — a phone column and a desktop column — then scales that viewport to the frame.
// Nothing is letterboxed and nothing is a screenshot.
export type FormatName = "vertical" | "wide";

export type Format = {
  name: FormatName;
  /** Output pixels. */
  width: number;
  height: number;
  /** CSS pixels of the recreated viewport, before `scale`. */
  cssW: number;
  cssH: number;
  scale: number;
  /** Safe margin in CSS px, held clear of the frame edge on all four sides. */
  safe: number;
  /**
   * Floors for the two blocks whose content changes length mid-shot. The standard's
   * descriptors run from 18 words to 68, so without a floor the whole page below the
   * explorer would jump every time the slider snaps. This reserves the tallest case and
   * lets the shorter ones sit in it. It changes no copy and hides no text.
   */
  glossMin: number;
  verbatimMin: number;
  /** Floors for the other two blocks that change length mid-shot. Same reason as above:
   *  the camera and the pointer are placed from measured layout, so the document below a
   *  block that grows or shrinks moves out from under the pointer. */
  leanMin: number;
  calloutMin: number;
};

// 540 CSS px is a phone: it takes the demo's own ≤600px branch, so the masthead wraps and the
// chips reflow exactly as they do on a handset. At 2× it renders body copy at 30px on a
// 1080-wide frame, which is readable at arm's length without cropping the page to one control.
export const VERTICAL: Format = {
  name: "vertical",
  width: 1080,
  height: 1920,
  cssW: 540,
  cssH: 960,
  scale: 2,
  safe: 24,
  glossMin: 114,
  verbatimMin: 188,
  leanMin: 46,
  calloutMin: 116,
};

export const WIDE: Format = {
  name: "wide",
  width: 1920,
  height: 1080,
  cssW: 1280,
  cssH: 720,
  scale: 1.5,
  safe: 40,
  glossMin: 74,
  verbatimMin: 126,
  leanMin: 23,
  calloutMin: 46,
};

export const FPS = 30;
export const DURATION = 600; // 20.0s
