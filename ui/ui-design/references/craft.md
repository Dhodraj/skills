# Craft

Loaded at stage 7, immediately before any UI edit. The numbers in
[directions.md](directions.md) stop a screen being wrong. These stop it being
forgettable. A correct screen and a screen people like are not the same
screen, and the difference is almost always a pile of small things.

Express every fix in the project's own styling system. Never introduce a
second one to apply a polish fix.

## Depth is a shadow, structure is a border

A border drawn only to make a card look raised reads as a line, not as lift.
It also breaks the moment the surface behind it changes. Use three layers: a
1px ring, a short lift, and an ambient pool. Pure black at low alpha, never a
tinted near-black. A tinted one picks up the surface under it and reads as
dirt.

```css
--lift:
  0 0 0 1px oklch(0 0 0 / .055),
  0 1px 2px -1px oklch(0 0 0 / .06),
  0 2px 4px 0  oklch(0 0 0 / .035);
--lift-hover:
  0 0 0 1px oklch(0 0 0 / .085),
  0 2px 4px -2px oklch(0 0 0 / .08),
  0 8px 20px -6px oklch(0 0 0 / .09);
```

On a dark surface the ambient layers are invisible. Raise a secondary panel
by a step of surface colour instead, and drop the lift to a single white ring,
`0 0 0 1px oklch(1 0 0 / .1)`.

> `tactile-design` holds the opposite on shadow colour: every light shadow in
> the neutral's darkest ink, never pure black, so one tinted shadow colour
> serves the product. Both cannot hold. The rule here is for a shadow spread
> wide enough to pick up what is under it; theirs is for a tight ring and a
> 1px drop, where there is no spread to pick anything up. Where `DESIGN.md`
> sets a shadow ink, follow it, and keep the alpha low either way.

**A structural line in dark steps darker, never lighter.** A divider, a table
rule, an input outline and every drop sit one step darker than the obvious
match of their light counterpart. A drop lighter than its surface reads as a
glow, which is the clearest tell of a theme flipped by a script rather than
designed. The white lift ring above is the exception, because it replaces a
shadow that cannot be seen and is the elevation cue itself rather than
structure: keep it to one ring at about 10%, and never put a second lighter
line under an edge that already has one.

Keep a border where it separates: dividers, table rules, input outlines,
selected and focus states.

## Concentric radii

`outer = inner + padding`. Equal radii on nested surfaces make the inner one
look pinched. It is the commonest reason a screen feels off while every value
in it is defensible. Above about 24px of padding the two are separate
surfaces, and each picks its own radius.

## Spacing and alignment

The rules below are the ones a screenshot can be held to a number against.
`scripts/measure.js` reports the five marked **measured** by name, so a review
cites the fault and its pixels rather than its taste. The rest are read off the
render by eye.

- **Words keep a 12px inset** from the edge of a window, card, panel, row or
  hovered fill. Under 8px reads as touching (**measured**: `tight inset`). A
  fill, a rule or an image may bleed to the edge. Words do not.
- **Carry the inset round the bottom.** A comfortable top does not excuse a
  cramped action. Content sitting about a third closer to one edge than to the
  sides is the usual form of it (**measured**: `uneven padding`).
- **Nothing is clipped by a container that hides overflow** (**measured**:
  `clipped`): an avatar half outside its card, a value sliced by a column, an
  action cut off at a panel's edge. A crop at the page's own edge is
  deliberate; one inside the page is a defect. Mark a crop you chose with
  `data-crop`, which the script then leaves alone. The script compares border
  boxes, so a sliced focus ring and a word cut inside its own box are both eye
  work.
- **No near-tangents** (**measured**: `near-tangent`). Two edges 1 to 3px
  apart read as an accident. Line them up exactly, or part them by a step of
  the project's spacing scale. The script's window is 0.5 to 3.5px between
  sibling boxes, and it compares left, right and top edges, not bottom ones:
  text of two sizes in a row sits a pixel or two apart at the foot when its
  baselines are right.
