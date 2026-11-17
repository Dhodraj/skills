# Interrogation of the three UI skills, 2026-11-17

Eight findings, every one reproduced on `54317a9` by a run recorded here. Four
are holes in `measure.js`. Three are test assertions that pass whether or not
the thing they name is true. One is a prose claim the data contradicts.

Nothing is fixed yet. The decision on what to fix is open.

## Method

An adversary subagent found these against `a6fe23c`, one generation back. Each
was then rerun here against the current tree. `measure.js` is byte identical
between those two commits, so no finding rests on the older code.

The browser runs served a copy of `ui/` over `127.0.0.1` and loaded the real
`measure.js` with `eval(await (await fetch(...)).text())`. The server is
stopped.

One error of my own, recorded because it nearly dropped a true finding. My
first run of finding 3 returned `clipped: 0`. The cause was my own scratch
copy, which still held the mutation from finding 7. I restored the fixtures
after that test, but not the script. With the real file the count is 8.

A measurement is evidence only when the file under test is known to be
unmodified. Every later run checked that first.

## Four holes in measure.js

### 1. A translucent text colour is dropped from the contrast check

`ui/ui-design/scripts/measure.js:139`:

```js
if (!foreground || foreground.a < 1) continue;
```

A probe held two paragraphs of 16px text that look identical on screen. One
was `rgba(0, 0, 0, 0.18)`. The other was the solid `rgb(209, 209, 209)` it
composites to. The run returned:

```
contrastFailures:   [ { selector: "p.faint-solid", ratio: 1.53, required: 4.5 } ]
contrastUnmeasured: []
counts: { contrastFailures: 1, contrastUnmeasured: 0 }
```

Required: both paragraphs in `contrastFailures`, or the translucent one in
`contrastUnmeasured`. It is in neither, so it leaves no trace in any count.

`gates.md` rule 5 is a Floor rule and is never waivable. The script's own
stated limits say contrast comes back unmeasured only for text over an image
or a gradient. A translucent `color` is not in that list. Every
`text-white/60` and `text-black/40` takes this path, so the commonest way to
write faint text is the one way the script cannot see.

### 2. A value attribute makes a text input count as named

`measure.js:193` returns `getAttribute("value")` as an accessible name.
`measure.js:232` adds a field to `placeholderOnly` only when it has no name,
so one attribute suppresses two Floor checks at once.

Two text inputs, neither with a label, both labelled only by a placeholder.
One carried `value="you@example.com"`. The run returned:

```
unnamedControls:       [ '<input type="text" name="phone" placeholder="Phone number">' ]
placeholderOnlyFields: [ { selector: "input", placeholder: "Phone number" } ]
```

Required: both inputs in both lists. The prefilled one is in neither.

Under HTML-AAM, `value` is a name source for `input type=button`, `submit`
and `reset` only, never for a text field. `gates.md` rule 7 is Floor and says
a placeholder is not a label. Any prefilled field in an edit form, a settings
page or a restored draft hides from both checks.

### 3. The visually hidden table header reports 8 clipped faults at 375

`ui/ui-design/tests/fixtures/dashboard-after.html:123` keeps the table
headers for a screen reader while the rows become blocks at phone width:

```css
thead { position: absolute; width: 1px; height: 1px; overflow: hidden;
        clip: rect(0 0 0 0); white-space: nowrap; }
```

At 375 by 812 the run returned:

```
clipped: 8, tightInsets: 1, unevenPadding: 1, nearTangents: 3, wrappedUnits: 0
all 8 clippedBy thead:  tr over 270.5,  th over 43.5
thead box 1.0x1.0,  its tr 1.0x271.5,  seven th of 32.0x36.5
```

The same page at 1440 returns zero of all five, which matches the recorded
figure.

Required: zero `clipped`. Nothing is sliced on screen. The header is hidden
on purpose and its only reader is the accessibility tree.

`ui-review` defines `clipped` as a mark sliced by a container that hides
overflow, exempt only when marked `data-crop`, and calls a confirmed clip a
Warning. The three innocent explanations it lists do not include this
pattern, and the fixture carries no `data-crop`. A reviewer who follows the
skill at 375 files up to 8 Warnings against the markup on the page that
exists for accessibility.

### 4. Every control under 44px is a small target

`measure.js:223` flags anything below 44 by 44, whatever the width, the
pointer or the context.

On `dashboard-after.html` at 1440:

```
interactive: 9,  smallTargets: 9
input#run-search 200x36 | button.iconbtn 43x36 | button.rowbtn 57x36  (and six more)
```

Required: no finding. `gates.md` rule 11 reads 24 by 24 minimum, and 44 by 44
wherever a thumb is expected. A pointer first console at 1440 is not that.

Nine of nine controls are flagged on the page the skill presents as built to
its own rules, so the signal carries nothing. `ui-review` then tells the reviewer not to flag a dense
32px control row on a pointer first console. The reviewer therefore discards
every row the script returned.

## Three test assertions that prove nothing

Baseline is `93 passed, 0 failed`. After each mutation below, the suite still
printed `93 passed, 0 failed`.

| Assertion | What it greps | What I broke |
|---|---|---|
| `run.sh:125` `hasnt "the after fixture has no colour-only status"` | `class="dot`, a class the after fixture never uses | deleted the word `Late` beside a coloured mark, which breaches Floor rule 8 |
| `run.sh:137` `has "the geometry fixture hides an overflowing avatar"` | `overflow: hidden`, a CSS rule | deleted the overflowing avatar and left the rule |
| `run.sh:148` `has "measure.js reports $fault"` | `clipped: clipped.length` in the source | gutted the detector loop to `for (const element of [])` |

The third covers all five geometry detectors, so every one of them can break
and the suite stays green. `run.sh:7` says the browser checks live in the
testing report instead. That file is a record of one session, not a check
that runs.

## One prose claim the data contradicts

`ui/ui-find/SKILL.md:57` says `--curated-only` searches only the read and
licensed sources.

```
node ui/ui-design/scripts/find-components.js data table --limit 5 --curated-only
@uiarc    sortable-data-table    28    not stated on the site's pages that were read
```

The top hit has no licence. A census of `sources.json` covers `components`, `screens` and `patterns`. It
gives 19 entries, of which 6 have no licence read. They are `@uiarc`,
`@23rd`, `@aceternity`, `component-gallery`, `21st`, and
`primer-ui-patterns`, whose licence reads `not read`.

`check-sources.js:46` requires the `licence-read` field to exist and never
reads its contents, so the file passes clean:

```
sources.json: 19 sources (11 searchable), 8 rejected, no problems
exit=0
```

`ui-find`'s own rank criterion says an unstated licence needs the user's
decision before it ships. The flag description is what tells an agent that
decision was already made.

## What was not covered

- The adversary on rules against each other reported nothing. It died at a
  rate limit while checking `tactile.md`'s override list, and was stopped
  because the paths moved under it.
- The coverage matrix, which was to find what the skills never name rather
  than what is broken, never started. Six gaps are candidates, named without
  a run. They are right to left, dark mode as a reviewed state, form
  validation depth, a performance budget, print, and email. `ui-find` also
  has no tests, while `ui-design` has 93.

## Open decisions

1. Which findings to fix, and in what order.
2. What becomes of `shared/docs/restructure-plan.md`, which still says
   `skills/ui` in seven places and does not know about `review/` or
   `orchestration/`.
3. Whether to relaunch the coverage matrix.
