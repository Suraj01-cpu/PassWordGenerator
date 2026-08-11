# 🌈 PassWordGenerator — Colorful, Interactive Password Generator

A small project that creates high-security passwords and can be used to rotate passwords periodically. This README includes a vibrant, interactive demo you can open locally to try the generator in your browser.

> This project aims to provide an easy-to-use, secure password generator with visually engaging UI and accessibility-friendly controls.

---

## Table of Contents

- [Demo (interactive)](#demo-interactive)
- [Features](#features)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Security notes](#security-notes)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

---

## Demo (interactive)

Save the file below as `generator_demo.html` in the repository (or open it directly in your browser). It contains a colorful, interactive generator UI with:
- Length slider
- Toggles for uppercase, lowercase, numbers, symbols
- "Exclude ambiguous characters" option
- Real cryptographic randomness (uses Web Crypto where available)
- Visual strength meter and animated color accents
- Copy-to-clipboard with success feedback

Paste the entire contents into a new file named `generator_demo.html` and open it in Chrome/Firefox/Edge/Safari.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PassWordGenerator — Interactive Demo</title>
<style>
  :root{
    --bg1:#0f172a; --bg2:#0b1226;
    --card:#0f172a;
    --accent1:#7c3aed; --accent2:#06b6d4; --accent3:#f97316;
    --glass: rgba(255,255,255,0.04);
    --success:#16a34a;
  }
  html,body{height:100%}
  body{
    margin:0;padding:48px;
    font-family:Inter,system-ui,Segoe UI,Roboto,"Helvetica Neue",Arial;
    background: radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.10), transparent 8%),
                radial-gradient(1000px 500px at 90% 90%, rgba(6,182,212,0.08), transparent 8%),
                linear-gradient(180deg,var(--bg1),var(--bg2));
    color:#e6eef8;
    display:flex; align-items:center; justify-content:center;
  }
  .card{
    width:900px; max-width:94vw; background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    border-radius:14px; padding:28px; box-shadow:0 10px 30px rgba(2,6,23,0.7); backdrop-filter: blur(6px);
    border:1px solid rgba(255,255,255,0.03);
  }
  h1{margin:0 0 6px 0; font-size:1.5rem; display:flex; gap:12px; align-items:center}
  .subtitle{color:rgba(230,238,248,0.7); margin-bottom:18px}
  .grid{display:grid; grid-template-columns: 1fr 360px; gap:20px}
  .controls{display:flex; flex-direction:column; gap:12px}
  label.switch{display:flex; gap:12px; align-items:center; background:var(--glass); padding:10px;border-radius:10px;}
  input[type="range"]{width:100%;}
  .output{
    background:linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    padding:12px; border-radius:10px; display:flex; gap:8px; align-items:center; justify-content:space-between;
    border:1px solid rgba(255,255,255,0.03);
  }
  .output .pw{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace; font-size:1.05rem; word-break:break-all; color:#e6eef8}
  .btn{
    padding:10px 12px; border-radius:10px; border:0; cursor:pointer; font-weight:600;
    background:linear-gradient(90deg,var(--accent1),var(--accent2));
    color:white; box-shadow: 0 6px 18px rgba(12,8,30,0.4);
  }
  .btn.secondary{background:linear-gradient(90deg,var(--accent2),var(--accent3));}
  .meter{height:12px; border-radius:8px; overflow:hidden; background:rgba(255,255,255,0.04); margin-top:8px}
  .meter > i{display:block; height:100%; width:0%; background:linear-gradient(90deg,#ef4444,#f59e0b,#10b981); transition: width 300ms ease;}
  .right-panel{padding:12px; background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02)); border-radius:10px}
  small.helper{color:rgba(230,238,248,0.65)}
  .copy-ok{color:var(--success); font-weight:700}
  footer{margin-top:18px; color:rgba(230,238,248,0.6); font-size:0.9rem}
  @media (max-width:900px){ .grid{grid-template-columns:1fr} .right-panel{order:-1}}
</style>
</head>
<body>
  <main class="card" role="main" aria-labelledby="title">
    <header>
      <h1 id="title">🌈 PassWordGenerator — Interactive Demo</h1>
      <div class="subtitle">Generate strong, colorful passwords. Use the controls to customize and regenerate instantly.</div>
    </header>

    <section class="grid">
      <div class="controls" aria-label="controls">
        <div style="display:flex; gap:12px; align-items:center;">
          <div style="flex:1">
            <label for="length">Length <span id="lenVal">16</span></label>
            <input id="length" type="range" min="6" max="64" value="16" />
            <small class="helper">Longer is stronger — aim for 12+ for general use.</small>
          </div>
          <div style="width:120px; display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
            <button id="regen" class="btn" title="Generate">Generate</button>
            <button id="copy" class="btn secondary" title="Copy password">Copy</button>
          </div>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <label class="switch"><input id="upper" type="checkbox" checked> Include UPPERCASE</label>
          <label class="switch"><input id="lower" type="checkbox" checked> Include lowercase</label>
          <label class="switch"><input id="numbers" type="checkbox" checked> Include numbers</label>
          <label class="switch"><input id="symbols" type="checkbox" checked> Include symbols</label>
          <label class="switch"><input id="ambiguous" type="checkbox"> Exclude ambiguous chars (0,O,l,1)</label>
        </div>

        <div class="output" role="status" aria-live="polite">
          <div class="pw" id="out">— click Generate —</div>
          <div style="text-align:right">
            <div id="copyMsg" style="font-size:0.9rem"></div>
            <small class="helper">Click "Copy" to copy to clipboard</small>
          </div>
        </div>

        <div>
          <div style="display:flex; justify-content:space-between; align-items:center">
            <div><strong>Strength</strong> <small id="strengthLabel" class="helper">—</small></div>
            <div id="entropyLabel" class="helper">Entropy: — bits</div>
          </div>
          <div class="meter" aria-hidden="true"><i id="meterBar"></i></div>
        </div>

        <footer>
          Tip: Use a password manager for storage. Do not reuse passwords across important accounts.
        </footer>
      </div>

      <aside class="right-panel" aria-labelledby="howItWorks">
        <h3 id="howItWorks">How it works</h3>
        <p class="helper">This demo uses cryptographic randomness via <code>crypto.getRandomValues</code> where available, and a secure character pool based on your selected options.</p>
        <h4>Quick rules</h4>
        <ul>
          <li>Use 16+ characters for high security.</li>
          <li>Include multiple character sets (upper/lower/numbers/symbols) to increase entropy.</li>
          <li>Exclude ambiguous characters if you need readability.</li>
        </ul>
        <h4>Accessibility</h4>
        <p class="helper">Controls are keyboard-accessible and use clear labels and status updates for screen readers.</p>
      </aside>

    </section>
  </main>

<script>
(() => {
  const out = document.getElementById('out');
  const copyBtn = document.getElementById('copy');
  const regen = document.getElementById('regen');
  const len = document.getElementById('length');
  const lenVal = document.getElementById('lenVal');
  const upper = document.getElementById('upper');
  const lower = document.getElementById('lower');
  const numbers = document.getElementById('numbers');
  const symbols = document.getElementById('symbols');
  const ambiguous = document.getElementById('ambiguous');
  const meterBar = document.getElementById('meterBar');
  const strengthLabel = document.getElementById('strengthLabel');
  const entropyLabel = document.getElementById('entropyLabel');
  const copyMsg = document.getElementById('copyMsg');

  const CHAR = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.<>/?'
  };
  const AMBIG = /[O0Il1]/g;

  function getPool() {
    let pool = '';
    if (upper.checked) pool += CHAR.upper;
    if (lower.checked) pool += CHAR.lower;
    if (numbers.checked) pool += CHAR.numbers;
    if (symbols.checked) pool += CHAR.symbols;
    if (ambiguous.checked) pool = pool.replace(AMBIG, '');
    return pool;
  }

  function secureRandomInt(max) {
    const uint32 = window.crypto && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] : Math.floor(Math.random()*0x100000000);
    return uint32 % max;
  }

  function generatePassword(length) {
    const pool = getPool();
    if (!pool) return '';
    const arr = [];
    for (let i=0;i<length;i++){
      arr.push(pool.charAt(secureRandomInt(pool.length)));
    }
    return arr.join('');
  }

  function estimateEntropy(pass) {
    // Very simple estimator: log2(poolSize^length) = length * log2(poolSize)
    const pool = new Set();
    for (const ch of pass) pool.add(ch);
    const poolSize = Math.max(2, (upper.checked?26:0) + (lower.checked?26:0) + (numbers.checked?10:0) + (symbols.checked?CHAR.symbols.length:0));
    const entropy = Math.round(pass.length * Math.log2(pool*
