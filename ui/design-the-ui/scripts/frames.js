// Samples the position of the element marked `data-watch` on every animation
// frame for 900ms. This file is one arrow function: pass its whole contents as
// the `function` argument of the Playwright MCP tool `browser_evaluate`.
//
// It returns `frames` (how many were sampled), `biggestStep` (the largest
// change in `left` between two frames) and `samples`, each as
// [milliseconds, left, top]. With nothing marked it returns `error` instead of
// throwing inside the frame callback, where the promise would never settle.
() => new Promise((resolve) => {
  const target = document.querySelector("[data-watch]");
  if (!target) { resolve({ error: "nothing carries data-watch" }); return; }
  const samples = [];
  const start = performance.now();
  const tick = () => {
    const box = target.getBoundingClientRect();
    samples.push([Math.round(performance.now() - start), Math.round(box.left), Math.round(box.top)]);
    if (performance.now() - start < 900) requestAnimationFrame(tick);
    else resolve({
      frames: samples.length,
      biggestStep: Math.max(...samples.slice(1).map(([, x], i) => Math.abs(x - samples[i][1]))),
      samples,
    });
  };
  requestAnimationFrame(tick);
})
