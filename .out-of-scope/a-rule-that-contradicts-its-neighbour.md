# A rule that contradicts the line it was added beside

Decided 2026-11-17.

## What was proposed

From `emilkowalski/skills`: "Never animate a keyboard-initiated action."

It contradicts `craft.md` in the same file, which allows a colour or opacity
change under 150ms on a keystroke. It contradicts the press rule, which keeps
`scale(.96)` on press even under reduced motion because it is feedback. And
in `references/tactile.md`, Enter or Space closes a sheet that then animates
for 200ms.

## What to do instead

Read the neighbouring lines before adding a prohibition, and prefer tightening
one of them. A borrowed absolute is the wording to distrust first.
