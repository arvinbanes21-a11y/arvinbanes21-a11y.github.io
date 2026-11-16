---
name: motion-graphics
description: Use when the user asks for a motion graphic, animated explainer, product-style animation, video, reel, short, intro, or "Apple-style" animation, or wants an existing animation's motion, transitions, morphs, narration or MP4 export improved. Covers 16:9 and 9:16 portrait output.
---

# Motion Graphics

House style and toolkit for scrubbable HTML motion graphics rendered to MP4.
Core principle: **transform, don't replace.** Objects persist and become the next
idea (a wheel becomes a tank becomes a thrust arrow); the camera moves through one
world instead of cutting between slides.

## Workflow

1. **Script before pixels.** Write the scene table (time, scene, what it explains)
   and the story question the piece answers. For factual pieces, sort every fact
   into *verified*, *claim* (label on screen), *estimate* (show the math), or *omit*
   (sources conflict). Never invent results or specs.
2. **Copy `template.html`** into the project/scratchpad and build scenes with its
   engine (`tw`, `hook`, `roll`, `morph`, `counter`, `scene`). Every animation is a
   paused WAAPI tween or a hook, so the whole piece is scrubbable and renders
   deterministically.
3. **Verify with stills** at each scene's settled state *and* mid-transition:
   `node scripts/shoot.js page.html outdir 1200,3400,...` then
   `python3 scripts/sheet.py outdir sheet.png`. Read the sheet; fix overlaps,
   orphans, stacked frames, dead space.
4. **Render:** `node scripts/render.js page.html out.mp4` (reads the stage size
   from the page; 1.5× scale gives 1920×1080 or 1080×1920, H.264, 30 fps, +1 s hold).
5. **Narration (optional):** `python3 scripts/narrate.py lines.json voice.onnx outdir`
   reports each line's length against its slot; then mix (see Audio).
6. Deliver MP4 + HTML source; state what was verified and what was not (e.g. audio
   you could not listen to).

## Motion system

| Token | Value | Use |
|---|---|---|
| `EASE.out` | cubic-bezier(.16,1,.3,1) | entrances |
| `EASE.exit` | cubic-bezier(.4,0,1,1) | exits, ~60% of entrance length |
| `EASE.move` | cubic-bezier(.65,0,.35,1) | on-screen → on-screen moves, morphs, camera |
| `EASE.ios` | cubic-bezier(.32,.72,0,1) | container morphs, headline rolls |
| `EASE.sweep` | cubic-bezier(.7,0,.2,1) | object wipes |
| `EASE.smooth` | spring, damping ratio 1.0 | default spring |
| `EASE.snappy` | spring, damping ratio 0.85 | quick UI landings |
| `EASE.playful` | spring, damping ratio 0.7 | **max once per piece** |

Durations: micro 150 · short 250 · base 450 · long 800 · hero 1200 ms. Staggers
60 ms (text) / 90 ms (objects), total stagger ≤ 400 ms.

**Entrance tiers** (hierarchy comes from tier, not size alone):
- *Hero* — mask reveal or roll, ~900 ms; the only tier allowed to blur.
- *Supporting* — fade + 12 px rise, 450 ms, no blur.
- *Meta* (labels, notes, disclaimers) — opacity only, 250 ms.

**Rules**
- One focal motion at a time; everything else holds still or drifts slowly.
- The visual leads its text by ~200 ms, or lands on the spoken word when narrated.
- Headlines change by **rolling through a mask** (`roll`), not by fading.
- No scene sits frozen: once settled, keep a subtle drift or a living element
  (spinning wheel, flickering plume) going.
- Physical honesty: wheels rotate by distance/radius, launches show anticipation
  (squat/dip) before the move, impacts squash then settle.

## Transition vocabulary

Pick the transition that explains the change. Story transitions first; UI
transitions only for product/UI content.

| Transition | Use when | Engine |
|---|---|---|
| **Camera push / match cut** | next idea is a part of the current object (car → wheel) | animate a `#cam` group; swap to a world-space stand-in on the exact frame the zoom lands |
| **Shape morph** | one thing becomes another (wheel → tank → thrust arrow) | `morph(pathEl, dA, dB, start, dur)` — similar shapes morph cleanly; for very different shapes add rotation or an intermediate shape to avoid the "blob" midpoint |
| **Object wipe** | an object's motion carries us forward (plume, beam, swipe) | wipe element and incoming scene's `clip-path` share the same start, duration and easing |
| **Container morph** | a summary expands into detail (pill → card) | animate box geometry with `EASE.ios`; old content out in 180 ms, new content in after 250 ms |
| **Rolling digits** | a number is the point | odometer strips per digit; blur the fast column mid-spin |
| **Headline roll** | any headline change | `roll(outEl, inEl, t)` inside a `.slot` mask |
| Crossfade | final card only | — |

## Composition

- Portrait 9:16 (720×1280 design canvas): keep text between y≈180 and y≈1050
  (platform UI covers the top and bottom); centre visuals around y≈640.
- 16:9 (1280×720): label y≈58, headline y≈88, visual band 200–680.
- Dark stage (#000, text #f5f5f7, accent #2997ff, cyan #64d2ff) for tech/automotive;
  light stage (#f5f5f7, ink #1d1d1f, accent #0071e3) for product/academic.
- Gradient text (`.grad`) for at most one hero line per scene.

## Audio

- **Voiceover:** Piper TTS (`pip install piper-tts`; voices from huggingface.co
  `rhasspy/piper-voices`, files served from `us.aws.cdn.hf.co`; both hosts must be
  allowed). Prefer the user's own recorded voice for personal or research content.
  Fit lines to slots by trimming words, never by speeding the voice up.
- **Mix:** place each line at scene start + 300 ms, then
  `highpass=f=80,acompressor=threshold=-20dB:ratio=3,loudnorm=I=-14:TP=-1.5:LRA=7`
  (social-platform loudness). Verify with `ebur128` and `silencedetect`.
- **Music:** leave it to the platform's licensed library unless the user supplies a track.

## Common mistakes

| Mistake | Fix |
|---|---|
| Every element fades + rises + blurs | apply the tier system; blur is hero-only |
| Scenes fade out and new ones fade in (slideshow) | share an object between scenes and transform it |
| Exit starts at the scene boundary → frames stack | start exits ~200 ms before the boundary |
| Springs with damping ratio < 0.6 (toy-like bounce) | use `smooth`/`snappy`; `playful` once |
| `fill: both` on sequential tweens of one element | always `fill: forwards`; set pre-entrance state in CSS (`.in`) |
| WAAPI transform on an SVG element that has a `transform` attribute | animate a wrapper `<g>`; put attribute transforms on children |
| Unverified numbers presented as fact | label as claim/estimate or omit |
| Wheels slide without turning | drive rotation from distance in a hook |
