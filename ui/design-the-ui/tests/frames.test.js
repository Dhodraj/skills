// Runs scripts/frames.js against a fake clock and a fake element, and prints
// one line per case: "ok <name>" or "FAIL <name>". run.sh counts the lines.
const fs = require("fs");
const path = require("path");

const frames = eval(fs.readFileSync(path.join(__dirname, "../scripts/frames.js"), "utf8"));
const check = (name, ok) => console.log(`${ok ? "ok" : "FAIL"} ${name}`);

// Each frame moves the clock 16ms; the element moves 2px a frame, then jumps 30px once.
let now = 0;
let frame = 0;
global.performance = { now: () => now };
global.requestAnimationFrame = (callback) => setImmediate(() => { now += 16; frame += 1; callback(); });
const lefts = (n) => (n < 10 ? n * 2 : 30 + n * 2);

(async () => {
  global.document = { querySelector: () => null };
  const none = await frames();
  check("nothing marked returns an error instead of hanging", none.error === "nothing carries data-watch");

  global.document = { querySelector: (sel) => sel === "[data-watch]" ? { getBoundingClientRect: () => ({ left: lefts(frame), top: 5 }) } : null };
  const result = await frames();
  check("it samples until the 900ms window ends", result.samples.at(-1)[0] >= 900 && result.samples.at(-2)[0] < 900);
  check("frames is the number of samples", result.frames === result.samples.length);
  check("biggestStep is the one jump, not the steady step", result.biggestStep === 32);
  check("each sample is [ms, left, top]", result.samples.every((s) => s.length === 3 && s[2] === 5));
})().catch((error) => console.log(`FAIL frames.test.js threw: ${error.message}`));
