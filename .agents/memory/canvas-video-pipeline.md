---
name: Canvas → ffmpeg video pipeline
description: How to produce a real MP4 in a repl that has no video artifact scaffold, and the traps that cost the most time.
---

# Rendering video without a video-artifact scaffold

Some repls advertise only the `mockup-sandbox` artifact type, and the `video-js`
skill's React/Vite scaffold (`src/lib/video/hooks.ts`, `scripts/validate-recording.sh`)
does not exist. There is no browser/Playwright either. In that situation the
working path is: draw every frame with `@napi-rs/canvas`, pipe raw RGBA into
ffmpeg over stdin, then deliver the file with `presentAsset`.

**Why:** it needs no browser, no headless capture, and no PNG sequence on disk;
1920×1080 renders at roughly 12 ms/frame, so a ~50 s film encodes in ~2 minutes.

**How to apply:**

- Pipe `Buffer.from(ctx.getImageData(0, 0, W, H).data.buffer)` into
  `ffmpeg -f rawvideo -pix_fmt rgba -s WxH -r FPS -i -`, and honour backpressure
  (`if (!stdin.write(buf)) await once(stdin, 'drain')`).
- Give the renderer a `--stills t1,t2,...` mode that writes JPEGs. Reading those
  back as images is the only way to actually see the composition, and it is far
  cheaper than re-encoding to check a layout tweak.
- skia (napi-rs canvas) will not pick a weight out of a shared font family.
  Register **one alias per weight file** (`JK400`, `JK700`, …) and select the
  alias in `ctx.font`. Faux-bold otherwise.
- There is no `letterSpacing` — measure and place per character if you want
  tracking, and build `strokeRoundProgressive` from `setLineDash([perim*p, perim])`
  for draw-on outlines.

## Transition traps

- **Bar/panel wipes:** if each colour band shares one time window with a stagger
  offset, an ease with a slow head (`inOutQuart`) turns a 0.05 s offset into
  ~900 px of position difference, so the screen is *not* covered on the cut frame
  and the scene swap is visible. Split it into two phases: all panels reach full
  coverage at exactly the boundary time, then peel off staggered.
- **Iris/clip-circle reveals:** the outgoing scene is drawn past its own duration,
  so every scene function must tolerate `t > dur` (clamped window helpers do this
  for free). Repaint the shared background *inside* the clip before drawing the
  incoming scene, or the two scenes composite on top of each other.
- Revealing a scene whose first element is a large white card shows a featureless
  white blob for the length of the reveal. Anchor the iris where content appears
  early, and pull that scene's first entrances forward.

## Audio muxing trap

`sidechaincompress` ends when its **shortest** input ends. Ducking a music bed
against a narration key truncates the music the moment the last VO line stops —
here it silently cut the final 1.4 s. Pad the key first:
`[vo]apad=whole_dur=<total>,asplit=2[mix][key]`.
