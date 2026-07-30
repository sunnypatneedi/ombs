'use strict';
/**
 * Scene 1 — THE HOOK
 * "Every school values making and building. Far fewer can say what good looks like."
 * Blueprint rubric cells draw themselves in and fill with question marks.
 */
const K = require('../lib/kit');
const { C, FONT, win, lerp, ease, rgba, clamp } = K;

const CELLS = [
  { code: 'OMBS.S.DF', label: 'Define' },
  { code: 'OMBS.M.AU', label: 'Audience' },
  { code: 'OMBS.B.ST', label: 'Structure' },
  { code: 'OMBS.S.IT', label: 'Iterate' },
];

function draw(ctx, t, dur) {
  const out = win(t, dur - 0.55, dur);
  const oe = ease.inCubic(out);

  ctx.save();
  // Whole-scene exit: a slow push-in with a fade.
  ctx.translate(960, 540);
  ctx.scale(lerp(1, 1.06, oe), lerp(1, 1.06, oe));
  ctx.translate(-960, -540);
  ctx.globalAlpha = lerp(1, 0, ease.inQuart(out));

  // ── Kicker ────────────────────────────────────────────────────────────
  const kp = win(t, 0.55, 1.15);
  ctx.save();
  ctx.translate(0, lerp(16, 0, ease.outQuart(kp)));
  K.kicker(ctx, 'Every school says it values', 160, 300, {
    alpha: kp,
    color: C.s400,
  });
  ctx.restore();

  // ── Hero line: MAKING & BUILDING ──────────────────────────────────────
  const hp = win(t, 0.95, 2.5);
  const SZ = 132;
  let x = 160;
  x += K.textStagger(ctx, 'MAKING', x, 430, {
    size: SZ,
    color: C.orange,
    prog: hp,
    perChar: 0.05,
    ls: -2,
  });
  x += K.textStagger(ctx, ' & ', x, 430, {
    size: SZ,
    color: C.s600,
    prog: win(t, 1.25, 2.2),
    perChar: 0.05,
    ls: -2,
  });
  K.textStagger(ctx, 'BUILDING', x, 430, {
    size: SZ,
    color: C.green,
    prog: win(t, 1.35, 2.9),
    perChar: 0.05,
    ls: -2,
  });

  // ── Payoff line ───────────────────────────────────────────────────────
  const pp = win(t, 3.5, 4.7);
  K.textStagger(ctx, 'But what does good look like?', 160, 548, {
    size: 62,
    color: C.white,
    prog: pp,
    perChar: 0.022,
    rise: 0.35,
    ls: -0.5,
  });

  // ── Rubric cells: outline draws on, then the card fills, then "?" pops ─
  const CW = 380;
  const CH = 268;
  const GAP = 26;
  const X0 = 160;
  const Y0 = 668;

  CELLS.forEach((cell, i) => {
    const cx = X0 + i * (CW + GAP);
    const base = 0.25 + i * 0.17;
    const outline = win(t, base, base + 0.75);
    const fill = win(t, base + 0.7, base + 1.15);
    const qp = win(t, 2.55 + i * 0.28, 3.05 + i * 0.28);

    // Blueprint outline
    if (fill < 0.99) {
      K.strokeRoundProgressive(ctx, cx, Y0, CW, CH, 22, outline, rgba(C.blue, 0.55 * (1 - fill)), 2.5);
    }

    if (fill > 0.001) {
      const fe = ease.outBack(fill, 0.9);
      ctx.save();
      ctx.translate(cx + CW / 2, Y0 + CH / 2);
      ctx.scale(lerp(0.94, 1, fe), lerp(0.94, 1, fe));
      ctx.globalAlpha *= clamp(fill * 1.6);
      ctx.translate(-(cx + CW / 2), -(Y0 + CH / 2));
      K.card(ctx, cx, Y0, CW, CH, {
        r: 22,
        fill: C.white,
        border: C.s200,
        borderWidth: 3,
        shadowOffset: 11,
        lift: fill,
      });

      // Mono code chip
      K.pill(ctx, cell.code, cx + 26, Y0 + 26, {
        size: 19,
        family: FONT.mono,
        padX: 12,
        h: 34,
        r: 8,
        bg: C.s100,
        fg: C.s600,
      });
      K.text(ctx, cell.label, cx + 26, Y0 + 118, {
        size: 30,
        family: FONT.d,
        color: C.s900,
      });

      // Empty rubric rows waiting to be scored
      for (let r = 0; r < 2; r += 1) {
        K.fillRound(ctx, cx + 26, Y0 + 148 + r * 22, CW - 52 - r * 90, 10, 5, C.s100);
      }

      // The unanswered question
      if (qp > 0.001) {
        const qe = ease.outBack(qp, 2.2);
        ctx.save();
        ctx.globalAlpha *= clamp(qp * 2);
        ctx.translate(cx + CW - 74, Y0 + CH - 62);
        ctx.rotate(lerp(-0.35, 0, qe));
        ctx.scale(lerp(0.3, 1, qe), lerp(0.3, 1, qe));
        K.text(ctx, '?', 0, 0, {
          size: 96,
          family: FONT.d,
          color: C.orange,
          align: 'center',
          baseline: 'middle',
        });
        ctx.restore();
      }
      ctx.restore();
    }
  });

  ctx.restore();
}

module.exports = { draw };
