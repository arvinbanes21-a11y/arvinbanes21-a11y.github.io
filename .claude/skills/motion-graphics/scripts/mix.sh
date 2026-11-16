#!/usr/bin/env bash
# Mix narration from narrate.py onto a rendered video at social-platform loudness (-14 LUFS).
# Usage: bash mix.sh plan.json video.mp4 out.mp4
set -euo pipefail
PLAN=$1 VIDEO=$2 OUT=$3
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
read -r INPUTS FILTER N < <(python3 - "$PLAN" <<'PY'
import json, sys
plan = json.load(open(sys.argv[1]))
ins = " ".join(f"-i {p['wav']}" for p in plan)
f = "".join(f"[{i}:a]aresample=48000,adelay={p['offset_ms']}:all=1[a{i}];" for i, p in enumerate(plan))
f += "".join(f"[a{i}]" for i in range(len(plan)))
print(ins.replace(" ", "|"), f, len(plan))
PY
)
IFS='|' read -r -a INARR <<< "$INPUTS"
ffmpeg -v error -y "${INARR[@]}" -filter_complex "${FILTER}amix=inputs=${N}:normalize=0:duration=longest,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,apad=whole_dur=${DUR},atrim=0:${DUR},loudnorm=I=-14:TP=-1.5:LRA=7[out]" -map "[out]" -ar 48000 -ac 2 /tmp/_narration_$$.wav
ffmpeg -v error -y -i "$VIDEO" -i /tmp/_narration_$$.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
rm -f /tmp/_narration_$$.wav
ffmpeg -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | head -2
