// Lists the visible controls and marks that another element covers. This file
// is one arrow function: pass its whole contents as the `function` argument of
// the Playwright MCP tool `browser_evaluate`, at each width and after each
// scroll.
//
// An element is covered when the top element at its centre is neither the
// element, nor a child of it, nor part of the same control. It returns
// `controls` (links, buttons, fields, tabs) and `marks` (text, icons, images,
// cells), each as the first 120 characters of the covered element's HTML.
//
// Not reported:
// - an element under a sticky or fixed page header (`header`, `[role=banner]`),
//   which a scroll puts there on purpose. A fixed toast, banner or dialog over
//   a control is still reported;
// - an element covered by part of its own control, node or card (OWN_PARTS),
//   such as an icon under its own label;
// - an element its cover holds, such as an icon that lets clicks through to
//   its parent.
//
// If the page draws a graph whose nodes are not `[data-node]` or
// `[role=group]`, pass the node selector as the argument instead of editing
// this file: send `() => (<this file's contents>)(".my-node")` as the function.
(ownParts) => {
  const CONTROLS = "a, button, input, select, textarea, summary, [role=button], [role=link], [role=tab]";
  const MARKS = "svg, img, [role=img], p, span, li, dt, dd, td";
  const OWN_PARTS = ["a, button, label, summary, [role=button], [role=link], [role=tab], [data-node], [role=group]", typeof ownParts === "string" && ownParts]
    .filter(Boolean)
    .join(", ");

  const underPageHeader = (top) => {
    for (let node = top; node; node = node.parentElement) {
      if (/sticky|fixed/.test(getComputedStyle(node).position) && node.matches("header, [role=banner]")) return true;
    }
    return false;
  };

  const covered = (selector) =>
    [...document.querySelectorAll(selector)]
      .filter((element) => {
        const r = element.getBoundingClientRect();
        const x = r.x + r.width / 2;
        const y = r.y + r.height / 2;
        if (!r.width || !r.height || y < 0 || y > innerHeight || x < 0 || x > innerWidth) return false;
        const top = document.elementFromPoint(x, y);
        if (underPageHeader(top)) return false;
        if (!top) return true;
        const own = element.closest(OWN_PARTS) ?? element;
        return !(own.contains(top) || top.contains(element));
      })
      .map((element) => element.outerHTML.slice(0, 120));

  return { controls: covered(CONTROLS), marks: covered(MARKS) };
}
