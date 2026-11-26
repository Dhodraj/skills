// Prints the Playwright MCP calls that capture every state of a pairs file, one
// JSON object per line: the tool name and its arguments. Run them in order.
// "<capture.js>" stands for the whole contents of capture.js.
//
// Usage: node plan.js <pairs.json> <frames folder>
//
// It refuses any page address that does not resolve to this machine, and writes a .gitignore
// into the frames folder, because the frames hold the product's data. The
// frames folder must sit inside the MCP's workspace root.
const fs = require("fs");
const path = require("path");
const { SIDES, parse, heightOf, fileOf } = require("./pairs.js");

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

const main = () => {
  const [pairsFile, frames] = process.argv.slice(2);
  if (!pairsFile || !frames) { console.error("usage: node plan.js <pairs.json> <frames folder>"); return 2; }
  let pairs;
  try { pairs = parse(fs.readFileSync(pairsFile, "utf8")); } catch (e) { console.error(`pairs file: ${e.message}`); return 2; }
  // The full address, not only the origin: "//host/x" or an absolute address escapes an origin check.
  for (const pair of pairs.pairs) {
    for (const side of SIDES) {
      let host = null;
      try { host = new URL(pair.address[side], pairs.origin[side]).hostname; } catch {}
      if (!LOCAL_HOSTS.includes(host)) {
        console.error(`${pair.state} ${side}: the address must resolve to localhost, 127.0.0.1 or [::1], not ${host ?? pair.address[side]}`);
        return 2;
      }
    }
  }
  fs.mkdirSync(frames, { recursive: true });
  fs.writeFileSync(path.join(frames, ".gitignore"), "*\n");
  const call = (tool, args) => console.log(JSON.stringify({ tool, ...args }));
  const widths = [...new Set(pairs.pairs.flatMap((p) => p.widths))];
  for (const width of widths) {
    call("browser_resize", { width, height: heightOf(width) });
    for (const side of SIDES) {
      for (const pair of pairs.pairs.filter((p) => p.widths.includes(width))) {
        const spec = {
          state: pair.state, side, hold: pairs.hold, firstFrameMs: pairs.firstFrameMs,
          settled: pair.settled[side], text: pair.text[side],
          steps: pair.steps[side].map((s) => (s.kind === "wait" ? { wait: s.ms } : { [s.kind]: s.selector })),
          elements: pair.elements.map((e) => ({ name: e.name, selector: e.selector[side], data: e.data })),
        };
        const file = (frame) => fileOf(frames, pair.state, width, frame, side);
        fs.mkdirSync(path.dirname(file("first")), { recursive: true });
        call("browser_navigate", { url: new URL(pair.address[side], pairs.origin[side]).href });
        call("browser_evaluate", { function: "<capture.js>" });
        for (const frame of ["first", "settled"]) {
          call("browser_evaluate", { function: `() => window.mtpCapture.${frame}(${JSON.stringify(spec)})`, filename: `${file(frame)}.json` });
          call("browser_take_screenshot", { filename: `${file(frame)}.png`, fullPage: true, scale: "css" });
        }
      }
    }
  }
  return 0;
};

process.exitCode = main();
