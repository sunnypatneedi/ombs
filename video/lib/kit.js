'use strict';
/**
 * Drawing kit for the OMBS promo video renderer.
 * Pure canvas 2D helpers: easing, timing windows, colour maths, type, and the
 * "hard offset shadow" card language borrowed from the OMBS docs site.
 */

// ── Brand tokens ────────────────────────────────────────────────────────────
const C = {
  blue: '#2563EB',
  blueDark: '#1E40AF',
  blueLight: '#EFF6FF',
  orange: '#EA580C',
  orangeDark: '#C2410C',
  green: '#16A34A',
  greenDark: '#15803D',
  white: '#FFFFFF',
  s900: '#0F172A',
  s700: '#334155',
  s600: '#475569',
  s500: '#64748B',
  s400: '#94A3B8',
  s300: '#CBD5E1',
  s200: '#E2E8F0',
  s100: '#F1F5F9',
  s50: '#F8FAFC',
  // video-only ground tones
  ink0: '#080D19',
  ink1: '#0F1930',
  ink2: '#16233F',
};

const GRADE = {
  K2: { bg: '#EDE9FE', fg: '#6D28D9', label: 'K\u20132' },
  35: { bg: '#D1FAE5', fg: '#065F46', label: '3\u20135' },
  68: { bg: '#FEF3C7', fg: '#92400E', label: '6\u20138' },
  912: { bg: '#FFE4E6', fg: '#9F1239', label: '9\u201312' },
};

// ── Timing ──────────────────────────────────────────────────────────────────
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

/** Normalised progress of `t` inside the window [start, end]. */
function win(t, start, end) {
  if (end <= start) return t >= end ? 1 : 0;
  return clamp((t - start) / (end - start));
}

const lerp = (a, b, t) => a + (b - a) * t;

// ── Easing ──────────────────────────────────────────────────────────────────
const ease = {
  linear: (t) => t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inCubic: (t) => t * t * t,
  inQuart: (t) => t * t * t * t,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  /** Gentle overshoot — the signature "snap into place" move. */
  outBack: (t, s = 1.42) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  /** Damped spring settle, ends exactly at 1. */
  spring: (t, freq = 3.2, damp = 6.5) =>
    t >= 1 ? 1 : 1 - Math.exp(-damp * t) * Math.cos(freq * Math.PI * t),
};

// ── Colour ──────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgba(hex, a = 1) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function mixHex(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const c = A.map((v, i) => Math.round(lerp(v, B[i], clamp(t))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

// ── Geometry ────────────────────────────────────────────────────────────────
function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

function fillRound(ctx, x, y, w, h, r, fill) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function strokeRound(ctx, x, y, w, h, r, stroke, lw = 2) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lw;
  ctx.stroke();
}

/**
 * The OMBS site card: solid fill, thick border, hard offset shadow (no blur).
 * `lift` (0..1) animates the shadow offset so cards appear to rise into place.
 */
function card(ctx, x, y, w, h, opts = {}) {
  const {
    r = 24,
    fill = C.white,
    border = null,
    borderWidth = 3,
    shadow = 'rgba(0,0,0,0.42)',
    shadowOffset = 12,
    lift = 1,
  } = opts;
  const off = shadowOffset * clamp(lift);
  if (off > 0.4) {
    fillRound(ctx, x + off, y + off, w, h, r, shadow);
  }
  fillRound(ctx, x, y, w, h, r, fill);
  if (border) strokeRound(ctx, x, y, w, h, r, border, borderWidth);
}

// ── Type ────────────────────────────────────────────────────────────────────
const FONT = {
  d: 'JK800', // display / headings
  b: 'JK700',
  m: 'JK600',
  r: 'JK500',
  l: 'JK400',
  mono: 'MONO',
};

/**
 * Stroke a rounded rect that draws itself on, blueprint style.
 * `prog` 0..1 walks the outline using a dash the length of the perimeter.
 */