- **A unit stays with its number** (**measured**: `unit wrapped`). `42 GB`
  broken over two lines, or a currency sign alone on the first line, says the
  box was never sized for its content.
- **A control keeps 8 to 12px from the field, line or card edge above it.**
  On the field it reads as attached to it; well past 12px it drifts away from
  the thing it acts on. A floating card — a comment popup, a toast — pads the
  same all round, measured to the avatar's and the button's own edges rather
  than to their text.
- **A title over its subtitle is one item**: in a row, a card header or a
  list item, 4 to 6px of ink between the lines, which is a 1.3 line height
  plus about 2px of gap. Past 10px they read as two things. Display type sets
  its own gap from its own scale. The air around the pair comes from the row's
  padding.
- **Whitespace groups.** A title sits closer to its own metadata than to the
  next record. Never spread lines equally to fill the height available.
- **Row padding is 12px, 8px in a dense list**, and whatever the target needs
  where a thumb is expected: `gates.md` rule 11, and Hit areas below. In a
  dense list a one-line row three times taller than its own text is a fault,
  not generosity.
- **A dot, a badge or a ring is not a column.** It sits in the gutter or on
  the avatar, 6px clear of the text and the avatar's edge, and fully inside
  the row's inset. Halos and focus rings stay inside the content edge too.
- **Columns line up down the list.** One grid template with fixed tracks for
  every row. Optional content leaves its track empty instead of closing the
  gap, so nothing shifts from row to row.
- **A body under an avatar row starts at the name's edge**, not under the
  avatar.
- **Content clears the bar above it.** The first heading on a page sits at
  least the content's side inset below a toolbar's rule, never just under it.
- **Fix overflow by fitting the content, not by widening the container**, and
  re-measure the padding afterwards. A control hugs its content: `flex: 1`
  with the contents at one end is a lopsided control, not a wide one. A fixed
  box in a flex row takes `flex: none`, or it gets squeezed.
- **Centre a label on its letters, not on its line box.** Capitals sit low in
  a plain line box, so a word beside an icon, a label in a pill and an initial
  in an avatar all read low. Trim it where the engine supports it:

  ```css
  .label { text-box: trim-both cap alphabetic; }
  ```

  `CSS.supports("text-box", "trim-both cap alphabetic")` returned `true` in
  Chrome 157 on 2026-11-12, measured through the Playwright MCP browser. Guard
  it with `@supports` and fall back to a 1px nudge: it is not in every engine.
- **A centred amount centres its digits.** `$45` centred as one string sits
  right of centre to the eye. Centre the digits and hang the sign outside
  them, at `right: 100%` of the digit box. A figure that rolls rolls the
  digits only.
- **A popover draws its ring inset**, so its sides line up with the field's,
  and it holds still once open. An open popover whose list changes height
  drags its anchor with it and loses the reader's place.
- **A link has no hover surface; a control has a surface visible at rest.**
  Hover and selected fills are inset and rounded, with the negative margin on
  the list rather than on the row.
- **A trigger keeps its pressed look while its popover is open.** Give the
  open trigger what the hovered one gets, through whatever state the project
  already carries, or the open menu appears to belong to nothing.

## Emphasis, and what not to use for it

- **Never ring the thing you want looked at.** An accent ring and a soft halo
  around the card the screen is about reads as a focus state nobody gave it,
  and a coloured dot beside its label is a mark with no meaning. Lift it the
  way the product would: its own surface, the raised shadow, the label in the
  accent. A ring belongs to a field that really has focus.
- **No redundant tonal border.** Try the fill alone first. Keep it where it
  separates, where it carries a state, and where it is what gives a field or
  control its 3:1 edge: Depth is a shadow, structure is a border above lists
  the places, and `gates.md` rule 5 is the floor.
- **A filled button keeps its own colour under the pointer** — one step of
  that colour, never a swap to grey. Success is the one change of hue it is
  allowed.
