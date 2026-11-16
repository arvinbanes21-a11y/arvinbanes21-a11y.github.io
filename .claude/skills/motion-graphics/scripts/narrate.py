"""Synthesize narration lines with Piper and check each fits its scene slot.
Usage: python3 narrate.py lines.json voice.onnx outDir [lengthScale=1.0]
lines.json: [{"id": "hook", "start": 0, "end": 5500, "text": "..."}, ...]  (ms)
Writes outDir/<id>.wav and outDir/plan.json (start offsets for mixing).
Fit long lines by trimming words, not by lowering lengthScale."""
import sys, json, wave
from piper import PiperVoice
try:
    from piper import SynthesisConfig
except ImportError:
    SynthesisConfig = None
lines_path, model, out = sys.argv[1], sys.argv[2], sys.argv[3]
scale = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
voice = PiperVoice.load(model)
plan, over = [], 0
for ln in json.load(open(lines_path)):
    path = f"{out}/{ln['id']}.wav"
    with wave.open(path, "wb") as wf:
        if hasattr(voice, "synthesize_wav"):
            voice.synthesize_wav(ln["text"], wf, syn_config=SynthesisConfig(length_scale=scale) if SynthesisConfig else None)
        else:
            voice.synthesize(ln["text"], wf, length_scale=scale)
    with wave.open(path) as wf:
        dur = wf.getnframes() / wf.getframerate()
    offset = ln["start"] + ln.get("lead", 300)
    slot = (ln["end"] - offset - 200) / 1000
    flag = "OVER" if dur > slot else ""
    over += bool(flag)
    print(f"{ln['id']:12s} {dur:5.2f}s / slot {slot:5.2f}s {flag}")
    plan.append({"id": ln["id"], "wav": path, "offset_ms": offset})
json.dump(plan, open(f"{out}/plan.json", "w"), indent=1)
print(f"{over} line(s) over their slot")
