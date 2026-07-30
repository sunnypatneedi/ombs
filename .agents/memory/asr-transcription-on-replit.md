---
name: Getting word-level transcripts of local audio
description: The managed ElevenLabs passthrough cannot upload files, so local Whisper is the working route for transcribing repo audio.
---

# Transcribing audio that lives in the repo

**Rule:** to transcribe a local audio file with word timings, run Whisper
locally via `@huggingface/transformers` (transformers.js + onnxruntime-node)
installed **outside** the repo (e.g. `/tmp`), not through the managed
`externalApi__elevenlabs` passthrough.

**Why:** the passthrough serializes `body` as JSON and rejects a string body
outright, so it cannot build a `multipart/form-data` request. Every ElevenLabs
endpoint that takes an audio *upload* — speech-to-text (Scribe), forced
alignment, voice changer, audio isolation — is therefore unreachable, no matter
how the file is encoded. Symptom to recognise: JSON body → `422`, and setting
`Content-Type: multipart/form-data` (with or without a boundary) → `400` even
when the only field is a valid `model_id`. A genuine multipart request would
have produced a `422` field-validation error instead. `cloud_storage_url`
does not help; it is also a form field.

**How to apply:**

- Decode to raw PCM with ffmpeg (`-ac 1 -ar 16000 -f f32le`) and feed the
  `Float32Array` straight to the pipeline — transformers.js does not decode mp3.
- `return_timestamps: 'word'` works on the `Xenova/whisper-*.en` models; do not
  pass `language`/`task` to an English-only model, it throws.
- Small models truncate unfamiliar acronyms (heard `IST` for `ISTE`). Confirm
  wording with `onnx-community/whisper-large-v3-turbo` (`dtype: 'q8'`) on the
  *clean isolated clip* — a window cut out of a music-bedded mix reproduces the
  same error and will fool a re-check.
- Cross-check the word timings against `ffmpeg -af silencedetect=noise=-38dB:d=0.2`;
  Whisper's word ends land ~0.05–0.2 s before the real silence starts.
