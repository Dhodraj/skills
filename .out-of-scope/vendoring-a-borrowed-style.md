# Copying an upstream style repository into this one

Decided 2026-11-13.

## What was proposed

Vendoring the 160KB of `kosta4a/tactile-design` so its rules could be read
directly.

It buys a copy that drifts from its source with nobody watching. It also puts
one house's palette and scale in the tree as though they were ours.

## What to do instead

Read the source and write the rules in our own words. Record what was taken
in `NOTICE`. Keep the values in a direction file, loaded only when that
direction is picked.
