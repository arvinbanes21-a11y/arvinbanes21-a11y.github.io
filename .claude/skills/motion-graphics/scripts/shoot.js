// Screenshot a motion-graphics page at given times (ms) for review.
// Usage: node shoot.js page.html outDir 1200,3400,5600
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [, , page, outDir, list] = process.argv;
  if (!page || !outDir || !list) { console.error('usage: node shoot.js page.html outDir t1,t2,...'); process.exit(1); }
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const probe = await b.newPage(); await probe.goto('file://' + path.resolve(page) + '?render');
  const { W, H } = await probe.evaluate(() => ({ W: Motion.W, H: Motion.H })); await probe.close();
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await p.goto('file://' + path.resolve(page) + '?render'); await p.evaluate(() => document.fonts.ready);
  for (const t of list.split(',').map(Number)) {
    await p.evaluate((t) => Motion.seek(t), t);
    await p.screenshot({ path: path.join(outDir, `t${String(t).padStart(6, '0')}.png`), clip: { x: 0, y: 0, width: W, height: H } });
  }
  await b.close();
  console.log(errors.length ? `page errors: ${JSON.stringify(errors)}` : 'no page errors');
})();
