'use strict';
/**
 * OMBS social share card renderer.
 *
 * Draws docs/og-card.jpg in the visual language of the parent demo screen
 * (docs/demo/index.html) rather than lifting a frame out of the dark promo
 * video: light --bg canvas, the site header, and the hero's mixed-colour
 * headline.
 *
 *   node video/render-og-card.js          -> docs/og-card.jpg
 *   node video/render-og-card.js out.jpg  -> out.jpg
 *
 * Output paths resolve off __dirname, so it runs from any working directory.
 *
 * Colour note: the headline uses --orange-dark / --green-dark, not the base
 * hues. That is deliberate and matches docs/demo/index.html (lines 124-129) —
 * the base hues only clear the 3:1 large-text floor on --bg, the dark shades
 * clear AA outright, and a share card gets rescaled to thumbnail sizes where
 * the large-text exemption no longer applies.
 */
const fs = require('fs');
const path = require('path');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const K = require('./lib/kit');

const { C, FONT, fillRound, strokeRound, measure, text } = K;

// ── Fonts ───────────────────────────────────────────────────────────────────
const FONT_DIR = path.join(__dirname, 'assets', 'fonts');
[
  ['PlusJakartaSans-400.ttf', 'JK400'],
  ['PlusJakartaSans-500.ttf', 'JK500'],
  ['PlusJakartaSans-600.ttf', 'JK600'],
  ['PlusJakartaSans-700.ttf', 'JK700'],
  ['PlusJakartaSans-800.ttf', 'JK800'],
  ['JetBrainsMono-700.ttf', 'MONO'],
].forEach(([file, alias]) => GlobalFonts.registerFromPath(path.join(FONT_DIR, file), alias));

// ── Canvas ──────────────────────────────────────────────────────────────────
// 1200x630 is the canonical Open Graph size (1.91:1). The previous card was a
// 1920x1080 video frame, which every platform letterboxed or cropped.
const W = 1200;
const H = 630;

// The demo's --orange-dark / --green-dark already exist as kit tokens, so take
// them from there rather than re-declaring the hex and letting the two drift.
const ORANGE_DARK = C.orangeDark; // #C2410C
const GREEN_DARK = C.greenDark; // #15803D
// Not a kit token: this is the demo's --card-shadow (4px 4px 0 rgba(0,0,0,0.04)),
// which is lighter than the video's hard shadow because the ground is light.
const CARD_SHADOW = 'rgba(0,0,0,0.04)';

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

/** Draw a run of differently-coloured segments as one centred line. */
function mixedLine(ctx, segments, cx, y, size, ls) {
  const widths = segments.map((s) => measure(ctx, s.s, size, FONT.d, ls));
  const total = widths.reduce((a, b) => a + b, 0);
  let x = cx - total / 2;
  segments.forEach((seg, i) => {
    text(ctx, seg.s, x, y, { size, family: FONT.d, color: seg.c, ls });
    x += widths[i];
  });
  return total;
}

// ── Ground: the demo page's --bg ────────────────────────────────────────────
ctx.fillStyle = C.s50; // #F8FAFC
ctx.fillRect(0, 0, W, H);

// ── Header band — site: header / .header-inner (docs/demo/index.html 59-88) ─
const HEAD_H = 104;
ctx.fillStyle = C.white;
ctx.fillRect(0, 0, W, HEAD_H);
ctx.fillStyle = C.s200;
ctx.fillRect(0, HEAD_H - 2, W, 2);

// .logo — 48px square, --s900 fill, 16px radius, white wordmark. Scaled to 58.
const LOGO = 58;
const LX = 60;
const LY = (HEAD_H - 2 - LOGO) / 2;
fillRound(ctx, LX, LY, LOGO, LOGO, 19, C.s900);
text(ctx, 'OMBS', LX + LOGO / 2, LY + LOGO / 2 + 5, {
  size: 15,
  family: FONT.d,
  color: C.white,
  align: 'center',
  ls: 0.2,
});

// .brand-name
const BX = LX + LOGO + 22;
text(ctx, 'Open Making & Building Standard', BX, 44, {
  size: 27,
  family: FONT.d,
  color: C.s900,
  ls: -0.4,
});