- **Nothing translucent overlaps.** Stacked chips, overlapping cards and
  facepiles take opaque fills. Two see-through fills over each other read as
  dirt, and the stack order stops being readable.
- **The heaviest mark on the screen sits on what the screen is about.** A 2px
  rule under a label nobody needs outranks the figure beside it, and the eye
  believes the ink, not the intent.

## Motion

- ease-out, never ease-in. `ease-in` delays the first frame, which is the
  frame the eye is on. Use `cubic-bezier(.23, 1, .32, 1)` for interface
  motion and `cubic-bezier(.2, 0, 0, 1)` for a cross-fade.
- Under 300ms. Press feedback 100 to 160ms, tooltips 125 to 200ms, dropdowns
  150 to 250ms, a drawer up to 500ms. A 180ms transition feels faster than a
  400ms one, because it is.
- Transitions for state, keyframes for sequences. A CSS transition can be
  interrupted mid-flight; a keyframe restarts from zero. So anything the
  customer can reverse is a transition: hover, open, select.
- Never `transition: all`. Name the properties. Animate `transform`,
  `opacity` and `filter`, which the GPU composites. Animating `height`,
  `top` or `width` costs layout on every frame.
- Never from `scale(0)`. Nothing in the world appears from nothing. Start at
  `0.9` to `0.96`, with opacity.
- **Scale a popover from its trigger, not its centre.** Set
  `transform-origin` from the trigger's position, which Base UI and Radix
  both expose as a variable. A modal is exempt, because it appears in the
  middle of the viewport, so `transform-origin: center` is correct there.
- When the motion is right and the frames are not, the symptom table, the
  frame budget and the React trap are in
  [ui-review/references/performance.md](../../ui-review/references/performance.md).
- Press gives `scale(.96)` on a button-sized target. Below `0.95` reads as a
  flinch at that size, but the figure is a distance, not a ratio: 4% of a 22px
  row icon is under a pixel and reads as nothing. So the squeeze follows the
  target: `.99` on a card, `.97` to `.96` on a button, `.92` at 22px.
- Exits are shorter than enters, 150ms against 300ms, and softer. Use a small
  fixed `translateY`, never the element's full height.
- Honour `prefers-reduced-motion` by collapsing durations to 1ms, not by
  leaving elements invisible. Setting a duration to zero is also enough. This
  is an accommodation for vestibular disorders, not a preference. Softening
  also satisfies it and usually reads better: travel, blur, scale and spin
  become a 150 to 200ms opacity crossfade, a height change goes instant, a
  loop that carries state keeps only its opacity pulse, capped at a few
  cycles, and a press scale may stay, because it is feedback rather than
  travel.
- A hidden element must stop intercepting clicks. Pair `opacity: 0` with
  `visibility: hidden` or `pointer-events: none`, or an invisible layer eats
  the press and nothing appears to happen.
- **Scroll-linked motion is a pure function of scroll position**, never a
  sequence a scroll starts. The customer can scroll back up, and anything
  driven by a one-way timeline either stutters or refuses to reverse. Give
  the moments that matter more scroll distance, and keep the rest brisk.

## Where to look up a motion value

`https://kinetics.colorion.co` publishes 162 interface animations with their
real CSS, read on 2026-11-01. Useful for the shape of an effect you have
already decided to build, and its easing curves agree with the ones above:
its glide is `cubic-bezier(0.16, 1, 0.3, 1)` and its overshoot is
`cubic-bezier(0.34, 1.56, 0.64, 1)`.

Two things to fix in anything copied from there. **No snippet carries a
`prefers-reduced-motion` rule**, and several loop forever, so each one fails
the floor rule above until you add one. And no licence is stated on the site:
its parent's terms cover colour palettes, not this code. Take a value, not a
file, until somebody states the terms.

`UI Motion Prompts` describes 378 mobile micro-interactions as written specs,
each with its real timings, spring constants and thresholds. It was read on
2026-11-03 at `https://nameless-water-00e7.z66nry86gf.workers.dev`. That is a
`workers.dev` host and may move. The maker is `@ui_motion_prompts` on
Instagram and sells the set at `conceptless.gumroad.com/l/pack`.

