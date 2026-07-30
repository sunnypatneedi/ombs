'use strict';
/**
 * Scene 5 — THE PARENT TOOL AT /demo
 * A recreation of the parent-facing demo: child profile, practice explorer
 * slider (making <-> building lean) and a plain-English paraphrase that
 * rewrites itself as the slider moves. A cursor drives the whole thing.
 */
const K = require('../lib/kit');
const { C, FONT, win, lerp, ease, rgba, clamp } = K;

// Window frame
const WX = 200;
const WY = 180;
const WW = 1520;
const WH = 760;
const CHROME = 64;

// Columns
const C1 = { x: 244, w: 410 };
const C2 = { x: 698, w: 480 };
const C3 = { x: 1222, w: 454 };
const COL_Y = 466;
const COL_H = 352;

const GRADES = [
  { id: 'K2', label: 'K\u20132' },
  { id: '35', label: '3\u20135' },
  { id: '68', label: '6\u20138' },
  { id: '912', label: '9\u201312' },
];

// Slider geometry
const TRACK_X = 730;
const TRACK_W = 416;
const TRACK_Y = 592;

// Cursor keyframes: [time, x, y]
const CURSOR = [
  [4.35, 1500, 980],
  [5.15, 536, 700],
  [5.75, 536, 700],
  [6.1, TRACK_X + TRACK_W * 0.28, TRACK_Y + 8],
  [7.05, TRACK_X + TRACK_W * 0.68, TRACK_Y + 8],
  [7.75, 1636, 892],
];

const PARAPHRASE_A = {
  code: 'OMBS.S.DF.35.1',
  text: 'She can say who her comic is for \u2014 and name one thing that would make it good.',
  foot: 'Shared Practices \u00b7 Define',
  color: C.blue,
};
const PARAPHRASE_B = {
  code: 'OMBS.B.MT.35.1',
  text: 'She compares two materials before she builds \u2014 and says what broke when she tested it.',
  foot: 'Building \u00b7 Materials',
  color: C.green,
};

function sliderValue(t) {
  return lerp(0.28, 0.68, ease.inOutCubic(win(t, 6.1, 7.05)));
}

function cursorAt(t) {
  if (t < CURSOR[0][0]) return null;
  for (let i = 0; i < CURSOR.length - 1; i += 1) {
    const [t0, x0, y0] = CURSOR[i];
    const [t1, x1, y1] = CURSOR[i + 1];
    if (t <= t1) {
      const e = ease.inOutCubic(win(t, t0, t1));
      return { x: lerp(x0, x1, e), y: lerp(y0, y1, e) };
    }
  }
  const last = CURSOR[CURSOR.length - 1];
  return { x: last[1], y: last[2] };
}

