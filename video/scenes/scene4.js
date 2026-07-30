'use strict';
/**
 * Scene 4 — GRADE-BAND PROGRESSION + CROSSWALKS
 * One anchor code (S.DF Define) walks its four bands along a progression
 * track, then the real crosswalk frameworks connect up from underneath.
 */
const K = require('../lib/kit');
const { C, FONT, GRADE, win, lerp, ease, rgba, clamp } = K;

const BANDS = [
  {
    key: 'K2',
    code: 'OMBS.S.DF.K2.1',
    text: 'Says what they will make \u2014 and names one person who will see it.',
    at: 0.95,
  },
  {
    key: '35',
    code: 'OMBS.S.DF.35.1',
    text: 'Records the artifact, the audience, and one criterion for success.',
    at: 1.85,
  },
  {
    key: '68',
    code: 'OMBS.S.DF.68.1',
    text: 'Two or more success criteria \u2014 and revises the plan at least once.',
    at: 2.75,
  },
  {
    key: '912',
    code: 'OMBS.S.DF.912.1',
    text: 'Frames intent against real constraints and defends the scope chosen.',
    at: 3.65,
  },
];

const CROSSWALKS = [
  { name: 'NGSS', sub: 'Engineering Design', count: '6 mappings', color: C.blue, at: 4.85 },
  { name: 'CCSS', sub: 'ELA Writing', count: '5 mappings', color: C.orange, at: 5.6 },
  { name: 'ISTE', sub: 'Students 2024', count: '10 mappings', color: C.green, at: 6.35 },
];

const TRACK_X0 = 330;
const TRACK_X1 = 1590;
const TRACK_Y = 486;
const CARD = { x: 420, y: 590, w: 1080, h: 200 };

function nodeX(i) {
  return TRACK_X0 + ((TRACK_X1 - TRACK_X0) / 3) * i;
}

function activeBand(t) {
  let idx = -1;
  BANDS.forEach((b, i) => {
    if (t >= b.at) idx = i;
  });
  return idx;
}

