/* Three.js hand-off pattern for the motion-graphics engine (needs three.min.js r158 inlined first).
   A flat element at stage px (x, y) is replaced by a 3D stand-in on one frame, the camera moves,
   and the camera returns front-on before handing back. */
const GL = (() => {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: $("gl"), antialias: true, alpha: true, preserveDrawingBuffer: true }); }
  catch (e) { return null; }                                   // caller keeps a 2D fallback
  renderer.setPixelRatio(window.devicePixelRatio || 1); renderer.setSize(STAGE.w, STAGE.h, false); renderer.setClearColor(0, 0);
  const scene = new THREE.Scene(), FOV = 35, D = (STAGE.h / 2) / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const cam = new THREE.PerspectiveCamera(FOV, STAGE.w / STAGE.h, 10, 10000);
  const world = (x, y) => [x - STAGE.w / 2, STAGE.h / 2 - y];  // stage px → world units at z = 0
  const setCam = (az, el, dist, tx = 0, ty = 0, tz = 0) => {
    cam.position.set(tx + dist * Math.sin(az) * Math.cos(el), ty + dist * Math.sin(el), tz + dist * Math.cos(az) * Math.cos(el));
    cam.lookAt(tx, ty, tz); cam.updateMatrixWorld();          // so label projection uses this frame's camera
  };
  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  // Stand-in for a 120×24 px bar whose top-left is at stage (300, 960): front face sits at z = 0.
  const [bx, by] = world(300 + 60, 960 + 12);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(120, 24, 24), new THREE.MeshBasicMaterial({ color: 0x64d2ff }));
  bar.position.set(bx, by, -12); scene.add(bar);
  const T = { in: 28100, orbit: [28100, 1200], back: [32300, 1200], out: 33600 };
  function render(t) {
    if (t < T.in || t > T.out + 10) return;
    const pIn = prog(t, ...T.orbit, FN.move), pOut = prog(t, ...T.back, FN.move);
    const k = pIn * (1 - pOut);                                 // 0 at both hand-offs → exact front-on match
    setCam(-.55 * k, .38 * k, D * (1 - .14 * k));
    renderer.render(scene, cam);
  }
  return { render, T };
})();
if (GL) {
  tw($("bar"), [{ opacity: 1 }, { opacity: 0 }], GL.T.in, 1, EASE.linear);   // flat → 3D on one frame
  tw($("gl"),  [{ opacity: 0 }, { opacity: 1 }], GL.T.in, 1, EASE.linear);
  tw($("gl"),  [{ opacity: 1 }, { opacity: 0 }], GL.T.out, 1, EASE.linear);  // 3D → flat on one frame
  tw($("bar"), [{ opacity: 0 }, { opacity: 1 }], GL.T.out, 1, EASE.linear);
  hook((t) => GL.render(t));
}
