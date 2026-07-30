'use strict';
/**
 * OMBS promo video renderer.
 *
 * Draws every frame with @napi-rs/canvas and streams raw RGBA straight into
 * ffmpeg, so no intermediate PNG sequence ever hits disk.
 *
 *   node render.js                     -> build/ombs-promo-silent.mp4
 *   node render.js --stills 2,9,18     -> build/stills/still_<t>.png
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const K = require('./lib/kit');

const { C, FONT, win, lerp, ease, rgba, clamp } = K;

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

// ── Composition ─────────────────────────────────────────────────────────────
const W = 1920;
const H = 1080;
const FPS = 30;

const SCENES = [
  { mod: require('./scenes/scene1'), dur: 6.7 },
  { mod: require('./scenes/scene2'), dur: 7.8 },
  { mod: require('./scenes/scene3'), dur: 10.6 },
  { mod: require('./scenes/scene4'), dur: 8.9 },
  { mod: require('./scenes/scene5'), dur: 10.2 },
  { mod: require('./scenes/scene6'), dur: 7.1 },
];

const STARTS = [];
SCENES.reduce((acc, s, i) => {
  STARTS[i] = acc;
  return acc + s.dur;
}, 0);
const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);

/** Boundary transitions, one per gap between scenes. */
const TRANSITIONS = [
  { kind: 'wipe' },
  { kind: 'iris', ax: 960, ay: 520 },
  { kind: 'wipe' },
  { kind: 'iris', ax: 620, ay: 330 },
  { kind: 'wipe' },
];

/** Persistent brand mark: one element that travels the whole film. */
const MARK = [
  { x: 140, y: 78, size: 72, lockup: 1, bs: 0, bd: 0.6 },
  { x: 570, y: 400, size: 180, lockup: 0, bs: 0, bd: 0.75 },
  { x: 140, y: 78, size: 72, lockup: 1, bs: 0, bd: 0.8 },
  { x: 140, y: 78, size: 72, lockup: 1, bs: 0, bd: 0.6 },
  { x: 140, y: 78, size: 72, lockup: 1, bs: 0, bd: 0.6 },
  { x: 703, y: 928, size: 64, lockup: 0, bs: 0, bd: 0.5 },
];

/** Persistent accent bar: repositions and recolours per beat. */
const BAR = [
  { x: 160, y: 578, w: 340, color: C.orange, bs: 0.9, bd: 0.7 },
  { x: 760, y: 600, w: 400, color: C.blue, bs: 0, bd: 0.9 },
  { x: 140, y: 340, w: 380, color: C.blue, bs: 0, bd: 0.8 },
  { x: 140, y: 340, w: 380, color: C.green, bs: 0, bd: 0.8 },
  { x: 200, y: 986, w: 420, color: C.blue, bs: 0.3, bd: 0.9 },
  { x: 752, y: 632, w: 128, color: C.blue, bs: 1.5, bd: 0.9 },
];

// ── Canvas ──────────────────────────────────────────────────────────────────
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// One-off noise tile, reused as a repeating pattern for film grain.
function buildNoise() {
  const n = createCanvas(220, 220);
  const nc = n.getContext('2d');
  const img = nc.createImageData(220, 220);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 210;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  nc.putImageData(img, 0, 0);
  return n;
}
const NOISE = buildNoise();
const NOISE_PATTERN = ctx.createPattern(NOISE, 'repeat');

