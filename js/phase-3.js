(function() {

// ─────────────────────────────────────────────────────────────
// HECATE — PHASE 3 — SOLILOQUY
// The voice of Hecate becomes audible for the first time.
// The most recognisably composed of the early phases.
// Two systems coupling: higher emergent pitches (from Latency)
// meeting the depth of the Dark Energy synthesiser.
// The violet-red (Qoph path colour, path 29, hidden fire beneath
// the Moon's water field) surfaces here for the first time —
// not dominant, but present. The afterimage colour.
// Nine overlapping fields: four deep (Dark Energy body),
// five surface (higher emergent pitches, metallic character).
// Metallic particles reference contact mic / excitation character.
// Palette: deep blue-violet, violet, metallic-violet.
// Hidden: violet-red / crimson (Qoph, Golden Dawn King Scale).
// Brainwave target: theta (4–8 Hz)
// Dark Energy synthesiser as deeper tonal body.
// ─────────────────────────────────────────────────────────────

const canvas = document.getElementById('canvas-3');
const ctx    = canvas.getContext('2d');

function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
resize();
window.addEventListener('resize', resize);

// Fixed parameters (site version — no interactive controls)
const PULSE_RATE = 3.2;
const DENSITY    = 0.55;
const FIRE_AMT   = 0.22;

// Palette
const deepVioletBlue = {r:18, g:14, b:72 };
const blueViolet     = {r:48, g:28, b:118};
const violetMid      = {r:72, g:32, b:140};
const violetRed      = {r:120,g:18, b:65 }; // Qoph path colour — hidden fire
const crimsonDeep    = {r:90, g:10, b:40 };
const metallic       = {r:85, g:75, b:110};
const nearBlack      = {r:6,  g:4,  b:22 };

function lerp(a,b,t) { return {r:a.r+(b.r-a.r)*t, g:a.g+(b.g-a.g)*t, b:a.b+(b.b-a.b)*t}; }
function ease(t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; }
function clamp(v,lo,hi) { return Math.max(lo,Math.min(hi,v)); }

const bodyFields = [];
for (let i = 0; i < 9; i++) {
  bodyFields.push({
    x: 0.15+Math.random()*.7, y: 0.15+Math.random()*.7,
    r: 0.18+Math.random()*.32,
    phase: Math.random()*Math.PI*2, speed: 0.06+Math.random()*.18,
    pulseOffset: Math.random()*Math.PI*2,
    isDeep: i < 4,
  });
}

const metalParticles = [];
for (let i = 0; i < 45; i++) {
  metalParticles.push({
    x: Math.random(), y: Math.random(),
    phase: Math.random()*Math.PI*2, speed: 0.4+Math.random()*1.8,
    lifePhase: Math.random()*Math.PI*2, lifeSpeed: 0.8+Math.random()*2.5,
    size: 0.0008+Math.random()*.002,
  });
}

let fireEvents = [];
let fireSpawnTimer = 0;
function spawnFireEvent() {
  fireEvents.push({
    x: 0.2+Math.random()*.6, y: 0.2+Math.random()*.6,
    r: 0.08+Math.random()*.18,
    life: 0, maxLife: 2.5+Math.random()*3.5,
  });
}

let time = 0, lastTime = null;

function draw(ts) {
  if (!lastTime) lastTime = ts;
  const dt = Math.min((ts-lastTime)/1000, 0.05);
  lastTime = ts;
  time += dt;

  const pulseRate = PULSE_RATE;
  const density   = DENSITY;
  const fireAmt   = FIRE_AMT;
  const W = canvas.width, H = canvas.height;
  const masterPulse = 0.5+0.5*Math.sin(time*pulseRate*Math.PI*2);
  const masterEase  = ease(masterPulse);

  ctx.fillStyle = `rgb(${nearBlack.r},${nearBlack.g},${nearBlack.b})`;
  ctx.fillRect(0,0,W,H);

  // Body fields
  for (const f of bodyFields) {
    f.phase += dt*f.speed;
    const pCycle = 0.5+0.5*Math.sin(time*pulseRate*Math.PI*2+f.pulseOffset);
    const pEase  = ease(pCycle);
    const cx = (f.x+0.06*Math.sin(f.phase*1.1))*W;
    const cy = (f.y+0.04*Math.cos(f.phase*.8))*H;
    const radius = f.r*Math.min(W,H)*(0.85+0.2*pEase*density);
    const baseCol = f.isDeep
      ? lerp(blueViolet, violetMid, pEase*density)
      : lerp(violetMid, metallic, pEase*density*.6);
    const alpha = (f.isDeep ? 0.055 : 0.04) + density*0.07*pEase;
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,radius);
    g.addColorStop(0,   `rgba(${baseCol.r},${baseCol.g},${baseCol.b},${alpha.toFixed(3)})`);
    g.addColorStop(0.5, `rgba(${baseCol.r},${baseCol.g},${baseCol.b},${(alpha*.4).toFixed(3)})`);
    g.addColorStop(1,   `rgba(${nearBlack.r},${nearBlack.g},${nearBlack.b},0)`);
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }

  // Metallic particles
  for (const p of metalParticles) {
    p.phase += dt*p.speed; p.lifePhase += dt*p.lifeSpeed;
    const life  = Math.max(0,Math.sin(p.lifePhase));
    const alpha = clamp(life*density*.55*(0.4+0.6*masterEase),0,1);
    if (alpha < 0.02) continue;
    const px = (p.x+0.012*Math.sin(p.phase*2.3))*W;
    const py = (p.y+0.009*Math.cos(p.phase*1.7))*H;
    ctx.beginPath();
    ctx.arc(px,py,p.size*Math.min(W,H),0,Math.PI*2);
    ctx.fillStyle = `rgba(${metallic.r},${metallic.g},${metallic.b},${alpha.toFixed(3)})`;
    ctx.fill();
  }

  // Violet-red fire events
  fireSpawnTimer += dt;
  const spawnInterval = fireAmt > 0.05 ? (4.0 - fireAmt*3.0) : 9999;
  if (fireSpawnTimer > spawnInterval && fireAmt > 0.05) { spawnFireEvent(); fireSpawnTimer = 0; }
  fireEvents = fireEvents.filter(e => e.life < e.maxLife);
  for (const e of fireEvents) {
    e.life += dt;
    const prog = e.life/e.maxLife;
    const fadeIn  = clamp(prog*4,0,1);
    const fadeOut = clamp((1-prog)*2.5,0,1);
    const lifeAlpha = ease(fadeIn)*ease(fadeOut)*fireAmt*0.18;
    if (lifeAlpha < 0.004) continue;
    const col = lerp(violetRed, crimsonDeep, prog);
    const cx = e.x*W, cy = e.y*H;
    const r  = e.r*Math.min(W,H)*(0.7+0.4*ease(clamp(prog*4,0,1)));
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0,   `rgba(${col.r},${col.g},${col.b},${lifeAlpha.toFixed(3)})`);
    g.addColorStop(0.6, `rgba(${col.r},${col.g},${col.b},${(lifeAlpha*.3).toFixed(3)})`);
    g.addColorStop(1,   `rgba(${col.r},${col.g},${col.b},0)`);
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }

  // Global pulse
  const globalAlpha = density*0.07*masterEase;
  if (globalAlpha > 0.003) {
    const cx=W*.5, cy=H*.5;
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*.65);
    g.addColorStop(0,`rgba(${blueViolet.r},${blueViolet.g},${blueViolet.b},${globalAlpha.toFixed(3)})`);
    g.addColorStop(1,`rgba(${nearBlack.r},${nearBlack.g},${nearBlack.b},0)`);
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }

  // Vignette
  const vig = ctx.createRadialGradient(W*.5,H*.5,Math.min(W,H)*.25,W*.5,H*.5,Math.min(W,H)*.75);
  vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(4,2,16,0.65)');
  ctx.fillStyle = vig; ctx.fillRect(0,0,W,H);

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

})();