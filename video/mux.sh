#!/usr/bin/env bash
# Lay narration over the silent render, duck the music bed under it and
# encode the deliverable.
set -euo pipefail
cd "$(dirname "$0")"

SILENT=build/ombs-promo-silent.mp4
OUT=ombs-promo.mp4
A=assets/audio

# Narration start times, in ms from the top of the film.
D1=700; D2=7100; D3=14900; D4=25450; D5=34350; D6=44700

ffmpeg -y -loglevel error \
  -i "$SILENT" \
  -i "$A/music_bed.mp3" \
  -i "$A/vo1.mp3" -i "$A/vo2.mp3" -i "$A/vo3.mp3" \
  -i "$A/vo4.mp3" -i "$A/vo5.mp3" -i "$A/vo6.mp3" \
  -filter_complex "\
[2]adelay=${D1}|${D1}[v1];\
[3]adelay=${D2}|${D2}[v2];\
[4]adelay=${D3}|${D3}[v3];\
[5]adelay=${D4}|${D4}[v4];\
[6]adelay=${D5}|${D5}[v5];\
[7]adelay=${D6}|${D6}[v6];\
[v1][v2][v3][v4][v5][v6]amix=inputs=6:normalize=0:dropout_transition=0[vo];\
[vo]apad=whole_dur=51.3,asplit=2[vomix][vokey];\
[1]atrim=0:51.3,asetpts=PTS-STARTPTS,volume=0.30,\
afade=t=in:st=0:d=1.8,afade=t=out:st=49.0:d=2.3[bed];\
[bed][vokey]sidechaincompress=threshold=0.025:ratio=9:attack=15:release=420:makeup=1[duck];\
[duck][vomix]amix=inputs=2:normalize=0:dropout_transition=0,\
loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.97,\
afade=t=out:st=50.9:d=0.4[aout]" \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart \
  "$OUT"

echo "wrote $OUT"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
