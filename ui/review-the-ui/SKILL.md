---
name: review-the-ui
description: "Review an existing UI, or what a change did to one, and report harm to customers with evidence and severity. Use for \"review\", \"audit\" or \"critique\" of a page, flow or product, \"is this ready to ship\", \"did my diff break the UI\", or \"check it on a phone\". Changes no files unless asked to fix."
---

# Review the UI

## Triggers

- Asked to "review", "audit", "critique", "what is wrong with" or "is this ready" → review only. Change no files, however bad the findings. Where fixing is the obvious next step, finish the report and offer it.
- Asked to "review and fix", "find and fix" or "improve", or the user says yes to the offer → review and fix (section 11).
- The request names no scope, and the tree is dirty or ahead of its base → ask whether they mean the surface or the change. The two reports are not interchangeable.
- Tempted to judge from the source → render it. It cannot be started or reached → stop, say which (no server, no credentials, no data, a failing build), and mark every journey claim unverified.
- Only a Storybook is running → use it for component states, but it cannot close the review: it never shows the journey or the real data.
- A script returns a number → it is a candidate. Confirm it on the render and name who it harms before it becomes a finding.
- A dozen hits share one cause → one finding, with the hits as its occurrences.
- Something moves → set reduced motion in the system and film it again. Then run the checks in [motion.md](../design-the-ui/references/motion.md) that apply to this project.
- The surface carries copy, badges, a chart or a dashboard → check it with [references/copy.md](references/copy.md).
- Torn between two severities → take the lower and say why.
- Tempted to grade by how easy the fix is → grade by harm to the customer.
- A script needs a project-specific setting → pass it as an argument. Never edit the script's file, nor its installed copy under `~/.claude/skills/`.

State the mode in the first line of the reply.

## Scope: a surface, a change, or a whole product

| Scope | Asked by | Answers |
|---|---|---|
| A surface | "review this page", "audit the dashboard", "is this ready" | Is this interface good |
| A change | "review my diff", "review this branch", "review pr 482", "did I break anything" | Did this change make it worse |
| A whole product | "audit the whole product", "check every screen" | Where across the product does an element break a principle |

A change: read [references/changes.md](references/changes.md) and work through
it, then return here for the measuring, the looking and the severity. A whole
product: read [references/product.md](references/product.md) and work through
it, then return here for the measuring, the severity and the finding format.

## 1. Find the design principles first

Decide what the interface is measured against, in this order:

1. **`DESIGN.md` at the project root.** Run `pnpm dlx @google/design.md lint
   DESIGN.md`; what it reports are findings about the system itself.
2. **The project's own system in code**: tokens, a theme, a Tailwind config, a
   component library. Values off it are drift.
3. **[gates.md](../design-the-ui/references/gates.md)**, the floor for any
   product.
4. **[craft.md](../design-the-ui/references/craft.md)**, the layer above the
   floor.

Where the project has neither 1 nor 2, say so and review against 3 and 4.
Offer to write a `DESIGN.md` with `design-the-ui`; do not write one in a review.

## 2. Pick the target: running app, Storybook, or both

| Target | Use it for | How |
|---|---|---|
| **The running application** | Journeys, real data, real density | The project's own `dev` or `start` script |
| **Storybook** | A component's states and variants, including ones the app never shows | `storybook dev -p 6006`, then one story per state |
| **A static page** | A mock, a landing page, an exported build | Serve the folder; never open it as a `file:` URL |

Look for Storybook before assuming it is absent: `.storybook/`, a `storybook`
script, `*.stories.*` files. Where both exist, use both, and say which target
each finding came from. In Storybook, read `/index.json` for every story id
and visit each as `/iframe.html?id=<story-id>`.

## 3. Measure the render

Measure at 1440, 1024 and 375.
[playwright.md](../design-the-ui/references/playwright.md) has the mechanics.

Pass the whole contents of [measure.js](../design-the-ui/scripts/measure.js) as
the `function` argument of `browser_evaluate`, once per width. It returns
overflow, text contrast, target sizes, unnamed controls, heading order,
unsized media, text below 12px, and a census of the type sizes, radii, shadows
and font families the page uses.