// ── Persistent layers ───────────────────────────────────────────────────────
function paintBackground(c, time) {
  const g = c.createLinearGradient(0, 0, 400, H);
  g.addColorStop(0, C.ink0);
  g.addColorStop(0.55, C.ink1);
  g.addColorStop(1, C.ink2);
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);

  // Blueprint grid, slowly drifting — the standard as graph paper.
  const cell = 96;
  const dx = (time * 5.5) % cell;
  const dy = (time * 3.2) % cell;
  c.save();
  c.strokeStyle = 'rgba(148,163,184,0.055)';
  c.lineWidth = 1;
  c.beginPath();
  for (let x = -cell + dx; x <= W + cell; x += cell) {
    c.moveTo(x, 0);
    c.lineTo(x, H);
  }
  for (let y = -cell + dy; y <= H + cell; y += cell) {
    c.moveTo(0, y);
    c.lineTo(W, y);
  }
  c.stroke();
  // Every fourth line reads a little heavier.
  c.strokeStyle = 'rgba(148,163,184,0.075)';
  c.lineWidth = 1.5;
  c.beginPath();
  for (let x = -cell * 4 + dx; x <= W + cell * 4; x += cell * 4) {
    c.moveTo(x, 0);
    c.lineTo(x, H);
  }
  for (let y = -cell * 4 + dy; y <= H + cell * 4; y += cell * 4) {
    c.moveTo(0, y);
    c.lineTo(W, y);
  }
  c.stroke();
  c.restore();

  // Three domain-coloured atmospheres, always drifting.
  const blobs = [
    { col: C.blue, r: 780, px: [0.18, 0.42, 0.26], py: [0.28, 0.16, 0.38], sp: 0.045, a: 0.3 },
    { col: C.orange, r: 620, px: [0.82, 0.66, 0.9], py: [0.72, 0.84, 0.6], sp: 0.037, a: 0.24 },
    { col: C.green, r: 700, px: [0.58, 0.78, 0.46], py: [0.88, 0.7, 0.94], sp: 0.029, a: 0.22 },
  ];
  blobs.forEach((b, i) => {
    const ph = time * b.sp + i * 1.7;
    const bx = W * (b.px[0] + 0.11 * Math.sin(ph * 2.1) + 0.07 * Math.cos(ph * 1.3));
    const by = H * (b.py[0] + 0.12 * Math.cos(ph * 1.7) + 0.06 * Math.sin(ph * 2.6));
    const rr = b.r * (1 + 0.12 * Math.sin(ph * 1.9));
    K.glow(c, bx, by, rr, b.col, b.a);
  });
}

function paintOverlay(c) {
  // Vignette
  const v = c.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.02);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.5)');
  c.fillStyle = v;
  c.fillRect(0, 0, W, H);

  // Grain
  c.save();
  c.globalAlpha = 0.035;
  c.fillStyle = NOISE_PATTERN;
  c.fillRect(0, 0, W, H);
  c.restore();
}

/** The OMBS mark: a hard-shadowed white tile, as on the docs site. */
function drawMark(c, x, y, size, alpha) {
  if (alpha <= 0.002) return;
  c.save();
  c.globalAlpha *= alpha;
  const r = size * 0.31;
  K.fillRound(c, x + size * 0.075, y + size * 0.075, size, size, r, 'rgba(0,0,0,0.45)');
  K.fillRound(c, x, y, size, size, r, C.white);
  K.text(c, 'OMBS', x + size / 2, y + size / 2 + 1, {
    size: size * 0.21,
    family: FONT.d,
    color: C.s900,
    align: 'center',
    baseline: 'middle',
    ls: -0.3,
  });
  c.restore();
}

function blend(list, i, localT, key) {
  const cur = list[i];
  const prev = list[Math.max(0, i - 1)];
  const b = ease.inOutCubic(win(localT, cur.bs, cur.bs + cur.bd));
  return lerp(prev[key], cur[key], b);
}

