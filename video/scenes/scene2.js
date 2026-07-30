'use strict';
/**
 * Scene 2 — WHAT OMBS IS
 * The brand lockup assembles, then three domain seeds are emitted from the
 * mark and drift toward the positions they will occupy in Scene 3.
 */
const K = require('../lib/kit');
const { C, FONT, win, lerp, ease, rgba, clamp } = K;

const CHIPS = [
  { label: 'K\u201312', color: C.blue },
  { label: '13 anchor codes', color: C.orange },
  { label: '52+ evidence descriptors', color: C.green },
  { label: 'CC BY-SA 4.0', color: C.s400 },
];

// Where the three domain seeds head as the scene ends (Scene 3 card centres).
const SEED_TARGETS = [
  { x: 400, y: 642, color: C.blue },
  { x: 960, y: 642, color: C.orange },
  { x: 1520, y: 642, color: C.green },
];

function draw(ctx, t, dur) {
  const out = win(t, dur - 0.6, dur);

  ctx.save();
  ctx.globalAlpha = lerp(1, 0, ease.inCubic(out));

  // ── Kicker ────────────────────────────────────────────────────────────
  const kp = win(t, 0.3, 0.85);
  ctx.save();
  ctx.globalAlpha *= kp;
  K.kicker(ctx, 'Introducing', 960, 316, { align: 'center', color: C.s500 });
  ctx.restore();

  // ── Ring pulse behind the mark ────────────────────────────────────────
  const ring = win(t, 0.15, 1.5);
  if (ring > 0.001 && ring < 0.999) {
    ctx.save();
    ctx.globalAlpha *= (1 - ring) * 0.5;
    K.strokeRound(
      ctx,
      660 - lerp(90, 240, ease.outCubic(ring)),
      490 - lerp(90, 240, ease.outCubic(ring)),
      lerp(180, 480, ease.outCubic(ring)),
      lerp(180, 480, ease.outCubic(ring)),
      lerp(44, 140, ease.outCubic(ring)),
      C.blue,
      3,
    );
    ctx.restore();
  }

  // ── Wordmark (the mark itself is the persistent logo, drawn by render) ─
  const wp = win(t, 0.55, 1.9);
  K.textStagger(ctx, 'OMBS', 786, 556, {
    size: 180,
    color: C.white,
    prog: wp,
    perChar: 0.09,
    rise: 0.4,
    ls: -4,
  });

  // ── Full name + positioning line ──────────────────────────────────────
  const sp = win(t, 1.5, 2.2);
  ctx.save();
  ctx.globalAlpha *= sp;
  ctx.translate(0, lerp(18, 0, ease.outQuart(sp)));
  K.text(ctx, 'Open Making and Building Standard', 960, 690, {
    size: 46,
    family: FONT.m,
    color: C.s300,
    align: 'center',
    ls: 0.5,
  });
  ctx.restore();

  const tp = win(t, 2.05, 2.75);
  ctx.save();
  ctx.globalAlpha *= tp;
  ctx.translate(0, lerp(14, 0, ease.outQuart(tp)));
  K.text(ctx, 'A shared vocabulary for the practices behind the projects \u2014 not another content standard.', 960, 748, {
    size: 30,
    family: FONT.r,
    color: C.s500,
    align: 'center',
  });
  ctx.restore();

  // ── Fact chips ────────────────────────────────────────────────────────
  const gap = 18;
  ctx.save();
  const widths = CHIPS.map((c) => K.measure(ctx, c.label, 24, FONT.b, 0) + 52);
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (CHIPS.length - 1);
  let cx = 960 - totalW / 2;
  CHIPS.forEach((chip, i) => {
    const p = win(t, 2.6 + i * 0.13, 3.15 + i * 0.13);
    if (p > 0.001) {
      const e = ease.outBack(p, 1.1);
      ctx.save();
      ctx.globalAlpha *= clamp(p * 1.8);
      ctx.translate(cx + widths[i] / 2, 830 + 26);
      ctx.scale(lerp(0.85, 1, e), lerp(0.85, 1, e));
      ctx.translate(-(cx + widths[i] / 2), -(830 + 26));
      K.fillRound(ctx, cx + 5, 835, widths[i], 52, 14, 'rgba(0,0,0,0.4)');
      K.fillRound(ctx, cx, 830, widths[i], 52, 14, rgba(chip.color, 0.16));
      K.strokeRound(ctx, cx, 830, widths[i], 52, 14, rgba(chip.color, 0.55), 2);
      K.text(ctx, chip.label, cx + 26, 830 + 34, {
        size: 24,
        family: FONT.b,
        color: chip.color === C.s400 ? C.s300 : chip.color,
      });
      ctx.restore();
    }
    cx += widths[i] + gap;
  });
  ctx.restore();

  // ── Domain seeds: emitted from the mark, drifting to their Scene 3 homes
  SEED_TARGETS.forEach((seed, i) => {
    const p = win(t, 4.15 + i * 0.16, dur + 0.35);
    if (p <= 0.001) return;
    const e = ease.inOutCubic(p);
    const sx = lerp(660, seed.x, e);
    const sy = lerp(490, seed.y, e);
    const rad = lerp(10, 150, ease.inCubic(p));
    ctx.save();
    ctx.globalAlpha *= clamp(p * 3) * lerp(1, 0.85, p);
    K.glow(ctx, sx, sy, rad * 2.1, seed.color, 0.28);
    ctx.beginPath();
    ctx.arc(sx, sy, rad * 0.42 + 8, 0, Math.PI * 2);
    ctx.fillStyle = rgba(seed.color, 0.9);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}

module.exports = { draw };
