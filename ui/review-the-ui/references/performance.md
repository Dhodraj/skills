# When the motion is right and the frames are not

Read at step 5, where the journey is walked and the motion is filmed. Which
properties to animate is in
[craft.md](../../design-the-ui/references/craft.md), Motion. This file is for
motion that is already correct and still stutters.

Name the cause before proposing a fix. "Added `will-change`, looks smoother"
is not a diagnosis. Say which findings came from reading the code and which
need a recording on a real device, and never conclude that it is fine from a
fast machine.

## Start from the symptom

| Problem | Cause to check first |
|---|---|
| The animation stutters | It animates `width`, `height`, `top` or `margin`. Move to `transform` and `opacity` |
| A shadow animation is choppy | Use `filter: drop-shadow()`, which Chrome composites. Measure it elsewhere |
| It janks only during navigation or loading | The main thread is busy. Move the animation to CSS or the Web Animations API |
| A hand-rolled animation drops frames in React | It writes to state every frame. Write to `ref.current.style` instead |
| Drag gets slower as the list grows | A CSS variable on a parent is being animated. Set `transform` on the element |
| A blur transition lags, worst in Safari | Keep an animated `blur()` under 20px. 2 to 5px softens a crossfade |
| Properties animate that nobody named | `transition: all`. List the properties |
| The element shifts a pixel as motion starts or ends | The GPU hand-off. Add `will-change`, but only now that you have seen it |

## The frame budget

60fps gives the browser 16.7ms a frame. A 120Hz screen gives 8ms. Design
against the smaller number. A layout recalculation on a complex page can pass
100ms on its own, which is a dozen frames rather than one.

Two things decide whether a frame fits: what is animated, and whether that
work can be blocked by everything else the page is doing.

## Animating through React state

A library animates outside the render cycle, so it is safe. A hand-rolled
animation that calls `setState` every frame re-renders the component every
16.7ms, and the render alone spends the budget.

Write to the node instead:

```js
// drops frames: one re-render a frame
setY(nextY);

// smooth: no re-render
ref.current.style.transform = `translateY(${nextY}px)`;
```

Look for state updates inside `requestAnimationFrame`, `pointermove`,
`scroll` and drag handlers.

## Two traps that look correct

Both animate `transform` and still drop frames.

**An inherited CSS variable.** A variable set on a parent recalculates styles
for every descendant, every frame, because custom properties inherit. The
more content, the slower each frame. Suspect it whenever a `transform`
animation degrades as the content grows. Set `transform` on the element
rather than writing a distance into a variable a child reads.

**Blur.** `filter: blur()` gets expensive fast, Safari worst. Keep an
animated blur under 20px.

## will-change

A browser can hand an animation from the CPU to the GPU mid-flight, and that
hand-off can shift the element by a pixel at the start or the end.
`will-change` promotes it up front so no hand-off happens.

Add it only once you have seen that shift. Nothing here times frames:
`measure.js` measures geometry and the browser reference films motion without
timing it, so the visible shift is the evidence to work from. A browser
already promotes an element animating `transform` or `opacity`, so on the
common path `will-change` does nothing, and every promoted layer costs GPU
memory. Put it on the element that animates, never on `*` or a large
container.

Where it earns its place is an expensive paint, such as a large blurred
element. Promote it and keep the layer small, because a small layer is
cheaper to composite than a full-screen one.
