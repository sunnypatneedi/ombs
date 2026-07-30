# OMBS promo video

Source for `ombs-promo.mp4` — a 51-second promotional film for the standard,
ending on a call to action for the `/demo` parent tool.

Every frame is drawn with `@napi-rs/canvas` and streamed as raw RGBA into
ffmpeg, so there is no browser or PNG sequence involved.

## Layout

| Path | What it is |
| --- | --- |
| `render.js` | Composition: scene timings, transitions, persistent background and brand mark, frame loop |
| `lib/kit.js` | Drawing kit — brand tokens, easing, rounded-rect/card helpers, typography helpers |
| `scenes/scene1..6.js` | One `draw(ctx, t, dur)` per scene, `t` in seconds from the scene start |
| `assets/fonts/` | Plus Jakarta Sans (400–800) and JetBrains Mono, registered one alias per weight |
| `assets/audio/` | `vo1..vo6.mp3` narration and `music_bed.mp3` |
| `mux.sh` | Places narration on the timeline, ducks the bed under it, muxes the deliverable |
| `ombs-promo.srt` | Captions for upload (YouTube, Vimeo, an LMS) |
| `ombs-promo.vtt` | Same cues as WebVTT, for an HTML `<track>`; published copy lives at `docs/ombs-promo.vtt` |

## Rebuilding

```bash
cd video
npm install
node render.js                 # -> build/ombs-promo-silent.mp4  (~2 min)
./mux.sh                       # -> ombs-promo.mp4
```

To iterate on a layout without a full encode, render single frames instead:

```bash
node render.js --stills 3.2,18,38,49   # -> build/stills/*.jpg
```

## Scene timings

Narration drives the cut points; each clip starts a beat after its scene opens.

| Scene | Window | Beat |
| --- | --- | --- |
| 1 | 0.00 – 6.70 | Hook — schools value making and building, but cannot say what good looks like |
| 2 | 6.70 – 14.50 | What OMBS is |
| 3 | 14.50 – 25.10 | Three domains, thirteen codes |
| 4 | 25.10 – 34.00 | Grade-band progression and crosswalks |
| 5 | 34.00 – 44.20 | The `/demo` parent tool |
| 6 | 44.20 – 51.30 | Tagline and call to action |

Changing a narration clip means re-measuring it (`ffprobe -show_entries
format=duration`) and updating both the scene duration in `render.js` and the
matching delay in `mux.sh`.

## Captions

`ombs-promo.srt` and `ombs-promo.vtt` carry the same fourteen cues, transcribed
from the narration clips themselves rather than from any script. Cue times are
clip-local positions plus that clip's `D1..D6` delay from `mux.sh`, so every cue
falls inside its own clip's window and no cue spans two clips.

Re-recording a clip or moving a delay invalidates the cues that sit on it: both
caption files and the published copy at `docs/ombs-promo.vtt` have to be re-timed
together.

The narration was written against v0.1.0 and now understates the standard — it
says five shared practices and does not mention `S.AI`, so the film implies
thirteen dimensions where v0.3.0 has fourteen. The captions reproduce what is
spoken; correcting the claim means re-recording, not editing the cues.