function drawProfile(ctx, t) {
  const p = win(t, 1.25, 2.05);
  if (p <= 0.001) return;
  const e = ease.outQuart(p);
  ctx.save();
  ctx.globalAlpha *= clamp(p * 1.8);
  ctx.translate(0, lerp(22, 0, e));

  K.kicker(ctx, 'Child profile', C1.x, 442, { size: 17, color: C.s400, ls: 3 });
  K.card(ctx, C1.x, COL_Y, C1.w, COL_H, {
    r: 20,
    fill: C.s50,
    border: C.s200,
    borderWidth: 2.5,
    shadow: 'rgba(15,23,42,0.10)',
    shadowOffset: 7,
    lift: p,
  });

  // Avatar
  ctx.beginPath();
  ctx.arc(C1.x + 74, COL_Y + 74, 36, 0, Math.PI * 2);
  ctx.fillStyle = C.blue;
  ctx.fill();
  K.text(ctx, 'M', C1.x + 74, COL_Y + 76, {
    size: 32,
    family: FONT.d,
    color: C.white,
    align: 'center',
    baseline: 'middle',
  });
  K.text(ctx, 'Maya', C1.x + 126, COL_Y + 68, { size: 32, family: FONT.d, color: C.s900 });
  K.text(ctx, 'Grade 4 \u00b7 comics + circuits', C1.x + 126, COL_Y + 100, {
    size: 20,
    family: FONT.r,
    color: C.s500,
  });

  K.kicker(ctx, 'Grade band', C1.x + 32, COL_Y + 158, { size: 16, color: C.s400, ls: 3 });

  // Grade chips — "3-5" snaps selected once the cursor lands on it
  const selP = win(t, 5.2, 5.6);
  GRADES.forEach((g, i) => {
    const gx = C1.x + 32 + (i % 2) * 172;
    const gy = COL_Y + 180 + Math.floor(i / 2) * 62;
    const sel = i === 1 ? selP : 0;
    const grade = K.GRADE[g.id];
    const pop = 1 + 0.09 * Math.sin(Math.PI * clamp(sel)) ;
    ctx.save();
    ctx.translate(gx + 80, gy + 25);
    ctx.scale(pop, pop);
    ctx.translate(-(gx + 80), -(gy + 25));
    K.fillRound(ctx, gx, gy, 160, 50, 14, sel > 0.5 ? grade.bg : C.white);
    K.strokeRound(ctx, gx, gy, 160, 50, 14, sel > 0.5 ? grade.fg : C.s200, sel > 0.5 ? 3 : 2);
    K.text(ctx, grade.label, gx + 80, gy + 33, {
      size: 24,
      family: FONT.b,
      color: sel > 0.5 ? grade.fg : C.s500,
      align: 'center',
    });
    ctx.restore();
  });

  ctx.save();
  ctx.globalAlpha *= selP;
  K.text(ctx, 'Ages 8\u201311 \u00b7 13 practices in band', C1.x + 32, COL_Y + 320, {
    size: 19,
    family: FONT.r,
    color: C.s500,
  });
  ctx.restore();

  ctx.restore();
}

function drawExplorer(ctx, t) {
  const p = win(t, 1.75, 2.55);
  if (p <= 0.001) return;
  const e = ease.outQuart(p);
  const val = sliderValue(t);

  ctx.save();
  ctx.globalAlpha *= clamp(p * 1.8);
  ctx.translate(0, lerp(22, 0, e));

  K.kicker(ctx, 'Practice explorer', C2.x, 442, { size: 17, color: C.s400, ls: 3 });
  K.card(ctx, C2.x, COL_Y, C2.w, COL_H, {
    r: 20,
    fill: C.white,
    border: C.s200,
    borderWidth: 2.5,
    shadow: 'rgba(15,23,42,0.10)',
    shadowOffset: 7,
    lift: p,
  });

  K.text(ctx, 'Making', TRACK_X, COL_Y + 66, { size: 25, family: FONT.b, color: C.orange });
  K.text(ctx, 'Building', TRACK_X + TRACK_W, COL_Y + 66, {
    size: 25,
    family: FONT.b,
    color: C.green,
    align: 'right',
  });

  // Track
  const grad = ctx.createLinearGradient(TRACK_X, 0, TRACK_X + TRACK_W, 0);
  grad.addColorStop(0, C.orange);
  grad.addColorStop(0.5, '#CBD5E1');
  grad.addColorStop(1, C.green);
  K.fillRound(ctx, TRACK_X, TRACK_Y, TRACK_W, 16, 8, grad);

  // Ticks
  for (let i = 0; i <= 4; i += 1) {
    const tx = TRACK_X + (TRACK_W / 4) * i;
    ctx.fillStyle = rgba(C.s400, 0.5);
    ctx.fillRect(tx - 1, TRACK_Y + 26, 2, 8);
  }

  // Handle
  const hx = TRACK_X + TRACK_W * val;
  const dragging = t > 6.05 && t < 7.15;
  const hr = dragging ? 26 : 23;
  ctx.beginPath();
  ctx.arc(hx + 4, TRACK_Y + 12, hr, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15,23,42,0.18)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(hx, TRACK_Y + 8, hr, 0, Math.PI * 2);
  ctx.fillStyle = C.white;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = K.mixHex(C.orange, C.green, val);
  ctx.stroke();

  // Lean readouts
  const makingPct = Math.round((1 - val) * 100);
  const buildingPct = 100 - makingPct;
  const bars = [
    { label: 'Making', pct: makingPct, color: C.orange },
    { label: 'Building', pct: buildingPct, color: C.green },
  ];
  bars.forEach((b, i) => {
    const by = COL_Y + 218 + i * 58;
    K.text(ctx, b.label, TRACK_X, by + 18, { size: 20, family: FONT.b, color: C.s600 });
    K.text(ctx, `${b.pct}%`, TRACK_X + TRACK_W, by + 18, {
      size: 20,
      family: FONT.b,
      color: b.color,
      align: 'right',
    });
    K.fillRound(ctx, TRACK_X, by + 28, TRACK_W, 10, 5, C.s100);
    K.fillRound(ctx, TRACK_X, by + 28, (TRACK_W * b.pct) / 100, 10, 5, b.color);
  });

  ctx.restore();
}