Two fields say which target floor it applied. `targetFloor` is 24 or 44, and
`thumbExpected` says why: a coarse pointer, or a viewport at or under 768px.
Cite the floor beside the number: a 36px control is correct on a pointer-first
console and a failure on a phone.

It names five geometry faults, each a rule in
[craft.md](../design-the-ui/references/craft.md), Spacing and alignment:

| Fault | What the number means |
|---|---|
| `clipped` | A mark sliced by a container that hides overflow. Exempt: a crop marked `data-crop`, truncation with an ellipsis, and a visually hidden container such as a screen-reader-only header or skip link |
| `tightInsets` | Ink closer than 8px to the edge of its surface, where 12px is the rule. Measured from the text, not its box. A dense table or chip set tight on purpose reports here too |
| `unevenPadding` | A panel of at least 120 by 80 with two or more children whose content is cramped against one edge, or whose left and right gaps differ while the content fills the width. A panel with room below its content is not reported |
| `nearTangents` | Sibling edges 0.5 to 3.5px apart: a gap that neither closes nor clears a step of the scale, or left, right or top edges meant to line up. Bottom edges are not compared |
| `wrappedUnits` | A figure split from its unit, or a currency sign from its digits, across two lines, including a unit in a child span such as `42 <span>GB</span>` |

Confirm each geometry candidate on the screenshot. Check the innocent cause
first: a deliberate crop, a chip tight on purpose, a grid that stretched a
panel taller than its content. A confirmed clip is a Warning; a miss of a pixel
or two is Polish.

Then pass [covered.js](../design-the-ui/scripts/covered.js) the same way, at
each width and after each scroll. Report each element it returns, in
`controls` or `marks`, as fault `covered`. If the page draws a graph whose
nodes are not `[data-node]` or `[role=group]`, pass the node selector as the
argument: send `() => (<covered.js contents>)(".my-node")` as the `function`.

Then run every sweep in [references/sweeps.md](references/sweeps.md), and read
the DOM snapshot against the check in
[markup.md](../design-the-ui/references/markup.md).

## 4. Look at the screenshots, in this order

The scripts cannot see hierarchy, rhythm, crowding or whether the page is any
good. First run [critique.md](../design-the-ui/references/critique.md) on each
screenshot, one at a time. Then open every screenshot at every width and walk
these seven. Each is a failure that renders wrong while the source reads fine.

1. **Placement.** Is the main element where it belongs, and the rest on the
   grid? Is a large empty region carrying nothing?
2. **Containment.** Does any text, number or label cross or touch the edge of
   its card, column or button? Right-aligned values and long identifiers fail
   first.
3. **Duplication.** Is the same action offered twice? Does a control the
   customer had before still exist?
4. **Reachability at 375.** Is every control on screen, each target at least
   24 × 24 (44 × 44 where a thumb is expected), with no horizontal scroll?
5. **Contrast.** Can you read every label on its own background, including
   pressed, hovered and selected states?
6. **Rhythm.** Do spacing and type sizes come from the product's scale, or were
   they chosen for this screen alone? `craft.md`, Spacing and alignment, is
   eye work beyond the script: a dot outside its row, a body starting under an
   avatar instead of at the name, a title spread from its subtitle.
7. **Meaning.** For each element a person can see or press, ask the rows the
   [principles.md](../design-the-ui/references/principles.md) index lists for
   its kind, within the limit that file sets: look rows here, act rows in the
   step 5 walk.

Tag each finding with where it came from: its check number here, its fault
name from step 3 (such as `clipped` or `covered`), its sweep, or `critique`.

## 5. Walk it as a customer

Skip this only for a single static element. Write the journey down **before**
opening the browser, so what you expected is recorded apart from what happened:

```
JOURNEY: reassign a late run
ENTRY:   /runs, signed in as a dispatcher, 40 open runs seeded
GOAL:    the late run is assigned to another operator
STEPS:   1 find the late run  2 open it  3 choose an operator  4 confirm
MISTAKES TO TRY: confirm with nobody chosen; reassign a finished run;
         lose the connection mid-save
```

