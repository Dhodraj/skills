// Runs scripts/covered.js against a small fake page and prints one line per
// case: "ok <name>" or "FAIL <name>". run.sh counts the lines.
const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "../scripts/covered.js"), "utf8");
const covered = eval(source);

// A fake element: just enough of the DOM for covered.js.
const all = [];
const el = (name, tags, rect, { parent = null, position = "static" } = {}) => {
  const e = {
    name, tags: new Set(tags), parentElement: parent, position,
    outerHTML: `<${name}>`,
    getBoundingClientRect: () => ({ x: rect[0], y: rect[1], width: rect[2], height: rect[3] }),
    matches: (sel) => sel.split(",").some((s) => e.tags.has(s.trim())),
    closest: (sel) => { for (let n = e; n; n = n.parentElement) if (n.matches(sel)) return n; return null; },
    contains: (other) => { for (let n = other; n; n = n.parentElement) if (n === e) return true; return false; },
  };
  all.push(e);
  return e;
};

const body = el("body", ["body"], [0, 0, 1000, 800]);
const onTop = el("button-on-top", ["button"], [0, 0, 100, 40], { parent: body });
const underToast = el("button-under-toast", ["button"], [0, 100, 100, 40], { parent: body });
const toast = el("toast", ["div"], [0, 90, 300, 60], { parent: body, position: "fixed" });
const header = el("header", ["header"], [0, 200, 1000, 60], { parent: body, position: "sticky" });
const underHeader = el("link-under-header", ["a"], [0, 210, 80, 20], { parent: body });
const card = el("card", ["[role=group]"], [0, 300, 300, 100], { parent: body });
const icon = el("icon", ["svg"], [10, 310, 20, 20], { parent: card });
const cardLabel = el("card-label", ["p"], [0, 305, 300, 40], { parent: card });
const hidden = el("zero-size", ["button"], [0, 500, 0, 0], { parent: body });
const lostIcon = el("icon-under-overlay", ["svg"], [600, 600, 20, 20], { parent: body });
const overlay = el("overlay", ["div"], [500, 500, 300, 300], { parent: body, position: "absolute" });

const topAt = new Map([[onTop, onTop], [underToast, toast], [underHeader, header], [icon, cardLabel], [cardLabel, cardLabel], [lostIcon, overlay]]);
const centre = (e) => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; };

global.innerWidth = 1000;
global.innerHeight = 800;
global.getComputedStyle = (e) => ({ position: e.position });
global.document = {
  querySelectorAll: (sel) => all.filter((e) => e.matches(sel)),
  elementFromPoint: (x, y) => {
    for (const [e, top] of topAt) { const [cx, cy] = centre(e); if (cx === x && cy === y) return top; }
    return null;
  },
};

const result = covered();
const check = (name, ok) => console.log(`${ok ? "ok" : "FAIL"} ${name}`);
check("a control on top is not covered", !result.controls.includes("<button-on-top>"));
check("a control under a fixed toast is covered", result.controls.includes("<button-under-toast>"));
check("a control under a sticky page header is not reported", !result.controls.includes("<link-under-header>"));
check("a zero-size control is skipped", !result.controls.includes("<zero-size>"));
check("an icon under its own card's label is not covered", !result.marks.includes("<icon>"));
check("an icon under an unrelated overlay is covered", result.marks.includes("<icon-under-overlay>"));
check("exactly two elements are reported", result.controls.length + result.marks.length === 2);

// A graph node whose class is not one of the built-in own parts.
const graphNode = el("graph-node", [".graph-node"], [0, 700, 200, 60], { parent: body });
const nodeIcon = el("node-icon", ["svg"], [10, 710, 20, 20], { parent: graphNode });
const nodeLabel = el("node-label", ["p"], [0, 705, 200, 40], { parent: graphNode });
topAt.set(nodeIcon, nodeLabel).set(nodeLabel, nodeLabel);
check("an icon under its graph node's label is covered when the node class is not passed", covered().marks.includes("<node-icon>"));

const withNodes = covered(".graph-node");
check("an icon under its graph node's label is not covered when the node class is passed", !withNodes.marks.includes("<node-icon>"));
check("passing a node class leaves other covering reported", withNodes.marks.includes("<icon-under-overlay>") && withNodes.controls.includes("<button-under-toast>"));

// The form the skill tells the model to send: the file wrapped, with the node class as its argument.
const wrapped = eval(`() => (${source})(".graph-node")`)();
check("the wrapped form passes the node class through", !wrapped.marks.includes("<node-icon>"));
