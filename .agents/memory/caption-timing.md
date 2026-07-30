---
name: Caption cue timing for the promo film
description: Why the promo's caption cues are anchored to the mux delays, and what invalidates them.
---

# Caption cues are derived, not authored

**Rule:** the promo's SRT/VTT cue times are a narration clip's local timestamp
plus that clip's delay from `mux.sh`. Never let a cue span two narration clips,
and keep every cue inside its own clip's window.

**Why:** the film is six separate narration clips laid onto a silent render at
fixed delays. Anchoring cues to the clips (rather than to the film as one
continuous take) means a cue can only ever be wrong by as much as its own clip
moved, and re-timing after a re-record is arithmetic instead of a re-transcribe.
It also keeps captions off the screen during the musical gaps between clips.

**How to apply:** changing a `D1..D6` delay, or swapping any `vo*.mp3`,
invalidates the cues sitting on that clip — re-time the SRT, the VTT, and the
published `docs/` copy of the VTT together, they are meant to stay identical.
Verify by cutting each cue's window out of the muxed film with ffmpeg and
re-transcribing it: the text should come back matching the cue.
