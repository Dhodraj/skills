# Putting a borrowed palette and scale into the always-loaded rules

Decided 2026-11-13.

## What was proposed

Taking the whole of a borrowed house style into `references/craft.md` and
`references/gates.md`, which load before every UI edit.

Every project would then pay for one house's taste on every build, and every
screen would look like the dashboard the style came from. The same argument
refused the `ease-drawer` curve of `emilkowalski/skills` on 2026-11-17, which
`references/tactile.md` already carries.

## What to do instead

A style with its own values becomes a direction, dealt as one of three and
never by default, with every override it makes listed. The rule is
`adr-0001-architecture.md:131`: one house's taste belongs in a direction
file.
