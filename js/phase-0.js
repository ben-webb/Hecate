(function() {

// ─────────────────────────────────────────────────────────────
// HECATE — PHASE 0 — LATENCY
// No-input feedback threshold. The system before it sounds.
// Near-black field, micro-blue traces, the breath of a closed system.
// Palette: near-black indigo ground, micro traces of deep blue.
// Brainwave target: pre-delta / unconscious (<0.5 Hz)
// ─────────────────────────────────────────────────────────────

const canvas = document.getElementById('canvas-0');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

// Fixed parameters (site version — no interactive controls)
const EMERGE   = 0.12;
const BREATH_HZ= 0.08;
const UNSTABLE = 0.3;

// Sparse micro-particles — system noise, micro-feedback traces
const particles = [];
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random(), y: Math.random(),
    r: 0.001 + Math.random() * 0.003,
    phase: Math.random() * Math.PI * 2,
    speed: 0.02 + Math.random() * 0.12,
    lifePhase: Math.random() * Math.PI * 2,
    lifeSpeed: 0.3 + Math.random() * 1.2,
    hue: 200 + Math.random() * 40,
  });
}

// Slow deep emergence blobs
const blobs = [];
for (let i = 0; i < 5; i++) {
  blobs.push({
    x: 0.2 + Math.random() * 0.6,
    y: 0.2 + Math.random() * 0.6,
    r: 0.15 + Math.random() * 0.25,
    phase: Math.random() * Math.PI * 2,
    speed: 0.01 + Math.random() * 0.03,
  });
}

let time = 0, lastTime = null;
function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

function draw(ts) {
  if (!lastTime) lastTime = ts;
  const dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;
  time += dt;

  const emerge   = EMERGE;
  const breathHz = BREATH_HZ;
  const unstable = UNSTABLE;
  const W = canvas.width, H = canvas.height;

  ctx.fillStyle = 'rgb(2,3,8)';
  ctx.fillRect(0, 0, W, H);

  // Breath pulse
  const breathCycle = 0.5 + 0.5 * Math.sin(time * breathHz * Math.PI * 2);
  const breathAlpha = emerge * 0.06 * ease(breathCycle);
  if (breathAlpha > 0.001) {
    const g = ctx.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,Math.max(W,H)*.6);
    g.addColorStop(0, `rgba(8,18,55,${breathAlpha.toFixed(4)})`);
    g.addColorStop(1, 'rgba(2,3,8,0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }

  // Deep blobs
  for (const b of blobs) {
    b.phase += dt * b.speed;
    const cx = (b.x + 0.04*Math.sin(b.phase*1.3)) * W;
    const cy = (b.y + 0.03*Math.cos(b.phase*0.9)) * H;
    const radius = b.r * Math.min(W,H);
    const bAlpha = emerge * 0.04 * (0.5 + 0.5*Math.sin(b.phase*2.1));
    if (bAlpha < 0.001) continue;
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,radius);
    g.addColorStop(0, `rgba(12,28,72,${bAlpha.toFixed(4)})`);
    g.addColorStop(.5, `rgba(6,14,40,${(bAlpha*.4).toFixed(4)})`);
    g.addColorStop(1, 'rgba(2,3,8,0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }

  // Micro-particles
  for (const p of particles) {
    p.phase += dt * p.speed;
    p.lifePhase += dt * p.lifeSpeed;
    const lifeAlpha = Math.max(0, Math.sin(p.lifePhase));
    const instAlpha = unstable * lifeAlpha * emerge * 0.5;
    if (instAlpha < 0.01) continue;
    const flicker = 0.5 + 0.5*Math.sin(p.phase*7.3 + time*unstable*3);
    const finalAlpha = instAlpha * flicker;
    if (finalAlpha < 0.01) continue;
    const px = (p.x + 0.008*Math.sin(p.phase*3.1+time*unstable)) * W;
    const py = (p.y + 0.006*Math.cos(p.phase*2.7+time*unstable*.7)) * H;
    ctx.beginPath();
    ctx.arc(px, py, p.r*Math.min(W,H), 0, Math.PI*2);
    ctx.fillStyle = `hsla(${p.hue},60%,40%,${finalAlpha.toFixed(3)})`;
    ctx.fill();
  }

  // Occasional flash
  const flashCycle = Math.sin(time*.17)*Math.sin(time*.31)*Math.sin(time*.11);
  if (flashCycle > 0.85 && unstable > 0.2) {
    const fAlpha = (flashCycle-0.85)/0.15 * unstable * emerge * 0.08;
    ctx.fillStyle = `rgba(20,35,90,${fAlpha.toFixed(4)})`;
    ctx.fillRect(0,0,W,H);
  }

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

})();