function drawParaphrase(ctx, t) {
  const p = win(t, 2.25, 3.05);
  if (p <= 0.001) return;
  const e = ease.outQuart(p);
  const swap = win(t, 6.75, 7.35);
  const data = swap > 0.5 ? PARAPHRASE_B : PARAPHRASE_A;
  // Mid-swap the card briefly compresses, like content re-flowing.
  const swapPulse = Math.sin(Math.PI * clamp(swap));

  ctx.save();
  ctx.globalAlpha *= clamp(p * 1.8);
  ctx.translate(0, lerp(22, 0, e));

  K.kicker(ctx, 'In plain English', C3.x, 442, { size: 17, color: C.s400, ls: 3 });

  const tint = swap > 0.5 ? '#F0FDF4' : C.blueLight;
  const edge = swap > 0.5 ? '#BBF7D0' : '#BFDBFE';
  ctx.save();
  ctx.translate(C3.x + C3.w / 2, COL_Y + COL_H / 2);
  ctx.scale(1 - 0.02 * swapPulse, 1 - 0.02 * swapPulse);
  ctx.translate(-(C3.x + C3.w / 2), -(COL_Y + COL_H / 2));
  K.card(ctx, C3.x, COL_Y, C3.w, COL_H, {
    r: 20,
    fill: tint,
    border: edge,
    borderWidth: 2.5,
    shadow: 'rgba(15,23,42,0.10)',
    shadowOffset: 7,
    lift: p,
  });

  // Content fades through the swap so the rewrite reads as a change of state
  const contentAlpha = 1 - 0.85 * swapPulse;
  ctx.save();
  ctx.globalAlpha *= contentAlpha;
  K.pill(ctx, data.code, C3.x + 30, COL_Y + 30, {
    size: 19,
    family: FONT.mono,
    padX: 13,
    h: 36,
    r: 9,
    bg: C.white,
    fg: data.color,
  });

  const lines = K.wrap(ctx, data.text, 27, FONT.m, C3.w - 60);
  lines.forEach((ln, i) => {
    K.text(ctx, ln, C3.x + 30, COL_Y + 122 + i * 40, {
      size: 27,
      family: FONT.m,
      color: C.s900,
    });
  });

  ctx.fillStyle = rgba(data.color, 0.25);
  ctx.fillRect(C3.x + 30, COL_Y + COL_H - 74, C3.w - 60, 1.5);
  K.text(ctx, data.foot, C3.x + 30, COL_Y + COL_H - 34, {
    size: 19,
    family: FONT.b,
    color: data.color,
  });
  ctx.restore();
  ctx.restore();

  // Attention ring once the rewrite lands
  const ring = win(t, 7.4, 8.3);
  if (ring > 0.001 && ring < 0.999) {
    ctx.save();
    ctx.globalAlpha *= (1 - ring) * 0.9;
    const g = lerp(0, 18, ease.outCubic(ring));
    K.strokeRound(ctx, C3.x - g, COL_Y - g, C3.w + g * 2, COL_H + g * 2, 20 + g, C.green, 3);
    ctx.restore();
  }

  ctx.restore();
}

