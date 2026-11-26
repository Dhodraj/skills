// Compares the frames capture.js measured and writes differences.md into the
// output folder: one row per difference. Exits 0 when the table is empty, 1
// when it has a row, 2 on bad input.
//
// Usage: node compare.js <pairs.json> <output folder>
const fs = require("fs");
const { STYLE_PROPERTIES, parse, fileOf } = require("./pairs.js");

const TOLERANCE_PX = 1;
// The largest word grid aligned word for word; a longer page compares as one block.
const MAX_ALIGNED_CELLS = 25_000_000;

const read = (file) => {
  try {
    const m = JSON.parse(fs.readFileSync(file, "utf8"));
    if (typeof m.error === "string") return m;
    return Array.isArray(m.elements) && typeof m.text === "string" ? m : null;
  } catch { return null; }
};

// The form of a computed value that decides what is drawn.
const drawnValue = (property, value = "") => {
  if (property === "font-family") return (value.split(",")[0] ?? "").trim().replace(/^["']|["']$/g, "");
  if (property === "border-top" && /^0px\b/.test(value)) return "none";
  if (property === "border-radius" && parseFloat(value) >= 1000) return "full";
  return value;
};

// A product frame with no page to compare: no named element drawn, or an alert
// the prototype's frame does not show. Without these, two empty frames match.
const frameRows = (row, prototype, product) => [
  ...(product.elements.every((e) => e.kind === "absent")
    ? [row("frame", "", "empty", "the product frame draws no named element")] : []),
  ...(product.alerts ?? []).filter((a) => !(prototype.alerts ?? []).includes(a))
    .map((a) => row("alert", "(none)", a, "the product frame shows an alert the prototype's does not")),
];

const elementRows = (row, element, a, b) => {
  const r = (property, x, y, difference) => row(property ? `${element.name}: ${property}` : element.name, x, y, difference);
  if (!a || a.kind === "absent") return b?.kind === "drawn" ? [r("", "absent", "drawn", "prototype lacks it: check the selector")] : [];
  if (!b || b.kind === "absent") return [r("", "drawn", "absent", "product lacks it")];
  return [
    ...["x", "y", "w", "h"].flatMap((k) => {
      const gap = Math.round((b.box[k] - a.box[k]) * 10) / 10;
      return Math.abs(gap) > TOLERANCE_PX ? [r(k, `${a.box[k]}`, `${b.box[k]}`, `${gap > 0 ? "+" : ""}${gap} px`)] : [];
    }),
    ...STYLE_PROPERTIES.flatMap((p) => {
      const x = drawnValue(p, a.style[p]);
      const y = drawnValue(p, b.style[p]);
      return x === y ? [] : [r(p, x, y, "not the same")];
    }),
    ...(a.count === b.count ? [] : [r("count", `${a.count}`, `${b.count}`, "a different number of matches")]),
    ...(element.data || a.text === b.text ? [] : [r("text", a.text, b.text, "different words")]),
  ];
};

// The runs of words that differ, aligned by their longest common subsequence.
const wordRuns = (a, b) => {
  if ((a.length + 1) * (b.length + 1) > MAX_ALIGNED_CELLS) return a.join(" ") === b.join(" ") ? [] : [[a.join(" "), b.join(" ")]];
  const cols = b.length + 1;
  const lcs = new Uint32Array((a.length + 1) * cols);
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i * cols + j] = a[i] === b[j] ? lcs[(i + 1) * cols + j + 1] + 1 : Math.max(lcs[(i + 1) * cols + j], lcs[i * cols + j + 1]);
    }
  }
  const runs = [];
  let onlyA = [];
  let onlyB = [];
  const flush = () => { if (onlyA.length || onlyB.length) runs.push([onlyA.join(" "), onlyB.join(" ")]); onlyA = []; onlyB = []; };
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { flush(); i++; j++; }
    else if (j >= b.length || (i < a.length && lcs[(i + 1) * cols + j] >= lcs[i * cols + j + 1])) onlyA.push(a[i++]);
    else onlyB.push(b[j++]);
  }
  flush();
  return runs;
};

const words = (t) => t.split(/\s+/).filter((w) => w !== "");

// Takes every whole run of the cut words out of the list.
const cutRun = (list, cut) => {
  if (cut.length === 0) return list;
  const kept = [];
  for (let i = 0; i < list.length;) {
    if (cut.every((w, k) => list[i + k] === w)) i += cut.length;
    else kept.push(list[i++]);
  }
  return kept;
};

// A frame's words, without the words its data elements drew.
const wordsOf = (m) => (m.dataText ?? []).map(words).sort((x, y) => y.length - x.length).reduce(cutRun, words(m.text));

const pairRows = (folder, pair, width) => ["settled", "first"].flatMap((frame) => {
  const row = (element, prototype, product, difference) => ({ state: pair.state, width, frame, element, prototype, product, difference });
  const a = read(`${fileOf(folder, pair.state, width, frame, "prototype")}.json`);
  const b = read(`${fileOf(folder, pair.state, width, frame, "product")}.json`);
  if (!a || !b) return [row("capture", a ? "taken" : "missing", b ? "taken" : "missing", "run the plan.js calls for this state")];
  if (a.error || b.error) return [row("capture", a.error || "taken", b.error || "taken", "the capture refused or failed")];
  // The first frame holds every element not marked data to the prototype's first frame.
  const held = frame === "first" ? pair.elements.filter((e) => !e.data) : pair.elements;
  const rows = held.flatMap((e) => elementRows(row, e, a.elements.find((m) => m.name === e.name), b.elements.find((m) => m.name === e.name)));
  const textRows = frame === "first" ? [] : wordRuns(wordsOf(a), wordsOf(b)).map(([x, y]) =>
    row("page text", x || "(none)", y || "(none)", x === "" ? "extra words" : y === "" ? "missing words" : "different words"));
  return [...frameRows(row, a, b), ...rows, ...textRows];
});

const cell = (v) => String(v).replace(/\|/g, "\\|").replace(/\n/g, " ");

const main = () => {
  const [pairsFile, folder] = process.argv.slice(2);
  if (!pairsFile || !folder) { console.error("usage: node compare.js <pairs.json> <output folder>"); return 2; }
  let pairs;
  try { pairs = parse(fs.readFileSync(pairsFile, "utf8")); } catch (e) { console.error(`pairs file: ${e.message}`); return 2; }
  // The frames hold the product's data: keep the folder out of git.
  if (!fs.existsSync(`${folder}/.gitignore`)) fs.writeFileSync(`${folder}/.gitignore`, "*\n");
  const rows = pairs.pairs.flatMap((p) => p.widths.flatMap((w) => pairRows(folder, p, w)));
  const table = [
    "| state | width | frame | element | prototype | product | difference |",
    "|---|---|---|---|---|---|---|",
    ...rows.map((r) => `| ${[r.state, r.width, r.frame, r.element, r.prototype, r.product, r.difference].map(cell).join(" | ")} |`),
  ].join("\n");
  fs.writeFileSync(`${folder}/differences.md`, `${table}\n`);
  console.log(table);
  console.log(`\n${rows.length} ${rows.length === 1 ? "difference" : "differences"}, written to ${folder}/differences.md`);
  return rows.length === 0 ? 0 : 1;
};

process.exitCode = main();
