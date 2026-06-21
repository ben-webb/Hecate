(function() {

// ─────────────────────────────────────────────────────────────
// HECATE — PHASE 2 — ENYS
// Cornish: island.
// Slow harmonic drift, warm resonance, suspended field.
// The island reflected in water. Not dramatic — environmental.
// Seven overlapping radial fields move independently.
// Palette: deep water-blue, blue-green, silver-grey.
// Golden Dawn correspondence: The Moon — Water element.
// Brainwave target: low theta (0.3–2 Hz tidal)
// ─────────────────────────────────────────────────────────────

const canvas = document.getElementById('canvas-2');
const ctx    = canvas.getContext('2d');

function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
resize();
window.addEventListener('resize', resize);

// Fixed parameters (site version — no interactive controls)
const SHIMMER_RATE = 0.6;
const DRIFT_SPEED  = 0.06;
const DEPTH_AMT    = 0.18;

// Palette — Water / Moon
const palette = [
  {r:10, g:18, b:48 }, {r:18, g:34, b:82 }, {r:28, g:55, b:110},
  {r:42, g:80, b:130}, {r:60, g:110,b:148}, {r:85, g:140,b:165},
  {r:120,g:168,b:185}, {r:165,g:200,b:215}, {r:190,g:215,b:225},
  {r:38, g:55, b:90 }, {r:50, g:75, b:120}, {r:70, g:95, b:130},
  {r:22, g:28, b:55 }, {r:8,  g:14, b:40 },
];

function lerp(a,b,t) { return {r:a.r+(b.r-a.r)*t, g:a.g+(b.g-a.g)*t, b:a.b+(b.b-a.b)*t}; }
function ease(t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; }

const layers = [];
for (let i = 0; i < 7; i++) {
  layers.push({
    x: Math.random(), y: Math.random(),
    r: 0.3 + Math.random() * 0.5,
    colorA: Math.floor(Math.random() * palette.length),
    colorB: Math.floor(Math.random() * palette.length),
    phase: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.7,
    shimmerPhase: Math.random() * Math.PI * 2,
    shimmerSpeed: 0.5 + Math.random() * 1.5,
  });
}

let time = 0, lastTime = null;

function draw(ts) {
  if (!lastTime) lastTime = ts;
  const dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;
  time += dt;

  const shimmerRate = SHIMMER_RATE;
  const driftSpeed  = DRIFT_SPEED;
  const depthAmt    = DEPTH_AMT;
  const W = canvas.width, H = canvas.height;

  ctx.fillStyle = `rgb(${palette[0].r},${palette[0].g},${palette[0].b})`;
  ctx.fillRect(0,0,W,H);

  for (const l of layers) {
    l.phase        += dt * driftSpeed * l.speed;
    l.shimmerPhase += dt * shimmerRate * l.shimmerSpeed * Math.PI * 2;
    const cx = (l.x + 0.15*Math.sin(l.phase*.7+l.shimmerPhase*.05)) * W;
    const cy = (l.y + 0.08*Math.cos(l.phase*.5+l.shimmerPhase*.04)) * H;
    const radius = l.r * Math.min(W,H) * 0.65;
    const shimmerT = 0.5 + 0.5*Math.sin(l.shimmerPhase);
    const driftT   = 0.5 + 0.5*Math.sin(l.phase*1.3);
    const mixT  = ease(shimmerT*depthAmt + driftT*(1-depthAmt));
    const col   = lerp(palette[l.colorA], palette[l.colorB], mixT);
    const alpha = 0.06 + 0.08*ease(shimmerT);
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,radius);
    g.addColorStop(0, `rgba(${Math.round(col.r)},${Math.round(col.g)},${Math.round(col.b)},${alpha.toFixed(3)})`);
    g.addColorStop(1, `rgba(${Math.round(col.r)},${Math.round(col.g)},${Math.round(col.b)},0)`);
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }

  // Silver wash — reflected moonlight
  const silverAlpha = 0.04 + 0.06*(0.5+0.5*Math.sin(time*shimmerRate*Math.PI*2*.3));
  const silver = ctx.createLinearGradient(0,0,W,H);
  silver.addColorStop(0,'rgba(190,210,225,0)');
  silver.addColorStop(0.4+0.15*Math.sin(time*.3),`rgba(190,210,225,${silverAlpha.toFixed(3)})`);
  silver.addColorStop(1,'rgba(190,210,225,0)');
  ctx.fillStyle = silver; ctx.fillRect(0,0,W,H);

  // Dark pulse
  const darkAlpha = 0.12*(0.5+0.5*Math.sin(time*shimmerRate*Math.PI*2*.15+1.2))*depthAmt;
  ctx.fillStyle = `rgba(6,10,30,${darkAlpha.toFixed(3)})`; ctx.fillRect(0,0,W,H);

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

})();