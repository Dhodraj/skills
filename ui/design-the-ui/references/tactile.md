# The tactile direction

Style 13 in [styles.md](styles.md), with its values already decided. Loaded
only when the user picks it from the style gallery at stage 3, or asks for it
by name. Never the default: a style with values is still a choice the user
makes, and `directions.md` still deals three directions inside it.

Adapted from `kosta4a/tactile-design` (MIT).

## The three words

- **Tactile.** A control looks like an object. A secondary button is white
  with a fine ring and a 1px drop, and it squeezes when pressed. A field sinks
  into the surface as a well. The one real next step is a solid ink-12 fill.
- **Layered.** Every surface knows what it sits on and takes its fill, edge
  and drop from it, so one control recipe reads the same on a page, a card, a
  table row and a sheet, in both themes. Sizes never change between themes.
- **Quiet.** One type weight, a neutral palette, 0.5px lines, almost no
  colour. Hierarchy comes from size and contrast step, never from bold or hue.

## Where it fits

| Fits | Does not fit |
|---|---|
| A console, dashboard, admin, settings, billing or any screen whose controls are pressed all day | A landing page, a marketing site or an editorial surface |
| A product that ships light and dark | A product whose brand colour is meant to carry the screen |
| Dense data: tables, figures, charts, run lists | A screen with five elements, where 13px type and 0.5px lines read as timid |

Its signature: **every pressable thing looks pressable, and nothing else on
the screen asks for attention.**

## What it overrides, and what it never does

A direction may override a number and a Reflex rule. A Floor rule outranks it,
always: where the two meet, the Floor rule wins and the look gives way. Record
every override in `DESIGN.md`, which is what makes it legitimate
(`gates.md`, "The three tiers").

| Rule elsewhere | Here | Why it is allowed |
|---|---|---|
| `directions.md` numbers: body text 16px or larger | 13/20 desktop, 15/24 phone, 16px in any touch field | A density decision for a data surface, made once |
| `gates.md` 39: no running text below 16px | Same waiver. Nothing goes below 12px | Reflex, waivable in `DESIGN.md` |
| `directions.md` numbers: line length 45 to 75 characters, and `gates.md` 38 | An 800px reading column, about 120 characters at 13px | Only for a data column. Prose on this surface still takes `max-width: 65ch` |
| `directions.md` numbers: heading line height 1.1 to 1.3 | 20/28 and 16/24, which are 1.4 and 1.5 | A UI title is one or two lines, not a paragraph, and the extra leading is what keeps it off the control above it |
| `directions.md` numbers: five type sizes on a screen | Six: 32, 24, 20, 16, 13, 12 | A data surface carries a figure and a meta line that a page does not |
| `directions.md` numbers: two font weights | One weight for every word of UI | Hierarchy moves to size and ink step |
| `directions.md` numbers: a spacing step at least 25% above the last | 2px half-steps, and 16, 20, 24 | Density. The 4px grid still holds, and nothing is off it |
| `directions.md` numbers: 8 to 10 greys, 5 to 10 shades of a brand colour | Twelve steps for the neutral and for every hue | Each step has a named job, and the step-shift rule needs the whole ladder |
| `directions.md` numbers: nothing at rest carries a shadow | Every raised surface carries a ring and a 1px drop at rest | This is the direction. Without it there is no tactility |
| `gates.md` 25: no pure white or black outside the token block | The top surface is pure white, and dark drops are pure black | Both are tokens, and the light shadow ink is tinted, which is what rule 25 is protecting |
| `gates.md` 29: not the decade's default body face as the display face | Inter Medium is the default sans | A waiver until the face is replaced. The weight test below picks the weight for a new face; it does not pick the face |
| `gates.md` 35: no overshoot on a state change | Bounce up to 0.2 on a part held inside its own control | A toggle pill, a switch knob and a height reveal. A celebration up to 0.45 is a separate waiver, taken only where the moment is rare and nobody waits on a result |
| `craft.md`: shadows in pure black at low alpha | Every light shadow is drawn in the neutral's ink-12 | A tinted neutral then gets one shadow colour. `craft.md` records the disagreement |
| `craft.md`: springs as stiffness and damping | Bounce and duration | Two parameterisations of one spring, not two rules. In the libraries that take a bounce, bounce = 1 − the damping ratio, so `craft.md`'s 0.55 and 0.72 are bounce 0.45 and 0.28 |
| `craft.md`: interface motion under 300ms | `ease-move` at 400 to 450ms | The one duration past that ceiling, and only for a big object crossing the screen. Everything else here is 320ms or less |

