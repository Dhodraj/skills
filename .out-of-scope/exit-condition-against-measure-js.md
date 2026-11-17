# A stop rule written against measure.js

Decided 2026-11-16.

## What was proposed

"The pass ends when `scripts/measure.js` reports no fault."

The script emits no clean signal. It returns counts and samples, with no
boolean and no verdict. Four of its census counts are never zero on a
rendered page, so "no fault" has no referent. Two files say outright that its
numbers are candidates rather than findings. It is also not a CLI: it is
pasted into a browser evaluation, so naming it by path invites
`node measure.js`.

## What to do instead

Gate on the Floor list in `gates.md`, which is a list a reader can walk. See
also `docs/maintenance.md`, Extending measure.js.
