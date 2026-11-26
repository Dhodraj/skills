// Reads the pairs file that plan.js and compare.js share. The format is in
// ../references/pairs.md. parse() throws a plain Error naming the bad field.
const SIDES = ["prototype", "product"];

// The computed styles held to the prototype.
const STYLE_PROPERTIES = [
  "font-family", "font-size", "font-weight", "line-height", "color",
  "background-color", "padding", "gap", "border-radius", "border-top",
];

const isRecord = (v) => typeof v === "object" && v !== null && !Array.isArray(v);

const text = (from, key, where) => {
  const v = from[key];
  if (typeof v !== "string" || v === "") throw new Error(`${where}.${key} must be a non-empty string`);
  return v;
};

// A string names the same thing on both sides; an object names each side.
const bySide = (v, where) => {
  if (typeof v === "string" && v !== "") return { prototype: v, product: v };
  if (isRecord(v)) return { prototype: text(v, "prototype", where), product: text(v, "product", where) };
  throw new Error(`${where} must be a string, or an object with prototype and product`);
};

const widths = (v, where, fallback) => {
  if (v === undefined) return fallback;
  if (!Array.isArray(v) || v.length === 0 || v.some((w) => typeof w !== "number" || w < 200)) {
    throw new Error(`${where} must be a list of widths in pixels`);
  }
  return v;
};

const step = (v, where) => {
  if (isRecord(v) && typeof v.click === "string") return { kind: "click", selector: v.click };
  if (isRecord(v) && typeof v.check === "string") return { kind: "check", selector: v.check };
  if (isRecord(v) && typeof v.wait === "number") return { kind: "wait", ms: v.wait };
  throw new Error(`${where} must be { "click": selector }, { "check": selector } or { "wait": ms }`);
};

const steps = (v, where) => {
  if (v === undefined) return { prototype: [], product: [] };
  if (!isRecord(v)) throw new Error(`${where} must be an object with prototype and product`);
  const list = (s, w) => {
    if (s === undefined) return [];
    if (!Array.isArray(s)) throw new Error(`${w} must be a list`);
    return s.map((one, i) => step(one, `${w}[${i}]`));
  };
  return { prototype: list(v.prototype, `${where}.prototype`), product: list(v.product, `${where}.product`) };
};

const pair = (v, where, defaultWidths) => {
  if (!isRecord(v)) throw new Error(`${where} must be an object`);
  if (!Array.isArray(v.elements) || v.elements.length === 0) throw new Error(`${where}.elements must be a non-empty list`);
  return {
    state: text(v, "state", where),
    address: bySide(v.address, `${where}.address`),
    steps: steps(v.steps, `${where}.steps`),
    settled: v.settled === undefined ? { prototype: null, product: null } : bySide(v.settled, `${where}.settled`),
    text: v.text === undefined ? { prototype: "body", product: "body" } : bySide(v.text, `${where}.text`),
    widths: widths(v.widths, `${where}.widths`, defaultWidths),
    elements: v.elements.map((e, i) => {
      if (!isRecord(e)) throw new Error(`${where}.elements[${i}] must be an object`);
      return {
        name: text(e, "name", `${where}.elements[${i}]`),
        selector: bySide(e.selector, `${where}.elements[${i}].selector`),
        data: e.data === true,
      };
    }),
  };
};

const parse = (source) => {
  const root = JSON.parse(source);
  if (!isRecord(root)) throw new Error("the pairs file must hold one object");
  if (!Array.isArray(root.widths)) throw new Error("widths must list the project's widths in pixels");
  const defaultWidths = widths(root.widths, "widths");
  if (!Array.isArray(root.pairs) || root.pairs.length === 0) throw new Error("pairs must be a non-empty list");
  const firstFrameMs = root.firstFrameMs ?? 600;
  if (typeof firstFrameMs !== "number" || firstFrameMs < 0) throw new Error("firstFrameMs must be a number of 0 or more");
  return {
    origin: bySide(root.origin, "origin"),
    hold: typeof root.hold === "string" && root.hold !== "" ? root.hold : null,
    firstFrameMs,
    pairs: root.pairs.map((p, i) => pair(p, `pairs[${i}]`, defaultWidths)),
  };
};

const heightOf = (width) => (width < 600 ? 812 : width < 1600 ? 800 : 1080);
const slugOf = (state) => state.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fileOf = (folder, state, width, frame, side) => `${folder}/${slugOf(state)}/${width}-${frame}-${side}`;

module.exports = { SIDES, STYLE_PROPERTIES, parse, heightOf, fileOf };