// .v-badge + .brand-sub
const BADGE = 'v0.3.0';
const badgeSize = 15;
const badgeW = measure(ctx, BADGE, badgeSize, FONT.b, 0) + 22;
const badgeH = 25;
fillRound(ctx, BX, 56, badgeW, badgeH, 12.5, C.s200);
text(ctx, BADGE, BX + 11, 56 + badgeH / 2 + 5.2, {
  size: badgeSize,
  family: FONT.b,
  color: C.s700,
});
text(ctx, 'K\u201312 Cross-Domain Framework', BX + badgeW + 14, 56 + badgeH / 2 + 5.2, {
  size: 16,
  family: FONT.r,
  color: C.s500,
});

// ── Hero headline — derived: .hero h1 (weight 800, -1px tracking) ───────────
const CX = W / 2;
const HEAD_SIZE = 62;
const LS = -1.4;

mixedLine(
  ctx,
  [
    { s: 'Assess ', c: C.s900 },
    { s: 'making', c: ORANGE_DARK },
    { s: ' and ', c: C.s900 },
    { s: 'building', c: GREEN_DARK },
  ],
  CX,
  260,
  HEAD_SIZE,
  LS,
);
mixedLine(ctx, [{ s: 'with confidence.', c: C.s900 }], CX, 260 + 74, HEAD_SIZE, LS);

// ── Three domain bars: S / M / B, in meaning order ──────────────────────────
const BAR_W = 74;
const BAR_H = 7;
const GAP = 16;
const barsTotal = BAR_W * 3 + GAP * 2;
[C.blue, ORANGE_DARK, GREEN_DARK].forEach((col, i) => {
  fillRound(ctx, CX - barsTotal / 2 + i * (BAR_W + GAP), 372, BAR_W, BAR_H, BAR_H / 2, col);
});

// ── Subhead — .hero p ───────────────────────────────────────────────────────
text(ctx, 'Grounded in the open OMBS standard. Free, no account, nothing saved.', CX, 424, {
  size: 20,
  family: FONT.r,
  color: C.s600,
  align: 'center',
});

// ── /demo chip — card treatment: white, 2px --s200, 20px radius, 4px hard ───
const CHIP_LABEL = '/demo';
const chipSize = 30;
const chipTextW = measure(ctx, CHIP_LABEL, chipSize, FONT.mono, 0);
const ARROW_W = 34;
const chipW = chipTextW + ARROW_W + 78;
const chipH = 66;
const chipX = CX - chipW / 2;
const chipY = 462;

fillRound(ctx, chipX + 4, chipY + 4, chipW, chipH, 20, CARD_SHADOW);
fillRound(ctx, chipX, chipY, chipW, chipH, 20, C.white);
strokeRound(ctx, chipX, chipY, chipW, chipH, 20, C.s200, 2);

// Arrow, drawn rather than typed so it keeps its weight at thumbnail scale.
const ax = chipX + 34;
const ay = chipY + chipH / 2;
ctx.save();
ctx.strokeStyle = C.blue;
ctx.lineWidth = 3.4;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.beginPath();
ctx.moveTo(ax, ay);
ctx.lineTo(ax + 21, ay);
ctx.moveTo(ax + 13, ay - 8);
ctx.lineTo(ax + 21, ay);
ctx.lineTo(ax + 13, ay + 8);
ctx.stroke();
ctx.restore();

text(ctx, CHIP_LABEL, ax + ARROW_W + 12, ay + chipSize * 0.36, {
  size: chipSize,
  family: FONT.mono,
  color: C.s900,
});

// ── Footer ──────────────────────────────────────────────────────────────────
text(ctx, 'v0.3.0  \u00b7  CC BY-SA 4.0  \u00b7  open to the community', CX, 585, {
  size: 17,
  family: FONT.r,
  color: C.s500,
  align: 'center',
});

// ── Write ───────────────────────────────────────────────────────────────────
const outArg = process.argv[2];
const out = outArg
  ? path.resolve(outArg)
  : path.join(__dirname, '..', 'docs', 'og-card.jpg');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, canvas.toBuffer('image/jpeg', 92));
console.log(`Wrote ${out} (${W}x${H}, ${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
