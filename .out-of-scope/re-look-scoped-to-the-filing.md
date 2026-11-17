# Re-checking only the width a finding was filed at

Decided 2026-11-16.

## What was proposed

"A later pass re-captures only the width and state its findings were filed
at."

It misses what the fix itself breaks elsewhere: a repair at 375 can break
1440, and a token fix can break an untouched consumer. The finding format
records neither a width nor a state, so the rule pointed at a filename rather
than a field.

## What to do instead

Scale the re-look by the reach of the edit, which is always known. Open the
full set of widths and states once at the end. The rule is in
`references/regression.md`, Checking afterwards.
