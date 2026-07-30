'use strict';
/**
 * Scene 3 — THREE DOMAINS
 * The site's domain cards, rebuilt as motion: each card snaps in, then holds
 * focus while its dimension pills land one by one in time with the narration.
 */
const K = require('../lib/kit');
const { C, FONT, win, lerp, ease, rgba, clamp } = K;

const DOMAINS = [
  {
    id: 'S',
    title: 'Shared Practices',
    desc: 'The spine every project runs on.',
    color: C.blue,
    dark: C.blueDark,
    count: 5,
    pills: ['Define', 'Draft', 'Test', 'Iterate', 'Share'],
    active: [0.85, 5.35],
    pillStart: 1.25,
    pillStep: 0.62,
  },
  {
    id: 'M',
    title: 'Making',
    desc: 'Bringing something into the world for an audience.',
    color: C.orange,
    dark: C.orangeDark,
    count: 4,
    pills: ['Audience', 'Purpose', 'Expression', 'Critique'],
    active: [5.35, 7.55],
    pillStart: 5.5,
    pillStep: 0.42,
  },
  {
    id: 'B',
    title: 'Building',
    desc: 'Constructing something that has to work.',
    color: C.green,
    dark: C.greenDark,
    count: 4,
    pills: ['Materials', 'Structure', 'Durability', 'Function'],
    active: [7.55, 9.7],
    pillStart: 7.7,
    pillStep: 0.42,
  },
];

const CARD_W = 520;
const CARD_H = 548;
const CARD_Y = 368;
const GAP = 40;
const X0 = (1920 - (CARD_W * 3 + GAP * 2)) / 2;

function layoutPills(ctx, pills, maxW) {
  const rows = [[]];
  let w = 0;
  pills.forEach((label) => {
    const pw = K.measure(ctx, label, 22, FONT.b, 0) + 36;
    if (w + pw > maxW && rows[rows.length - 1].length) {
      rows.push([]);
      w = 0;
    }
    rows[rows.length - 1].push({ label, w: pw });
    w += pw + 10;
  });
  return rows;
}

