// Renders scene.html to readme.gif with headless Chrome and ffmpeg.
// Run: node shared/brand/readme-gif/render.mjs
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const fps = 10, seconds = 21, port = 9333;
const frames = mkdtempSync(join(tmpdir(), "readme-gif-"));
const profile = mkdtempSync(join(tmpdir(), "readme-gif-profile-"));

const browser = spawn(chrome, [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  "--window-size=960,540", "--hide-scrollbars", "about:blank",
], { stdio: "ignore" });

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await new Promise((r) => setTimeout(r, 200));
    target = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json())
      .then((list) => list.find((t) => t.type === "page")).catch(() => undefined);
  }
  if (!target) throw new Error("Chrome did not start");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const waiting = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (waiting.has(msg.id)) { waiting.get(msg.id)(msg); waiting.delete(msg.id); }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const n = ++id;
    waiting.set(n, (msg) => msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result));
    ws.send(JSON.stringify({ id: n, method, params }));
  });

  await send("Emulation.setDeviceMetricsOverride", { width: 960, height: 540, deviceScaleFactor: 1, mobile: false });
  await send("Page.enable");
  await send("Page.navigate", { url: "file://" + join(here, "scene.html") });
  await new Promise((r) => setTimeout(r, 1500));

  for (let f = 0; f < fps * seconds; f++) {
    await send("Runtime.evaluate", { expression: `show(${f / fps})` });
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(join(frames, `f${String(f).padStart(4, "0")}.png`), Buffer.from(data, "base64"));
  }
  ws.close();

  const out = join(here, "..", "readme.gif");
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", String(fps), "-i", join(frames, "f%04d.png"),
    "-vf", "split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle",
    "-loop", "0", out,
  ]);
  console.log(`wrote ${out}`);
} finally {
  browser.kill();
  rmSync(frames, { recursive: true, force: true });
  rmSync(profile, { recursive: true, force: true });
}
