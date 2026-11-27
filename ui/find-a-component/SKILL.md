---
name: find-a-component
description: "Find a component that already exists before writing one: in the project, then in shadcn-compatible registries. Use when the user describes a UI need in words, asks which component to use, asks for alternatives, or asks whether the project already has one. Returns ranked candidates with exact names, links and licences."
---

# Find a component

Most described components already exist, with their states, keyboard handling
and edge cases worked out. Find them, read their code, rank them, and only then
consider writing one.

## Triggers

- Tempted to write the component from scratch → only after naming each candidate read and why it failed.
- A script needs a project-specific setting → pass it as a flag. Never edit the script's file, nor its installed copy under `~/.claude/skills/`.
- The project already has one that is close → use or extend it. A second copy of a component the product already has is a defect, not a choice.
- Tempted to search with the request's own words → translate them first (step 1). The catalogue's words are rarely the request's.
- Tempted to rank from a name and a one-line description → read the code first (step 4).
- Tempted to call a high search score a good component → don't. The score is a text match. Never present it, or the directory's `ranking.score`, to the user as quality.
- Tempted to trust GitHub's licence label → read the repository's own `LICENSE` file.
- About to recommend or copy from a source in [sources.json](../design-the-ui/sources.json) → state its `tier`. `check-licence` → tell the user its `condition` before it ships. `inspiration` or `browse-only` → never a candidate to copy. Never fetch a `browse-only` site.
- The need is motion, video or a shader → read the sources of those kinds in `sources.json` first; for video or a shader, then [references/other-surfaces.md](references/other-surfaces.md).
- The need is not a web page component (terminal, email, PDF, editor) → read [references/other-surfaces.md](references/other-surfaces.md).
- About to install from a source the project has not used before → confirm with the user first.

## 1. Turn the words into requirements

Split the request before searching. Example: "a workflow execution timeline
with running, failed, retrying and completed states, expandable logs, and links
to job details."

| Kind | From that request |
|---|---|
| What it is | A vertical list of ordered events with per-event detail |
| States it must carry | running, failed, retrying, completed, and the empty list |
| Behaviour | expand and collapse a row, keyboard reachable, a link out of each row |
| Data shape | an ordered array with status, timestamps, a log body, a job id |
| Density | the real case: how many steps does a long run have? |
| Visual | matches the product's existing list and status conventions |

Name the category in the words other people use. A "workflow execution
timeline" is catalogued as a timeline, a stepper, an activity feed or a log
viewer. Search every plausible name. `https://component.gallery` settles what a
component is usually called and what it usually does.

## 2. Search the project first

```bash
rg -l --glob '!node_modules' -i 'timeline|stepper|activity' --glob '*.tsx' --glob '*.jsx' --glob '*.vue'
```

Where the repository has a code index, ask it before grepping. Read the
project's `components.json`: its `registries` field names the registries the
project already accepts.

## 3. Search the registries

The search script lives in the design-the-ui skill, a sibling of this skill's
folder. Run it by its full path, so it works from any working directory:

```bash
node "<this skill's folder>/../design-the-ui/scripts/find-components.js" timeline stepper activity --limit 20
```

`<this skill's folder>` is the base directory shown when this skill loads.
`--help` lists every option. The ones that matter:

- `--curated-only` searches only the sources in
  [sources.json](../design-the-ui/sources.json). It is not a licence filter:
  some entries carry no licence that was read, so read the licence on every
  hit before you ship it.
- `--registries <n>` widens the long tail.
- `--type any` adds blocks, hooks and whole pages to `registry:ui`.
- `--json` returns a machine-readable result.

When the script's coverage is not enough:

- `pnpm dlx shadcn@latest search @namespace --query <term>` asks one registry
  directly, including one that filters server-side.
- The shadcn MCP server, where it is already configured.
- `https://21st.dev/community/libraries`, when the user names a library rather
  than a component.

## 4. Read the candidates

For each serious candidate, read the real thing:

```bash
pnpm dlx shadcn@latest view @namespace/name     # the files, deps and code
curl -s "https://<registry>/r/<name>.json" | jq '.dependencies, .files[0].content' | head -60
```

In the code, look for: the states it really implements; status carried by
colour alone; keyboard and focus handling; whether it owns its data fetching;
how much of the stack it assumes; how many dependencies it adds. Open the live
preview on the source's own page for the dense case and the failure state.

## 5. Rank by suitability

An earlier row beats a later one. A component that fails one of the first three
is out, whatever it looks like.

| # | What | How to judge it |
|---|---|---|
| 1 | Does it do the job | Every state and behaviour from step 1, or a clear seam to add the missing one |
| 2 | Licence and cost | Read the repository's own `LICENSE` file, not GitHub's label. "MIT + Commons Clause" allows use in a product but forbids shipping the component in a template or kit. AGPL, a paid tier or no stated licence: ask the user before it ships |
| 3 | Stack fit | Same framework, styling system and component base. A Base UI component inside a Radix product is a second system |
| 4 | Design-system fit | Does it take the `DESIGN.md` colour, type, radius and spacing tokens, or hard-code its own? Its own palette spreads drift to every screen it lands on |
| 5 | Accessibility | Keyboard operable, named controls, status never by colour alone, focus visible |
| 6 | Responsive behaviour | Check at 375px, not only on the desktop preview |
| 7 | Customer usability | Does it suit the real density and labels, or only the demo's six tidy rows |
| 8 | Source quality | Readable code, a stated version, and a maintained repository: read the package page (for example npm) and the README for a deprecation, "security fixes only" or "use X instead" notice, and state what it says in the recommendation. A recent release can be a security-only release |
| 9 | Install cost | New dependencies, peer versions, a build step, a font, a licence key |
| 10 | Maintenance | Copied code is code the project now owns. Prefer fewer, larger, well-built pieces |

Recommend one, in two to four lines. Name the runner-up and what would make it
the better choice. Where nothing fits, say what each candidate lacked and
propose building it from primitives the project already has.

## 6. Install, integrate, verify

```bash
pnpm dlx shadcn@latest add @namespace/name --dry-run   # see what it writes
pnpm dlx shadcn@latest add @namespace/name
```

Map it onto the project's tokens, render it with real data and the dense case,
and walk it with `review-the-ui`. A component never rendered in this product
has not been evaluated.

## Report

- The requirement, as split in step 1.
- What the project already had.
- The candidates read: exact names, the source page, the registry item URL and
  the install command.
- The ranking, and the one recommended, with its licence as read and its tier.
- Which links you fetched, and which are inferred.
- What is unverified: a preview not opened, a licence not read or not stated.
