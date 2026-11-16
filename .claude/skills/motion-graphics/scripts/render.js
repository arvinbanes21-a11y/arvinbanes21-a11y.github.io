// Render a motion-graphics page to MP4.
// Usage: node render.js page.html out.mp4 [fps=30] [scale=1.5] [holdSeconds=1]
// The page must expose window.Motion = { seek, TOTAL, W, H } and support ?render.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const [, , page, out, fpsArg, scaleArg, holdArg] = process.argv;
  if (!page || !out) { console.error('usage: node render.js page.html out.mp4 [fps] [scale] [hold]'); process.exit(1); }
  const fps = +fpsArg || 30, scale = +scaleArg || 1.5, hold = holdArg === undefined ? 1 : +holdArg;
  const b = await chromium.launch();
  const probe = await b.newPage();
  await probe.goto('file://' + path.resolve(page) + '?render');
  const { W, H, TOTAL } = await probe.evaluate(() => ({ W: Motion.W, H: Motion.H, TOTAL: Motion.TOTAL }));
  await probe.close();
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: scale });
  const errors = []; p.on('pageerror', (e) => errors.push(e.message));
  await p.goto('file://' + path.resolve(page) + '?render');
  await p.evaluate(() => document.fonts.ready);
  const frames = Math.round(TOTAL / 1000 * fps) + Math.round(hold * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'slow', '-tune', 'animation', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    await p.evaluate((t) => Motion.seek(t), Math.min(TOTAL, i * 1000 / fps));
    const buf = await p.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close();
  console.log(`${frames} frames (${W * scale}x${H * scale}) in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${out}`);
  if (errors.length) { console.error('page errors:', errors); process.exit(2); }
})();