function strokeRoundProgressive(ctx, x, y, w, h, r, prog, color, lw = 2) {
  const p = clamp(prog);
  if (p <= 0.001) return;
  const perim = 2 * (w + h) - 8 * r + 2 * Math.PI * r;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  if (p < 0.999) {
    ctx.setLineDash([perim * p, perim]);
    ctx.lineDashOffset = 0;
  }
  roundRectPath(ctx, x, y, w, h, r);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function setFont(ctx, size, family = FONT.d) {
  ctx.font = `${size}px ${family}`;
}

/** Width of `str` including manual letter spacing. */
function measure(ctx, str, size, family, ls = 0) {
  setFont(ctx, size, family);
  let w = 0;
  for (const ch of str) w += ctx.measureText(ch).width + ls;
  return w - (str.length ? ls : 0);
}

/**
 * Draw text with manual letter spacing and alignment.
 * align: 'left' | 'center' | 'right'; baseline is alphabetic unless set.
 */
function text(ctx, str, x, y, opts = {}) {
  const {
    size = 40,
    family = FONT.d,
    color = C.white,
    align = 'left',
    ls = 0,
    alpha = 1,
    baseline = 'alphabetic',
  } = opts;
  if (alpha <= 0.002) return 0;
  setFont(ctx, size, family);
  ctx.textBaseline = baseline;
  ctx.textAlign = 'left';
  const total = measure(ctx, str, size, family, ls);
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  if (ls === 0) {
    ctx.fillText(str, cx, y);
  } else {
    for (const ch of str) {
      ctx.fillText(ch, cx, y);
      cx += ctx.measureText(ch).width + ls;
    }
  }
  ctx.globalAlpha /= alpha;
  return total;
}

/**
 * Per-character choreographed reveal. `prog` is 0..1 for the whole line;
 * each glyph gets its own sub-window so the line assembles left to right.
 */
function textStagger(ctx, str, x, y, opts = {}) {
  const {
    size = 120,
    family = FONT.d,
    color = C.white,
    align = 'left',
    ls = 0,
    prog = 1,
    perChar = 0.055,
    rise = 0.55, // fraction of size to rise from
    alpha = 1,
    skew = 0,
  } = opts;
  if (alpha <= 0.002) return 0;
  setFont(ctx, size, family);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  const chars = [...str];
  const total = measure(ctx, str, size, family, ls);
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  const span = Math.max(0.0001, 1 - perChar * Math.max(0, chars.length - 1));
  chars.forEach((ch, i) => {
    const start = i * perChar;
    const p = clamp((prog - start) / span);
    const e = ease.outExpo(p);
    const w = ctx.measureText(ch).width;
    if (ch !== ' ' && p > 0.001) {
      ctx.save();
      ctx.globalAlpha *= alpha * clamp(p * 1.7);
      ctx.translate(cx + w / 2, y);
      const sc = lerp(0.82, 1, e);
      ctx.transform(1, 0, skew, 1, 0, 0);
      ctx.scale(sc, lerp(1.25, 1, e));
      ctx.translate(0, lerp(size * rise, 0, e));
      ctx.fillStyle = color;
      ctx.fillText(ch, -w / 2, 0);
      ctx.restore();
    }
    cx += w + ls;
  });
  return total;
}

/** Word-wrap helper returning an array of lines that fit `maxW`. */
function wrap(ctx, str, size, family, maxW, ls = 0) {
  setFont(ctx, size, family);
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    const test = line ? `${line} ${wd}` : wd;
    if (measure(ctx, test, size, family, ls) > maxW && line) {
      lines.push(line);
      line = wd;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Reveal a block of text by animating a per-line clip wipe. */
function paragraph(ctx, lines, x, y, lh, opts = {}) {
  const { prog = 1, perLine = 0.16, ...rest } = opts;
  lines.forEach((ln, i) => {
    const p = clamp((prog - i * perLine) / Math.max(0.0001, 1 - perLine * (lines.length - 1)));
    if (p <= 0.001) return;
    const e = ease.outQuart(p);
    ctx.save();
    ctx.translate(0, lerp(14, 0, e));
    text(ctx, ln, x, y + i * lh, { ...rest, alpha: (rest.alpha ?? 1) * clamp(p * 1.6) });
    ctx.restore();
  });
}

// ── Effects ─────────────────────────────────────────────────────────────────
/** Soft radial glow — used instead of a blur filter for speed. */
function glow(ctx, x, y, radius, color, strength = 0.5) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, rgba(color, strength));
  g.addColorStop(0.45, rgba(color, strength * 0.42));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

/** Rounded rect whose outline draws itself on (blueprint effect). */
function strokeRoundProgressive(ctx, x, y, w, h, r, prog, color, lw = 2) {
  const p = clamp(prog);
  if (p <= 0.001) return;
  const perim = 2 * (w + h);
  ctx.save();
  roundRectPath(ctx, x, y, w, h, r);
  ctx.setLineDash([perim, perim]);
  ctx.lineDashOffset = perim * (1 - p);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

/** Animated dash-stroke line (blueprint "drawing on" effect). */
function drawLine(ctx, x1, y1, x2, y2, prog, color, lw = 3) {
  const p = clamp(prog);
  if (p <= 0.001) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(lerp(x1, x2, p), lerp(y1, y2, p));
  ctx.stroke();
  ctx.restore();
}

/** Small uppercase kicker label with wide tracking. */
function kicker(ctx, str, x, y, opts = {}) {
  return text(ctx, str.toUpperCase(), x, y, {
    size: 22,
    family: FONT.b,
    color: C.s400,
    ls: 4.5,
    ...opts,
  });
}

/** Pill / chip used for dimensions, grade bands, crosswalk targets. */
function pill(ctx, str, x, y, opts = {}) {
  const {
    size = 24,
    family = FONT.b,
    padX = 20,
    h = 46,
    bg = 'rgba(255,255,255,0.14)',
    fg = C.white,
    border = null,
    r = 12,
    alpha = 1,
    align = 'left',
  } = opts;
  const tw = measure(ctx, str, size, family, 0);
  const w = tw + padX * 2;
  const px = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  ctx.save();
  ctx.globalAlpha *= alpha;
  fillRound(ctx, px, y, w, h, r, bg);
  if (border) strokeRound(ctx, px, y, w, h, r, border, 2);
  text(ctx, str, px + padX, y + h / 2 + size * 0.35, { size, family, color: fg });
  ctx.restore();
  return w;
}

module.exports = {
  C,
  GRADE,
  FONT,
  clamp,
  win,
  lerp,
  ease,
  hexToRgb,
  rgba,
  mixHex,
  roundRectPath,
  fillRound,
  strokeRound,
  strokeRoundProgressive,
  card,
  setFont,
  measure,
  text,
  textStagger,
  wrap,
  paragraph,
  glow,
  drawLine,
  kicker,
  pill,
};