function drawCursor(ctx, t) {
  const cur = cursorAt(t);
  if (!cur) return;
  const fade = clamp(win(t, 4.35, 4.7) - win(t, 8.0, 8.45));
  if (fade <= 0.001) return;

  ctx.save();
  ctx.globalAlpha *= fade;

  // Click ripple on the grade chip
  const click = win(t, 5.18, 5.85);
  if (click > 0.001 && click < 0.999) {
    ctx.save();
    ctx.globalAlpha *= (1 - click) * 0.8;
    ctx.beginPath();
    ctx.arc(536, 700, lerp(6, 62, ease.outCubic(click)), 0, Math.PI * 2);
    ctx.strokeStyle = C.blue;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cur.x + 2, cur.y + 3, 13, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15,23,42,0.22)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cur.x, cur.y, 13, 0, Math.PI * 2);
  ctx.fillStyle = C.white;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.s900;
  ctx.stroke();
  ctx.restore();
}

function draw(ctx, t, dur) {
  const out = win(t, dur - 0.6, dur);
  const inP = win(t, 0.0, 0.9);
  const ie = ease.outQuart(inP);

  ctx.save();
  ctx.globalAlpha = lerp(1, 0, ease.inCubic(out));
  ctx.translate(960, 560);
  const s = lerp(0.94, 1, ie) * lerp(1, 0.965, ease.inCubic(out));
  ctx.scale(s, s);
  ctx.translate(0, lerp(30, 0, ie) + lerp(0, -40, ease.inCubic(out)));
  ctx.translate(-960, -560);

  // Window
  K.card(ctx, WX, WY, WW, WH, {
    r: 28,
    fill: C.white,
    border: C.s200,
    borderWidth: 3,
    shadow: 'rgba(0,0,0,0.5)',
    shadowOffset: 18,
    lift: inP,
  });

  // Chrome bar
  ctx.save();
  K.roundRectPath(ctx, WX, WY, WW, WH, 28);
  ctx.clip();
  ctx.fillStyle = C.s100;
  ctx.fillRect(WX, WY, WW, CHROME);
  ctx.fillStyle = C.s200;
  ctx.fillRect(WX, WY + CHROME - 2, WW, 2);
  ctx.restore();

  [0, 1, 2].forEach((i) => {
    ctx.beginPath();
    ctx.arc(WX + 34 + i * 26, WY + 32, 7, 0, Math.PI * 2);
    ctx.fillStyle = C.s300;
    ctx.fill();
  });

  const urlP = win(t, 0.15, 0.7);
  ctx.save();
  ctx.globalAlpha *= urlP;
  K.fillRound(ctx, WX + 140, WY + 14, 300, 36, 10, C.white);
  K.strokeRound(ctx, WX + 140, WY + 14, 300, 36, 10, C.s200, 2);
  K.fillRound(ctx, WX + 156, WY + 24, 12, 16, 3, C.s400);
  K.text(ctx, '/demo', WX + 180, WY + 39, { size: 21, family: FONT.mono, color: C.s700 });
  K.kicker(ctx, 'Parent tool', WX + WW - 34, WY + 40, {
    size: 16,
    color: C.s400,
    ls: 3,
    align: 'right',
  });
  ctx.restore();

  // Headline
  K.textStagger(ctx, 'What does making well look like at my child\u2019s age?', 244, 336, {
    size: 42,
    color: C.s900,
    prog: win(t, 0.35, 1.6),
    perChar: 0.013,
    rise: 0.3,
    ls: -0.4,
  });
  const subP = win(t, 0.9, 1.5);
  ctx.save();
  ctx.globalAlpha *= subP;
  K.text(ctx, 'Set the grade. Move the slider. Read the standard in plain English.', 244, 386, {
    size: 24,
    family: FONT.r,
    color: C.s500,
  });
  ctx.restore();

  drawProfile(ctx, t);
  drawExplorer(ctx, t);
  drawParaphrase(ctx, t);
  drawCursor(ctx, t);

  ctx.restore();
}

module.exports = { draw };
