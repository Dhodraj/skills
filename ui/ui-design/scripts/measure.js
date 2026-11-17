// Measures a rendered page in the browser. This file is one arrow function:
// pass its whole contents as the `function` argument of the Playwright MCP
// tool `browser_evaluate`.
//
// It leaves itself on the page as `window.pxeMeasure`, so measure it again
// after a resize, a navigation within the same page, or opening a state with
// the one-line call instead of pasting this file a second time:
//
//   browser_evaluate(function: "() => window.pxeMeasure()")
//
// A full page load clears it; paste this file again after one. Pass
// `filename` to keep the result out of the conversation and read it from the
// file instead.
//
// It measures what a source diff cannot show and a screenshot cannot state as
// a number: overflow, text contrast, target sizes, controls with no name,
// heading order, unsized media, and how many type sizes, radii and shadows the
// page actually uses.
//
// It also reports five geometry faults from references/craft.md (Spacing and
// alignment), each named there: clipped, tight inset, uneven padding,
// near-tangent and a wrapped unit. Tight inset and uneven padding have to
// recognise a surface first, which they do from the computed background,
// border and shadow: a surface drawn with a pseudo-element is missed, and
// uneven padding also misses one drawn with a background image. ui-review's
// own table states what each fault means and what it cannot see.
//
// It reports measurements, not findings. A number here is a candidate: confirm
// it on the screenshot, decide whether it harms the user, and group everything
// with one cause into one finding.
//
// Limits, which belong in any report that cites it: it reads the page as it
// stands, so a state nobody opened is not measured. Contrast is computed
// against the nearest opaque background colour, so text over an image or a
// gradient comes back as "unmeasured" rather than wrong. A translucent ink is
// composited over that background first and then measured, so an `rgba()`
// colour is a real result rather than a skipped one. It cannot see hierarchy,
// rhythm, crowding or whether the page is any good.
//
// Thresholds: an inset under 8px, a panel at least 120 by 80 with two or more
// children, sibling edges 0.5 to 3.5px apart, 24 siblings per parent and 60
// near-tangents in all. A target is measured against 24 by 24, and against 44
// by 44 where a thumb is expected: a coarse pointer, or a viewport at or under
// 768px. data-crop exempts a container from the clipping check, and so does a
// container that hides its own content from the screen, such as the visually
// hidden pattern.
() => {
  const measure = () => {
  const SAMPLE = 12;
  const viewport = { width: window.innerWidth, height: window.innerHeight };

  const parseColour = (value) => {
    const match = /rgba?\(([^)]+)\)/.exec(value || "");
    if (!match) return null;
    const parts = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };

  const luminance = ({ r, g, b }) => {
    const channel = (value) => {
      const c = value / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };

  const contrast = (foreground, background) => {
    const a = luminance(foreground);
    const b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };

  // The colour behind an element: the nearest ancestor with an opaque
  // background. An image or a gradient on the way makes the result unusable,
  // which the caller has to sample from the screenshot instead.
  const backgroundBehind = (element) => {
    let node = element;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      if (style.backgroundImage && style.backgroundImage !== "none") return { unmeasured: "background-image" };
      const colour = parseColour(style.backgroundColor);
      if (colour && colour.a === 1) return { colour };
      if (colour && colour.a > 0 && colour.a < 1) return { unmeasured: "translucent-background" };
      node = node.parentElement;
    }
    const root = parseColour(getComputedStyle(document.documentElement).backgroundColor);
    return root && root.a === 1 ? { colour: root } : { colour: { r: 255, g: 255, b: 255, a: 1 } };
  };

  const visible = (element) => {
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
  };

  const describe = (element) => {
    const id = element.id ? `#${element.id}` : "";
    const classes = typeof element.className === "string" && element.className
      ? `.${element.className.trim().split(/\s+/).slice(0, 2).join(".")}`
      : "";
    return `${element.tagName.toLowerCase()}${id}${classes}`;
  };

  const text = (element) => (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60);

  const all = Array.from(document.querySelectorAll("*")).filter(visible);

  // 1. Horizontal overflow. The page scrolling sideways is the finding; the
  // widest elements are the evidence.
  const documentWidth = Math.max(
    document.documentElement.scrollWidth,
    document.body ? document.body.scrollWidth : 0,
  );
  const overflow = {
    documentWidth,
    viewportWidth: viewport.width,
    scrollsSideways: documentWidth > viewport.width + 1,
    widest: all
      .map((element) => ({ element, box: element.getBoundingClientRect() }))
      .filter(({ box }) => box.right > viewport.width + 1 || box.left < -1)
      .sort((a, b) => b.box.right - a.box.right)
      .slice(0, SAMPLE)
      .map(({ element, box }) => ({
        selector: describe(element),
        right: Math.round(box.right),
        left: Math.round(box.left),
        text: text(element),
      })),
  };

  // A translucent ink is what the reader sees once it composites over the
  // surface behind it, so that is what gets measured. Reading the declared
  // colour instead would skip every `rgba()` and every `text-black/40`.
  const composite = (foreground, background) => ({
    r: Math.round(foreground.r * foreground.a + background.r * (1 - foreground.a)),
    g: Math.round(foreground.g * foreground.a + background.g * (1 - foreground.a)),
    b: Math.round(foreground.b * foreground.a + background.b * (1 - foreground.a)),
    a: 1,
  });

  // 2. Text contrast against the nearest opaque background.
  const textNodes = all.filter((element) => {
    if (!element.firstChild) return false;
    return Array.from(element.childNodes).some(
      (node) => node.nodeType === 3 && node.textContent.trim().length > 0,
    );
  });
  const contrastFailures = [];
  const unmeasuredContrast = [];
  for (const element of textNodes) {
    const style = getComputedStyle(element);
    const declared = parseColour(style.color);
    if (!declared) continue;
    const behind = backgroundBehind(element);
    const size = parseFloat(style.fontSize);
    const weight = Number(style.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    if (behind.unmeasured) {
      unmeasuredContrast.push({ selector: describe(element), reason: behind.unmeasured, text: text(element) });
      continue;
    }
    // Fully transparent ink paints nothing, so there is nothing to measure.
    if (declared.a === 0) continue;
    const foreground = declared.a < 1 ? composite(declared, behind.colour) : declared;
    const ratio = contrast(foreground, behind.colour);
    const required = large ? 3 : 4.5;
    if (ratio < required) {
      contrastFailures.push({
        selector: describe(element),
        text: text(element),
        ratio: Math.round(ratio * 100) / 100,
        required,
        fontSize: Math.round(size * 10) / 10,
        colour: style.color,
        measured: declared.a < 1
          ? `rgb(${foreground.r}, ${foreground.g}, ${foreground.b}) after compositing`
          : undefined,
        background: `rgb(${behind.colour.r}, ${behind.colour.g}, ${behind.colour.b})`,
      });
    }
  }

  // 3. Interactive elements: size and accessible name.
  const interactiveSelector = [
    "a[href]", "button", "input", "select", "textarea", "summary",
    "[role=button]", "[role=link]", "[role=checkbox]", "[role=radio]",
    "[role=switch]", "[role=tab]", "[role=menuitem]", "[tabindex]:not([tabindex='-1'])",
  ].join(",");
  const interactive = Array.from(document.querySelectorAll(interactiveSelector)).filter(visible);

  const accessibleName = (element) => {
    const label = element.getAttribute("aria-label");
    if (label && label.trim()) return label.trim();
    const labelledBy = element.getAttribute("aria-labelledby");
    if (labelledBy) {
      const names = labelledBy.split(/\s+/)
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((node) => (node.textContent || "").trim())
        .filter(Boolean);
      if (names.length) return names.join(" ");
    }
    if (element.labels && element.labels.length) {
      const fromLabel = Array.from(element.labels).map((node) => (node.textContent || "").trim()).filter(Boolean);
      if (fromLabel.length) return fromLabel.join(" ");
    }
    const own = (element.textContent || "").trim();
    if (own) return own;
    const title = element.getAttribute("title");
    if (title && title.trim()) return title.trim();
    const image = element.querySelector("img[alt]");
    if (image && image.getAttribute("alt").trim()) return image.getAttribute("alt").trim();
    // Under HTML-AAM, `value` is a name source for a button, submit or reset
    // input only. On a text field it is the content, not a label.
    const buttonish = ["button", "submit", "reset"];
    if (element.tagName === "INPUT"
        && buttonish.includes((element.getAttribute("type") || "").toLowerCase())
        && element.getAttribute("value")) return element.getAttribute("value");
    return null;
  };

  const inlineLink = (element) => {
    if (element.tagName !== "A") return false;
    const parent = element.parentElement;
    if (!parent) return false;
    // A link inside running text is exempt from the target-size rule.
    return getComputedStyle(element).display === "inline" &&
      (parent.textContent || "").trim().length > (element.textContent || "").trim().length + 10;
  };

  const smallTargets = [];
  const unnamedControls = [];
  const placeholderOnly = [];
  // gates.md 11: 24 x 24 is the floor everywhere, and 44 x 44 applies where a
  // thumb is expected. A coarse pointer says so outright; a viewport at or
  // under 768px is a phone whatever the pointer reports. Measuring every
  // control against 44 on a pointer-first console flags the whole page, which
  // is the same as measuring nothing.
  const thumbExpected = (typeof window.matchMedia === "function"
      && window.matchMedia("(pointer: coarse)").matches)
    || viewport.width <= 768;
  const targetFloor = thumbExpected ? 44 : 24;
  for (const element of interactive) {
    const box = element.getBoundingClientRect();
    const name = accessibleName(element);
    if (!name) {
      unnamedControls.push({ selector: describe(element), html: element.outerHTML.slice(0, 120) });
    }
    // A visually hidden control, such as a skip link, is exempt from WCAG
    // 2.5.8 and is required practice rather than a 1px target.
    const visuallyHidden = box.width <= 2 || box.height <= 2;
    if (!inlineLink(element) && !visuallyHidden
        && (box.width < targetFloor || box.height < targetFloor)) {
      smallTargets.push({
        selector: describe(element),
        name,
        width: Math.round(box.width),
        height: Math.round(box.height),
        below: `${targetFloor}x${targetFloor}`,
        rule: thumbExpected
          ? "44x44 where a thumb is expected (gates.md 11)"
          : "24x24 minimum (WCAG 2.5.8)",
      });
    }
    if ((element.tagName === "INPUT" || element.tagName === "TEXTAREA") &&
        element.getAttribute("placeholder") && !name) {
      placeholderOnly.push({ selector: describe(element), placeholder: element.getAttribute("placeholder") });
    }
  }

  // 4. Heading order.
  const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).filter(visible);
  const levels = headings.map((element) => ({ level: Number(element.tagName[1]), text: text(element) }));
  const skips = [];
  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i].level - levels[i - 1].level > 1) {
      skips.push({ from: `h${levels[i - 1].level}`, to: `h${levels[i].level}`, at: levels[i].text });
    }
  }

  // 5. Media with no reserved space. Measured from the attributes, not the
  // render: a cached or inline image decodes before paint and shifts nothing
  // locally while a real network image does.
  const unsizedMedia = Array.from(document.querySelectorAll("img,video,iframe,embed,object"))
    .filter(visible)
    .filter((element) => {
      const style = getComputedStyle(element);
      if (style.aspectRatio && style.aspectRatio !== "auto") return false;
      const hasAttributes = element.getAttribute("width") && element.getAttribute("height");
      return !hasAttributes;
    })
    .slice(0, SAMPLE)
    .map((element) => ({
      selector: describe(element),
      source: (element.currentSrc || element.src || element.getAttribute("src") || "").slice(-70),
    }));

  const imagesWithoutAlt = Array.from(document.querySelectorAll("img")).filter(visible)
    .filter((element) => element.getAttribute("alt") === null)
    .slice(0, SAMPLE)
    .map((element) => ({ selector: describe(element), source: (element.currentSrc || element.src || "").slice(-70) }));

  // 6. Census. Drift shows up here before anyone can name it: a page with
  // fourteen type sizes and nine radii has no scale.
  const census = (values) => {
    const counts = new Map();
    for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count }));
  };

  const fontSizes = [];
  const radii = [];
  const shadows = [];
  const families = [];
  const tiny = [];
  for (const element of all) {
    const style = getComputedStyle(element);
    if ((element.textContent || "").trim()) {
      const size = Math.round(parseFloat(style.fontSize) * 10) / 10;
      if (size) fontSizes.push(`${size}px`);
      if (size && size < 12) tiny.push({ selector: describe(element), fontSize: size, text: text(element) });
      families.push(style.fontFamily.split(",")[0].replace(/["']/g, "").trim());
    }
    if (style.borderRadius && style.borderRadius !== "0px") radii.push(style.borderRadius);
    if (style.boxShadow && style.boxShadow !== "none") shadows.push(style.boxShadow.slice(0, 60));
  }

  // 7. Geometry faults: the parts of references/craft.md (Spacing and
  // alignment) that are numbers. Each is a candidate, named as that file names
  // it, and confirmed on the screenshot.
  const hidesOverflow = (value) => value === "hidden" || value === "clip";
  const surfaceOf = (element) => {
    let node = element.parentElement;
    while (node && node !== document.body && node !== document.documentElement) {
      const style = getComputedStyle(node);
      const background = parseColour(style.backgroundColor);
      const hasFill = (background && background.a > 0.04)
        || (style.backgroundImage && style.backgroundImage !== "none");
      const hasEdge = (parseFloat(style.borderTopWidth) > 0 && style.borderTopStyle !== "none")
        || (parseFloat(style.borderLeftWidth) > 0 && style.borderLeftStyle !== "none")
        || (style.boxShadow && style.boxShadow !== "none");
      if (hasFill || hasEdge) return node;
      node = node.parentElement;
    }
    return null;
  };
  // The inner edge of a surface: its border box less its own borders. Padding
  // is what we are measuring, so it is not subtracted.
  const innerBox = (element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      top: box.top + parseFloat(style.borderTopWidth || 0),
      bottom: box.bottom - parseFloat(style.borderBottomWidth || 0),
      left: box.left + parseFloat(style.borderLeftWidth || 0),
      right: box.right - parseFloat(style.borderRightWidth || 0),
    };
  };
  const round = (value) => Math.round(value * 10) / 10;

  const textElements = all.filter((element) => Array.from(element.childNodes)
    .some((node) => node.nodeType === 3 && node.textContent.trim().length > 0));

  // 7a. Clipped: a mark sliced by an ancestor that hides overflow. A crop the
  // author chose carries data-crop; ellipsis truncation is not a clip.
  const clipped = [];
  const paints = (element) => {
    if (["IMG", "SVG", "VIDEO", "CANVAS"].includes(element.tagName)) return true;
    if ((element.textContent || "").trim()) return true;
    const style = getComputedStyle(element);
    const background = parseColour(style.backgroundColor);
    if (background && background.a > 0.04) return true;
    if (style.backgroundImage && style.backgroundImage !== "none") return true;
    if (style.boxShadow && style.boxShadow !== "none") return true;
    return parseFloat(style.borderTopWidth) > 0 && style.borderTopStyle !== "none";
  };
  for (const element of all) {
    if (!paints(element)) continue;
    const box = element.getBoundingClientRect();
    let node = element.parentElement;
    while (node && node !== document.documentElement) {
      if (node.hasAttribute("data-crop")) break;
      const style = getComputedStyle(node);
      const inner = innerBox(node);
      // A container that hides its content from the screen on purpose is not
      // slicing a mark, because none of it is on screen to slice. The
      // visually hidden pattern is a 1px box with overflow hidden, which is
      // how a responsive table header or a skip link stays available to a
      // screen reader. Reporting it would file a fault against the markup
      // that exists for access.
      const hidesFromScreen = inner.bottom - inner.top <= 2
        || inner.right - inner.left <= 2
        || style.clip === "rect(0px, 0px, 0px, 0px)";
      if (hidesFromScreen) break;
      const sides = [];
      if (hidesOverflow(style.overflowY)) {
        if (box.top < inner.top - 1) sides.push("top");
        if (box.bottom > inner.bottom + 1) sides.push("bottom");
      }
      if (hidesOverflow(style.overflowX) && style.textOverflow !== "ellipsis") {
        if (box.left < inner.left - 1) sides.push("left");
        if (box.right > inner.right + 1) sides.push("right");
      }
      if (sides.length && node !== document.body) {
        clipped.push({
          selector: describe(element),
          clippedBy: describe(node),
          sides,
          over: round(Math.max(
            inner.top - box.top,
            box.bottom - inner.bottom,
            inner.left - box.left,
            box.right - inner.right,
          )),
          text: text(element),
        });
        break;
      }
      node = node.parentElement;
    }
  }

  // 7b. Tight inset: words closer than 8px to the edge of the surface they
  // sit on. 12px is the rule; under 8px reads as touching.
  const tightInsets = [];
  const seenInset = new Set();
  // Where the ink is, not where the box is: a table cell or a paragraph
  // stretches to its container's width, and its own padding is the inset the
  // reader sees.
  const inkBox = (element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 && rect.height > 0);
    range.detach();
    if (!rects.length) return element.getBoundingClientRect();
    return {
      top: Math.min(...rects.map((rect) => rect.top)),
      bottom: Math.max(...rects.map((rect) => rect.bottom)),
      left: Math.min(...rects.map((rect) => rect.left)),
      right: Math.max(...rects.map((rect) => rect.right)),
    };
  };
  for (const element of textElements) {
    const surface = surfaceOf(element);
    if (!surface) continue;
    const inner = innerBox(surface);
    const box = inkBox(element);
    if (box.right - box.left < 1 || box.bottom - box.top < 1) continue;
    const gaps = {
      top: round(box.top - inner.top),
      bottom: round(inner.bottom - box.bottom),
      left: round(box.left - inner.left),
      right: round(inner.right - box.right),
    };
    const smallest = Math.min(gaps.top, gaps.bottom, gaps.left, gaps.right);
    if (smallest < 0 || smallest >= 8) continue;
    const key = `${describe(surface)}|${smallest}`;
    if (seenInset.has(key)) continue;
    seenInset.add(key);
    tightInsets.push({ selector: describe(element), surface: describe(surface), gap: smallest, gaps, text: text(element) });
  }
  tightInsets.sort((a, b) => a.gap - b.gap);

  // 7c. Uneven padding: a panel whose content sits much closer to one edge
  // than to the opposite one, or much closer to top or bottom than to the
  // sides. Only panels at least 120 by 80, with two or more children: a chip
  // or a button is tighter vertically on purpose.
  const unevenPadding = [];
  for (const element of all) {
    const children = Array.from(element.children).filter(visible);
    if (children.length < 2) continue;
    const box = element.getBoundingClientRect();
    if (box.width < 120 || box.height < 80) continue;
    if (element === document.body || element === document.documentElement) continue;
    const style = getComputedStyle(element);
    const background = parseColour(style.backgroundColor);
    const hasSurface = (background && background.a > 0.04)
      || (style.boxShadow && style.boxShadow !== "none")
      || (parseFloat(style.borderTopWidth) > 0 && style.borderTopStyle !== "none");
    if (!hasSurface) continue;
    if (hidesOverflow(style.overflowY) && element.scrollHeight > element.clientHeight + 2) continue;
    const rects = children.map((child) => child.getBoundingClientRect());
    const inner = innerBox(element);
    const content = {
      top: Math.min(...rects.map((r) => r.top)),
      bottom: Math.max(...rects.map((r) => r.bottom)),
      left: Math.min(...rects.map((r) => r.left)),
      right: Math.max(...rects.map((r) => r.right)),
    };
    const gaps = {
      top: round(content.top - inner.top),
      bottom: round(inner.bottom - content.bottom),
      left: round(content.left - inner.left),
      right: round(inner.right - content.right),
    };
    if (Math.min(gaps.top, gaps.bottom, gaps.left, gaps.right) < 0) continue;
    const side = Math.min(gaps.left, gaps.right);
    const topBottomHigh = Math.max(gaps.top, gaps.bottom);
    const topBottomLow = Math.min(gaps.top, gaps.bottom);
    // A cramped edge is the fault. Room to spare is left to the eye, and a
    // panel stretched by its grid row has it through no choice of its own. The
    // left-against-right reason fires on a difference either way, which is why
    // it needs the content to fill at least half the width.
    const reasons = [];
    if (topBottomLow < 12 && topBottomLow < 0.67 * topBottomHigh) reasons.push("top against bottom");
    if (side >= 6 && topBottomLow < 0.67 * side - 1) reasons.push("vertical against sides");
    const fillsWidth = (content.right - content.left) > 0.5 * (inner.right - inner.left);
    const sideSpread = Math.abs(gaps.left - gaps.right);
    if (fillsWidth && sideSpread > 3 && sideSpread > 0.33 * Math.max(gaps.left, gaps.right)) reasons.push("left against right");
    if (!reasons.length) continue;
    unevenPadding.push({ selector: describe(element), gaps, reasons, text: text(element) });
  }

  // 7d. Near-tangent: sibling edges 1 to 3px apart, which read as an
  // accident. Either a gap that neither closes nor clears 8px, or two edges
  // that were meant to line up and miss.
  //
  // Bottom edges are not compared. Text boxes of different type sizes in one
  // row sit 1 to 3px apart at the foot when they are aligned correctly on
  // their baselines, which produced three findings and no real fault across
  // this skill's fixtures on 2026-11-12.
  const nearTangents = [];
  const parents = new Set(all.map((element) => element.parentElement).filter(Boolean));
  for (const parent of parents) {
    const children = Array.from(parent.children).filter(visible).slice(0, 24);
    for (let i = 0; i < children.length; i += 1) {
      for (let j = i + 1; j < children.length; j += 1) {
        const a = children[i].getBoundingClientRect();
        const b = children[j].getBoundingClientRect();
        if (a.width < 4 || b.width < 4 || a.height < 4 || b.height < 4) continue;
        const between = (value) => value >= 0.5 && value <= 3.49;
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2;
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2;
        let kind = null;
        let pixels = null;
        if (overlapY && between(Math.max(a.left - b.right, b.left - a.right))) {
          kind = "gap across"; pixels = round(Math.max(a.left - b.right, b.left - a.right));
        } else if (overlapX && between(Math.max(a.top - b.bottom, b.top - a.bottom))) {
          kind = "gap down"; pixels = round(Math.max(a.top - b.bottom, b.top - a.bottom));
        } else if (between(Math.abs(a.left - b.left))) {
          kind = "left edges miss"; pixels = round(Math.abs(a.left - b.left));
        } else if (between(Math.abs(a.right - b.right))) {
          kind = "right edges miss"; pixels = round(Math.abs(a.right - b.right));
        } else if (between(Math.abs(a.top - b.top))) {
          kind = "top edges miss"; pixels = round(Math.abs(a.top - b.top));
        }
        if (kind) nearTangents.push({ kind, pixels, a: describe(children[i]), b: describe(children[j]), parent: describe(parent) });
      }
    }
    if (nearTangents.length > 60) break;
  }

  // 7e. A wrapped unit: a figure on one line and its unit, or its currency
  // sign, on another. It finds the figure and the unit in the text, puts a
  // range round each and compares the line each one landed on, so ordinary text
  // wrapping in a narrow column is not reported. It reads through child
  // elements, so a unit in its own span counts.
  const textNodesIn = (element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node = walker.nextNode();
    while (node) { nodes.push(node); node = walker.nextNode(); }
    return nodes;
  };
  // A range over element.textContent[from, to), which may cross child elements.
  const rangeFor = (element, from, to) => {
    const range = document.createRange();
    let seen = 0;
    let started = false;
    for (const node of textNodesIn(element)) {
      const length = node.textContent.length;
      if (!started && from < seen + length) { range.setStart(node, from - seen); started = true; }
      if (started && to <= seen + length) { range.setEnd(node, to - seen); return range; }
      seen += length;
    }
    return null;
  };
  const lineOf = (range) => {
    const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 && rect.height > 0);
    return rects.length ? Math.round(rects[0].top) : null;
  };

  const wrappedUnits = [];
  for (const element of all) {
    const raw = element.textContent || "";
    const content = raw.trim().replace(/\s+/g, " ");
    if (!content || content.length > 24) continue;
    // One inline flow, not a stack: a tile whose label, figure and delta are
    // separate blocks is three lines by design, not a figure split from a unit.
    if (Array.from(element.children).some((child) => child.children.length
      || !getComputedStyle(child).display.startsWith("inline"))) continue;
    // A figure with a short unit after it, or a currency sign before its digits.
    const match = /(\d[\d.,]*)([\s ]*)([^\s\d:][^\s:]{0,3})\s*$/.exec(raw)
      || /([$£€¥])([\s ]*)(\d[\d.,]*)/.exec(raw);
    if (!match) continue;
    const firstEnd = match.index + match[1].length;
    const secondStart = firstEnd + match[2].length;
    const first = rangeFor(element, match.index, firstEnd);
    const second = rangeFor(element, secondStart, secondStart + match[3].length);
    if (!first || !second) continue;
    const firstLine = lineOf(first);
    const secondLine = lineOf(second);
    first.detach();
    second.detach();
    if (firstLine === null || secondLine === null || Math.abs(firstLine - secondLine) < 1) continue;
    wrappedUnits.push({
      selector: describe(element),
      text: content,
      figure: match[1],
      unit: match[3],
      lineGap: Math.abs(secondLine - firstLine),
    });
  }

  return {
    url: location.href,
    title: document.title,
    viewport,
    measuredAt: new Date().toISOString(),
    targetFloor,
    thumbExpected,
    counts: {
      elements: all.length,
      interactive: interactive.length,
      contrastFailures: contrastFailures.length,
      contrastUnmeasured: unmeasuredContrast.length,
      smallTargets: smallTargets.length,
      unnamedControls: unnamedControls.length,
      placeholderOnlyFields: placeholderOnly.length,
      headingSkips: skips.length,
      h1: headings.filter((element) => element.tagName === "H1").length,
      unsizedMedia: unsizedMedia.length,
      imagesWithoutAlt: imagesWithoutAlt.length,
      textBelow12px: tiny.length,
      clipped: clipped.length,
      tightInsets: tightInsets.length,
      unevenPadding: unevenPadding.length,
      nearTangents: nearTangents.length,
      wrappedUnits: wrappedUnits.length,
      typeSizes: new Set(fontSizes).size,
      radiusValues: new Set(radii).size,
      shadowValues: new Set(shadows).size,
      fontFamilies: new Set(families).size,
    },
    overflow,
    contrastFailures: contrastFailures.slice(0, SAMPLE),
    contrastUnmeasured: unmeasuredContrast.slice(0, SAMPLE),
    smallTargets: smallTargets.slice(0, SAMPLE),
    unnamedControls: unnamedControls.slice(0, SAMPLE),
    placeholderOnlyFields: placeholderOnly.slice(0, SAMPLE),
    headings: { order: levels.slice(0, 30), skips },
    unsizedMedia,
    imagesWithoutAlt,
    textBelow12px: tiny.slice(0, SAMPLE),
    clipped: clipped.slice(0, SAMPLE),
    tightInsets: tightInsets.slice(0, SAMPLE),
    unevenPadding: unevenPadding.slice(0, SAMPLE),
    nearTangents: nearTangents.slice(0, SAMPLE),
    wrappedUnits: wrappedUnits.slice(0, SAMPLE),
    census: {
      typeSizes: census(fontSizes).slice(0, 14),
      radii: census(radii).slice(0, 10),
      shadows: census(shadows).slice(0, 8),
      fontFamilies: census(families).slice(0, 6),
    },
  };
  };

  window.pxeMeasure = measure;
  return measure();
}
