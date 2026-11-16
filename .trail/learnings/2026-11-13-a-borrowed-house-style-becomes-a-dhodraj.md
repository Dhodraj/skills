---
title: "A borrowed house style becomes a direction the user picks, never a rule everyone pays for"
author: Dhodraj
date: 2026-11-13
branch: main
id: l-f47def00
scope: repo
status: active
src: agent
touches:
  - README.md
  - docs/adr-0001-architecture.md
  - docs/install-and-invoke.md
  - docs/maintenance.md
  - docs/source-research.md
  - docs/testing-report.md
---

## Decided

A design skill read from outside splits in two before anything is written down.
The parts that hold whatever the product looks like become rules on the pages
every build reads. The parts that are one house's taste become a named
direction, in its own file, loaded only when the user picks it.

The split test is a question: would this rule still be right on a marketing
page, an editorial surface and a console? An answer of "only on a console"
makes it a density or a style decision, not craft.

A direction may override a number or a waivable rule. It may not touch the
floor rules about truth and access. Each override is listed in the direction's
own file next to the rule it overrides, and the waiver is only real once the
project's design system file records it.

## Tried and ruled out

- Taking the whole style into the rules every build reads. It would have made
  every project look like the one dashboard the style came from, which is the
  default aesthetic the skill exists to prevent.
- Recording the source and changing no rules. It throws away the parts that
  are plain craft: worst-case data, touch behaviour, drag physics.
- Vendoring the source's 160KB of per-component detail. The direction names
  the values and points at the source for the rest, so the repo carries a fifth
  of the weight.

## Watch out

Where a borrowed source disagrees with a rule already on the page, both
readings go on the page with the reason each holds. A hidden conflict comes
back later as a rule that looks arbitrary, and the next person deletes it.

A borrowed palette usually has two or three steps that miss the contrast
floor. Say which, and say what to use instead, or an authoritative-looking
file breaks a floor rule.

A claim that a file overrides a numbered rule rots silently. A test that the
rule still exists under the number it names costs one line and keeps the pair
honest.

## In the code:

- `.claude/skills/ui-design/references/tactile.md` is the direction, with the
  override table at its head. `references/directions.md` says it is one of
  three and never the default.
- The style-independent craft went to `references/craft.md` and
  `references/gates.md`, which load before every UI edit.
- `tests/run.sh`, the references section: each override is checked against the
  rule number it names. `bash .claude/skills/ui-design/tests/run.sh`.
- `docs/maintenance.md`, "Add or change a direction with values".