Then walk it, recording what the customer meets, not what the code intends:

```
STEP 2: open the late run
  SEES:     <what is on screen, from the snapshot or the screenshot>
  EXPECTS:  <what a customer would assume happens next>
  HAPPENS:  <what actually happened>
  EVIDENCE: <the screenshot file, or the snapshot line>
  FRICTION: none | low | high | blocker
  WHY:      <what caused it: a label, a missing state, a dead control>
```

A row with no screenshot or snapshot behind it stays out of the report. "The
customer would feel confused" is usable only when the row says what confused
them.

**The states a happy path hides.** Each axis has a cue. Cue matches, run the
axis. Cue fails, drop it and name the drop in the report: an unnamed drop reads
as coverage you did not have. Then judge each rendered state on screen, not in
the DOM.

| Axis | Cue | What to render |
|---|---|---|
| Lifecycle | always | Empty at first use, empty because a filter matched nothing, loading, failure, recovery, no permission |
| Quantity | it repeats over items | Zero, one, the realistic count, ten times the realistic count |
| Content length | it renders text it does not author | Empty string, one word, several sentences, one unbreakable string |
| Content shape | the text can come from customers or locales nobody on the team writes | Emoji alone and in a sentence, right-to-left, mixed direction, diacritics and tall scripts, figures down a column |
| Container | always | 320px, squeezed by a flex or grid sibling, very wide |
| Environment | the project has the mode | Dark theme, browser zoom, reduced motion |

Lifecycle. "Not reachable here" is a valid result if recorded.

- Empty at first use: does it say what to do next?
- Empty by filter: does it name the filter and offer to clear it? Zeros in
  place of an empty result are a defect.
- Loading: feedback within a few hundred milliseconds, and the layout holds
  its size.
- Failure: a failed request, a rejected validation, a timeout. Is the message
  specific, next to what failed, and recoverable?
- Recovery: can the customer get back without starting over?
- No permission: what does a customer who may not do this see?

Where it is easy to get wrong:

- **The container widths are fixed boxes on the page, not viewport resizes.**
  The flex-sibling squeeze finds a missing `min-width: 0` or
  `minmax(0, 1fr)` (gates rule 15); no viewport resize reproduces it.
- **Toggle the real environment mode.** Re-declaring dark tokens under a class
  tests a different component. Zoom in the browser and set reduced motion in
  the system.
- **Anything that moves is filmed, not inferred.** Slow it down and capture
  every appear, disappear, press and loop seam, then reduced motion.
  [playwright.md](../design-the-ui/references/playwright.md), Filming motion,
  has the mechanics.
- **Motion that stutters is a separate finding from motion that is wrong.**
  [references/performance.md](references/performance.md) has the symptom
  table and the frame budget. Name the cause before proposing a fix.
- Tab through focus and hover by hand; a harness can hold a ring the keyboard
  never shows.

**The mistakes.** Submit the form empty, and with one field wrong. Press the
primary action twice. Go back mid-flow, then forward. Reload halfway. Open a
link in a new tab and carry on in the first.

**At 375.** Walk the whole journey at phone width, with the primary action
reachable by a thumb. A journey that works on desktop and dead-ends on a phone
is a Blocker.

## 6. Sort every finding into its kind

Give each finding exactly one.

1. **Product and information architecture**: the screen solves the wrong
   problem, shows the system's internals instead of the customer's task, or
   buries what the job needs behind what the database holds.
2. **Journey and usability**: confusion, a dead end or a detour between entry
   and outcome.
3. **Design system**: values off `DESIGN.md` or the token file: a hard-coded
   colour, an off-scale spacing, a third radius, a fourth font.
4. **Visual design**: hierarchy, rhythm, density, type, colour,
   distinctiveness. Nothing dominates; twelve equal tiles; a page that could
   belong to any other product.
5. **Interaction and state**: a missing state, feedback that lies, a control
   with no response.
6. **Accessibility**: contrast, naming, keyboard, focus, colour-only status,
   heading structure, reduced motion.
7. **Implementation**: the code behind one of the above: a hard-coded palette,
   a fixture that hides the dense case, a layout that cannot hold long content.