**Where this direction meets a Floor rule, the Floor rule wins and the look
changes.** Four places it bites, each of which has to be built before the
screen ships:

- **A field needs a 3:1 edge** (`gates.md` 5). A well drawn as an ink-3 fill
  with no border is about 1.05:1 against the panel beside it, and no neutral
  step below ink-9 reaches 3:1 on white. Give the field an edge that measures
  3:1 against both the well and the page, and record the measurement. The same
  goes for the 0.5px hairline wherever it is the only thing separating a
  control from its surface.
- **A placeholder is text a customer reads** (`gates.md` 5, and the contrast
  row in `directions.md`). It does not get ink-10 at 3.87:1. Tune the step or
  use ink-11.
- **A pressable thing is 24 × 24, and 44 × 44 under a thumb**
  (`gates.md` 11). A 22px row icon and a 20px badge that is pressable keep
  their drawn size and get a hit area that reaches those numbers on a mouse
  too, with no two overlapping (`craft.md`, Hit areas). The 44 × 44 in the
  Phone section below is not enough on its own.
- **A height reveal does not animate `height`** (`gates.md` 21). Animate
  `grid-template-rows`, or a wrapper's `transform`, and spring that instead.

Untouched for the same reason: a visible instant focus state, an accessible
name on every control, status never by colour alone, a reduced-motion path on
every transition, a pointer-free path to every gesture's outcome, and a token
for every colour and font.

## The neutral scale

