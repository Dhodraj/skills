# ADR 0003: The user picks the look from live variants

Date: 2026-11-26
Status: accepted
Supersedes: in ADR 0001, the decision text "The file is loaded at stage G
before every UI edit" and its claim that craft "cannot be added at review
time"; and the consequences "Dealing three directions is now a stage with a
hard stop", "`craft.md` is read before every UI edit" and "Nothing enforces
`craft.md` or `gates.md`. Both are read at stage 7"

## Context

In ADR 0001, stage 3 of `design-the-ui` dealt three directions as text and
stopped until the user picked one. In use, the user approved every accepted
look from live variants in the browser, and no look from a text direction.
Screens built from one version, with no live variants, were the screens the
user disliked. The `prototype` skill already builds live variants, and stage 6
called it, but nothing made that step run. Nothing carried the approved
variant into the build.

## Decision

- The hard stop at stage 3 is the user's pick from live variants, by eye, in
  the browser. A text or ASCII pick settles structure only, never the look.
- The order is: the live brand, then three variants that differ in structure,
  then the user's pick, then `DESIGN.md`. The brand or the picked style passes
  on only its ground, colour, type and imagery. Layout, hierarchy and density
  stay open until the pick.
- The picked variant stays in a lasting mock folder, and `DESIGN.md` records
  its address. The other variants stay throwaway.
- A new skill, `match-the-prototype`, builds a screen that an approved
  prototype draws. It measures both sides, state by state, and the screen is
  done when no difference is left that the user has not ruled on.
- The rules files (`gates.md`, `craft.md`, `markup.md`, `principles.md`) are
  read at the stage 9 review, not before the first edit. A copy, colour or
  one-prop change keeps its small pre-read, because that depth has no review.
  ADR 0001 said craft cannot be added at review time. The review here is not
  a report: stage 9 is a fix loop that changes the code until the Floor list
  is clear, so craft is still applied to the code, after the composition.
- A screen an approved prototype draws now has a measured gate:
  `match-the-prototype`'s `compare.js` exits 1 while a difference is left.
  `craft.md` and `gates.md` themselves still have no gate beyond the review;
  the `DESIGN.md` lint stays the other exception.

## Consequences

**Good**

- The look that ships is a look the user saw running.
- A build from a ticket or a sub-agent has a measured target: the approved
  mock.

**Bad, and accepted**

- Every new look costs three running variants before any product code.
- `match-the-prototype` captures through the Playwright MCP, like
  `measure.js`. It cannot hold or block requests from outside the page, so
  the first frame is a held copy of the page, and a form post is not blocked.
- A rule added to `craft.md` or `gates.md` is now paid for at every review,
  not at every edit.
- Craft is now applied in the review fix loop, not while writing. A first
  build can miss craft that a writer holding the rules would have put in, and
  the fix loop has to add it afterwards.
- Nothing can force the three variants to differ in structure. Three shades of
  one idea would still pass the stage.

## What would change this decision

- If text directions came to predict which look the user approves, the live
  variants would cost more than they give.
