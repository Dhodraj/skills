# Splitting craft.md so a text edit loads less of it

Decided 2026-11-17.

## What was proposed

Breaking `references/craft.md` into parts by the moment each applies, so a
copy change does not load the motion, touch and sheet sections.

Deferred rather than refused. The gain is unproven, and a split invites a new
rule landing in the half nobody loaded. The file is read before every UI
edit, so the cost is real and worth revisiting with a measurement.

## What to do instead

Keep one file. Where a body of rules has its own moment, give it its own
reference instead, as `ui-review/references/performance.md` does for frames.
Reopen this with a measured figure for what the load costs.