## 7. Severity, by harm to the customer

| Severity | Meaning |
|---|---|
| **Blocker** | Stops a core task, loses data, misleads: the primary action unreachable, a keyboard trap, a figure that misstates the data, a success message for a failure, a form that prints "Sent" with nothing behind it |
| **Critical** | Major harm on a common path: body or action text below 4.5:1, horizontal scrolling at 375, a missing empty or error state on a primary flow, a control with no accessible name, a placeholder as the only label, an invented metric or testimonial |
| **Warning** | Degrades the experience: off-system spacing, values off a shared scale, weak hierarchy, duplicated actions, words or a mark clipped by their own container, a forgettable public page |
| **Polish** | Refinement: a widow, nested corners, a few pixels of asymmetry |

Never rank a fault class from [sweeps.md](references/sweeps.md) below Warning.
An inflated review gets ignored.

Order the report by harm, then by how many customers meet it, then by how
often, then by business consequence.

## 8. What not to flag

- **Anything `DESIGN.md` explicitly allows, except a Floor rule.** The
  project's system outranks the Reflex and Finish tiers; where they disagree,
  say so once and follow `DESIGN.md`. A `DESIGN.md` entry does not
  waive a Floor rule in `gates.md`, because those are about truth and access:
  contrast, focus, accessible names, status, reduced motion, targets, a
  pointer-free path. Flag a Floor breach even where the system asked for it,
  and name the entry. Cite the line. "Consistent" or "deliberate" alone never
  drops a finding.
- **Wiring a static page cannot have**: a `#` link, a form with no endpoint.
  List them once, unscored, as wiring to confirm, unless the result is false,
  such as a filter that relabels the view but not the data.
- **House rules that are not standards.** 12px labels and table headers are
  normal in dense data interfaces. Flag reading copy below 16px on a reading
  page; do not invent a floor.
- **Missing dark mode**, unless the product has or promises one.
- **Taste.** Every finding names who it hurts and how.
- **The same cause twice.**

## 9. Finding format

```
C2. Run status shown by colour alone  (.run-row .status, 40 rows)
Kind:   accessibility
Principle: 1.4.1  (optional: the principles.md row the finding breaks)
Found:  status is a coloured dot with no word or shape; green and amber
        measure 2.9:1 against the row background
Why:    a colour-blind dispatcher cannot tell a late run from a running one,
        which is the screen's whole job
Fix:    add the status word beside the dot and give each status its own shape
Evidence: shots/1440-runs.png, measure-1440.json contrastFailures[3]
```

One line each for Polish. Keep `Found` and `Why` to one or two lines. In a
change scope, add a `Status` line: `introduced`, `regression` or
`pre-existing`, set by cause, not position. Cap `pre-existing` at three.

## 10. The report

```
# UI review: <surface or change>
Mode:  review only | review and fix
Scope: a surface | a change | a whole product
Measured against: <DESIGN.md | the token file | gates.md and craft.md alone>
Checked: <widths, axes run, journeys walked, target, browser>
Axes dropped: <axis, and the cue that failed>
Stood in for: <fixtures for live data, a seeded account, a local font>
Not checked: <what the environment could not reach>

Top three: <three ids, one line each>

## Blockers / Critical / Warnings / Polish
<findings in the format above, each with its kind>

## States
empty first use <result> · empty by filter <result> · loading <result>
· dense <result> · error <result> · recovery <result>
· permission <result | not reachable> · 10x count <result>
· unbreakable string <result> · 320px <result> · flex squeeze <result>

## What is sound
<the decisions worth keeping, so a later session does not undo them>

## Questions
<at most three, each with the assumption made meanwhile>
```

Record what is sound: a review that lists only faults invites a rewrite of what
was right.

No score, and never a score as the reason to stop: here the scorer is the
builder, so the number certifies itself. The severity list already carries the
order.

## 11. In review-and-fix mode

Get the fix list agreed, or fix only Blocker and Critical findings and say so.
Then run stage 9 of the `design-the-ui` skill against this report: it is the
one fix loop, with the stop rule. Report each finding as fixed, left with a
reason, or not verified.
