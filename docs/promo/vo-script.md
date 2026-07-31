# Voiceover — OMBS /demo promo

Eight lines, 43 words, ~17.5 seconds of speech inside a 20-second cut. It is deliberately
short. The screen already carries the promise; the voice carries the operation, and the two
never say the same sentence.

**Register:** plain, warm, precise — the register of the standard itself. Never salesy, never
breathless. The `[excited]` tag appears once, on the line where the tool does its one trick.

**Honesty ledger.** Every line maps to a numbered Ground-truth item from the brief. A line with
no item is an overclaim and does not get recorded. Nothing here implies progress tracking,
comparison between children, assessment, accounts, data collection, or AI features, because the
tool has none of those.

| # | Frames | Line | Ground truth |
|---|--------|------|--------------|
| 1 | 24–90 | A first name. An age. | 1 · 2 |
| 2 | 150–235 | Three things they like making. | 3 |
| 3 | 205–250 | It leans Making, or Building. | 3 |
| 4 | 262–330 | Six practices, four grade bands. | 4 · 5 |
| 5 | 350–425 | Slide it, and watch one practice mature. | 5 |
| 6 | 415–450 | In the standard's own words. | 6 |
| 7 | 455–500 | Never a score. Never a rank. | 8 |
| 8 | 512–575 | Fifty-seven descriptors. Free, and open. | 7 · 9 |

Line 5 says *one practice* matures, not *the child*. The distinction is the whole point of the
band slider and it is the easiest thing in this script to get wrong.

Line 8's count is not typed into the video — `promo-src/src/standard.ts` derives it from
`docs/standards.json`. If the standard grows, re-record this line and re-render; the number on
screen will already have changed.

## The script

The generator reads the fenced block below and nothing else. One line per row, blank lines and
`#` comments ignored. Audio tags stay inline; ElevenLabs v3 reads them as delivery direction,
not as words.

```vo
[chill] A first name. An age.
[warm] Three things they like making.
[warm] It leans Making, or Building.
[chill] Six practices, four grade bands.
[excited] Slide it, and watch one practice mature.
[warm] In the standard's own words.
[warm] Never a score. Never a rank.
[warm] Fifty-seven descriptors. Free, and open.
```

## Recording it

```
export ELEVENLABS_API_KEY=…        # your key, your shell. Never committed, never logged.
node scripts/gen-vo.mjs            # writes docs/promo/vo.mp3
node scripts/render-promo.mjs      # picks the mp3 up automatically
```

`docs/promo/vo.mp3` is gitignored. The repository carries the script, not the recording, so a
re-record is a one-line command rather than a binary diff.

Optional environment: `ELEVENLABS_VOICE_ID` (defaults to a documented public voice),
`ELEVENLABS_MODEL_ID` (defaults to `eleven_v3`, which is the model that honours the tags).

## Captions

`docs/ombs-promo.vtt` belongs to the existing 103-second explainer, not to this cut. If this
promo needs captions, generate a new file rather than editing that one.
