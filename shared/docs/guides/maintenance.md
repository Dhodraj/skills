# Maintenance

Three things go stale here: the component sources, the research behind the
verdicts, and what the browser tooling allows. Each has an owner in the files
below.

## Add a component source

One object in the `sources` array of `sources.json`, placed with the others of its tier:

```json
{
  "id": "@example",
  "url": "https://example.dev",
  "tier": "use",
  "kind": "component",
  "registry": "https://example.dev/r/{name}.json",
  "for": ["table", "filter"],
  "stack": "react+tailwind+shadcn",
  "licence": "MIT",
  "licence-read": "example-org/ui LICENSE, 2026-11-14",
  "install": "pnpm dlx shadcn@latest add @example/<name>",
  "notes": "What it is good for, and what it is not."
}
```

Rules the validator enforces, and why each exists:

- `tier` is one of the five that `tiers` in `sources.json` defines: `use`,
  `credit`, `check-licence`, `inspiration` or `browse-only`. The tier says what
  may be copied, so an entry without one cannot be used safely.
- `kind` is one of the known kinds, such as `component`, `screen` or `motion`.
- A `check-licence` entry needs `condition`: what the user must check before
  anything from it ships.
- A `credit` entry needs `credit`: where the attribution goes.
- `licence-read` is required. A licence with no note saying where it was read
  cannot be told apart from a guess, and a guessed licence is the one that
  reaches a client.
- `registry` must contain `{name}`; it is a template the search fills in.
  Leave it out for a source you copy from by hand, like hyperui.
- Check which `type` the catalogue's items carry. `find-components.js`
  searches `registry:ui` and `registry:component` by default, and a registry
  that files its components under another type answers every request while
  returning nothing. `@astryx` did until 2026-11-12.
- `catalogue` overrides where the catalogue is fetched from. Only needed when
  it is not `<base>/registry.json` — shadcn's own index is at `/r/index.json`.
- A url cannot be both listed and rejected.

Then:

```bash
node ui/design-the-ui/scripts/check-sources.js
node ui/design-the-ui/scripts/check-sources.js --links
./ui/design-the-ui/tests/run.sh --network
```

Check the new source is actually reachable before trusting it:

```bash
node ui/design-the-ui/scripts/find-components.js \
  button --curated-only | grep '@example'
```

If it says `not searched: @example`, the catalogue url is wrong. Fetch it by
hand to find out where it really is:

```bash
curl -sL https://example.dev/r/registry.json | jq '.items | length'
```

## Is the source even needed?

Before adding one, check whether it is already in the public directory:

```bash
curl -s https://ui.shadcn.com/r/registries.json \
  | jq -r '.[] | select(.name | test("example")) | "\(.name) \(.health.status) \(.ranking.itemCount) \(.homepage)"'
```

The directory held 508 registries on 2026-10-27 and the search already covers
the healthy ones. `sources.json` is for sources worth **curating**: where the
licence has been read, where the notes carry something the catalogue does not,
or where the source should be searched first. A registry that is in the
directory and has nothing special to say about it does not need an entry.

## Refresh a source evaluation

Every entry records a date. Re-read a source when:

- The date is more than about three months old.
- `--links` reports a non-200, or `find-components.js` reports it as not
  searched.
- The directory marks it `degraded` or `unavailable`:

  ```bash
  curl -s https://ui.shadcn.com/r/registries.json \
    | jq -r '.[] | select(.health.status != "healthy") | "\(.name) \(.health.status)"'
  ```

- Someone proposes using it at a client. Licences change, and the one in
  `sources.json` is what was visible on a date, not a promise.

When re-reading, update `licence`, `licence-read` and the top-level `updated`
date together. Where a licence has changed, say so in `notes` rather than
quietly overwriting it: the old reading explains decisions already made.

## Refresh the research

`shared/docs/research/source-research.md` carries one date and every verdict. Revisit a
verdict when:

- A source read as **exclude** publishes a licence. rareui.com, originkit.dev,
  beautifului.dev and libraries.dev are all excluded for that reason alone,
  and any of them could become usable tomorrow.
- A skill read as **reference** changes in a way that matters: if
  `ui-ux-audit` stopped needing Python Playwright, the argument in
  ADR 0001 for writing `measure.js` would weaken.
- A free route appears for something currently paid, or a free route closes.
  21st.dev's two-copies-a-day free tier and its paid MCP are both subject to
  change.

Keep the shape: identity, what it is, install and dependencies, cost, licence,
unique contribution, overlap, limitations, verdict. And keep the distinction
between what was read and what was inferred — it is the only thing that makes
the document worth re-reading in six months.

## When the browser tooling changes

`references/playwright.md` states what Playwright MCP 0.0.83 allowed on
2026-10-27: `file:` urls blocked, output paths confined to the workspace root,
no filesystem access inside `browser_run_code_unsafe`. All three are version
behaviour, not laws. Re-check them after an upgrade:

```bash
claude mcp list
```

If `browser_evaluate` ever gains a way to load a function from a file,
`measure.js` stops needing to be pasted and the note about
`window.pxeMeasure` can go.

