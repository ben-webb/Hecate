(function() {

// ─────────────────────────────────────────────────────────────
// HECATE — PHASE 1 — B1
// B♮ 61.7 Hz. The fixed reference point. The datum.
// A single stable electrical blue field, almost completely static.
// Everything else in the composition is measured against this tone.
// Two overlapping radial fields pulse at slightly different rates
// (ratio 1.013) creating a barely perceptible beating — a
// difference-tone effect.
// Scan lines reference the 50Hz electrical field infrastructure.
// Palette: deep near-black blue, single electrical blue field.
// Brainwave target: delta boundary (0.5–1 Hz)
// ─────────────────────────────────────────────────────────────

const canvas = document.getElementById('canvas-1');
const ctx = canvas.getContext('2d');

function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
resize();
window.addEventListener('resize', resize);

// Fixed parameters (site version — no interactive controls)
const PULSE_RATE = 0.22;
const WARMTH     = 0.28;
const FIELD_DEPTH= 0.22;

// Palette — electrical blue infrastructure
const blueCore   = { r:14,  g:38,  b:105 };
const blueDeep   = { r:6,   g:18,  b:58  };
const blueEdge   = { r:28,  g:62,  b:138 };
const blueGhost  = { r:45,  g:88,  b:160 };
const warmAmber  = { r:80,  g:55,  b:12  }; // electrical hum warmth

function lerp(a,b,t) { return {r:a.r+(b.r-a.r)*t, g:a.g+(b.g-a.g)*t, b:a.b+(b.b-a.b)*t}; }
function ease(t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; }

// Horizontal scan lines — 50Hz electrical field trace
const scanLines = [];
for (let i = 0; i < 8; i++) {
  scanLines.push({
    y: Math.random(),
    width: 0.002 + Math.random() * 0.003,
    phase: Math.random() * Math.PI * 2,
    speed: 0.008 + Math.random() * 0.015,
    alpha: 0.015 + Math.random() * 0.025,
  });
}

let time = 0, lastTime = null;

function draw(ts) {
  if (!lastTime) lastTime = ts;
  const dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;
  time += dt;

  const pulseRate  = PULSE_RATE;
  const warmth     = WARMTH;
  const fieldDepth = FIELD_DEPTH;
  const W = canvas.width, H = canvas.height;

  ctx.fillStyle = `rgb(${blueDeep.r},${blueDeep.g},${blueDeep.b})`;
  ctx.fillRect(0,0,W,H);

  // Primary pulse
  const mainPulse = 0.5 + 0.5*Math.sin(time * pulseRate * Math.PI*2);
  const pulsed    = ease(mainPulse);
  const cx = W*.5, cy = H*.5;
  const radius = Math.min(W,H)*(0.5 + fieldDepth*0.3*pulsed);
  const centreAlpha = 0.18 + fieldDepth*0.2*pulsed;
  const midCol = lerp(blueCore, blueEdge, pulsed*fieldDepth);

  const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,radius);
  grad.addColorStop(0,   `rgba(${blueGhost.r},${blueGhost.g},${blueGhost.b},${centreAlpha.toFixed(3)})`);
  grad.addColorStop(0.3, `rgba(${midCol.r},${midCol.g},${midCol.b},${(centreAlpha*.7).toFixed(3)})`);
  grad.addColorStop(0.7, `rgba(${blueCore.r},${blueCore.g},${blueCore.b},${(centreAlpha*.3).toFixed(3)})`);
  grad.addColorStop(1,   `rgba(${blueDeep.r},${blueDeep.g},${blueDeep.b},0)`);
  ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

  // Secondary pulse — beating at ratio 1.013 (difference tone)
  const beatPulse = 0.5 + 0.5*Math.sin(time*pulseRate*Math.PI*2*1.013+0.7);
  const beatAlpha = fieldDepth * 0.06 * ease(beatPulse);
  if (beatAlpha > 0.002) {
    const bg = ctx.createRadialGradient(cx+W*.04,cy-H*.03,0,cx+W*.04,cy-H*.03,Math.min(W,H)*.38);
    bg.addColorStop(0, `rgba(${blueEdge.r},${blueEdge.g},${blueEdge.b},${beatAlpha.toFixed(3)})`);
    bg.addColorStop(1, `rgba(${blueDeep.r},${blueDeep.g},${blueDeep.b},0)`);
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
  }

  // Scan lines
  for (const sl of scanLines) {
    sl.phase += dt * sl.speed * Math.PI * 2;
    const yPos = (sl.y + 0.003*Math.sin(sl.phase)) * H;
    const lineAlpha = sl.alpha * (0.5+0.5*Math.sin(sl.phase*.7)) * fieldDepth;
    if (lineAlpha < 0.003) continue;
    const lh = sl.width * H;
    const lg = ctx.createLinearGradient(0,yPos,W,yPos);
    lg.addColorStop(0,   `rgba(${blueGhost.r},${blueGhost.g},${blueGhost.b},0)`);
    lg.addColorStop(0.2, `rgba(${blueGhost.r},${blueGhost.g},${blueGhost.b},${lineAlpha.toFixed(3)})`);
    lg.addColorStop(0.8, `rgba(${blueGhost.r},${blueGhost.g},${blueGhost.b},${lineAlpha.toFixed(3)})`);
    lg.addColorStop(1,   `rgba(${blueGhost.r},${blueGhost.g},${blueGhost.b},0)`);
    ctx.fillStyle = lg; ctx.fillRect(0, yPos-lh/2, W, lh);
  }

  // Warmth — amber electrical hum, edges only
  if (warmth > 0.05) {
    const wAlpha = warmth * 0.055 * (0.7+0.3*pulsed);
    const wg = ctx.createRadialGradient(cx,H*.85,0,cx,H*.85,W*.7);
    wg.addColorStop(0, `rgba(${warmAmber.r},${warmAmber.g},${warmAmber.b},${wAlpha.toFixed(3)})`);
    wg.addColorStop(1, `rgba(${warmAmber.r},${warmAmber.g},${warmAmber.b},0)`);
    ctx.fillStyle = wg; ctx.fillRect(0,0,W,H);
  }

  // Vignette
  const vig = ctx.createRadialGradient(cx,cy,Math.min(W,H)*.3,cx,cy,Math.min(W,H)*.75);
  vig.addColorStop(0,'rgba(0,0,0,0)');
  vig.addColorStop(1,'rgba(2,4,14,0.55)');
  ctx.fillStyle = vig; ctx.fillRect(0,0,W,H);

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

})();