One spec per set is free and the rest are paid. The gesture rules below were
drawn from the free ones. It carries the same two defects as kinetics: no spec
mentions `prefers-reduced-motion`, and every demo loops forever. Only the free
specs are licensed for use in your own work, so take a number, not a spec.

## Entrances, and where they are allowed

Stagger a staged entrance by ~100ms per region, combining `opacity`,
`translateY(10–12px)` and `blur(4–5px)` over 400–560ms. For a headline,
split it into words at ~70–80ms each.

Travel follows the size of the thing that moves, not the drama wanted: 4px for
a small menu, 6px for a label swap, 8px for a block, 10 to 12px for a page
section, 16px for a modal card, 24px for a toast leaving. Blur follows the size of what
swaps, not the distance it covers: 2px on small text, 4px on a panel or an
icon, 6px on headline text, 8px on a large panel entering. A flat, quiet
surface can skip the blur and only fade and rise.

```css
@keyframes rise {
  from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
  to   { opacity: 1; transform: none;             filter: blur(0); }
}
```

Frequency decides how much motion is allowed, before any curve or duration,
and it applies to every kind of motion, not only an entrance. An arrival the
customer meets once, such as a first paint, a success state or an empty state,
can be staged. A repeated interaction cannot. A row hover, a keystroke, a tab
change or a command palette costs attention on every trigger, so it gets
instant feedback, or a colour or opacity change under 150ms, with no travel,
blur or stagger. Anything the customer triggers all day takes the settled end
of every range above.

Below the first screen, reveal a section the first time it arrives and never
again, with an `IntersectionObserver` that unobserves on the first hit. The
first screen animates on load and must not wait for a scroll.

## Gestures, thresholds and springs

A drag, a swipe, a pull or a sheet is not an entrance. The customer's finger
is on the element, so the element answers the finger continuously. It does not
play a clip.

- While the finger is down, position is a pure function of the finger. Same
  rule as scroll above. No duration and no easing: the element tracks. Easing
  belongs to the release alone.
- Show commitment at the threshold, not at the release. A row that deletes
  past 60% of its width starts growing the trash icon at about 36% of travel.
  The customer learns where the line is while there is still time to pull
  back. An action that reveals itself only after the finger lifts is a
  surprise.
- The release decides by distance or by speed, whichever arrives first. Past
  about 70% of travel, complete the action. Below it, return. A fast flick
  completes from anywhere, because the customer already committed.
- Snap to named stops, never to the position the finger left. A sheet has
  peek, half and full. Record the three pixel heights, and let the release
  pick the nearest by midpoint. A sheet that rests wherever it was dropped has
  no state the next screen can rely on.
- Spring the release; do not tween it. Overshoot about 10% of the remaining
  distance, then settle. Two numbers control it, stiffness and damping. A
  damping ratio near 0.55 reads springy and near 0.72 reads settled. Anything
  the customer repeats all day gets settled.
- Two edges on two springs gives stretch. Make the leading edge of a moving
  indicator stiffer than its trailing edge. A tab pill or an underline then
  stretches while it travels and snaps back to its real width on arrival. Use
  around stiffness 19 and damping 0.55 leading, against 11 and 0.72 trailing.
  One spring for the whole element reads mechanical.
- Whatever the drag dims or reveals is a function of the same position. Scrim
  opacity is a fraction of travel, so dragging back undims by itself. Never
  run it as a separate fade, which cannot reverse.
- A shake decays. `x = A · sin(2πft) · e^(−kt)`, with A 14px, f 9Hz, k 6,
  finished inside 800ms. A fixed keyframe shake repeats each cycle identically
  and reads as a broken loop rather than a rejection.
- Stagger arrivals 50 to 150ms apart. Use 150ms for discrete items, such as
  the digits of a code landing one by one. Use 50ms for a wave across a row of
  boxes that confirm together. Land each one with a small overshoot from a
  back ease, never from `scale(0)`.
