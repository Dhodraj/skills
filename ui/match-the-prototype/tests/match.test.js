// Runs scripts/compare.js on hand-written frames, checks that plan.js and
// capture.js refuse a page off this machine, and that plan.js writes the
// frames .gitignore. Prints one line per case:
// "ok <name>" or "FAIL <name>". design-the-ui's tests/run.sh counts the lines.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const compare = path.join(__dirname, "../scripts/compare.js");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "match-"));
const style = { "font-size": "16px" };
const drawn = (name, count = 1, y = 0) => ({ kind: "drawn", name, count, box: { x: 0, y, w: 10, h: 10 }, style, text: name });
const frame = (state, side, f, elements, text = "a b") =>
  fs.writeFileSync(path.join(dir, state, `1280-${f}-${side}.json`), JSON.stringify({ elements, text, dataText: [], alerts: [] }));

const states = {
  same: [[drawn("t"), drawn("r", 2)], [drawn("t"), drawn("r", 2)]],
  count: [[drawn("t"), drawn("r", 2)], [drawn("t"), drawn("r", 1)]],
  moved: [[drawn("t"), drawn("r", 2)], [drawn("t", 1, 5), drawn("r", 2)]],
  empty: [[], [{ kind: "absent", name: "t" }, { kind: "absent", name: "r" }]],
};
for (const [state, [a, b]] of Object.entries(states)) {
  fs.mkdirSync(path.join(dir, state));
  for (const f of ["first", "settled"]) { frame(state, "prototype", f, a); frame(state, "product", f, b); }
}

const run = (state) => {
  const pairs = path.join(dir, `${state}.json`);
  fs.writeFileSync(pairs, JSON.stringify({ origin: "http://127.0.0.1:1/", widths: [1280],
    pairs: [{ state, address: "/", elements: [{ name: "t", selector: "h1" }, { name: "r", selector: "li" }] }] }));
  try { execFileSync("node", [compare, pairs, dir], { stdio: "pipe" }); return { code: 0, table: fs.readFileSync(path.join(dir, "differences.md"), "utf8") }; }
  catch (e) { return { code: e.status, table: fs.readFileSync(path.join(dir, "differences.md"), "utf8") }; }
};

const check = (name, ok) => console.log(`${ok ? "ok" : "FAIL"} ${name}`);
const same = run("same");
check("matching frames exit 0", same.code === 0);
const count = run("count");
check("a different number of matches is a row", count.code === 1 && count.table.includes("a different number of matches"));
const moved = run("moved");
check("a 5 px move is a row", moved.code === 1 && moved.table.includes("+5 px"));
const empty = run("empty");
check("a product frame with no named element fails", empty.code === 1 && empty.table.includes("draws no named element"));
fs.rmSync(dir, { recursive: true, force: true });

const plan = path.join(__dirname, "../scripts/plan.js");
const planDir = fs.mkdtempSync(path.join(os.tmpdir(), "match-plan-"));
const planFor = (address) => {
  const pairs = path.join(planDir, "pairs.json");
  fs.writeFileSync(pairs, JSON.stringify({ origin: "http://localhost:3/", widths: [1280],
    pairs: [{ state: "s", address, elements: [{ name: "t", selector: "h1" }] }] }));
  const frames = path.join(planDir, "frames");
  fs.rmSync(frames, { recursive: true, force: true });
  try { return { code: (execFileSync("node", [plan, pairs, frames], { stdio: "pipe" }), 0), frames }; }
  catch (e) { return { code: e.status, frames }; }
};
check("plan.js refuses a //host address", planFor("//evil.com/x").code === 2);
check("plan.js refuses an absolute address off this machine", planFor("http://evil.com/x").code === 2);
const local = planFor("/runs");
check("plan.js passes a local address", local.code === 0);
check("plan.js writes the frames .gitignore", fs.existsSync(path.join(local.frames, ".gitignore")));
fs.rmSync(planDir, { recursive: true, force: true });

globalThis.location = { href: "http://example.com/x" };
const capture = eval(`(${fs.readFileSync(path.join(__dirname, "../scripts/capture.js"), "utf8")})`);
check("capture refuses a page off this machine", /refused/.test(capture().error || ""));