Twelve steps, each with a job. Any 12-step neutral works (gray, slate, mauve,
olive, sand, or one generated from the product's own world). Choose it once.
Never mix a brand hue into a neutral step.

| Step | Job |
|---|---|
| 1 | page ground |
| 2 | app ground; the raised surface in dark; a stripe |
| 3 | quiet fill: a field well, a chip, a selected row |
| 4 | hover on a fill; a focused well |
| 5 | pressed fill; the dark hairline |
| 6 | hairline; control ring |
| 7 | strong line; hovered border |
| 8 | disabled text on a fill |
| 9 | faint: leading icons, group titles |
| 10 | tertiary: meta, timestamps, placeholders, chevrons |
| 11 | secondary text: body, descriptions, row icons |
| 12 | strong text: titles, values, labels; and the primary fill |

**Steps 9 and 10 usually fail 4.5:1.** Measure them on the surface they sit
on before using them. Radix sand's light ink-10 reaches 3.87:1 on white and
3.40:1 on an ink-3 well; ink-9 reaches 3.34:1 and 2.93:1. Either tune the two
steps until they pass, or keep them for chevrons, separators, icon fills and
disabled text, and set every line a customer reads in ink-11. A placeholder is
a line a customer reads, so it does not stay on a failing step. Figure labels,
empty states, rail labels and pager counts are the same.

Hues keep the same twelve positions and only a few are used: 3 as a tint fill,
6 as an edge on a tint, 9 as a solid, 11 as text on a tint, and the scale's own
contrast colour for text on the 9. Hue carries meaning, never rank: success,
danger, warning, info, inactive, and one non-status hue for identity.

## Surfaces, and the step-shift rule

| Role | Light | Dark |
|---|---|---|
| Ground (window, rail) | ink-2 | one stop below ink-1 |
| Panel (the page body) | the top surface, white by default | ink-1 |
| Raised card | the top surface | ink-2, the ground plus one |
| Control fill | the top surface | the ground plus two |
| Well (a field) | ink-3 | ink-3 |
| Overlay (modal, menu, popover) | the top surface | ink-2 |
| Hover on any fill | local ground plus one | local ground plus one |
| Selected on any fill | local ground plus two | local ground plus two |

In dark the order turns over: the darkest plane is the furthest back, so a
surface raises by getting lighter.

Components are written as if they sit on an ink-1 page. A container whose
ground is a different step **remaps steps 1 to 7 inside itself**, so every
child keeps its contrast against its own ground. Text steps 8 to 12 never
move, so ink reads the same everywhere. Hover stays one step below selected,
so the two never collide and hovering a selected row keeps it selected.

Two implementation traps:

- A step cannot be derived from its neighbour on the same element; each would
  chain to the last. Keep fixed root handles per theme and remap from those.
- A variable built from a remapped step resolves where it is **declared**, not
  where it is used. Redeclare the line and shadow tokens on every surface
  class, or the edge keeps the root step and refuses to follow its parent.

## The tactile recipe

Fill, edge and drop are never absolute. Each comes from the surface beneath.

| Part | Light | Dark |
|---|---|---|
| Fill | the top surface | the parent plus two steps for a control, plus one for a card |
| Edge | a 1px ring at 8% of the shadow ink (7% on cards and modals) | one solid 0.5px outline three steps above the fill, the same colour all round |
| Drop | `0 1px 2px 0` at 12% of the shadow ink | `0 1px 2px 0 rgb(0 0 0 / .5)` |
| Primary edge | a 1px ring in the local surface colour, so it never halos | a 0.5px outline in its own fill colour |
| Badge edge | a 1px ring at 14% and a drop at 16% of its own text colour | a 0.5px outline of its own colour mixed 34% into black, plus the black drop |

A white control on a white parent takes its edge from the ring and the drop,
never from a fill change.

**The shadow ladder is crisp.** Every level is the ring plus `0 1px 2px`, plus
at most one short drop whose negative spread keeps it under the object:

```
button  ring + 0 1px 2px
card    + 0 3px 4px -2px
menu    + 0 4px 8px -4px
modal   + 0 6px 8px -4px
table   the drop alone; its 0.5px border is the edge
```

No large soft blurs. Every light shadow is drawn in the neutral's ink-12, so
one tinted shadow colour serves the whole product. Dark shadows are black and
always darker than the surface under them: a drop lighter than its parent
reads as a glow.

**In dark, every edge is 0.5px.** One solid outline per object, the same
colour all round, the primary's included. No lit top edge and no second line
under the edge: on a dark ground the two read as a gradient.

## Lines, radii, type, sizes

| Token | Default |
|---|---|
| Hairline | 0.5px, on every structural line: borders, dividers, rules, table cells. One step darker in dark, so lines do not glow |
| Marks and strokes | 1.5px: radio and checkbox rings, icon strokes, spinners |
| Focus ring | ink-10, drawn 2px with a 2px offset, on every control. Never a hard-coded dark alpha, which vanishes in dark |
| Radius | set the control radius once, 4 to 8px, to match the icon set. The rest follows: control ÷ 2 for a key chip, control − 2 for a checkbox mark, control + 2 for a panel, card, table, menu and desktop dialog, × 1.5 for a feature card, 14px for a phone sheet's top corners, 999px for pills, badges and dots |
| Nested radius | the outer radius minus the border. A band inside an 8px dialog keeps 8px where the edge is a shadow ring, and takes 7.5px under a 0.5px border |

Type, with line heights as absolute px so children inherit a value rather than
a ratio:

| Role | Desktop | Phone | Ink |
|---|---|---|---|
| Display | 32/40, −0.02em | 32/40, or 24/32 past two lines | 12, lead words 11 |
| Display figure | 24/32, tabular | 24/32 | 12 |
| Section title | 20/28 | 20/28 | 12 |
| Card and dialog title | 16/24 | 16/24 | 12 |
| Body and controls | 13/20 | 15/24 | 12, descriptions 11 |
| Meta | 12/16 | 15/20 | 10 |
| Field text | 13/20 | 16px on any touch screen | 12 |

Tracking: −0.01em on a button label, −0.02em on a display title. One sans for
every word of UI. One mono, for machine values only: IDs, code, keys, terminal
text. A table keeps one typeface.

**The weight rule.** Every UI weight renders at one weight: the one at which
the sans reads solid at body size. For Inter that is Medium, 500. Bold is rare
emphasis. To pick the weight for another face, set the three candidates side by
side at body size on the real surface and keep the one that reads solid without
looking heavy. Match its size to Inter's with `font-size-adjust` before judging
it, or the comparison is between two sizes.

Sizes, on a 4px grid with 2px half-steps (2, 4, 6, 8, 12, 16, 20, 24, 32, 48,
64):

| Size | Default |
|---|---|
| Control height | 36px desktop, 44px phone |
| Compact / pill / inline / row icon / badge | 32 / 28 / 24 / 22 / 20px |
| Table row | 38px desktop, 44px phone. A sheet row 48px |
| Button padding | 12 to 14px a side; 2px tighter on the side with a leading icon |
| Spacing | 4 to 8px inside a control, 8 to 12px between items, 16 to 20px between fields, 16 to 24px of card padding, a 24px gap inside 32px of section padding |
| Columns | 800px to read, 1200px for data, 440px for a form or flow |

A height follows from the line height plus its padding: 36 = 20 + 2 × 8,
38 = 20 + 2 × 9. Recompute them whenever the type scale changes.

## Controls

| Item | Recipe |
|---|---|
| Primary | ink-12 fill, ink-1 text, one per surface, and only the real next step. Hover mixes 7% of the text colour into the fill |
| Accent primary | opt-in only, where the brand requires it: hue-9 fill with its contrast text. That hue then leaves status use |
| Secondary | light: white with the button shadow and no border. Dark: two steps above its ground with the solid outline and the black drop |
| Utility pill | fully round, 28px, white with the button shadow. It belongs to content: copy, filter, back |
| Badge | fully round, hue-3 fill, hue-11 text, its edge drawn from its own colour. A neutral status is white with the button shadow |
| Destructive | the trigger is white with red-11 text. The final confirm inside its own dialog is a solid red-9 |
| Field | a well: ink-3 fill, with an edge that measures 3:1 against the well and the page (`gates.md` 5). Focus deepens it to ink-4 and adds the focus ring for keyboard focus |
| Field error | a 1px red-11 ring as a box-shadow and a 12/16 red-11 line under it. Validate on blur and on submit |
| Disabled | `.6` on buttons, switches and fields, `.4` on icon buttons |
| Loading | the label swaps in place to a spinner and "Saving…" in the same button |
| Copy | the icon turns to a tick on the click, before the clipboard answers, and reverts or says "Copy failed" if it refuses. No toast |
| Press | `scale(.97)` over 150ms. Smaller targets squeeze more, `.92` at 22px; a card less, `.99` |
| Menu | the trigger is the secondary button and its chevron turns over while open. 36px items 2px apart, the highlighted item one step up, the chosen item two steps up in ink-12 and no tick |
| Modal | 620px, 460px for a confirm. Backdrop black at 30% in light and 90% in dark with a 2px blur. Cancel left, confirm right. Focus the first field, trap Tab, lock scroll |
| Table | 38px rows, a 0.5px frame and column dividers, 12 to 16px cells, every cell left-aligned, tabular figures, status as a dot plus its word. Stripes only on a long table. The frame hugs the last row. No pager and no action buttons inside the card |

## Motion

| Token | Value | Role |
|---|---|---|
| ease-out | `cubic-bezier(.23, 1, .32, 1)` | anything the customer caused, hover and colour included |
| ease-move | `cubic-bezier(.22, 1, .36, 1)` | a long on-screen move of a big object, 400 to 450ms |
| ease-drawer | `cubic-bezier(.32, .72, 0, 1)` | a sheet after the finger lets go |

Durations: 80ms for a fade that carries no news, 100 to 120ms for a small
exit, **150ms** for press, hover, colour and a menu opening, **200ms** for a
content swap, an overlay fade and a modal exit, 240ms for a modal entrance,
300ms for a page section, 320ms for a sheet rising. Exits are faster than
entrances: menu 150 in and 120 out, modal 240 and 200, sheet 320 and 200.

Travel grows with the size of the thing that moves: 4px for a phone menu, 6px
for a label swap, 8px for a step block, 16px for a page section or modal card,
24px for a toast exit. Blur bridges the seam and follows the size of what
swaps, not the distance: 2px on small text, 4px on a panel or icon, 6px on
headline text, 8px on a large panel. Enter from `.95` to `.97`, never from 0.
Stagger children 40 to 80ms apart.

Springs are written as bounce and duration, never as stiffness and damping.
Bounce rises with rarity: 0.12 over 0.4s for a segmented toggle's pill, 0.2
over 0.45s for a switch knob, 0.2 over 0.35 to 0.5s for a height reveal on
`grid-template-rows` rather than `height`, and
up to 0.45 for a rare celebration. **A spring stays inside its container.**
Overshoot is roughly travel × e^(−π(1−b)/√(1−(1−b)²)): at 0.35 a pill crossing
100px overshoots about 7px, past a 4px inset, and is seen hitting the end of
its track. At 0.12 it stays under a pixel. `overflow: hidden` is a backstop,
not the fix.

Reduced motion softens rather than deletes: travel, blur, scale and spin
become a 150 to 200ms opacity crossfade, a height change is instant, a switch
knob moves at once, a loop that carries state keeps only its opacity pulse and
is capped at a few cycles,
and the press scale may stay, because it is feedback rather than travel.

## Phone

| Item | Value |
|---|---|
| Breakpoint | under 768px, screen only, so a printed page keeps desktop sizes. The touch rules apply at `(pointer: coarse)`, tablets included |
| Targets | 44 × 44. A small visual keeps its look and gets an invisible 44 × 44 hit area. No two hit areas overlap. Apple's 44 points are 44 CSS px, so write px: `44pt` in CSS is 58.7px |
| Type | a 15px floor for body, controls and meta; 14/20 for a description under a larger lead; 16px in a field |
| Gutter | 20px each side. The panel runs edge to edge: no float, no radius, no shadow |
| Segmented toggle | a 42px track with 34px options in its 4px inset |
| Switch | 51 × 31 with a 23px knob 4px in (Apple HIG) |
| Stacking | full width. A page stack keeps 12px, a dialog or sheet footer 8px, and the confirm goes on top |
| Native feel | hover styles only under `(hover: hover) and (pointer: fine)`, the same styles on `:active` under `(pointer: coarse)`, `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation` on controls, `user-select: none` on controls only, `overscroll-behavior: none`, `100dvh`, `env(safe-area-inset-*)` on every bar and sheet, and no scrollbars |

**A dialog becomes a bottom sheet.** Full width, 14px top corners, a hairline
on the top edge only, and a maximum height of
`calc(100dvh - env(safe-area-inset-top) - 24px)`, which keeps 24px clear for
the grab handle. The sheet's colour runs about 200px below its foot, so a pull
upward never shows a gap. Closed, it rests at `translateY(calc(100% + 48px))`,
so the handle leaves the screen with it.

A 36 × 5 white pill replaces the ×, sitting 12px above the top edge on the
backdrop, tactile like a button, with an 88 × 44 hit area labelled "Close". A
tap, a click, Enter or Space on it closes the sheet. Keyboard focus rings it
with a 2px white gap, because its parent is the dimmed page.

Drag physics, which is where this direction earns its name:

- Drag from anywhere on the sheet. On the handle a press is a drag at once;
  anywhere else it becomes a drag only past 4px of movement, so a tap on the
  row or button under it stays a tap.
- The sheet captures the pointer once a drag starts, and the click that ends
  the drag is swallowed.
- Only the sheet's own loss of pointer capture cancels a drag. On touch the
  browser captures the press to the element it landed on, and that element's
  `lostpointercapture` bubbles up to the sheet; ignore it unless its target is
  the sheet.
- A scrolling body keeps its scroll, and drags the sheet only at its top.
- Velocity is measured over the last 100ms. **Close** past
  `min(64px, 15% of the sheet's height)` or on a downward flick faster than
  0.11 px/ms, sliding out in 300ms from wherever the finger left it. A sheet
  closed by its handle or a button sinks in 200ms instead. Otherwise spring
  back in 400ms. A press
  that catches the sheet mid-spring takes it from where it is.
- Dragging up only gives, tiring out towards 32px:
  `offset = (1 - 1 / (d * 0.55 / 32 + 1)) * 32`. It is the only rubber band in
  the product.
- Drag on `translate`, so it stacks on the enter and exit `transform`. Never
  while the sheet cannot close, such as mid-payment.

## Never ship, in this direction

- [ ] More than one primary on a surface, or a primary that is not the real
      next step
- [ ] A grey filled button in light mode, or more than one coloured fill on a
      surface
- [ ] A destructive action styled as the primary
- [ ] A dark style that changes padding, height, radius or border width
- [ ] A shadow as the only elevation cue in dark
- [ ] A fill, edge or drop set to a fixed value that ignores the surface
      beneath it
- [ ] A large soft blur, a lit top edge in dark, an edge over 0.5px in dark,
      or a drop lighter than its parent
- [ ] Hierarchy made with bold or with hue
- [ ] An action placed below the data it acts on, paging excepted
- [ ] A toast for a successful copy, or a copy tick that waits for the
      clipboard
- [ ] One hover highlight sliding between rows
- [ ] Not checked at 4 to 8× zoom in both themes

## The deeper detail

`kosta4a/tactile-design` holds about 160KB on these rules, with a file per
area: `tokens.md` (a full CSS custom-property template with light and dark
values, the surface classes and a Tailwind v4 mapping),
`buttons-and-controls.md`, `surfaces-and-layering.md`,
`layout-and-hierarchy.md`, `motion.md`, `mobile.md` and `decisions.md`. Read
the file for the area in hand when a recipe here leaves a case open. It is
MIT, so a value may be taken; the licence stays with it.