- Every gesture needs a pointer-free path to the same outcome. A row with
  swipe-to-delete also needs a delete the keyboard can reach. A sheet that
  closes only by dragging traps anyone who cannot drag. This is the rule
  gesture work breaks most often.

A sheet dragged by a thumb is the case worth having numbers for, because four
of them decide whether it feels native:

- **Slop, 4px.** A press anywhere on the sheet becomes a drag only once it has
  moved 4px. Until then it is a tap on the row or button under it, and a tap
  stays a tap. On the grab handle a press is a drag at once.
- **Velocity over the last 100ms**, not over the whole gesture, or a slow pull
  that ends with a flick is read as slow.
- **Close past `min(64px, 15% of its height)`, or on a flick faster than
  0.11 px/ms.** A distance cap beside the fraction is what makes a short pull
  enough on a tall sheet; a fraction alone asks for a longer and longer pull
  as the sheet grows. This is the release rule above read for a sheet: a
  sheet's job is to leave, so what commits it is a short pull rather than 70%
  of its travel. Otherwise spring back, and let a press that catches it
  mid-spring take it from where it is.
- **Upward drag only gives**, tiring out towards 32px:
  `offset = (1 - 1 / (d * 0.55 / 32 + 1)) * 32`. One rubber band in the
  product is a limit you can feel; two is a page that wobbles.

Two traps come with it. Swallow the click that ends a drag, or the row it
began on fires; and ignore a `lostpointercapture` whose target is not the
sheet, or the browser's own capture to the element under the finger cancels
every drag as it starts. Drag with the `translate` property, so it stacks on
the entrance and exit `transform`.

## Type and numbers

- `font-variant-numeric: tabular-nums` on anything that changes: a count, a
  timer, a column of figures. Proportional digits shift the layout under the
  reader.
- Keep one type scale per screen, and let scale carry the hierarchy.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body text.
- `-webkit-font-smoothing: antialiased` at the root on macOS.
- Scale contrast is the cheapest way to make a screen feel designed. A
  display figure at 8 to 12 times the body size says what matters. Twelve
  things at 1.2 times say nothing.

## Dense screens

A table, a run list or a dependency view is not a landing page.

- Row height stays constant. Density is decided once for the screen.
- Numbers align right, and a column of numbers uses tabular figures.
- A status is a word plus a shape or a position, never colour alone.
- The header row stays visible while the body scrolls.
- A long identifier truncates in the middle, with the full value reachable.
- Every column earns its width. A column nobody reads is a column to drop.
- An action that applies to a row lives in that row, not only in a bar above
  it.

## The shortest and longest real value

Build against the real range, never against the sample. Every rule below is
cheaper to apply while writing the component than to retrofit once a customer
has found it.

These hold wherever a surface shows records: a table, a list, a rail, a card
of data. Editorial and marketing text wraps instead, and a headline is never
truncated. A long identifier truncates in the middle, as Dense screens says
above; free text truncates at the end.

| Case | Rule |
|---|---|
| Free text in a cell: a name, an email, a URL | one line, hugging up to about 32 characters, then end-truncate with a real ellipsis. The full value goes in a tooltip and stays selectable |
| A name in a rail, a breadcrumb, a dialog title | the same, at the container's width |
| A description in a card | clamp to two lines |
| A figure over six digits | `Intl.NumberFormat(locale, { notation: "compact" })`, with the full value in a tooltip |
| A missing or null value | an en dash in the faint ink, never an empty cell and never `0` |
| A count | plural forms through `Intl.PluralRules`, not an `s` glued on |
| A flex child holding text | `min-width: 0`, or it refuses to truncate at all |

Then preview the component with its shortest and its longest real value before
calling it done. A layout that moves when the long value arrives is the defect
this prevents.

## Touch, where the pointer is a finger

A phone layout is not the desktop layout squeezed. These apply on any touch
screen, tablets included, through `(pointer: coarse)` rather than a width.