function draw(ctx, t, dur) {
  const out = win(t, dur - 0.5, dur);
  const oe = ease.inCubic(out);

  ctx.save();
  ctx.globalAlpha = lerp(1, 0, ease.inQuart(out));

  // ── Header ────────────────────────────────────────────────────────────
  const kp = win(t, 0.3, 0.85);
  ctx.save();
  ctx.globalAlpha *= kp;
  K.kicker(ctx, 'The framework', 140, 250, { color: C.s500 });
  ctx.restore();
  K.textStagger(ctx, 'Three domains, one shared spine', 140, 312, {
    size: 54,
    color: C.white,
    prog: win(t, 0.45, 1.5),
    perChar: 0.018,
    rise: 0.35,
    ls: -0.5,
  });

  // Running tally, right-aligned against the headline
  const tallyP = win(t, 0.6, 1.2);
  ctx.save();
  ctx.globalAlpha *= tallyP;
  const sCount = Math.round(lerp(0, 5, ease.outCubic(win(t, 1.2, 4.9))));
  const mCount = Math.round(lerp(0, 4, ease.outCubic(win(t, 5.5, 7.1))));
  const bCount = Math.round(lerp(0, 4, ease.outCubic(win(t, 7.7, 9.3))));
  const total = sCount + mCount + bCount;
  K.text(ctx, `${total}`, 1780, 318, {
    size: 96,
    family: FONT.d,
    color: rgba(C.white, 0.16),
    align: 'right',
  });
  K.text(ctx, 'codes', 1780, 250, {
    size: 22,
    family: FONT.b,
    color: C.s500,
    align: 'right',
    ls: 4.5,
  });
  ctx.restore();

  // ── Domain cards ──────────────────────────────────────────────────────
  DOMAINS.forEach((d, i) => {
    const x = X0 + i * (CARD_W + GAP);
    const inP = win(t, 0.15 + i * 0.13, 1.0 + i * 0.13);
    if (inP <= 0.001) return;
    const e = ease.outBack(inP, 1.05);

    const isActive = t >= d.active[0] && t < d.active[1];
    const afterAll = t >= 9.7;
    const focus = win(t, d.active[0] - 0.25, d.active[0] + 0.3) - (afterAll ? 0 : 0);
    const defocus = win(t, d.active[1] - 0.05, d.active[1] + 0.45);
    let emph = isActive || afterAll ? 1 : Math.max(0, focus - defocus);
    if (afterAll) emph = Math.max(emph, win(t, 9.7, 10.05));
    const dim = lerp(0.48, 1, emph);
    const rise = lerp(0, -18, emph);

    ctx.save();
    ctx.globalAlpha *= clamp(inP * 1.7);
    ctx.translate(x + CARD_W / 2, CARD_Y + CARD_H / 2 + rise);
    ctx.scale(lerp(0.9, 1, e), lerp(0.9, 1, e));
    ctx.translate(-(x + CARD_W / 2), -(CARD_Y + CARD_H / 2));

    // Focus glow behind the active card
    if (emph > 0.02) {
      ctx.save();
      ctx.globalAlpha *= emph * 0.85;
      K.glow(ctx, x + CARD_W / 2, CARD_Y + CARD_H / 2, 520, d.color, 0.3);
      ctx.restore();
    }

    ctx.globalAlpha *= dim;
    K.card(ctx, x, CARD_Y, CARD_W, CARD_H, {
      r: 32,
      fill: d.color,
      border: d.dark,
      borderWidth: 4,
      shadow: 'rgba(0,0,0,0.45)',
      shadowOffset: 14,
      lift: inP,
    });

    // Letter badge
    K.fillRound(ctx, x + 40, CARD_Y + 40, 76, 76, 20, 'rgba(255,255,255,0.20)');
    K.strokeRound(ctx, x + 40, CARD_Y + 40, 76, 76, 20, 'rgba(255,255,255,0.3)', 2);
    K.text(ctx, d.id, x + 78, CARD_Y + 78, {
      size: 40,
      family: FONT.d,
      color: C.white,
      align: 'center',
      baseline: 'middle',
    });

    // Dimension count, top-right
    const cnt = [sCount, mCount, bCount][i];
    K.text(ctx, `${cnt}`, x + CARD_W - 40, CARD_Y + 108, {
      size: 78,
      family: FONT.d,
      color: 'rgba(255,255,255,0.32)',
      align: 'right',
    });

    K.text(ctx, d.title, x + 40, CARD_Y + 176, {
      size: 38,
      family: FONT.d,
      color: C.white,
      ls: -0.5,
    });
    const descLines = K.wrap(ctx, d.desc, 24, FONT.r, CARD_W - 80);
    descLines.forEach((ln, li) => {
      K.text(ctx, ln, x + 40, CARD_Y + 224 + li * 32, {
        size: 24,
        family: FONT.r,
        color: 'rgba(255,255,255,0.88)',
      });
    });

    // Divider
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(x + 40, CARD_Y + 312, CARD_W - 80, 1.5);

    K.kicker(ctx, `${d.count} dimensions`, x + 40, CARD_Y + 356, {
      size: 18,
      color: 'rgba(255,255,255,0.7)',
      ls: 3,
    });

    // Pills land one at a time, in narration order
    const rows = layoutPills(ctx, d.pills, CARD_W - 80);
    let idx = 0;
    rows.forEach((row, ri) => {
      let px = x + 40;
      row.forEach((p) => {
        const start = d.pillStart + idx * d.pillStep;
        const pp = win(t, start, start + 0.45);
        const hit = win(t, start, start + 0.9);
        idx += 1;
        if (pp <= 0.001) return;
        const pe = ease.outBack(pp, 1.6);
        const py = CARD_Y + 382 + ri * 54;
        ctx.save();
        ctx.globalAlpha *= clamp(pp * 2);
        ctx.translate(px + p.w / 2, py + 22);
        const pop = 1 + 0.12 * Math.sin(Math.PI * clamp(hit)) * (1 - clamp(hit));
        ctx.scale(lerp(0.7, 1, pe) * pop, lerp(0.7, 1, pe) * pop);
        ctx.translate(-(px + p.w / 2), -(py + 22));
        const freshness = 1 - clamp(hit);
        K.fillRound(ctx, px, py, p.w, 44, 12, `rgba(255,255,255,${0.16 + 0.5 * freshness})`);
        K.strokeRound(ctx, px, py, p.w, 44, 12, 'rgba(255,255,255,0.34)', 2);
        K.text(ctx, p.label, px + 18, py + 30, {
          size: 22,
          family: FONT.b,
          color: freshness > 0.5 ? d.dark : C.white,
        });
        ctx.restore();
        px += p.w + 10;
      });
    });

    ctx.restore();
  });

  // ── Closing line ──────────────────────────────────────────────────────
  const fp = win(t, 9.45, 10.15);
  if (fp > 0.001) {
    ctx.save();
    ctx.globalAlpha *= fp;
    ctx.translate(0, lerp(20, 0, ease.outQuart(fp)));
    K.text(ctx, '5 + 4 + 4  \u2014  thirteen codes, one shared spine', 960, 1000, {
      size: 32,
      family: FONT.m,
      color: C.s300,
      align: 'center',
      ls: 0.5,
    });
    ctx.restore();
  }

  ctx.restore();
  void oe;
}

module.exports = { draw };
