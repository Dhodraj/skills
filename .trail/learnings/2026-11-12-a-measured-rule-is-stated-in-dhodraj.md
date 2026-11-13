---
title: "A measured rule is stated in both places: the guide a builder reads and the script that checks it"
author: Dhodraj
date: 2026-11-12
branch: main
id: l-5999c487
scope: repo
status: active
src: agent
touches:
  - docs/adr-0001-architecture.md
  - docs/maintenance.md
  - docs/source-research.md
  - docs/testing-report.md
---

## Decided

Where a script measures a design value, the guide read before the edit still
states the rule and marks it measured. A rule nobody reads until review is a
rule nobody follows, so one fault carries one name in both places. This
replaced the earlier rule that the guide leave the measurable parts to the
script.

## Tried and ruled out

- Following the old rule and stripping the measured values out of the guide.
  An agent building a screen would then never see the numbers, only a reviewer
  after the fact.
- Leaving both texts disagreeing and noting the conflict for later. Two live
  instructions that contradict each other is worse than either one.

## Watch out

A registry can answer every request and return nothing. One component source
filed its components under a type the search did not ask for, so all 1,004 of
its items were invisible while it looked healthy. Check which item type a
catalogue uses before trusting an empty result.

In the code: the rule is in docs/maintenance.md (Extending craft.md), the
measured values in .claude/skills/ui-design/references/craft.md, the default
item types in .claude/skills/ui-design/scripts/find-components.js.
