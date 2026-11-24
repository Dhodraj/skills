#!/usr/bin/env node
// Writes one HTML page that shows every style in references/styles.md as a
// tile, in the client's own name, brand colour and font, so the user picks a
// style by looking at it.
//
//   node style-gallery.js --name Lingaasys --brand "#F05B36" --font Manrope
//        [--headline "..."] [--image hero.jpg] [--out style-gallery.html]
//
// Plain Node, no dependencies. Fonts load from Google Fonts; without a network
// the page falls back to system faces. A local --image is embedded, so the
// page stays one file.
const fs = require("fs");
const path = require("path");

// ------------------------------------------------------------------ colour

const hexToRgb = (hex) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const rgbToHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
const mix = (a, b, t) => rgbToHex(hexToRgb(a).map((v, i) => v + (hexToRgb(b)[i] - v) * t));
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
// WCAG 2.2 contrast ratio.
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// Moves `colour` towards `toward` in 2% steps until it reaches `min` against `against`.
const untilContrast = (colour, toward, against, min = 4.5) => {
  for (let t = 0; t <= 1.0001; t += 0.02) {
    const c = mix(colour, toward, t);
    if (contrast(c, against) >= min) return c;
  }
  return toward;
};

const INK = "#15130F";
const PAPER = "#FCFBF9";
const NIGHT = "#0B0C0E";
// The darkest light ground any tile puts brand text on (the organic band).
const LIGHT_FLOOR = "#E8DFD0";
const GLASS = "#10121E";
const GLASS_TEXT = "#E4E2F0"; // the dimmest text on a glass pane

// The pane opacity at which glass text passes 4.5:1 over the lightest thing
// behind it, which in this tile is the brand colour at full strength.
const glassAlpha = (brand) => {
  for (let a = 0.4; a <= 0.951; a += 0.05) {
    if (contrast(mix(brand, GLASS, a), GLASS_TEXT) >= 4.5) return Math.round(a * 100) / 100;
  }
  return 0.95;
};

// Every colour a tile needs that must pass contrast, measured here rather than
// trusted. Decorative tints are mixed in CSS with color-mix().
const palette = (brand) => {
  const onBrand = contrast(brand, PAPER) >= 4.5 ? PAPER : contrast(brand, INK) >= 4.5 ? INK
    : contrast(brand, PAPER) >= contrast(brand, INK) ? PAPER : INK;
  return {
    brand,
    onBrand, // text on a brand fill
    // One value serves twice: a fill under light text, and text on any light ground.
    brandDeep: untilContrast(brand, INK, LIGHT_FLOOR),
    brandGlow: untilContrast(brand, PAPER, NIGHT), // brand as text on a dark ground
    glassAlpha: glassAlpha(brand),
    // Grounds and fills that carry text, mixed here so a measurer can read them.
    earthDeep: untilContrast(mix(untilContrast(brand, INK, LIGHT_FLOOR), "#3A2C1E", 0.3), INK, "#F7F2EA"),
    loudGround: mix(brand, "#FFF8EC", 0.86),
    softGround: mix(brand, "#FFF9F5", 0.88),
  };
};

// ------------------------------------------------------------- arguments

const usage = `usage: style-gallery.js --name NAME --brand "#RRGGBB" [--font FAMILY]
                        [--headline TEXT] [--image FILE|URL] [--out FILE]`;

