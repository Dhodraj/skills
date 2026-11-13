---
title: "Take another design skill's measurable spacing rules, not its purpose"
author: Dhodraj
date: 2026-11-12
branch: main
id: l-a2045531
scope: repo
status: active
src: agent
touches:
  - docs/adr-0001-architecture.md
  - docs/source-research.md
  - docs/testing-report.md
---

## Decided

The stageshow skill (MIT, benjitaylor/skills) exists to draw faux product UI
for marketing pages. Our ui-design skill forbids that in a real product. We
took only the parts that hold for a real interface: its spacing and alignment
numbers, its emphasis rules, four icon rules, and the practice of filming
motion rather than inferring it from the source. Its kit, examples, framing
rules and faux-specific rules stayed out.

Five of those numbers are now measured rather than left to the eye, because a
named fault with a pixel count survives an argument and "this looks cramped"
does not.

Scope was the user's call, from four options. They picked the widest: rules,
review checks, detectors and motion capture.

## Tried and ruled out

- Installing stageshow as its own skill. Its purpose contradicts the rule
  against drawn browser and phone frames, so it would have fought the skill
  next to it.
- Taking the rules alone, with no detectors. Nothing then enforces them, which
  is the known weakness of a reference file read at build time.
- Reusing its film scripts. They need playwright-core and a page built on its
  own React Stage component, so neither runs against an ordinary product page.

## Watch out

A geometry detector written from the rule alone fires on innocent layouts.
Three false positives had to be fixed before these were worth keeping: the
page body reporting uneven padding on a two-column grid, every card stretched
by its grid row reporting a cramped bottom, and a table cell reporting a zero
inset because its box reaches the panel edge while its text does not. Measure
the ink, not the box, and report a cramped edge rather than one with room to
spare. Check any new detector against a page known to be clean, not only
against a fixture built to fail.

In the code: the rules are in
.claude/skills/ui-design/references/craft.md (Spacing and alignment,
Emphasis), the detectors in .claude/skills/ui-design/scripts/measure.js
(clipped, tightInsets, unevenPadding, nearTangents, wrappedUnits), the motion
mechanics in .claude/skills/ui-design/references/playwright.md (Filming
motion). The fixture is tests/fixtures/geometry-faults.html, the browser
results are in docs/testing-report.md, and what was taken from where is in
.claude/skills/ui-design/NOTICE.