function paintPersistent(c, i, localT, time) {
  // Brand mark
  const cur = MARK[i];
  const prev = MARK[Math.max(0, i - 1)];
  const b = ease.inOutCubic(win(localT, cur.bs, cur.bs + cur.bd));
  const mx = lerp(prev.x, cur.x, b);
  const my = lerp(prev.y, cur.y, b);
  const ms = lerp(prev.size, cur.size, b);
  const lock = lerp(prev.lockup, cur.lockup, b);
  const intro = i === 0 ? win(localT, 0.05, 0.6) : 1;
  // In the final scene the mark steps aside, then reappears in the end lockup.
  const finale = i === 5 ? clamp(1 - win(localT, 0, 0.45) + win(localT, 4.25, 4.85)) : 1;
  const markAlpha = intro * finale;
  drawMark(c, mx, my, ms, markAlpha);

  if (lock > 0.01) {
    c.save();
    c.globalAlpha *= lock * markAlpha;
    K.text(c, 'OMBS', mx + ms + 20, my + ms * 0.46, {
      size: 28,
      family: FONT.d,
      color: C.white,
      ls: -0.3,
    });
    K.text(c, 'Open Making and Building Standard', mx + ms + 20, my + ms * 0.46 + 26, {
      size: 17,
      family: FONT.r,
      color: C.s500,
    });
    c.restore();
  }

  // Accent bar
  const bx = blend(BAR, i, localT, 'x');
  const by = blend(BAR, i, localT, 'y');
  const bw = blend(BAR, i, localT, 'w');
  const barCur = BAR[i];
  const barPrev = BAR[Math.max(0, i - 1)];
  const bb = ease.inOutCubic(win(localT, barCur.bs, barCur.bs + barCur.bd));
  const bcol = K.mixHex(barPrev.color, barCur.color, bb);
  const barIntro = i === 0 ? win(localT, 0.9, 1.5) : 1;
  if (bw > 2 && barIntro > 0.01) {
    c.save();
    c.globalAlpha *= barIntro;
    const breathe = 1 + 0.02 * Math.sin(time * 1.6);
    K.fillRound(c, bx, by, bw * breathe, 9, 5, bcol);
    c.restore();
  }
}

// ── Transitions ─────────────────────────────────────────────────────────────
const WIPE_IN = 0.52;
const WIPE_OUT = 0.58;
const IRIS_DUR = 0.62;

function paintScene(c, i, localT) {
  SCENES[i].mod.draw(c, localT, SCENES[i].dur);
}

/**
 * Three colour bands sweep across the cut. They arrive staggered but all land
 * flush at the boundary frame, so the scene swap itself is never visible; they
 * then peel off one after another to reveal what came next.
 */
function paintWipe(c, time, bt) {
  const cols = [C.blue, C.orange, C.green];
  const bandH = H / 3;
  const pw = W * 1.4;
  cols.forEach((col, i) => {
    let x;
    let edge;
    if (time <= bt) {
      const q = win(time, bt - 0.42 - i * 0.05, bt);
      if (q <= 0.001) return;
      x = lerp(W, 0, ease.outQuart(q));
      edge = 'lead';
    } else {
      const q = win(time, bt + i * 0.055, bt + 0.44 + i * 0.055);
      if (q >= 0.999) return;
      x = lerp(0, -pw, ease.outQuart(q));
      edge = 'trail';
    }
    c.save();
    c.fillStyle = col;
    c.fillRect(x, i * bandH, pw, bandH + 1);
    c.fillStyle = 'rgba(255,255,255,0.25)';
    if (edge === 'lead') c.fillRect(x - 9, i * bandH, 9, bandH + 1);
    else c.fillRect(x + pw, i * bandH, 9, bandH + 1);
    c.restore();
  });
}