const parseArgs = (argv) => {
  const known = ["--name", "--brand", "--font", "--headline", "--image", "--out"];
  const opts = { font: "Manrope", out: "style-gallery.html" };
  for (let i = 0; i < argv.length; i += 2) {
    if (argv[i] === "--help" || argv[i] === "-h") return { help: true };
    if (!known.includes(argv[i])) throw new Error(`unknown option ${argv[i]}`);
    if (argv[i + 1] === undefined) throw new Error(`${argv[i]} needs a value`);
    opts[argv[i].slice(2)] = argv[i + 1];
  }
  if (!opts.name) throw new Error("--name is required");
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(opts.brand || "")) throw new Error("--brand must be a hex colour such as #F05B36");
  // The family goes into a URL and a CSS string, so only plain names pass.
  if (!/^[A-Za-z0-9 ]{1,40}$/.test(opts.font)) throw new Error("--font must be a plain family name such as Manrope");
  return opts;
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const imageUrl = (image) => {
  if (!image) return null;
  if (/^https?:\/\//.test(image)) return image;
  const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml" };
  const type = types[path.extname(image).toLowerCase()];
  if (!type) throw new Error("--image must be a .jpg, .png, .webp, .avif or .svg file, or a URL");
  return `data:${type};base64,${fs.readFileSync(image).toString("base64")}`;
};

// A drawn landscape that stands in for a photograph, tinted by the brand.
const standIn = (brand, mood) => {
  const dark = mood === "dusk";
  const sky = dark ? [mix(brand, "#0A1020", 0.86), mix(brand, "#1A1830", 0.55), mix(brand, "#F7C59F", 0.25)]
    : mood === "earth" ? ["#D9CBB4", "#E8D9BF", "#F1E3CC"] : ["#BFD3E6", "#DCE6EE", mix(brand, "#FFF3E6", 0.75)];
  const ridge = dark ? ["#2A2433", "#1B1824", "#100E16"] : mood === "earth" ? ["#9C8466", "#7B6A50", "#5B5040"] : ["#8FA7BD", "#6D879E", "#4C6378"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".6" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient>
<radialGradient id="g" cx=".68" cy=".6" r=".32"><stop offset="0" stop-color="${brand}" stop-opacity="${dark ? 0.85 : 0.35}"/><stop offset="1" stop-color="${brand}" stop-opacity="0"/></radialGradient>
<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .09 0"/></filter></defs>
<rect width="800" height="500" fill="url(#s)"/><rect width="800" height="500" fill="url(#g)"/>
<path d="M0 330 L90 300 L170 318 L260 268 L340 300 L430 252 L520 290 L600 262 L700 300 L800 280 V500 H0Z" fill="${ridge[0]}" opacity=".85"/>
<path d="M0 380 L120 340 L210 362 L320 322 L420 352 L540 318 L640 350 L800 330 V500 H0Z" fill="${ridge[1]}"/>
<path d="M0 430 L150 398 L300 420 L460 392 L620 418 L800 400 V500 H0Z" fill="${ridge[2]}"/>
<rect width="800" height="500" filter="url(#n)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// ------------------------------------------------------------------ tiles

// One entry per style in references/styles.md, in the same order and with the
// same names. Each tile is a mini hero plus one card or section.
const tiles = (o) => {
  const n = esc(o.name);
  const h = esc(o.headline);
  const line = `Sample copy. Replace it with what ${n} does, in the words its customers use.`;
  return [
    {
      id: "rich", name: "Rich and immersive",
      look: "Full-bleed pictures, deep dark sections and the brand colour as light.",
      html: `<div class="hero"><nav><b>${n}</b><span>Services</span><span>Projects</span><span>About</span><span class="btn">Contact us</span></nav>
<div class="copy"><h3>${h}</h3><p>${line}</p><div class="row"><span class="btn">See our projects</span><span class="btn ghost">Talk to an engineer</span></div></div></div>
<div class="band"><div class="pic"></div><div><h4>From first survey to handover</h4><p>One team carries the work through every stage, so nothing is lost between them.</p><span class="link">How we work →</span></div></div>`,
    },
    {
      id: "corp", name: "Corporate clean",
      look: "White, ordered and photographic. Trust through structure.",
      html: `<nav><b>${n}</b><span>Industries</span><span>Services</span><span>Insights</span><span>Careers</span><span class="btn">Contact</span></nav>
<div class="hero"><div><h3>${h}</h3><p>${line}</p><div class="row"><span class="btn">Explore services</span><span class="btn quiet">Read case studies</span></div></div><div class="pic"></div></div>
<div class="band"><div class="card wide"><div class="pic sm"></div><div><h4>Plant modernisation</h4><p>Upgrades planned around live production.</p><span class="link">Learn how →</span></div></div><div class="card"><h4>Digital engineering</h4><p>Models that stay true to the built asset.</p><span class="link">Learn how →</span></div></div>`,
    },
    {
      id: "editorial", name: "Editorial",
      look: "A magazine page: a serif voice, long reading and captioned pictures.",
      html: `<nav><b>${n}</b><span>Journal</span><span>Projects</span><span>Studio</span></nav>
<div class="hero"><div><p class="kicker">Field notes</p><h3>${h}</h3><p class="deck">${line}</p><p class="by">By the ${n} team</p></div><figure><div class="pic"></div><figcaption>A stand-in picture, captioned as a magazine would.</figcaption></figure></div>
<div class="band"><p class="lede"><span class="drop">T</span>he best engineering is the part nobody notices: the bridge that does not move, the line that never stops. This essay walks through how a project is scoped.</p><blockquote>“Measure twice, and write down why.”</blockquote></div>`,
    },
    {
      id: "swiss", name: "Swiss grid",
      look: "A strict grid, flush-left grotesque type and one solid field of colour.",
      html: `<div class="grid"><b class="mark">${n}</b><span class="meta">Engineering<br>since day one</span><span class="meta">Services<br>Projects<br>Contact</span>
<h3>${h}</h3><div class="field"></div><p class="intro">${line}</p></div>
<div class="band"><div><span class="no">1</span><h4>Scope</h4><p>A written brief and a fixed price.</p></div><div><span class="no">2</span><h4>Build</h4><p>Weekly reviews against the brief.</p></div><div><span class="no">3</span><h4>Support</h4><p>One contact after handover.</p></div></div>`,
    },
    {
      id: "mono", name: "Monochrome minimal",
      look: "Greys, space and one quiet type voice. Colour only where you act.",
      html: `<nav><b>${n}</b><span>Work</span><span>Approach</span><span>Contact</span></nav>
<div class="hero"><h3>${h}</h3><p>${line}</p><span class="btn">Start a project</span></div>
<dl class="band"><div><dt>Approach</dt><dd>Small senior teams, one per client.</dd></div><div><dt>Coverage</dt><dd>Design, build and support under one contract.</dd></div><div><dt>Contact</dt><dd>hello@example.com</dd></div></dl>`,
    },
    {
      id: "glass", name: "Glassmorphism",
      look: "Frosted panels floating over a rich colour field or picture.",
      html: `<div class="stage"><nav class="pane"><b>${n}</b><span>Platform</span><span>Projects</span><span class="btn">Contact</span></nav>
<div class="pane hero"><h3>${h}</h3><p>${line}</p><div class="row"><span class="btn">Book a call</span><span class="btn ghost">See projects</span></div></div>
<div class="pane card"><h4>Live project view</h4><p>Every milestone, owner and open question on one screen.</p><span class="link">Open the demo →</span></div></div>`,
    },
    {
      id: "bento", name: "Bento",
      look: "A grid of rounded tiles in mixed sizes, each showing one idea.",
      html: `<nav><b>${n}</b><span>Product</span><span>Pricing</span><span class="btn">Get in touch</span></nav>
<div class="grid"><div class="t big"><h3>${h}</h3><p>${line}</p></div><div class="t brand"><h4>Plan</h4><p>Scope and price, in writing.</p></div><div class="t pic"></div>
<div class="t dark"><h4>Build</h4><p>Weekly reviews against the brief.</p></div><div class="t wide"><h4>Support</h4><p>One named contact after handover, for as long as the asset runs.</p></div></div>`,
    },
    {
      id: "dark", name: "Dark tech",
      look: "Near-black, hairlines, monospace detail and the brand as a signal light.",
      html: `<nav><b>${n}</b><span>Docs</span><span>Changelog</span><span>Pricing</span><span class="btn">Sign in</span></nav>
<div class="hero"><h3>${h}</h3><p>${line}</p><div class="row"><span class="btn primary">Start building</span><code>npx create-app</code></div></div>
<div class="band"><pre><span class="c">// one call, typed end to end</span>
const run = await client.<span class="k">runs</span>.create({
  project: <span class="s">"bridge-a12"</span>,
})</pre><div><h4>An API you can read</h4><p>Typed clients, readable errors and logs you can search.</p></div></div>`,
    },
    {
      id: "brutal", name: "Bold and neo-brutalist",
      look: "Thick black lines, hard offset shadows, loud flat colour and chunky type.",
      html: `<nav><b>${n}</b><span>Work</span><span>Shop</span><span class="btn">Hire us</span></nav>
<div class="hero"><h3>${h}</h3><p>${line}</p><div class="row"><span class="btn">Start a project</span><span class="btn alt">See the work</span></div><span class="sticker">New work</span></div>
<div class="band"><div class="card a"><h4>Plan</h4><p>Scope and price, in writing.</p></div><div class="card b"><h4>Build</h4><p>Weekly reviews, no surprises.</p></div><div class="card c"><h4>Support</h4><p>One contact, forever.</p></div></div>`,
    },
    {
      id: "clay", name: "Soft pastel and clay",
      look: "Pastel ground, pillowy rounded shapes and soft, friendly depth.",
      html: `<nav><b>${n}</b><span>How it works</span><span>Stories</span><span class="btn">Get started</span></nav>
<div class="hero"><div><h3>${h}</h3><p>${line}</p><span class="btn">Get started</span></div><div class="objects" aria-hidden="true"><i class="o1"></i><i class="o2"></i><i class="o3"></i></div></div>
<div class="band"><div class="card"><i class="ico"></i><h4>Plan together</h4><p>A shared brief you can edit.</p></div><div class="card"><i class="ico b"></i><h4>Track it</h4><p>See every step as it happens.</p></div></div>`,
    },
    {
      id: "retro", name: "Retro and Y2K",
      look: "Bevelled windows, pixel labels and a saturated sky. Nostalgic on purpose.",
      html: `<div class="desk"><div class="win main"><div class="bar"><span>${n}.exe</span><i></i></div><div class="body"><h3>${h}</h3><p>${line}</p><div class="row"><span class="btn">Start project</span><span class="btn">Read me</span></div></div></div>
<div class="win side"><div class="bar"><span>about.txt</span><i></i></div><div class="body"><h4>How we work</h4><p>Plan, build and support, in that order.</p><div class="meter"><b></b></div></div></div><div class="task"><span class="btn">Start</span><span>${n}</span><span class="clock">Plan, build, support</span></div></div>`,
    },
    {
      id: "organic", name: "Organic and earthy",
      look: "Warm paper, natural pictures, soft serif type and arched shapes.",
      html: `<nav><b>${n}</b><span>Our work</span><span>Materials</span><span>Journal</span><span class="btn">Visit us</span></nav>
<div class="hero"><div><h3>${h}</h3><p>${line}</p><span class="btn">See our approach</span></div><div class="arch"></div></div>
<div class="band"><div class="pic"></div><div><h4>Made to last decades</h4><p>We choose materials for the life of the building, not for the opening day.</p><div class="tags"><span>Timber</span><span>Stone</span><span>Lime</span></div></div></div>`,
    },
    {
      id: "tactile", name: "Tactile",
      look: "A quiet console where every control looks pressable. For dense product screens.",
      html: `<div class="app"><aside><b>${n}</b><span class="on">Projects</span><span>Runs</span><span>Settings</span></aside><main><header><div><h3>Projects</h3><p>12 active, 3 need review</p></div><div class="row"><span class="btn">Export</span><span class="btn primary">New project</span></div></header>
<div class="filters"><span class="seg"><b>All</b><span>Mine</span><span>At risk</span></span><span class="field">Search projects</span></div><div class="table"><div class="tr th"><span>Name</span><span>Owner</span><span>Status</span></div><div class="tr"><span>Bridge A12</span><span>R. Iyer</span><span><i class="dot ok"></i>On track</span></div><div class="tr"><span>Plant line 4</span><span>M. Chen</span><span><i class="dot warn"></i>At risk</span></div><div class="tr"><span>Depot retrofit</span><span>S. Rao</span><span><i class="dot ok"></i>On track</span></div><div class="tr"><span>Substation 7</span><span>A. Khan</span><span><i class="dot ok"></i>On track</span></div><div class="tr"><span>Cooling loop B</span><span>L. Park</span><span><i class="dot idle"></i>Paused</span></div><div class="tr"><span>Rail spur 3</span><span>J. Okafor</span><span><i class="dot ok"></i>On track</span></div><div class="tr"><span>Water main C</span><span>P. Nair</span><span><i class="dot warn"></i>At risk</span></div><div class="tr"><span>Office fit-out</span><span>E. Rossi</span><span><i class="dot ok"></i>On track</span></div></div></main></div>`,
    },
  ];
};

// ------------------------------------------------------------------- page

const css = (p, font, img) => `
:root{--brand:${p.brand};--on-brand:${p.onBrand};--brand-deep:${p.brandDeep};--brand-glow:${p.brandGlow};--glass-alpha:${p.glassAlpha};--earth-deep:${p.earthDeep};--loud-ground:${p.loudGround};--soft-ground:${p.softGround};
--brand-font:"${font}",ui-sans-serif,system-ui,sans-serif;--paper:${PAPER};--ink:${INK};
--img-dusk:url("${img.dusk}");--img-day:url("${img.day}");--img-earth:url("${img.earth}")}
*{box-sizing:border-box;margin:0}
html,body{overflow-x:clip}
body{font:16px/1.5 var(--brand-font);background:#EDECEA;color:var(--ink);padding:48px 40px 80px}
.page-head{max-width:1360px;margin:0 auto 40px}
.page-head h1{font-size:40px;line-height:1.15;font-weight:600;letter-spacing:-.02em}
.page-head p{color:#55524C;max-width:70ch;margin-top:8px}
.gallery{max-width:1360px;margin:0 auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:56px 40px}
.pick>header{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline;margin-bottom:12px}
.pick .num{font-weight:700;font-variant-numeric:tabular-nums;color:var(--brand-deep)}
.pick h2{font-size:20px;font-weight:600;white-space:nowrap}
.pick header p{color:#55524C;font-size:15px}
.tile{border-radius:12px;overflow:hidden;box-shadow:0 0 0 1px rgb(0 0 0/.08),0 12px 32px -12px rgb(0 0 0/.25);min-height:560px;position:relative}
.tile h3,.tile h4{text-wrap:balance}
.tile p{text-wrap:pretty}
.tile .row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.tile .btn{display:inline-flex;align-items:center;white-space:nowrap}
.tile .pic{background:var(--img-day) center/cover}
.foot{max-width:1360px;margin:48px auto 0;color:#55524C;font-size:15px}

/* 1 rich and immersive */
.s-rich{background:#0D0E12;color:#F4F1EC}
.s-rich .hero{position:relative;min-height:350px;padding:20px 32px 36px;display:flex;flex-direction:column;justify-content:space-between;
 background:linear-gradient(90deg,rgb(8 9 12/.88) 0%,rgb(8 9 12/.55) 55%,rgb(8 9 12/.1) 100%),var(--img-dusk) center/cover}
.s-rich nav{display:flex;gap:24px;align-items:center;font-size:14px;color:#E6E1DA}
.s-rich nav b{font-size:18px;margin-right:auto;font-weight:700;letter-spacing:-.01em;color:#fff}
.s-rich nav .btn{padding:8px 14px;border:1px solid rgb(255 255 255/.45);border-radius:999px}
.s-rich h3{font-size:46px;line-height:1.05;font-weight:700;letter-spacing:-.03em;max-width:13ch}
.s-rich .copy p{max-width:40ch;margin:14px 0 22px;color:#D9D4CC}
.s-rich .btn{padding:12px 20px;border-radius:999px;font-weight:600;font-size:15px;background:var(--brand);color:var(--on-brand)}
.s-rich .btn.ghost{background:rgb(255 255 255/.08);color:#fff;box-shadow:inset 0 0 0 1px rgb(255 255 255/.5)}
.s-rich .band{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:28px;align-items:center;padding:28px 32px 32px;
 background:radial-gradient(120% 140% at 0% 100%,color-mix(in oklch,var(--brand) 30%,transparent),transparent 60%),#0D0E12}
.s-rich .band .pic{height:150px;border-radius:10px;background:var(--img-dusk) 30% 70%/220% auto}
.s-rich h4{font-size:22px;line-height:1.2;font-weight:600;letter-spacing:-.01em}
.s-rich .band p{color:#C9C3BA;margin:8px 0 12px;font-size:15px}
.s-rich .link{color:var(--brand-glow);font-weight:600;font-size:15px}

/* 2 corporate clean */
.s-corp{background:#FFFFFF;color:#14171C}
.s-corp nav{display:flex;gap:24px;align-items:center;padding:16px 28px;font-size:14px;color:#3D434C;border-bottom:1px solid #E4E6EA}
.s-corp nav b{margin-right:auto;font-size:18px;color:#14171C;font-weight:700}
.s-corp nav .btn{padding:8px 14px;border-radius:6px;background:var(--brand-deep);color:#fff;font-weight:600}
.s-corp .hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:28px;align-items:center;padding:32px 28px}
.s-corp h3{font-size:36px;line-height:1.12;font-weight:700;letter-spacing:-.02em}
.s-corp .hero p{color:#4A515B;margin:12px 0 20px;font-size:15px}
.s-corp .btn{padding:10px 16px;border-radius:6px;font-weight:600;font-size:14px;background:var(--brand-deep);color:#fff}
.s-corp .btn.quiet{background:#fff;color:#14171C;box-shadow:inset 0 0 0 1px #8A919B}
.s-corp .hero .pic{height:220px;border-radius:8px}
.s-corp .band{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:16px;padding:20px 28px 28px;background:#F4F5F7}
.s-corp .card{background:#fff;border:1px solid #E4E6EA;border-radius:8px;padding:18px}
.s-corp .card.wide{display:grid;grid-template-columns:120px minmax(0,1fr);gap:16px;align-items:center}
.s-corp .pic.sm{height:96px;border-radius:6px}
.s-corp h4{font-size:17px;font-weight:700}
.s-corp .card p{font-size:14px;color:#4A515B;margin:4px 0 8px}
.s-corp .link{color:var(--brand-deep);font-weight:600;font-size:14px}

/* 3 editorial */
.s-editorial{background:#F5F0E6;color:#1C1A16}
.s-editorial nav{display:flex;gap:22px;align-items:baseline;margin:0 28px;padding:16px 0 12px;border-bottom:2px solid #1C1A16;font-size:14px}
.s-editorial nav b{margin-right:auto;font:400 30px/1 "Instrument Serif",Georgia,serif;letter-spacing:-.01em}
.s-editorial .hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:28px;padding:24px 28px;border-bottom:1px solid #1C1A16;margin:0 28px;padding-left:0;padding-right:0}
.s-editorial .kicker{color:var(--brand-deep);font-weight:700;font-size:14px}
.s-editorial h3{font:400 52px/1 "Instrument Serif",Georgia,serif;letter-spacing:-.015em;margin:6px 0 12px}
.s-editorial .deck{font:italic 400 19px/1.4 "Instrument Serif",Georgia,serif;color:#3B372F}
.s-editorial .by{font-size:13px;margin-top:14px;color:#5A544A}
.s-editorial figure .pic{height:200px}
.s-editorial figcaption{font-size:13px;color:#5A544A;margin-top:8px;font-style:italic}
.s-editorial .band{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:28px;padding:22px 28px 28px}
.s-editorial .lede{font:400 17px/1.6 "Source Serif 4",Georgia,serif;max-width:60ch}
.s-editorial .drop{float:left;font:400 64px/.8 "Instrument Serif",Georgia,serif;padding:6px 8px 0 0;color:var(--brand-deep)}
.s-editorial blockquote{font:italic 400 26px/1.2 "Instrument Serif",Georgia,serif;border-top:2px solid var(--brand);padding-top:12px}

/* 4 swiss grid */
.s-swiss{background:#F7F7F5;color:#111111}
.s-swiss .grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:0 16px;padding:24px 28px 28px;
 background-image:linear-gradient(90deg,rgb(0 0 0/.06) 1px,transparent 1px);background-size:calc((100% - 56px + 16px)/6) 100%;background-position:28px 0}
.s-swiss .mark{grid-column:1/3;font-size:18px;font-weight:700;letter-spacing:-.02em}
.s-swiss .meta{grid-column:span 2;font-size:13px;line-height:1.4}
.s-swiss h3{grid-column:1/6;font-size:58px;line-height:.98;font-weight:700;letter-spacing:-.045em;margin:56px 0 20px}
.s-swiss .field{grid-column:6/7;grid-row:2/4;background:var(--brand);margin-top:56px}
.s-swiss .intro{grid-column:3/6;font-size:15px}
.s-swiss .band{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;padding:20px 28px 28px;border-top:3px solid #111}
.s-swiss .no{font-size:32px;font-weight:700;letter-spacing:-.04em;color:var(--brand-deep)}
.s-swiss h4{font-size:17px;font-weight:700;margin-top:4px}
.s-swiss .band p{font-size:14px}

/* 5 monochrome minimal */
.s-mono{background:#FAFAF9;color:#121212}
.s-mono nav{display:flex;gap:28px;padding:22px 36px;font-size:14px;color:#5E5E5C}
.s-mono nav b{margin-right:auto;color:#121212;font-weight:600}
.s-mono .hero{padding:56px 36px 44px}
.s-mono h3{font-size:44px;line-height:1.08;font-weight:500;letter-spacing:-.035em;max-width:14ch}
.s-mono .hero p{color:#5E5E5C;max-width:42ch;margin:16px 0 28px}
.s-mono .btn{padding:11px 18px;border-radius:8px;background:var(--brand-deep);color:#FFFFFF;font-size:15px;font-weight:500}
.s-mono .band{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin:0 36px;padding:20px 0 32px;border-top:1px solid #DEDEDB}
.s-mono dt{font-size:13px;color:#6B6B68}
.s-mono dd{font-size:15px;margin-top:4px}

/* 6 glassmorphism */
.s-glass{color:#fff;background:
 radial-gradient(75% 80% at 90% 10%,var(--brand),transparent 62%),
 radial-gradient(60% 70% at 5% 95%,color-mix(in oklch,var(--brand) 75%,#7A2E8E),transparent 65%),
 linear-gradient(160deg,color-mix(in oklch,var(--brand) 35%,#141A3A),#10142C)}
.s-glass .stage{padding:20px 24px 24px;display:grid;gap:16px}
.s-glass .pane{background:rgb(16 18 30/var(--glass-alpha));-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px);
 border:1px solid rgb(255 255 255/.22);border-radius:18px;box-shadow:0 10px 30px -10px rgb(0 0 0/.35),inset 0 1px 0 rgb(255 255 255/.18)}
.s-glass nav{display:flex;gap:22px;align-items:center;padding:10px 12px 10px 18px;font-size:14px;color:#ECEAF6;border-radius:999px}
.s-glass nav b{margin-right:auto;color:#fff}
.s-glass nav .btn{padding:7px 14px;border-radius:999px;background:rgb(255 255 255/.92);color:#141625;font-weight:600}
.s-glass .hero{padding:28px}
.s-glass h3{font-size:38px;line-height:1.08;font-weight:700;letter-spacing:-.025em;max-width:15ch}
.s-glass .hero p{color:#E4E2F0;margin:12px 0 20px;max-width:44ch;font-size:15px}
.s-glass .btn{padding:11px 18px;border-radius:999px;background:rgb(255 255 255/.92);color:#141625;font-weight:600;font-size:15px}
.s-glass .btn.ghost{background:rgb(255 255 255/.1);color:#fff;box-shadow:inset 0 0 0 1px rgb(255 255 255/.4)}
.s-glass .card{padding:20px 22px;max-width:62%;margin-left:auto}
.s-glass h4{font-size:18px;font-weight:600}
.s-glass .card p{color:#E4E2F0;font-size:14px;margin:4px 0 8px}
.s-glass .link{font-weight:600;font-size:14px;color:#fff}
@media (prefers-reduced-transparency:reduce){.s-glass .pane{background:#1A1C2C;backdrop-filter:none}}

/* 7 bento */
.s-bento{background:#F1F0EE;color:#161616}
.s-bento nav{display:flex;gap:22px;align-items:center;padding:16px 24px;font-size:14px;color:#55534F}
.s-bento nav b{margin-right:auto;color:#161616;font-weight:700}
.s-bento nav .btn{padding:7px 14px;border-radius:999px;background:#161616;color:#F1F0EE;font-weight:600}
.s-bento .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:minmax(150px,auto);gap:12px;padding:4px 24px 24px}
.s-bento .t{background:#FFFFFF;border-radius:20px;padding:20px;box-shadow:0 0 0 1px rgb(0 0 0/.04)}
.s-bento .big{grid-column:span 2;grid-row:span 2;display:flex;flex-direction:column;justify-content:flex-end}
.s-bento h3{font-size:34px;line-height:1.05;font-weight:700;letter-spacing:-.03em;max-width:14ch}
.s-bento .big p{color:#55534F;margin-top:10px;font-size:15px;max-width:40ch}
.s-bento .brand{background:var(--brand);color:var(--on-brand)}
.s-bento .pic{padding:0;background:var(--img-day) center/cover}
.s-bento .dark{background:#161616;color:#F1F0EE}
.s-bento .wide{grid-column:span 2}
.s-bento h4{font-size:18px;font-weight:700}
.s-bento .t p{font-size:14px;margin-top:4px;opacity:.85}

/* 8 dark tech */
.s-dark{background:#0A0B0D;color:#EDEEF0;
 background-image:radial-gradient(70% 50% at 50% 0%,color-mix(in oklch,var(--brand) 22%,transparent),transparent 70%)}
.s-dark nav{display:flex;gap:22px;align-items:center;padding:16px 28px;font-size:14px;color:#A3A8B0;border-bottom:1px solid #1E2127}
.s-dark nav b{margin-right:auto;color:#EDEEF0;font-weight:600}
.s-dark nav .btn{padding:6px 12px;border-radius:8px;box-shadow:inset 0 0 0 1px #2C3038;color:#EDEEF0}
.s-dark .hero{padding:48px 28px 32px}
.s-dark h3{font-size:42px;line-height:1.05;font-weight:600;letter-spacing:-.035em;margin:8px 0 12px;max-width:16ch}
.s-dark .hero p{color:#A3A8B0;max-width:46ch;margin-bottom:22px;font-size:15px}
.s-dark .btn.primary{padding:10px 16px;border-radius:8px;background:#EDEEF0;color:#0A0B0D;font-weight:600;font-size:15px}
.s-dark code{font:500 14px "JetBrains Mono",ui-monospace,monospace;color:#C9CDD3;padding:9px 14px;border-radius:8px;border:1px solid #2C3038;background:#111318}
.s-dark .band{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:24px;align-items:center;margin:0 28px 28px;padding:20px;border:1px solid #1E2127;border-radius:12px;background:#0F1114}
.s-dark pre{font:13px/1.6 "JetBrains Mono",ui-monospace,monospace;color:#C9CDD3;white-space:pre-wrap}
.s-dark pre .c{color:#868C96}.s-dark pre .k{color:var(--brand-glow)}.s-dark pre .s{color:#A6E3B8}
.s-dark h4{font-size:17px;font-weight:600}
.s-dark .band p{color:#A3A8B0;font-size:14px;margin-top:4px}

/* 9 bold and neo-brutalist */
.s-brutal{background:var(--loud-ground);color:#111;--line:3px solid #111}
.s-brutal nav{display:flex;gap:20px;align-items:center;padding:14px 24px;border-bottom:var(--line);font-weight:700;font-size:15px;background:#FFF8EC}
.s-brutal nav b{margin-right:auto;font:400 22px/1 "Archivo Black",var(--brand-font)}
.s-brutal .btn{padding:11px 18px;border:var(--line);border-radius:10px;background:var(--brand);color:var(--on-brand);font-weight:800;font-size:15px;box-shadow:4px 4px 0 #111}
.s-brutal nav .btn{padding:6px 12px;box-shadow:3px 3px 0 #111}
.s-brutal .btn.alt{background:#FFF8EC;color:#111}
.s-brutal .hero{position:relative;padding:32px 24px 30px}
.s-brutal h3{font:400 44px/1 "Archivo Black",var(--brand-font);letter-spacing:-.02em;text-transform:uppercase;max-width:14ch}
.s-brutal .hero p{font-size:16px;font-weight:500;max-width:40ch;margin:14px 0 22px}
.s-brutal .sticker{position:absolute;right:28px;top:26px;transform:rotate(8deg);background:#FFE14D;border:var(--line);border-radius:999px;padding:10px 16px;font-weight:800;box-shadow:3px 3px 0 #111}
.s-brutal .band{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:22px 24px 26px;border-top:var(--line);background:#FFF8EC}
.s-brutal .card{border:var(--line);border-radius:12px;padding:16px;box-shadow:5px 5px 0 #111}
.s-brutal .card.a{background:#FFE14D}.s-brutal .card.b{background:#9EE6C4}.s-brutal .card.c{background:#111;color:#FFF8EC;box-shadow:5px 5px 0 var(--brand)}
.s-brutal h4{font:400 20px/1.1 "Archivo Black",var(--brand-font)}
.s-brutal .card p{font-size:14px;font-weight:500;margin-top:6px}

/* 10 soft pastel and clay */
.s-clay{background:var(--soft-ground);color:#2B2235;--clay:inset -5px -6px 10px rgb(60 30 20/.08),inset 5px 6px 10px rgb(255 255 255/.85),0 18px 30px -14px color-mix(in oklch,var(--brand) 45%,transparent)}
.s-clay nav{display:flex;gap:22px;align-items:center;padding:18px 28px;font-size:15px;color:#5A4E63;font-weight:500}
.s-clay nav b{margin-right:auto;font:600 22px/1 Fredoka,var(--brand-font);color:#2B2235}
.s-clay .btn{padding:12px 22px;border-radius:999px;background:var(--brand);color:var(--on-brand);font-weight:700;font-size:15px;box-shadow:inset 0 -3px 0 rgb(0 0 0/.12),0 10px 20px -8px color-mix(in oklch,var(--brand) 70%,transparent)}
.s-clay nav .btn{padding:8px 16px}
.s-clay .hero{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:16px;align-items:center;padding:12px 28px 24px}
.s-clay h3{font:600 40px/1.05 Fredoka,var(--brand-font);letter-spacing:-.01em}
.s-clay .hero p{color:#5A4E63;margin:12px 0 20px;font-size:15px}
.s-clay .objects{position:relative;height:200px}
.s-clay .objects i{position:absolute;box-shadow:var(--clay)}
.s-clay .o1{width:130px;height:130px;border-radius:40px;background:color-mix(in oklch,var(--brand) 55%,#FFE9DD);left:20px;top:30px;transform:rotate(-10deg)}
.s-clay .o2{width:90px;height:90px;border-radius:50%;background:#CDE7FF;right:20px;top:10px}
.s-clay .o3{width:120px;height:56px;border-radius:999px;background:#D9F2E3;right:36px;bottom:12px}
.s-clay .band{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;padding:8px 28px 28px}
.s-clay .card{background:#FFFDFB;border-radius:28px;padding:20px;box-shadow:var(--clay)}
.s-clay .ico{display:block;width:44px;height:44px;border-radius:14px;background:color-mix(in oklch,var(--brand) 35%,#FFF3EC);box-shadow:var(--clay);margin-bottom:12px}
.s-clay .ico.b{background:#CDE7FF}
.s-clay h4{font:600 19px/1.2 Fredoka,var(--brand-font)}
.s-clay .card p{color:#5A4E63;font-size:14px;margin-top:4px}

/* 11 retro and y2k */
.s-retro{color:#141414;background:linear-gradient(180deg,#7CC6FF 0%,#C9B8FF 55%,color-mix(in oklch,var(--brand) 55%,#FFD2E8) 100%)}
.s-retro .desk{padding:28px 28px 0;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);grid-template-rows:1fr auto;gap:20px;align-items:start;min-height:560px;
 background-image:radial-gradient(rgb(255 255 255/.5) 1px,transparent 1.4px);background-size:16px 16px}
.s-retro .win{background:#DCDCE2;border:2px solid;border-color:#FFFFFF #5C5C66 #5C5C66 #FFFFFF;box-shadow:4px 4px 0 rgb(20 20 40/.35)}
.s-retro .bar{display:flex;justify-content:space-between;align-items:center;padding:6px 8px;color:#fff;font:400 14px/1 Silkscreen,monospace;
 background:linear-gradient(90deg,var(--brand-deep),color-mix(in oklch,var(--brand-deep) 60%,#3A2A8C))}
.s-retro .bar i{width:16px;height:14px;background:#DCDCE2;border:2px solid;border-color:#FFFFFF #5C5C66 #5C5C66 #FFFFFF}
.s-retro .body{padding:20px}
.s-retro .main{margin-top:24px}
.s-retro .task{grid-column:1/-1;align-self:end;margin:0 -28px;display:flex;gap:12px;align-items:center;padding:6px 8px;background:#DCDCE2;border-top:2px solid #FFFFFF;font-size:14px}
.s-retro .task .clock{margin-left:auto;padding:4px 10px;border:2px solid;border-color:#5C5C66 #FFFFFF #FFFFFF #5C5C66;font:400 13px/1 Silkscreen,monospace}
.s-retro h3{font:400 38px/1.05 "Bungee",var(--brand-font);color:#1A1446;text-shadow:3px 3px 0 color-mix(in oklch,var(--brand) 70%,white)}
.s-retro .body p{margin:12px 0 18px;font-size:15px}
.s-retro .btn{padding:8px 14px;background:#DCDCE2;font:400 14px/1 Silkscreen,monospace;border:2px solid;border-color:#FFFFFF #5C5C66 #5C5C66 #FFFFFF;box-shadow:1px 1px 0 #141414}
.s-retro .side{margin-top:120px}
.s-retro h4{font:400 18px/1.2 Silkscreen,monospace}
.s-retro .side p{font-size:14px;margin:6px 0 12px}
.s-retro .meter{height:18px;border:2px solid;border-color:#5C5C66 #FFFFFF #FFFFFF #5C5C66;background:#fff;padding:2px}
.s-retro .meter b{display:block;height:100%;width:64%;background:repeating-linear-gradient(90deg,var(--brand-deep) 0 10px,transparent 10px 12px)}

/* 12 organic and earthy */
.s-organic{background:#F2ECE1;color:#2B261F}
.s-organic nav{display:flex;gap:22px;align-items:center;padding:18px 30px;font-size:14px;color:#5B5246}
.s-organic nav b{margin-right:auto;font:500 24px/1 Fraunces,Georgia,serif;color:#2B261F;font-variation-settings:"SOFT" 100}
.s-organic .btn{padding:11px 20px;border-radius:999px;background:var(--earth-deep);color:#F7F2EA;font-weight:600;font-size:15px}
.s-organic nav .btn{padding:7px 14px}
.s-organic .hero{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:24px;align-items:end;padding:12px 30px 28px}
.s-organic h3{font:400 46px/1.02 Fraunces,Georgia,serif;letter-spacing:-.02em;font-variation-settings:"SOFT" 100,"opsz" 96}
.s-organic .hero p{color:#5B5246;margin:14px 0 22px;font-size:15px}
.s-organic .arch{height:240px;border-radius:999px 999px 16px 16px;background:var(--img-earth) center/cover}
.s-organic .band{display:grid;grid-template-columns:160px minmax(0,1fr);gap:22px;align-items:center;margin:0 30px 30px;padding:18px;background:#E8DFD0;border-radius:24px}
.s-organic .band .pic{height:130px;border-radius:16px;background:var(--img-earth) 70% 80%/240% auto}
.s-organic h4{font:400 22px/1.15 Fraunces,Georgia,serif}
.s-organic .band p{color:#5B5246;font-size:14px;margin:6px 0 10px}
.s-organic .tags{display:flex;gap:8px}
.s-organic .tags span{font-size:13px;padding:4px 12px;border-radius:999px;border:1px solid #A8977E;color:#4A4136}

/* 13 tactile */
.s-tactile{background:#F1F0EF;color:#21201C;font-weight:500;font-size:13px;line-height:20px}
.s-tactile .app{display:grid;grid-template-columns:150px minmax(0,1fr);min-height:560px}
.s-tactile aside{display:flex;flex-direction:column;gap:2px;padding:16px 10px;color:#63635E}
.s-tactile aside b{color:#21201C;font-size:14px;padding:6px 10px 14px}
.s-tactile aside span{padding:7px 10px;border-radius:6px}
.s-tactile aside .on{background:#FFFFFF;color:#21201C;box-shadow:0 0 0 1px rgb(33 32 28/.08),0 1px 2px rgb(33 32 28/.12)}
.s-tactile main{background:#FFFFFF;margin:8px 8px 8px 0;border-radius:10px;box-shadow:0 0 0 1px rgb(33 32 28/.07),0 1px 2px rgb(33 32 28/.12);padding:24px}
.s-tactile header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px}
.s-tactile h3{font-size:20px;line-height:28px;font-weight:500}
.s-tactile header p{color:#63635E}
.s-tactile .btn{height:32px;padding:0 12px;border-radius:6px;background:#fff;box-shadow:0 0 0 1px rgb(33 32 28/.1),0 1px 2px rgb(33 32 28/.14)}
.s-tactile .btn.primary{background:#21201C;color:#FFFFFF;box-shadow:0 0 0 1px #21201C,0 1px 2px rgb(0 0 0/.2)}
.s-tactile .table{border:.5px solid #CFCECA;border-radius:8px;overflow:hidden}
.s-tactile .tr{display:grid;grid-template-columns:2fr 1.2fr 1fr;height:38px;align-items:center;padding:0 14px;border-top:.5px solid #DAD9D6}
.s-tactile .th{border-top:0;color:#63635E;background:#F9F9F8}
.s-tactile .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px}
.s-tactile .dot.ok{background:#30A46C}.s-tactile .dot.warn{background:var(--brand)}.s-tactile .dot.idle{background:#8D8D86}
.s-tactile .filters{display:flex;justify-content:space-between;gap:12px;margin-bottom:12px}
.s-tactile .seg{display:inline-flex;gap:2px;padding:2px;border-radius:8px;background:#F1F0EF}
.s-tactile .seg>*{padding:4px 10px;border-radius:6px;font-weight:500}
.s-tactile .seg b{background:#fff;box-shadow:0 0 0 1px rgb(33 32 28/.08),0 1px 2px rgb(33 32 28/.12)}
.s-tactile .field{flex:0 1 200px;height:32px;padding:6px 10px;border-radius:6px;background:#F1F0EF;box-shadow:inset 0 0 0 1px #7E7E78;color:#63635E}
`;

const fontLinks = (font) => {
  const fixed = "family=Instrument+Serif:ital@0;1&family=Fraunces:opsz,wght,SOFT@9..144,400..600,0..100&family=JetBrains+Mono:wght@400;500"
    + "&family=Source+Serif+4:opsz,wght@8..60,400&family=Archivo+Black&family=Fredoka:wght@500;600&family=Bungee&family=Silkscreen";
  // One link per family, so a weight one family lacks cannot fail the others.
  return [`https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;500;600;700;800&display=swap`,
    `https://fonts.googleapis.com/css2?${fixed}&display=swap`]
    .map((href) => `<link rel="stylesheet" href="${href}">`).join("\n");
};

const render = (opts) => {
  const p = palette(opts.brand);
  const real = imageUrl(opts.image);
  const img = { dusk: real || standIn(opts.brand, "dusk"), day: real || standIn(opts.brand, "day"), earth: real || standIn(opts.brand, "earth") };
  const list = tiles({ name: opts.name, headline: opts.headline || "Work that holds up for decades" });
  const n = esc(opts.name);
  const sections = list.map((t, i) => `<section class="pick" id="${t.id}"><header><span class="num">${i + 1}</span><h2>${esc(t.name)}</h2><p>${esc(t.look)}</p></header>
<div class="tile s-${t.id}" inert aria-label="${esc(t.name)} preview">${t.html}</div></section>`).join("\n");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pick a style for ${n}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLinks(opts.font)}
<style>${css(p, opts.font, img)}</style></head>
<body><div class="page-head"><h1>Pick a style for ${n}</h1>
<p>${list.length} styles, each drawn in ${n}'s colour ${esc(opts.brand)} and the ${esc(opts.font)} typeface. Pick one or two by number. A few styles set headlines in their own face; references/styles.md names each one. The copy is a sample${real ? "" : ", and the pictures are drawn stand-ins. Pass <code>--image</code> to use a real one"}.</p></div>
<main class="gallery">${sections}</main>
<p class="foot">Generated by design-the-ui/scripts/style-gallery.js. Text on a brand fill uses ${p.onBrand === PAPER ? "light" : "dark"} ink, because that pair passes 4.5:1. Brand text on light grounds is ${p.brandDeep}, and on dark grounds ${p.brandGlow}.</p>
</body></html>`;
};

module.exports = { contrast, mix, untilContrast, glassAlpha, palette, LIGHT_FLOOR, GLASS, GLASS_TEXT, parseArgs, render, tiles, INK, PAPER, NIGHT };

if (require.main === module) {
  try {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.help) { console.log(usage); process.exit(0); }
    fs.writeFileSync(opts.out, render(opts));
    const written = fs.statSync(opts.out).size;
    console.log(`wrote ${opts.out} (${written} bytes, ${tiles({ name: "", headline: "" }).length} styles). Open it in a browser and ask the user to pick.`);
  } catch (error) {
    console.error(`${error.message}\n${usage}`);
    process.exit(1);
  }
}
