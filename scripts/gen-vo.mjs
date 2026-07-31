#!/usr/bin/env node
/**
 * Record the promo voiceover with ElevenLabs.
 *
 *   export ELEVENLABS_API_KEY=…
 *   node scripts/gen-vo.mjs
 *
 * Reads the script out of docs/promo/vo-script.md (the ```vo fenced block, one line per row)
 * and writes docs/promo/vo.mp3. The mp3 is gitignored: this repository carries the script, not
 * the recording, so a re-record is a command rather than a binary diff.
 *
 * The key: read from process.env and nowhere else. It is never printed, never written to a
 * file, never put in a URL, and never passed as an argument — the request header is the only
 * place it appears. `scrub()` runs over every message this script emits, including thrown
 * errors and anything the API sends back, so a key echoed inside a vendor error payload cannot
 * reach the terminal or a CI log.
 *
 * Environment:
 *   ELEVENLABS_API_KEY   required
 *   ELEVENLABS_VOICE_ID  optional · defaults to the public "Rachel" voice below
 *   ELEVENLABS_MODEL_ID  optional · defaults to eleven_v3, the model that reads the [tags]
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = path.join(ROOT, "docs", "promo", "vo-script.md");
const OUT = path.join(ROOT, "docs", "promo", "vo.mp3");

/** The cut is 600 frames at 30fps. A voiceover longer than this gets truncated by the video. */
const CUT_SECONDS = 20;

const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Rachel, public
const MODEL = process.env.ELEVENLABS_MODEL_ID || "eleven_v3";

/** Belt and braces: nothing this process prints may contain the key. */
const scrub = (s) => (KEY ? String(s).split(KEY).join("«ELEVENLABS_API_KEY»") : String(s));
const say = (s) => console.log(scrub(s));
const die = (s) => {
  console.error(scrub(s));
  process.exit(1);
};

if (!KEY) {
  die(
    "ELEVENLABS_API_KEY is not set.\n" +
      "  export ELEVENLABS_API_KEY=…   then re-run. The key is read from the environment and\n" +
      "  is never written to this repository.",
  );
}

/* ── the script ─────────────────────────────────────────────────────────── */

const md = readFileSync(SCRIPT, "utf8");
const block = md.match(/```vo\n([\s\S]*?)```/);
if (!block) die(`No \`\`\`vo block in ${path.relative(ROOT, SCRIPT)}.`);

const lines = block[1]
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));

if (!lines.length) die("The ```vo block is empty.");

// One request, not eight: ElevenLabs decides its own inter-sentence pacing, and eight separate
// clips concatenated would each carry their own lead-in silence and their own room tone.
const text = lines.join("\n");
const words = text.replace(/\[[a-z]+\]/g, "").split(/\s+/).filter(Boolean).length;

say(`script  · ${lines.length} lines, ${words} words (${path.relative(ROOT, SCRIPT)})`);
say(`voice   · ${VOICE}`);
say(`model   · ${MODEL}`);
say(`budget  · ${CUT_SECONDS}s cut\n`);

/* ── the request ────────────────────────────────────────────────────────── */

const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(VOICE)}?output_format=mp3_44100_128`,
  {
    method: "POST",
    headers: {
      "xi-api-key": KEY, // the only place the key appears
      "content-type": "application/json",
      accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: {
        // Plain and steady. High stability keeps it out of the breathless read that a promo
        // voice defaults to; this is the register of the standard, not an advert.
        stability: 0.55,
        similarity_boost: 0.75,
        style: 0.15,
        use_speaker_boost: true,
      },
    }),
  },
).catch((err) => die(`Request failed: ${err.message}`));

if (!res.ok) {
  const body = await res.text().catch(() => "");
  die(`ElevenLabs returned ${res.status} ${res.statusText}\n${body.slice(0, 800)}`);
}

const audio = Buffer.from(await res.arrayBuffer());
mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, audio);

say(`wrote   · ${path.relative(ROOT, OUT)} · ${(audio.length / 1024).toFixed(0)} KB`);

/* ── the one check worth making ─────────────────────────────────────────── */

let seconds = null;
try {
  seconds = Number(
    execFileSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", OUT],
      { encoding: "utf8" },
    ).trim(),
  );
} catch {
  say("note    · ffprobe not available, duration unchecked");
}

if (seconds) {
  say(`length  · ${seconds.toFixed(2)}s`);
  if (seconds > CUT_SECONDS) {
    say(
      `\n⚠  Longer than the ${CUT_SECONDS}s cut — the tail will be clipped.\n` +
        `   Shorten a line in ${path.relative(ROOT, SCRIPT)} and re-run, or re-time the beats\n` +
        `   in promo-src/src/script.ts. Do not lengthen the cut without re-checking the camera.`,
    );
  } else if (seconds < CUT_SECONDS - 4) {
    say(`\nnote    · ${(CUT_SECONDS - seconds).toFixed(1)}s of the cut is silent. That may be fine.`);
  }
}

say("\nNext:  node scripts/render-promo.mjs");
