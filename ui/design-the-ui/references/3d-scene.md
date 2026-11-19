# A WebGL or three.js scene

Read this only when the page carries a WebGL or three.js scene. A phone
renders the same fragments as a workstation, the first frame after a shader
appears compiles mid-scroll, and the loop keeps drawing behind sections nobody
is looking at. Fix those in this order, cheapest and largest first. Adapted
from the `optimize-3d-scene` skill in `textura-agency/ai-design-vault`
(Unlicense), whose `references/patterns.md` holds working code for each step;
[NOTICE](../NOTICE) records what was taken.

## 0. Measure before touching anything

- In three.js, read `renderer.info.render` (draw calls, triangles, points),
  `renderer.info.programs.length` and `renderer.info.memory`.
- In raw WebGL there is no equivalent: wrap `getContext` before the app runs
  and count draws, vertices, frames (one `clear` per frame) and the time of
  each `linkProgram`.
- Measure a production build, never the dev server. Stop the old server before
  rebuilding, or it serves a stale build.
- Headless Chrome renders on SwiftShader, not a GPU. Its frame rate means
  nothing; only counted quantities carry over: draw calls, vertices, buffer
  pixels, listener counts, program-link times, main-thread blocking.

Write the before numbers down. Every step below costs some of the look, and a
change you cannot measure you cannot defend.

## 1. Never ship the scene to a crawler

A crawler or an audit run gets a static poster, and the scene's bundle is
never fetched. Mount the scene through the stack's lazy or client-only
boundary, so it lands in its own chunk. The poster also serves the no-WebGL
and lost-context cases; export a landscape and a portrait crop. Reading the
user agent on the server can make the route dynamic: say so, or branch in
middleware instead.

## 2. Decide the device tier once

One module decides the tier, at construction, and everything else reads it:
pixel ratio, counts, bloom, frame budget, whether the pointer is listened to.
Mobile is `innerWidth < 768` or `(hover: none) and (pointer: coarse)`. The same
module exposes reduced motion and an energy-saver guess (`saveData`, or
`deviceMemory <= 2`). Under either, play the entrance, then stop drawing on a
settled frame: WebGL keeps the last frame, so a frozen scene costs nothing.

## 3. Compile and upload everything while the loader shows

After the loader hands off, the frame loop allocates, compiles and uploads
nothing. A stall on scroll is one of five things:

1. A shader compile: `renderer.compileAsync(scene, camera)` with every
   material in the graph, hidden ones included.
2. A program variant: changing a define, the light count, `transparent` or
   `blending` at run time compiles a new program. Set the final variant at
   construction and change only uniforms.
3. A texture upload: `renderer.initTexture` for each texture.
4. A render target or post pass, which allocates on first use: render one
   throwaway frame through the whole chain.
5. CPU work: decoding and building buffers. Chunk it across frames, or move
   it to a Worker and transfer the buffers both ways.

Render one frame at several points of the scroll timeline (0, 0.25, 0.5,
0.75, 1) into a 1×1 target while the loader still shows. Check that every
program links before the handoff: code-splitting the scene can push the
compile past it on a slow connection. Preload the scene's data, and gate the
loader on the scene being ready rather than on a fixed time.

## 4. Draw only when visible

Draw only when the tab is visible, the section is on screen or within about
one viewport of it, and the canvas is not faded out. Subscribe to the page's
one render loop ([motion.md](motion.md)) rather than running a loop per scene.

## 5. Budget the frame rate and the pixels per tier

- Frame budget: about 30fps on mobile, 45 on a tablet, every frame on
  desktop, throttled per subscriber so springs sharing the loop keep full
  rate.
- Pixel ratio: mobile `min(dpr, 0.85)`, tablet up to 1.25, desktop up to 1.5.
  Use 1.0 where the scene has hard edges or thin lines. Clamp the composer's
  targets to the same value, or the post pass spends the saving.

## 6. Cut fill, not detail

- Particle counts per tier, about a third of desktop on mobile, cut from the
  sparse edge of the distribution. A pre-baked point buffer may be ordered by
  position: check before truncating it, or the cut removes a region.
- Bloom: halve it on mobile, and skip the pass when its strength is near zero.
- Fewer, larger transparent sprites; `depthWrite: false` on transparents.
- Remove post-processing passes that render nothing.
- Renderer flags on mobile: `antialias: false`, `alpha: false` for an opaque
  canvas, no stencil, no shadow maps.

## 7. Lights, transforms, input

- One directional light and an environment map. Bake rim and fill into the
  material instead of adding lights, and never add or remove a light at run
  time.
- Scroll-driven transforms go to a uniform read by the vertex shader, not a
  JavaScript loop over objects. Set `frustumCulled = false` on what the
  shader moves. Move a group, not its children. Instance what repeats. Reuse
  scratch vectors instead of allocating per frame.
- Read `scrollY` once per frame, inside the loop. On touch, smooth it:
  `smoothed += (raw - smoothed) * k`, with `k` about 0.2 to 0.3, and snap when
  the jump is larger than about 1.5vh.
- On mobile, attach no pointer listener at all. Gate every pointer effect on
  the pointer having moved, or an unmoved cursor sits at the centre of the
  scene.

## 8. Assets and the iOS flicker

- Geometry in Draco, with the decoder served locally. Textures in KTX2, capped
  at 2048 on desktop and 1024 on mobile.
- No `resize` listener on touch: iOS fires it as the address bar collapses
  and the framebuffer rebuilds mid-scroll. Size the canvas once, in `lvh`. The
  layout stays in `dvh` (`gates.md` 16).
- Put the canvas wrapper on its own compositor layer, make scroll and pointer
  listeners passive, and clamp the frame delta to 50ms so a returning tab does
  not jump.
- On unmount, dispose geometries, materials, textures, targets and the
  renderer, and remove every listener.
- Never ship a debug panel, `Stats` or a disabled `OrbitControls`.

## 9. Measure again

Measure again on the same footing: production build, fresh server, counted
quantities. The program count must not grow during scroll. Throttle the CPU
and scroll the whole page looking for long tasks. Then look at it on a real
phone: a fill-rate win is invisible in a profiler and obvious in the hand.
Do not drop the scene on mobile wholesale; tier it.
