'use strict';
/**
 * Scene 6 — TAGLINE + CALL TO ACTION
 * The tagline lands, three domain bars sweep beneath it, and the /demo
 * destination snaps into place as a hard-shadow card.
 */
const K = require('../lib/kit');
const { C, FONT, win, lerp, ease, rgba, clamp } = K;

const LINE1 = [
  { s: 'Assess ', c: C.white },
  { s: 'making', c: C.orange },
  { s: ' and ', c: C.white },
  { s: 'building', c: C.green },
];

function draw(ctx, t, dur) {
  const push = ease.inOutCubic(win(t, dur - 1.6, dur));

  ctx.save();
  ctx.translate(960, 540);
  ctx.scale(lerp(1, 1.03, push), lerp(1, 1.03, push));
  ctx.translate(-960, -540);

  // ── Tagline line 1 (mixed colour, staggered per character) ────────────
  const SZ = 92;
  const p1 = win(t, 0.15, 1.65);
  const segW = LINE1.map((seg) => K.measure(ctx, seg.s, SZ, FONT.d, -2));
  const total1 = segW.reduce((a, b) => a + b, 0);
  let x = 960 - total1 / 2;
  // Characters are timed across the whole line, not per segment.
  const charsBefore = [];
  let acc = 0;
  LINE1.forEach((seg) => {
    charsBefore.push(acc);
    acc += seg.s.length;
  });
  const totalChars = acc;
  LINE1.forEach((seg, i) => {
    const offset = charsBefore[i] / totalChars;
    const span = seg.s.length / totalChars;
    const local = clamp((p1 - offset * 0.75) / Math.max(0.0001, span * 0.75 + 0.25));
    K.textStagger(ctx, seg.s, x, 454, {
      size: SZ,
      color: seg.c,
      prog: local,
      perChar: 0.05,
      rise: 0.42,
      ls: -2,
    });
    x += segW[i];
  });

  K.textStagger(ctx, 'with confidence.', 960, 574, {
    size: SZ,
    color: C.white,
    prog: win(t, 1.0, 2.35),
    perChar: 0.035,
    rise: 0.42,
    ls: -2,
    align: 'center',
  });

  // ── Three domain bars sweep in beneath the tagline ────────────────────
  [C.blue, C.orange, C.green].forEach((col, i) => {
    const bp = win(t, 2.15 + i * 0.11, 2.85 + i * 0.11);
    if (bp <= 0.001) return;
    const e = ease.outExpo(bp);
    const w = lerp(0, 128, e);
    const bx = 960 - 208 + i * 144;
    ctx.save();
    ctx.globalAlpha *= clamp(bp * 2);
    K.fillRound(ctx, bx, 632, w, 9, 5, col);
    ctx.restore();
  });

  // ── Call to action ────────────────────────────────────────────────────
  const kp = win(t, 3.05, 3.6);
  ctx.save();
  ctx.globalAlpha *= kp;
  K.kicker(ctx, 'Try the parent tool', 960, 726, { align: 'center', color: C.s400 });
  ctx.restore();

  const cp = win(t, 3.3, 4.1);
  if (cp > 0.001) {
    const e = ease.outBack(cp, 1.5);
    const pulse = 1 + 0.012 * Math.sin((t - 4.1) * 3.1);
    const CW = 424;
    const CX = 960 - CW / 2;
    const CY = 762;
    const CHh = 124;
    ctx.save();
    ctx.globalAlpha *= clamp(cp * 2);
    ctx.translate(960, CY + CHh / 2);
    const s = lerp(0.82, 1, e) * (cp >= 1 ? pulse : 1);
    ctx.scale(s, s);
    ctx.translate(-960, -(CY + CHh / 2));

    ctx.save();
    ctx.globalAlpha *= 0.55;
    K.glow(ctx, 960, CY + CHh / 2, 320, C.blue, 0.5);
    ctx.restore();

    K.card(ctx, CX, CY, CW, CHh, {
      r: 30,
      fill: C.white,
      border: C.s200,
      borderWidth: 3,
      shadow: 'rgba(0,0,0,0.55)',
      shadowOffset: 16,
      lift: cp,
    });

    const nudge = 6 * Math.max(0, Math.sin((t - 4.1) * 2.6));
    K.text(ctx, '\u2192', CX + 62 + nudge, CY + CHh / 2 + 4, {
      size: 56,
      family: FONT.d,
      color: C.blue,
      align: 'center',
      baseline: 'middle',
    });
    K.text(ctx, '/demo', CX + 108, CY + CHh / 2 + 4, {
      size: 62,
      family: FONT.mono,
      color: C.s900,
      baseline: 'middle',
    });
    ctx.restore();
  }

  // ── Bottom lockup (the persistent mark parks itself here) ─────────────
  const lp = win(t, 4.25, 5.0);
  ctx.save();
  ctx.globalAlpha *= lp;
  K.text(ctx, 'Open Making and Building Standard', 787, 954, {
    size: 24,
    family: FONT.b,
    color: C.white,
  });
  K.text(ctx, 'v0.1.0 draft \u00b7 CC BY-SA 4.0 \u00b7 open to the community', 787, 986, {
    size: 20,
    family: FONT.r,
    color: C.s500,
  });
  ctx.restore();

  ctx.restore();
  void rgba;
}

module.exports = { draw };