function draw(ctx, t, dur) {
  const out = win(t, dur - 0.55, dur);

  ctx.save();
  ctx.globalAlpha = lerp(1, 0, ease.inQuart(out));
  ctx.translate(960, 540);
  ctx.scale(lerp(1, 0.97, ease.inCubic(out)), lerp(1, 0.97, ease.inCubic(out)));
  ctx.translate(-960, -540);

  // ── Header ────────────────────────────────────────────────────────────
  const kp = win(t, 0.15, 0.7);
  ctx.save();
  ctx.globalAlpha *= kp;
  K.kicker(ctx, 'Grade-band progression', 140, 250, { color: C.s500 });
  ctx.restore();
  K.textStagger(ctx, 'One practice, four bands', 140, 312, {
    size: 54,
    color: C.white,
    prog: win(t, 0.3, 1.3),
    perChar: 0.02,
    rise: 0.35,
    ls: -0.5,
  });

  // ── Anchor code chip ──────────────────────────────────────────────────
  const cp = win(t, 0.4, 1.0);
  if (cp > 0.001) {
    ctx.save();
    ctx.globalAlpha *= cp;
    const codeW = K.measure(ctx, 'OMBS.S.DF', 24, FONT.mono, 0) + 40;
    const nameW = K.measure(ctx, 'Define', 26, FONT.b, 0);
    const totalW = codeW + 18 + nameW;
    const sx = 960 - totalW / 2;
    K.fillRound(ctx, sx, 356, codeW, 46, 11, rgba(C.blue, 0.2));
    K.strokeRound(ctx, sx, 356, codeW, 46, 11, rgba(C.blue, 0.6), 2);
    K.text(ctx, 'OMBS.S.DF', sx + 20, 388, { size: 24, family: FONT.mono, color: '#93C5FD' });
    K.text(ctx, 'Define', sx + codeW + 18, 388, { size: 26, family: FONT.b, color: C.s300 });
    ctx.restore();
  }

  // ── Progression track ─────────────────────────────────────────────────
  const tp = win(t, 0.55, 1.35);
  ctx.save();
  ctx.globalAlpha *= clamp(tp * 2);
  K.fillRound(ctx, TRACK_X0, TRACK_Y - 3, (TRACK_X1 - TRACK_X0) * ease.outQuart(tp), 6, 3, rgba(C.white, 0.16));
  ctx.restore();

  const act = activeBand(t);

  // Filled portion of the track follows the active band
  if (act >= 0) {
    const fillTo = lerp(
      nodeX(Math.max(0, act - 1)),
      nodeX(act),
      ease.inOutCubic(win(t, BANDS[act].at, BANDS[act].at + 0.45)),
    );
    K.fillRound(ctx, TRACK_X0, TRACK_Y - 3, Math.max(0, fillTo - TRACK_X0), 6, 3, C.blue);
  }

  BANDS.forEach((b, i) => {
    const nx = nodeX(i);
    const appear = win(t, 0.7 + i * 0.1, 1.15 + i * 0.1);
    if (appear <= 0.001) return;
    const on = win(t, b.at, b.at + 0.35);
    const grade = GRADE[b.key];
    const isCurrent = act === i;

    ctx.save();
    ctx.globalAlpha *= clamp(appear * 1.8);

    // Node
    const r = lerp(9, 15, on);
    if (on > 0.01) {
      ctx.save();
      ctx.globalAlpha *= on;
      K.glow(ctx, nx, TRACK_Y, 90, C.blue, 0.5);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(nx, TRACK_Y, r, 0, Math.PI * 2);
    ctx.fillStyle = on > 0.5 ? C.white : rgba(C.white, 0.3);
    ctx.fill();

    // Grade pill
    ctx.save();
    const scale = lerp(0.92, 1, on);
    ctx.translate(nx, TRACK_Y + 66);
    ctx.scale(scale, scale);
    ctx.translate(-nx, -(TRACK_Y + 66));
    const pw = 132;
    ctx.globalAlpha *= lerp(0.5, 1, on);
    K.fillRound(ctx, nx - pw / 2, TRACK_Y + 42, pw, 48, 13, on > 0.5 ? grade.bg : rgba(C.white, 0.1));
    K.text(ctx, grade.label, nx, TRACK_Y + 74, {
      size: 26,
      family: FONT.b,
      color: on > 0.5 ? grade.fg : C.s400,
      align: 'center',
    });
    ctx.restore();

    // Connector from the current node down to the descriptor card
    if (isCurrent) {
      const cl = win(t, b.at + 0.05, b.at + 0.4);
      K.drawLine(ctx, nx, TRACK_Y + 96, nx, CARD.y - 8, cl, rgba(C.blue, 0.55), 2.5);
    }
    ctx.restore();
  });

  // ── Descriptor card, rewritten at every band ──────────────────────────
  const cardIn = win(t, 0.85, 1.4);
  if (cardIn > 0.001 && act >= 0) {
    const b = BANDS[act];
    const swap = win(t, b.at, b.at + 0.34);
    const pulse = Math.sin(Math.PI * clamp(swap));
    ctx.save();
    ctx.globalAlpha *= clamp(cardIn * 1.8);
    ctx.translate(960, CARD.y + CARD.h / 2);
    const s = lerp(0.96, 1, ease.outQuart(cardIn)) * (1 - 0.015 * pulse);
    ctx.scale(s, s);
    ctx.translate(-960, -(CARD.y + CARD.h / 2));

    K.card(ctx, CARD.x, CARD.y, CARD.w, CARD.h, {
      r: 26,
      fill: C.white,
      border: C.s200,
      borderWidth: 3,
      shadow: 'rgba(0,0,0,0.45)',
      shadowOffset: 13,
      lift: cardIn,
    });

    ctx.save();
    ctx.globalAlpha *= 1 - 0.9 * pulse;
    K.pill(ctx, b.code, CARD.x + 36, CARD.y + 26, {
      size: 21,
      family: FONT.mono,
      padX: 14,
      h: 40,
      r: 10,
      bg: C.blueLight,
      fg: C.blue,
    });
    const lines = K.wrap(ctx, b.text, 31, FONT.m, CARD.w - 76);
    lines.forEach((ln, li) => {
      K.text(ctx, ln, CARD.x + 36, CARD.y + (lines.length > 1 ? 118 : 134) + li * 40, {
        size: 31,
        family: FONT.m,
        color: C.s900,
      });
    });
    ctx.restore();
    ctx.restore();
  }

  // ── Crosswalks ────────────────────────────────────────────────────────
  const xkp = win(t, 4.35, 4.9);
  ctx.save();
  ctx.globalAlpha *= xkp;
  K.kicker(ctx, 'Every code crosswalks out', 960, 846, { align: 'center', color: C.s500 });
  ctx.restore();

  const CHIP_W = 404;
  const CHIP_H = 88;
  const CHIP_GAP = 28;
  const totalW = CHIP_W * 3 + CHIP_GAP * 2;
  CROSSWALKS.forEach((cw, i) => {
    const p = win(t, cw.at, cw.at + 0.5);
    if (p <= 0.001) return;
    const e = ease.outBack(p, 1.2);
    const cx = 960 - totalW / 2 + i * (CHIP_W + CHIP_GAP);
    const cy = 880;

    // Connector up to the descriptor card
    K.drawLine(
      ctx,
      cx + CHIP_W / 2,
      cy,
      cx + CHIP_W / 2,
      CARD.y + CARD.h + 8,
      win(t, cw.at - 0.12, cw.at + 0.3),
      rgba(cw.color, 0.4),
      2,
    );

    ctx.save();
    ctx.globalAlpha *= clamp(p * 2);
    ctx.translate(cx + CHIP_W / 2, cy + CHIP_H / 2);
    ctx.scale(lerp(0.86, 1, e), lerp(0.86, 1, e));
    ctx.translate(-(cx + CHIP_W / 2), -(cy + CHIP_H / 2));
    K.fillRound(ctx, cx + 6, cy + 6, CHIP_W, CHIP_H, 18, 'rgba(0,0,0,0.35)');
    K.fillRound(ctx, cx, cy, CHIP_W, CHIP_H, 18, rgba(cw.color, 0.14));
    K.strokeRound(ctx, cx, cy, CHIP_W, CHIP_H, 18, rgba(cw.color, 0.55), 2.5);
    K.text(ctx, cw.name, cx + 26, cy + 44, { size: 30, family: FONT.d, color: C.white });
    K.text(ctx, cw.sub, cx + 26, cy + 72, { size: 20, family: FONT.r, color: C.s400 });
    K.text(ctx, cw.count, cx + CHIP_W - 26, cy + 56, {
      size: 20,
      family: FONT.b,
      color: cw.color === C.blue ? '#93C5FD' : cw.color === C.orange ? '#FDBA74' : '#86EFAC',
      align: 'right',
    });
    ctx.restore();
  });

  ctx.restore();
}

module.exports = { draw };
