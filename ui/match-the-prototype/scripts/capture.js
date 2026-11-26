// Measures one side of one state in the browser. This file is one arrow
// function: pass its whole contents as the `function` argument of the
// Playwright MCP tool `browser_evaluate`, after `browser_navigate` has opened
// the address. It leaves itself on the page as `window.mtpCapture`, and
// `node plan.js` prints the calls that use it:
//
//   window.mtpCapture.first(spec)    the page as it first draws: a copy of the
//                                    page in a full-window frame, with its
//                                    fetch and XHR responses held back
//   window.mtpCapture.settled(spec)  the page itself, once the `settled`
//                                    element is drawn and the steps are done
//
// Each returns the position, size, computed style and text of every named
// element, the page's text, the words of each visible [role=alert], and every
// request it blocked. Pass `filename` to browser_evaluate to keep the result in
// a file.
//
// It refuses a page that is not on this machine. It blocks every fetch and XHR
// that is not a GET: in the held copy from its first script, on the page itself
// only from the moment it is installed.
() => {
  const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];
  const host = new URL(location.href).hostname;
  if (!LOCAL_HOSTS.includes(host)) {
    return { error: `refused: ${host} is not localhost, 127.0.0.1 or [::1]` };
  }
  const STYLE_PROPERTIES = [
    "font-family", "font-size", "font-weight", "line-height", "color",
    "background-color", "padding", "gap", "border-radius", "border-top",
  ];
  const blocked = (window.mtpBlocked = window.mtpBlocked || []);

  // Runs inside a window before its own scripts when it is the held copy.
  // `holdPrefix` undefined means "do not hold, only block".
  const guard = (win, holdPrefix, report) => {
    let release = () => {};
    const gate = new Promise((resolve) => { release = resolve; });
    win.__mtpRelease = release;
    win.__mtpHeld = 0;
    const held = (url) => holdPrefix !== undefined
      && (holdPrefix === null || new URL(url, win.location.href).pathname.startsWith(holdPrefix));
    const fetch = win.fetch.bind(win);
    win.fetch = (input, init = {}) => {
      const url = typeof input === "string" ? input : input.url || String(input);
      const method = String(init.method || input.method || "GET").toUpperCase();
      if (method !== "GET") {
        report(`${method} ${url}`);
        return Promise.reject(new TypeError("blocked by match-the-prototype"));
      }
      if (!held(url)) return fetch(input, init);
      win.__mtpHeld++;
      return gate.then(() => fetch(input, init));
    };
    const open = win.XMLHttpRequest.prototype.open;
    const send = win.XMLHttpRequest.prototype.send;
    win.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this.__mtp = { method: String(method).toUpperCase(), url: String(url) };
      return open.call(this, method, url, ...rest);
    };
    win.XMLHttpRequest.prototype.send = function (...args) {
      const { method, url } = this.__mtp || { method: "GET", url: "" };
      if (method !== "GET") { report(`${method} ${url}`); return undefined; }
      if (!held(url)) return send.apply(this, args);
      win.__mtpHeld++;
      gate.then(() => send.apply(this, args));
      return undefined;
    };
  };

  const squash = (t) => String(t || "").replace(/\s+/g, " ").trim();
  const visible = (el) => (el.checkVisibility ? el.checkVisibility() : el.offsetParent !== null);

  const measure = (win, spec, frame) => {
    const doc = win.document;
    const round = (n) => Math.round(n * 10) / 10;
    const elements = spec.elements.map(({ name, selector }) => {
      const all = doc.querySelectorAll(selector);
      if (all.length === 0) return { kind: "absent", name };
      const el = all[0];
      const r = el.getBoundingClientRect();
      const s = win.getComputedStyle(el);
      return {
        kind: "drawn", name, count: all.length,
        box: { x: round(r.x + win.scrollX), y: round(r.y + win.scrollY), w: round(r.width), h: round(r.height) },
        style: Object.fromEntries(STYLE_PROPERTIES.map((p) => [p, s.getPropertyValue(p)])),
        text: squash(el.innerText ?? el.textContent),
      };
    });
    const textOf = (selector) => [...doc.querySelectorAll(selector)].map((el) => squash(el.innerText ?? el.textContent)).filter(Boolean);
    return {
      state: spec.state, side: spec.side, width: win.innerWidth, frame, url: win.location.href,
      elements,
      text: textOf(spec.text || "body")[0] || "",
      dataText: spec.elements.filter((e) => e.data).flatMap((e) => textOf(e.selector)),
      alerts: [...doc.querySelectorAll("[role=alert]")].filter(visible).map((el) => squash(el.innerText)).filter(Boolean),
      blocked: [...blocked],
    };
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const first = async (spec) => {
    const html = await (await fetch(location.href, { credentials: "include" })).text();
    const frame = document.createElement("iframe");
    frame.style.cssText = `position:fixed;inset:0;width:${innerWidth}px;height:${innerHeight}px;border:0;z-index:2147483647;background:#fff`;
    document.body.appendChild(frame);
    const inject = "<script>window.__mtpSetup(window)<\/script>";
    const copy = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (tag) => tag + inject) : inject + html;
    const doc = frame.contentDocument;
    // The copy keeps this page's address: document.open takes the caller's URL.
    doc.open();
    frame.contentWindow.__mtpSetup = (win) => guard(win, spec.hold ?? null, (line) => blocked.push(line));
    doc.write(copy);
    doc.close();
    await wait(spec.firstFrameMs ?? 600);
    const result = measure(frame.contentWindow, spec, "first");
    result.heldRequests = frame.contentWindow.__mtpHeld;
    window.mtpHeldFrame = frame;
    return result;
  };

  const settled = async (spec) => {
    if (window.mtpHeldFrame) { window.mtpHeldFrame.remove(); window.mtpHeldFrame = null; }
    if (spec.settled) {
      const start = Date.now();
      while (!document.querySelector(spec.settled) && Date.now() - start < 15000) await wait(100);
      if (!document.querySelector(spec.settled)) return { error: `"${spec.settled}" did not appear in 15 s` };
    }
    for (const step of spec.steps || []) {
      if (step.wait) await wait(step.wait);
      const el = step.click || step.check ? document.querySelector(step.click || step.check) : null;
      if ((step.click || step.check) && !el) return { error: `step: nothing matches "${step.click || step.check}"` };
      if (step.check && el.checked) continue;
      if (el) el.click();
    }
    await wait(300);
    return measure(window, spec, "settled");
  };

  if (!window.__mtpGuarded) { guard(window, undefined, (line) => blocked.push(line)); window.__mtpGuarded = true; }
  window.mtpCapture = { first, settled };
  return "ready";
}
