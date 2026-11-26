---
name: design-the-ui
description: "Design or redesign a UI screen, flow or page, starting from its design system, and verify it in a browser. Use when building a new interface, modernising one, or when the user says a UI looks dated, generic or AI-made. Not for audits (review-the-ui), finding a component (find-a-component) or building a screen an approved prototype draws (match-the-prototype)."
---

# Design the UI

Name the customer outcome before the first file. Drive the running product
before saying it works.

## Triggers

- The project has a `DESIGN.md` → it outranks every default here and your own taste. The work needs a value it lacks → add the value to `DESIGN.md`, not to a stylesheet.
- Tempted to propose one look → build three structurally different live variants (stage 3). One proposal is your default look with a rationale.
- A new look and no variant picked by eye yet → stop at stage 3 until the user picks one in the browser. A text or ASCII pick settles structure only, never the look. "You pick" → pick one, say which and why in one line, carry on.
- A redesign → keep the brand's imagery, colour and type unless the user asks to replace them. Fix a review fault inside the look; never delete the element ([references/styles.md](references/styles.md), "A redesign keeps the brand").
- At stage 7 step 2, about to write a component → run the `find-a-component` skill first.
- About to copy code, an asset or a look from an outside source → read its `tier` in [sources.json](sources.json) first. `check-licence` → tell the user its `condition` before it ships. `inspiration` or `browse-only` → copy no code and no assets. Never fetch a `browse-only` site; ask the user to paste in what they want.
- The user calls it generic, dated or AI-made → audit it against [references/slop-signs.md](references/slop-signs.md) before changing anything.
- The user names a site as inspiration → screenshot it at 1440 and 375, and list in a table what it makes dominant and what it leaves out. Take those traits into the client's brand; copy nothing ([references/directions.md](references/directions.md), "Using a reference").
- The page sells a change in the client's own terms, such as legacy to modern → define each term on the page, side by side, in words and in the visual, before building on it.
- The user approves a version → save a copy beside it, with the date in its name, before the next change.
- The user wants a mock → stage 6.
- Briefing a ticket or sub-agent to build a screen → name the approved prototype, its address and the `match-the-prototype` skill in the brief.
- About to review what you built → read what the depth table names for this depth, and no more.
- Building against one fixture → render every state from stage 4 as well.
- Tempted to say it works from the source or a file list → start it, open it in a browser, look at the screenshots (stage 8).
- Something moves → film it. A still cannot show a pop, a jump or an entrance that never ran.
- About to add an entrance, a sequence, or scroll, text or canvas motion → read [references/motion.md](references/motion.md) and ship its reduced-motion path. Hover, focus and press stay CSS transitions.
- Building from a Figma frame → [references/figma.md](references/figma.md). The page carries a WebGL or three.js scene → [references/3d-scene.md](references/3d-scene.md), and only then.
- A script needs a project-specific setting → pass it as an argument. Never edit the script's file, nor its installed copy under `~/.claude/skills/`.

## Pick the depth first

| The change | Stages | The review reads |
|---|---|---|
| Copy, a colour, one prop | 1, 7, then look at the result | Before the edit, as this depth has no review: "The three tiers", the Floor sections and "Before handing back" of [gates.md](references/gates.md), plus "Reflex: copy" for a copy change or "Reflex: the look a model defaults to" for a colour change |
| One component, one state | 1, 4, 6, 7, 9 | All of `gates.md`, and the [craft.md](references/craft.md) sections the component touches |
| A screen, a form, a flow | 0 to 10, briefly | All of `gates.md`, `craft.md` and [markup.md](references/markup.md); [principles.md](references/principles.md) within its limit |
| A new surface, or "make this modern" | 0 to 10 in full, with a live variant picked at stage 3 before stage 7 | As above, plus the reference each stage names |
| "Audit this" | Use `review-the-ui`. Do not edit | — |
| "Find me a component for…" | Use `find-a-component` | — |

Say the depth in one line before starting. Skip a stage only when the change
cannot reach what that stage protects.

## 0. Preflight: read the project before asking anything

Read in this order, and stop at the first that settles the question:

1. `DESIGN.md` at the project root.
2. `PRODUCT.md`, `README.md`, `.claude/`, an existing brief.
3. The stack, the styling system and the component library.
4. The nearest existing screen, and the tests covering it.

Then find the live brand source: the live site, its repo or a brand file.

A screen that contradicts the product's own system is a finding, not a licence
to start a third system.

## 1. The design system

[references/design-system.md](references/design-system.md) holds the format and
both routes into it.

| The project has | Do this |
|---|---|
| A `DESIGN.md` | Follow it, and say so in one line |
| Tokens, a theme file or a Tailwind config | Codify them into `DESIGN.md` by reading the values out of the code, never by guessing |
| A live product or brand with no written system | Render it, read the computed values, record them |
| Nothing | Write one at stage 3, from the brand or style and the variant the user picks |

A codified `DESIGN.md` records only values the product uses. A new one is a
proposal until the user picks it. Lint it, and fix what it reports before
stage 7:

```bash
pnpm dlx @google/design.md lint DESIGN.md
```

## 2. The customer outcome

[references/product-thinking.md](references/product-thinking.md) holds the
method. Write the outcome as something observable:

> A dispatcher with 40 open runs can see which run is late and reassign it
> without leaving the list.

Then acceptance criteria, each checkable in a browser. "Looks good" is not one.
"At 375px every run's status and its reassign control are reachable without
horizontal scrolling" is. Where there is no evidence, write the assumption and
label it.

## 3. The look: brand, live variants, the user's pick

For a new surface, a redesign or "make this modern", in this order:

1. **Brand.** Stage 0 found a live brand source → take its colour, type and
   imagery from it and skip the gallery. None → run
   `node scripts/style-gallery.js --name NAME --brand "#HEX" --font FONT`,
   with `--image` for the client's hero picture, open it, and have the user pick
   one or two styles by number with the question tool. Read only the
   picked entries in [references/styles.md](references/styles.md). A picked
   style passes on only its ground, colour, type and imagery; its structure and
   density stay open. Style 13 is
   [references/tactile.md](references/tactile.md), for a dense product whose
   controls are pressed all day.
2. **Diverge.** Build three live variants with the `prototype` skill's UI
   branch, beside the real header, navigation and sample data marked as
   sample. Pass the brand values only; layout and hierarchy stay open. Name
   each with [references/directions.md](references/directions.md).
3. **Pick.** Give the user the address and stop until they pick by eye in the
   browser.
4. **Record.** On a pick, keep the picked variant in a lasting mock folder,
   which `match-the-prototype` reads. The other variants stay throwaway. Write
   or update `DESIGN.md` with the brand or style values, the overrides, the
   picked variant and the `Approved mock:` line under `Overview`, and lint it.

A new screen inside a live product whose look is set skips this stage and
matches the product.

## 4. The journey and its states

Map the journey with
[references/journey-and-states.md](references/journey-and-states.md). Once the
composition exists (stage 7), list the states this surface really has: empty,
one item, many, the densest real case, loading, partial failure, error, no
permission.

## 5. Components

Run `find-a-component` at stage 7 step 2, once the composition exists.

## 6. Mock, or the real product

- **Mock**, for any new look: the stage 3 variants. Say before building that
  the winner is rebuilt in the product's components, not shipped. Without
  `prototype`, build the variants on the real route and mark them as sample.
- **Direct**, only inside an approved mock or an existing screen whose look is
  set: the product's own files.

## 7. Build

An approved prototype draws the screen, a variant picked at stage 3 included →
build it with the `match-the-prototype` skill. Otherwise:

1. Compose the whole screen in one pass, as one composition, inside the
   screens it joins.
2. Swap in the product's own tokens and components (stage 5).
3. Build the states from stage 4, not only the happy path.

Build the most important screen, or the hero, alone and first. Have a
sub-agent with no memory of your decisions review it, then build the rest.

## 8. Run it and look at it

Start the application, open it in a browser, and use it from the real entry
point as the customer would. [references/playwright.md](references/playwright.md)
holds the mechanics, what to do when the application will not start, and how
to slow an animation down and sample it frame by frame. Open the screenshots.

Walking a journey yourself finds friction. It does not measure what customers
do: say so wherever the report could read as user evidence.

## 9. Review and fix

This is the one fix loop for both skills. `review-the-ui` in review-and-fix
mode hands its agreed fix list to this stage.

1. Read what the depth table names, and check the built screen against it.
   At the screen depth and above, ask each element the
   [principles.md](references/principles.md) rows its index lists for the
   element's kind, within the limit that file sets: look rows on the render,
   act rows on the stage 8 walk. Run `review-the-ui` against what you built,
   unless its report is already in hand. Before editing, list the journeys that already work, with
   [references/regression.md](references/regression.md).
2. Fix one cause at a time, in severity order. A change you cannot justify
   against the stage 2 outcome, or the agreed fix list, is out of scope: leave
   it, and say so.
3. After each fix, re-measure, re-walk, and re-run
   [references/critique.md](references/critique.md) in a sub-agent with no
   memory of the build, on each state and width the fix touches.
4. Run the project's checks for the area changed, then the broader suite once.
   Separate failures you caused from failures already there.

**The pass ends on the list, not on the screenshot.** Reaching stage 10 needs
the Floor list of `gates.md` walked and clear; a screenshot that looks right
is not that walk. Stop when a pass finds nothing new, or after three passes. A
Floor breach still open after the third: stop and ask rather than hand it back
as a finding left with a reason.

## 10. Report

- The customer outcome, and whether it is met.
- The brand source or style, and the variant picked, and by whom.
- What was built or changed, by file.
- What was verified, by what means, at which widths, in which states.
- What was not verified, and why. Mark every stand-in, and every claim not
  checked on a render.
- Findings fixed, left with their reason, or not verified.
- Assumptions that are still assumptions.