// ── Frame ───────────────────────────────────────────────────────────────────
function renderFrame(time) {
  let i = SCENES.length - 1;
  for (let s = 0; s < SCENES.length; s += 1) {
    if (time < STARTS[s] + SCENES[s].dur) {
      i = s;
      break;
    }
  }
  const localT = time - STARTS[i];

  paintBackground(ctx, time);

  // Is an iris reveal running across the boundary into this scene?
  const inIris =
    i > 0 && TRANSITIONS[i - 1].kind === 'iris' && localT < IRIS_DUR ? TRANSITIONS[i - 1] : null;

  if (inIris) {
    paintScene(ctx, i - 1, SCENES[i - 1].dur + localT);
    const q = ease.inOutQuart(win(localT, 0, IRIS_DUR));
    const r = lerp(0, 2350, q);
    ctx.save();
    ctx.beginPath();
    ctx.arc(inIris.ax, inIris.ay, r, 0, Math.PI * 2);
    ctx.clip();
    paintBackground(ctx, time);
    paintScene(ctx, i, localT);
    ctx.restore();
    // Edge ring on the growing iris
    if (q < 0.995) {
      ctx.save();
      ctx.globalAlpha = 0.5 * (1 - q);
      ctx.beginPath();
      ctx.arc(inIris.ax, inIris.ay, r, 0, Math.PI * 2);
      ctx.strokeStyle = C.white;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();
    }
  } else {
    paintScene(ctx, i, localT);
  }

  paintPersistent(ctx, i, localT, time);

  // Wipes sit above everything they cut through.
  TRANSITIONS.forEach((tr, b) => {
    if (tr.kind !== 'wipe') return;
    const bt = STARTS[b] + SCENES[b].dur;
    if (time > bt - WIPE_IN - 0.1 && time < bt + WIPE_OUT + 0.3) paintWipe(ctx, time, bt);
  });

  paintOverlay(ctx);

  // Opening and closing fades
  const fadeIn = win(time, 0, 0.45);
  const fadeOut = 1 - win(time, TOTAL - 0.55, TOTAL);
  const fade = Math.min(fadeIn, fadeOut);
  if (fade < 0.999) {
    ctx.save();
    ctx.globalAlpha = 1 - fade;
    ctx.fillStyle = '#05080F';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

// ── Entry points ────────────────────────────────────────────────────────────
function stills(list, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  list.forEach((tRaw) => {
    const time = Number(tRaw);
    renderFrame(time);
    const buf = canvas.encodeSync('jpeg', 82);
    const name = `still_${time.toFixed(2).replace('.', '_')}.jpg`;
    fs.writeFileSync(path.join(outDir, name), buf);
    console.log('wrote', path.join(outDir, name));
  });
}

async function encode(outFile) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const frames = Math.round(TOTAL * FPS);
  const ff = spawn('ffmpeg', [
    '-y',
    '-loglevel', 'error',
    '-f', 'rawvideo',
    '-pix_fmt', 'rgba',
    '-s', `${W}x${H}`,
    '-r', String(FPS),
    '-i', '-',
    '-an',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '17',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outFile,
  ]);
  ff.stderr.on('data', (d) => process.stderr.write(d));
  const done = new Promise((res, rej) => {
    ff.on('close', (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`))));
    ff.on('error', rej);
  });

  const t0 = Date.now();
  for (let f = 0; f < frames; f += 1) {
    renderFrame(f / FPS);
    const buf = Buffer.from(ctx.getImageData(0, 0, W, H).data.buffer);
    if (!ff.stdin.write(buf)) {
      await new Promise((res) => ff.stdin.once('drain', res));
    }
    if (f % 150 === 0) {
      process.stdout.write(`  frame ${f}/${frames} (${((f / frames) * 100).toFixed(0)}%)\n`);
    }
  }
  ff.stdin.end();
  await done;
  console.log(`rendered ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${outFile}`);
}

async function main() {
  const args = process.argv.slice(2);
  const stillsIdx = args.indexOf('--stills');
  console.log(`composition: ${TOTAL.toFixed(2)}s`);
  SCENES.forEach((s, i) => console.log(`  scene ${i + 1}: ${STARTS[i].toFixed(2)} \u2192 ${(STARTS[i] + s.dur).toFixed(2)}`));
  if (stillsIdx !== -1) {
    stills(args[stillsIdx + 1].split(','), path.join(__dirname, 'build', 'stills'));
    return;
  }
  await encode(path.join(__dirname, 'build', 'ombs-promo-silent.mp4'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

void rgba;
void clamp;
