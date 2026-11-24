// Runs scripts/style-gallery.js in node and prints one line per case:
// "ok <name>" or "FAIL <name>". run.sh counts the lines.
const fs = require("fs");
const path = require("path");
const g = require("../scripts/style-gallery.js");

const check = (name, ok) => console.log(`${ok ? "ok" : "FAIL"} ${name}`);
const throws = (fn, text) => { try { fn(); return false; } catch (e) { return e.message.includes(text); } };

check("contrast of black on white is 21", Math.abs(g.contrast("#000000", "#FFFFFF") - 21) < 0.01);
check("contrast is symmetric", g.contrast("#F05B36", "#FFFFFF") === g.contrast("#FFFFFF", "#F05B36"));

// Every derived colour that carries text must pass 4.5:1 for any brand, the
// light, dark, mid and saturated ones included.
for (const brand of ["#F05B36", "#FFD400", "#0047AB", "#111111", "#FFFFFF", "#7F7F7F", "#00FF00"]) {
  const p = g.palette(brand);
  check(`${brand}: text on the brand fill is the better of the two inks`,
    g.contrast(p.onBrand, brand) >= Math.max(g.contrast(g.INK, brand), g.contrast(g.PAPER, brand)) - 0.001);
  check(`${brand}: brand text passes on the darkest light ground`, g.contrast(p.brandDeep, g.LIGHT_FLOOR) >= 4.5);
  check(`${brand}: light text passes on the deep brand fill`, g.contrast(p.brandDeep, g.PAPER) >= 4.5);
  check(`${brand}: brand text passes on the dark ground`, g.contrast(p.brandGlow, g.NIGHT) >= 4.5);
  check(`${brand}: earthy fill carries light text`, g.contrast(p.earthDeep, "#F7F2EA") >= 4.5);
  check(`${brand}: glass text passes over the brand at the chosen opacity`,
    g.contrast(g.mix(brand, g.GLASS, p.glassAlpha), g.GLASS_TEXT) >= 4.5);
}
check("a brand that already passes is left as it is", g.palette("#0047AB").brandDeep === "#0047AB");

check("a missing name is refused", throws(() => g.parseArgs(["--brand", "#F05B36"]), "--name is required"));
check("a colour that is not hex is refused", throws(() => g.parseArgs(["--name", "A", "--brand", "orange"]), "--brand must be"));
check("a font that could break out of CSS is refused",
  throws(() => g.parseArgs(["--name", "A", "--brand", "#F05B36", "--font", 'x"}body{']), "--font must be"));
check("an unknown option is refused", throws(() => g.parseArgs(["--name", "A", "--brand", "#F05B36", "--colour", "x"]), "unknown option"));
check("an option with no value is refused", throws(() => g.parseArgs(["--name"]), "needs a value"));
check("an image of an unknown type is refused",
  throws(() => g.render({ name: "A", brand: "#F05B36", font: "Manrope", image: "hero.gif" }), "--image must be"));

const html = g.render({ name: '<script>alert(1)</script>Co', brand: "#F05B36", font: "Manrope" });
check("the client name is escaped", !html.includes("<script>alert") && html.includes("&lt;script&gt;"));
const ids = g.tiles({ name: "", headline: "" }).map((t) => t.id);
check("every tile is rendered", ids.every((id) => html.includes(`class="tile s-${id}"`)));
check("every tile has its own styles", ids.every((id) => html.includes(`.s-${id}{`)));
check("the page loads no placeholder image service", !/unsplash|placehold|picsum/.test(html));

// A local image is embedded, so the page stays one file.
const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "gallery-"));
const svg = path.join(tmp, "hero.svg");
fs.writeFileSync(svg, '<svg xmlns="http://www.w3.org/2000/svg"/>');
const withImage = g.render({ name: "A", brand: "#F05B36", font: "Manrope", image: svg });
check("a local image is embedded as data", withImage.includes("data:image/svg+xml;base64,"));
check("and the stand-in note is dropped", !withImage.includes("drawn stand-ins"));
fs.rmSync(tmp, { recursive: true, force: true });

// The catalogue and the gallery name the same styles, in the same order.
const styles = fs.readFileSync(path.join(__dirname, "../references/styles.md"), "utf8");
const headings = [...styles.matchAll(/^## \d+\. (.+)$/gm)].map((m) => m[1].trim());
const names = g.tiles({ name: "", headline: "" }).map((t) => t.name);
check("styles.md and the gallery list the same styles in order", JSON.stringify(headings) === JSON.stringify(names));