- **Hover belongs to a mouse.** Put every hover style under
  `(hover: hover) and (pointer: fine)`, or it sticks after a tap and the
  customer sees a row highlighted for no reason.
- **Give the press the hover look instead**, under `(pointer: coarse)`, so
  every control answers a finger the way a native one does.
- `-webkit-tap-highlight-color: transparent`, so the control's own press is
  the feedback.
- `touch-action: manipulation` on controls, which removes the double-tap
  delay.
- `user-select: none` on controls only. Content and links stay selectable.
- `overscroll-behavior: none`, so the page neither bounces nor chains its
  scroll to whatever is behind it.
- `100dvh`, never `100vh`, and `env(safe-area-inset-*)` on every bar, sheet
  and fixed action row.
- **16px text in a field on any touch screen.** iOS zooms into anything
  smaller and stays zoomed.
- **No hover-only information.** An info tip opens on tap, and the reason a
  control is disabled is text under it.

## Optical, not geometric

- A button with a trailing icon takes 2px less padding on the icon side.
- A play triangle sits 2px right of centre.
- Fix an asymmetric icon in its SVG rather than with a margin in every
  component that uses it.

## Icons

Match the stroke to the text it sits beside: 1.5px next to regular, 2px next
to semibold. One icon set per surface, at one size: 14 to 16px on a dense
product surface, larger where the type is larger. One
SVG per icon, coloured through `currentColor`, with states from CSS — never a
second asset. Outline is the default; fill marks the active state.

- **Never a glyph drawn by hand.** Its weight never matches its neighbours,
  and that mismatch is the first tell of a generated interface. Take it from
  the product's own set, or leave it out.
- **At 14px and under, and in a tinted tile, use the filled style.** A thin
  outline goes wiry at that size. This narrows the rule above: on a surface
  built from small icons, every icon is filled and the active one is marked by
  colour or weight instead.
- **Filled and outline glyphs never sit side by side** in one navigation,
  list or toolbar, whichever style the surface chose.
- **An icon is one opaque colour.** Fade it with `opacity` on the `svg`, never
  with a second tone inside it. Duotone reads as two icons.
- **Even glyphs in even boxes.** An odd-sized icon centred in an even box
  lands on a half pixel, and it snaps into place when a transition ends.

## Hit areas

Visible size and hit area are different numbers. A 36px control in a dense
console is fine if its hit area reaches 44px through a pseudo-element, and no
two hit areas may overlap.

```css
.control { position: relative; }
.control::after { content: ""; position: absolute; inset: -4px -2px; }
```

## Connect the surfaces

The strongest moment in a screen is usually not an effect. It is two parts of
the screen turning out to be the same thing. Hover a row and the bar that
represents it lights up. Select a point and the list filters. It costs a few
lines, it teaches the customer how the screen is wired, and it is the thing
people remember.

Colour alone must never carry it. The link also moves, lifts or changes
weight.

## Reviewing craft

Slow the interface down: replay motion at 10% in the browser's animation
panel and walk hover, focus, active, loading and empty. What looks wrong at
10% is what feels wrong at full speed. Driving it from a script instead,
including the frame-by-frame capture of a press and the appear-and-disappear
sampling that a single screenshot cannot show, is in
[playwright.md](playwright.md), Filming motion.

A clean capture is not an approval. The frames prove geometry; whether the
sequence is the right one is still a judgement someone has to make, and say
they made.

Report findings as a table with Before, After and Why columns, never as loose
`Before:` and `After:` lines.

## Attribution

The values on this page are adapted from four MIT sources:
`jakubkrehel/make-interfaces-feel-better`, `emilkowalski/skills`,
`benjitaylor/skills` (its `stageshow` skill) and `kosta4a/tactile-design`. The
two sources in Where to look up a motion value are not among them, and that
section states their terms. [NOTICE](../NOTICE) records what was taken and what was changed.
`tactile-design`'s own house style, with its values already decided, is
[tactile.md](tactile.md), and it is a direction the user picks rather than a
rule on this page.
