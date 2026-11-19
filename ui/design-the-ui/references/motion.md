# The motion layer

Read this before adding motion to a project, or a new kind of motion to one
that has it. [craft.md](craft.md), Motion, holds the values: curves, durations,
travel. This file holds the structure: which library, which primitive, one
loop, and the reduced-motion path. Adapted from `textura-agency/ai-design-vault`
(Unlicense); [NOTICE](../NOTICE) records what was taken.

## One library per project

`sources.json` lists motion, video and shader sources by reuse tier. It is for
choosing. Once a project has chosen, it uses that one.

A page with no motion library keeps CSS for state changes and an entrance:
transitions, plus the `rise` keyframe in [craft.md](craft.md). Do not add a
library for those alone. The rules below about springs apply once the project
has a motion library, or needs motion from the right column of the table in
"Springs, not keyframes".

1. **A library already installed wins**, even if it is not the default below.
   Check `package.json` first. Do not add a second animation library beside
   it. Where the installed one cannot do springs, propose replacing it.
2. **The framework's own springs come next.** Svelte ships `Spring` in
   `svelte/motion`; using the platform beats adding a dependency.
3. **Otherwise the default for the stack:**

   | Stack | Motion | Smooth scroll, if wanted |
   |---|---|---|
   | React, in any framework | `@react-spring/web` | `lenis` |
   | Svelte | `svelte/motion` | `lenis` |
   | Vue | `motion-v` or `@vueuse/motion` | `lenis` |
   | Solid, Angular, plain HTML | `motion` | `lenis` |

4. Weigh its size against what the page does. Three reveals do not need the
   largest option.
5. **Ask before installing.** Say what it is, what it adds to the bundle, and
   what it changes. Then record the choice in `DESIGN.md`, so the next session
   does not choose again.

A library qualifies only if it does all five: spring physics (stiffness and
damping, not a duration and a curve); retargeting mid-flight from the current
value and velocity; per-frame updates driven from a scroll value, not only from
state; output to `transform` and `opacity` without forcing layout; and it runs
in the project's client boundary. A keyframe-only library fails the first.

An effect library from the catalogue (an After Effects player, particles, a
morph, a shader) is a second library too. Take one only for an effect the
chosen library cannot make, and say so to the user.

Package APIs move between major versions. Read the installed version's own
documentation before writing code against it.

## Springs, not keyframes

A spring is defined by physics, not a duration. It can be interrupted and
resolves from wherever it is, and it carries velocity between states. A
keyframe restarts from zero.

| CSS `transition-*` is enough | A spring, from the project's library |
|---|---|
| Hover, focus and press: colour, opacity, border, underline | Anything scroll-driven |
| A small decorative nudge, such as an arrow shifting a few px | An entrance or a reveal |
| | Text motion |
| | A layout or size change, a staggered sequence |
| | Anything the customer can interrupt or reverse |

A CSS transition takes its duration and curve from tokens, and names its
properties (`gates.md` 21). In a project with a motion library, an entrance is
a spring: the `rise` values in [craft.md](craft.md) become its start and end
states.

## The primitives

Build each primitive the first time a page needs it, as a shared component.
Where the project has its own motion components, use those. Otherwise use
these names and props in every framework; where a framework has no wrapping
components, the same names become directives, actions or hooks.

| Primitive | Trigger | Use it for | Modes |
|---|---|---|---|
| `Inview` | the element enters the viewport | a reveal | `once`, `always` (reverses on leave), `forward` (downward scroll only) |
| `SpringTrigger` | scroll progress across a range | parallax, scrub, snap at a point | `scrub`, `toggle` |
| `Hover` | pointer enter and leave | hover motion; off on touch | — |
| `Handle` | children change | enter and exit on a swap | — |

