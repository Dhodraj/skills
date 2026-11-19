---
name: design-the-ui
description: "Design or redesign a UI screen, flow or page, starting from its design system, and verify it in a browser. Use when building a new interface, modernising one, or when the user says a UI looks dated, generic or AI-made. Not for audits (review-the-ui) or for finding a component (find-a-component)."
---

# Design the UI

Name the customer outcome before the first file. Drive the running product
before saying it works.

## Triggers

- The project has a `DESIGN.md` → it outranks every default here and your own taste. The work needs a value it lacks → add the value to `DESIGN.md`, not to a stylesheet.
- Tempted to propose one direction → deal three (stage 3). One proposal is your default look with a rationale.
- A new surface and no direction picked yet → stop at stage 3 until the user picks. "You pick" → pick one, say which and why in one line, carry on.
- About to write a component → run the `find-a-component` skill first.
- About to copy code, an asset or a look from an outside source → read its `tier` in [sources.json](sources.json) first. `check-licence` → tell the user its `condition` before it ships. `inspiration` or `browse-only` → copy no code and no assets. Never fetch a `browse-only` site; ask the user to paste in what they want.
- The user calls it generic, dated or AI-made → audit it against [references/slop-signs.md](references/slop-signs.md) before changing anything.
- The user wants a mock → stage 6.
- About to make the first UI edit → read what the depth table names for this depth, and no more.
- Building against one fixture → render every state from stage 4 as well.
- Tempted to say it works from the source or a file list → start it, open it in a browser, look at the screenshots (stage 8).
- Something moves → film it. A still cannot show a pop, a jump or an entrance that never ran.
- About to add an entrance, a sequence, or scroll, text or canvas motion → read [references/motion.md](references/motion.md) and ship its reduced-motion path. Hover, focus and press stay CSS transitions.
- Building from a Figma frame → [references/figma.md](references/figma.md). The page carries a WebGL or three.js scene → [references/3d-scene.md](references/3d-scene.md), and only then.
- A script needs a project-specific setting → pass it as an argument. Never edit the script's file, nor its installed copy under `~/.claude/skills/`.

## Pick the depth first

| The change | Stages | Read before the first edit |
|---|---|---|
| Copy, a colour, one prop | 1, 7, then look at the result | "The three tiers", the Floor sections and "Before handing back" of [gates.md](references/gates.md), plus "Reflex: copy" for a copy change or "Reflex: the look a model defaults to" for a colour change |
| One component, one state | 1, 4, 6, 7, 9 | All of `gates.md`, and the [craft.md](references/craft.md) sections the component touches |
| A screen, a form, a flow | 0 to 10, briefly | All of `gates.md`, `craft.md` and [markup.md](references/markup.md); [principles.md](references/principles.md) within its limit |
| A new surface, or "make this modern" | 0 to 10 in full, with stage 3 approved before stage 7 | As above, plus the reference each stage names |
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
| Nothing | Write one at stage 3, from the direction the user picks |

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

## 3. Directions, and the user's pick

[references/directions.md](references/directions.md) holds the method and the
vocabulary. Deal three directions. Give each a name, the anchor hue, the type
pairing, the density and the one memorable thing, in four lines.

One of the three may be [references/tactile.md](references/tactile.md), a
direction already decided down to its tokens, for a dense product whose
controls are pressed all day. Deal it only beside two taken from the product's
own world, and never as the default.

This is the approval gate. On a yes, write or update `DESIGN.md` with the
picked direction's real values, and lint it.

## 4. The journey and its states

[references/journey-and-states.md](references/journey-and-states.md). List the
states this surface really has: empty, one item, many, the densest real case,
loading, partial failure, error, no permission.

## 5. Find components before writing them

Run the `find-a-component` skill for each new component.

## 6. Mock, or the real product

Ask which in one line, unless the user already said.

- **Mock**, for a new surface, a redesign or a stakeholder to convince: run the
  `prototype` skill's UI branch for variants inside the direction picked at
  stage 3, with the tokens from `DESIGN.md` and sample data marked as sample.
  Without `prototype`, build the variants on the real route and mark them as
  sample. Say before building that the winner is rebuilt in the product's
  components, not shipped.
- **Direct**, for a change inside a live product: the product's own files.

## 7. Build

Build the states from stage 4, not only the happy path, with the product's own
tokens and components. Read what the depth table names, immediately before the
first UI edit.

At the screen depth and above, ask each element the
[principles.md](references/principles.md) rows its index lists for the
element's kind, within the limit that file sets: look rows while building,
act rows in the stage 8 walk.

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

1. Run `review-the-ui` against what you built, unless its report is already
   in hand. Before editing, list the journeys that already work, with
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
- The direction picked, and by whom.
- What was built or changed, by file.
- What was verified, by what means, at which widths, in which states.
- What was not verified, and why. Mark every stand-in, and every claim not
  checked on a render.
- Findings fixed, left with their reason, or not verified.
- Assumptions that are still assumptions.