## Extending measure.js

It returns measurements, never verdicts. Keep it that way: a check that
decides whether something is a problem belongs in `review-the-ui`, where a
human-readable rule can say who it hurts.

For the same reason, never write a stop condition against it. It returns no
verdict, and four of its census counts are never zero on a rendered page, so
"no fault" has nothing to refer to. A loop ends on the Floor list in
`gates.md`, because that is a list a reader can walk.

Worth adding, in rough order of value, each absent today: card rows off a
shared line; sibling control heights; inner and outer corner radii that are
not concentric; grid rows with one lone item; focus indicators removed with
nothing in their place. The last one needs driving
focus through the page, so it belongs with the journey walk rather than with a
single evaluation.

Add the count to `counts`, the sample to the top level, and keep both capped
at `SAMPLE`. The whole return value has to stay small enough to read.

## Extending craft.md

`references/craft.md` holds values, not opinions. A line earns its place
there only if it is a number, a named property, or a rule a reviewer can
apply without arguing. For example: `outer = inner + padding`, `scale(.96)`,
ease-out under 300ms, and never a staged entrance on a repeated
interaction.

Keep two things out. Anything that reduces to taste, and anything that applies
to one framework only. Where `measure.js` measures a craft value, craft.md
still states the rule and marks it **measured**, so the fault and its pixels
carry one name in both places. That replaces the earlier rule that craft.md
leave the measurable parts to the script: a rule nobody reads before the edit
is a rule nobody follows. Changed on 2026-11-12.

When a value is added, say where it was read. The page's attribution section
and `NOTICE` both name its four sources. A value with no provenance cannot be
told apart from a preference.

A value that holds only inside one house style is a third thing to keep out.
It goes to a direction file instead. The test: would the rule still be right
on a marketing page, an editorial surface and a console? An answer of "only on
a console" makes it a density or a style decision.
`references/tactile.md` is the shape such a decision takes here.

Where a source disagrees with a line already on the page, both readings go on
the page. Each one carries the reason it holds, as the shadow-colour
disagreement does. A hidden conflict surfaces later as a rule that looks
arbitrary.

**Known gap, recorded rather than fixed.** Nothing enforces this file. Stage
G tells the agent to read it before every UI edit, then relies on that. The
demo in `shared/demo/` was built to it by hand. `shared/demo/console/console-plain.html` is the
same screen without it, and both pass every automated check. To close this,
copy the shape `taste-skill` uses: make the agent produce three directions,
choose one with a written reason, then judge the result cold against a list
of default looks before calling it done.

## Add or change a style with values

`references/styles.md` holds thirteen styles, and `references/tactile.md` is
the thirteenth in full. Adding one, or changing one:

- **It is shown in the gallery beside the others, never alone and never by
  default.** Add a tile with the same name and position to
  `scripts/style-gallery.js`. `tests/style-gallery.test.js` fails until the
  two lists match. The style must differ from every other style on at least
  two axes of the table in `styles.md`. A style that becomes the automatic
  answer is the default aesthetic. The skill was written to prevent it.
- **Every override is listed in the file, with the rule it overrides.** A
  direction may override a number in `directions.md` or a Reflex rule in
  `gates.md`. `tests/run.sh` checks that each rule a direction claims to
  override still exists under the number it names, for the numbers listed in
  the test. It cannot check that the
  list is complete, so read the numbers table and the Reflex list against the
  direction line by line. The first version of `tactile.md` listed three of
  the nine numbers and three of the five Reflex rules it contradicted.
- **Say where the floor beats the look, rather than claiming it never
  happens.** A borrowed style breaks a Floor rule somewhere. A borderless
  field has no 3:1 edge. A quiet placeholder misses 4.5:1. A 22px icon is
  under 24 × 24, and a height reveal animates `height`. Name each place and
  say what to build instead. "It overrides no Floor rule" is the sentence to
  distrust.
- **The waiver is only legitimate once `DESIGN.md` records it.** That is
  already how `gates.md` works; a direction does not get a second mechanism.
  `review-the-ui` reads `DESIGN.md` first and skips what it allows, so the waiver
  list is also what a review stops looking at. On 2026-11-13 that bullet was
  tightened to exclude the Floor tier, which is what makes the mechanism safe
  to write a whole list into.
- **Say where its contrast fails.** A borrowed palette usually has two or
  three steps that miss 4.5:1. Name those steps, and name what to do instead,
  as the neutral-scale section does. Otherwise a file that looks authoritative
  breaks the Floor rule.

## When the entry point gets long

The eleven stages are the skill. Anything that grows past a short section
belongs in `references/` and is loaded when its stage runs. A companion skill
is justified only when someone would invoke it on its own, and when it would
still be worth invoking alone once the main skill is running. `find-a-component` and
`review-the-ui` pass both tests. `journey-walk` passed the first and failed the
second, so on 2026-11-01 it became stage 4 of `review-the-ui`. Product thinking
failed the first and stayed a reference document.