Shared props: `tag` (the semantic element to render), `from` and `to` (the
spring's states, animatable values only), `config` (the physics), `mode`,
`delayIn` and `delayOut` (a stagger is an increment of these),
`disableOnMobile`, and `className`. Styling stays in classes, never in `from`
or `to`.

Scroll positions use one grammar, `"<element-edge> <viewport-edge>[±=px]"`.
`"top bottom"` is progress 0 when the element's top meets the viewport's
bottom; `"bottom top"` is progress 1; `"top bottom+=200"` is the same, 200px
later.

## One render loop

Every per-frame subscriber goes through one `requestAnimationFrame` loop. A
page with twenty scroll-driven elements runs one loop, not twenty.

- It starts on the first subscriber and stops on the last, so an idle page
  costs nothing.
- It pauses while the tab is hidden.
- One debounced `resize` listener, shared the same way. Never one per
  component.
- A smooth-scroll library is driven from this loop, never from its own.
- Read layout once per frame, inside the loop. A scroll handler that reads
  layout and writes styles forces a reflow on every event.

## Rules that hold for every animation

- **Animate `transform` and `opacity`**, plus `filter` where
  [craft.md](craft.md) uses it, such as the `rise` blur. Never a layout
  property (`gates.md` 21).
- **Motion changes appearance, never presence.** The element and its content
  are in the DOM whatever the animation's state, so a screen reader, a crawler
  and a failed script all still get the content (`gates.md` 10).
- **A motion wrapper keeps the semantic element.** Pass `tag="section"` or
  `tag="h2"`. A wrapper renders a `div` unless told otherwise, and a heading
  or landmark animated into a `div` is gone for a screen reader.
  [markup.md](markup.md).
- **`from` and `to` take the same value type**: both numbers, or both strings
  with units. `0` against `'100%'` throws in most spring libraries.
- **Gate per instance, never globally.** A config module holds the mobile
  breakpoint and each primitive's defaults; `Hover` is off on touch. Read a
  reactive viewport width, not `window.innerWidth` once.
- **Hydrate only the leaf that moves.** On a server-components or islands
  stack, a whole section shipped to the client to animate one heading is the
  common regression.

## The reduced-motion path, for every animation

Most libraries in `sources.json` do not handle `prefers-reduced-motion` on
their own. tsparticles reads it, but by default only slows the particles: set
`motion.disable: true`. Write the path with the animation, not after it. Under `reduce`, every
element is at its end state, present, readable and in its final position:
never mid-transition, never hidden.

| What moves | Under `reduce` |
|---|---|
| A CSS transition | Duration to zero or 1ms, or the softened crossfade in [craft.md](craft.md) |
| A spring | Jump to the end state |
| Split text | Render the plain text in its final state; skip the split |
| Smooth scroll | Native scrolling |
| Canvas, WebGL, particles, Lottie | Draw one settled frame and stop the loop |
| Video or a scroll-driven sequence | The poster frame; play only on request |

This is `gates.md` Floor rule 9. A reduced-motion path that leaves content
invisible breaks Floor rule 10 as well.

## Text motion

Text does not use the primitives above. Use one text component, built once:

1. Split the text into line, word or letter slots, keeping nested inline
   elements (`strong`, `em`, links) rather than flattening them. Line splits
   need layout, so split again on resize and on font load.
2. Keep a plain-text copy in the DOM for assistive technology, and hide the
   split slots from it. Otherwise a screen reader reads a pile of spans.
3. Wrap each slot in a clip box when it slides in.
4. One spring per slot, staggered by index, driven from the one loop.
5. Trigger with the modes above: `once`, `always`, `forward`, or scroll
   progress. Never an imperative `play()` from an effect for scroll-driven
   text; it brings back the timing bugs the modes exist to prevent.
6. Restore the DOM on unmount.

Two traps:

- **The slots are flex items**, so `text-align` alone does nothing. Set
  `justify-*` and `text-*` together (`justify-center` with `text-center`).
  Never `justify-between`: it spreads every line's words edge to edge.
- **The clip cuts to the line box.** Below a line height of 1.1, descenders
  and accented capitals are shaved. Keep leading at 1.1 or more on the
  container. Many type scales above `text-4xl` ship `line-height: 1`. Where a
  design needs tighter leading, pad the clip box and pull it back with a
  negative margin (`py-[0.15em] -my-[0.15em]`).

A heading reveals line by line about 100ms apart. Body copy rises word by word
about 60ms apart, and needs no clip.

## Smooth scroll

Optional: a design decision, not a requirement.

- A server-safe shell renders the children; a client-only controller owns the
  library instance. That split keeps the page server-rendered.
- The library runs from the one render loop.
- Locking scroll is a store action: a modal calls `stop()` on open and
  `start()` on close. A component that sets `overflow` itself fights the next
  one, and the loser leaves the page unscrollable.
- In-page links go through the controller, and their targets carry stable
  `id`s.
- Decide whether a route change resets or restores the position. Doing neither
  opens the new page halfway down.
- One `scrollTo(target)` helper moves the page. No `window.scrollTo` calls
  scattered through components.
- Under `prefers-reduced-motion: reduce`, native scrolling.
- Where it breaks sticky positioning, scroll-driven CSS, the iOS address bar
  or find-in-page, stop overriding scroll for that section rather than adding
  a workaround.

## Checks before handing back

A script cannot see most of these. Check each on the running page. The first
two apply to a project that adopted this layer:

- One animation library in `package.json`, and it is the one `DESIGN.md`
  records. In a review of someone else's project, a second library is a
  finding only with a measured cost, such as bundle size or a second loop.
- One render loop: a performance profile shows one animation-frame callback
  per frame, not one per element. Where you may edit code, log the subscriber
  count instead.
- A hidden tab draws nothing.
- Nothing animates a layout property.
- Every motion wrapper renders its semantic element.
- With reduced motion set in the system, every piece of content is present,
  readable and still. Film it ([playwright.md](playwright.md), Filming motion).
- Nothing is clipped where tight leading meets a clip box.
- A WebGL or three.js scene: [3d-scene.md](3d-scene.md).
