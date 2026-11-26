# Installing and invoking

## What is here

```
ui/
  design-the-ui/
    SKILL.md                     the entry point and the eleven stages
    NOTICE                       what was borrowed, from where, under which licence
    sources.json                 sources by reuse tier, with the licence as read
    references/
      design-system.md           the DESIGN.md format, and both routes into it
      gates.md                   the floor, in three tiers: floor, reflex, finish
      product-thinking.md        business, customer and product questions; evidence rules
      styles.md                  thirteen styles with their values, picked from the gallery
      directions.md              naming the three live variants, the numbers
      tactile.md                 style 13 in full, loaded on a pick
      craft.md                   depth, motion, optical correctness: the layer under layout
      motion.md                  one motion library per project, springs, reduced motion
      markup.md                  semantic HTML; content stays in the DOM whatever the motion
      slop-signs.md              the signs of a generated-looking interface, and their fixes
      figma.md                   building a section from a Figma frame
      3d-scene.md                keeping a 3D scene fast, loaded only for 3D work
      journey-and-states.md      the journey table and the states a fixture hides
      playwright.md              browser mechanics, and what is blocked here
      regression.md              not breaking what worked
    scripts/
      find-components.js         searches 500+ registries, prints candidates
      measure.js                 measures a rendered page, in the browser
      check-sources.js           validates sources.json
      covered.js                 lists visible controls another element covers
      frames.js                  samples an element's position on every frame
      style-gallery.js           writes a page showing every style in the client's brand
    tests/
      run.sh                     the offline tests; add --network for the rest
      fixtures/                  the dashboard before and after, a landing page, the geometry faults
  find-a-component/SKILL.md               find a component instead of writing one
  match-the-prototype/
    SKILL.md                     build or check a screen against its approved prototype
    references/pairs.md          the pairs file that both scripts read
    scripts/
      plan.js                    prints the Playwright MCP calls that capture each state
      capture.js                 measures the first and settled frames, in the browser
      compare.js                 lists every difference into differences.md
      pairs.js                   reads the pairs file
    tests/match.test.js          the scripts on hand-written frames, run by run.sh
  review-the-ui/
    SKILL.md                     review what exists, in two modes and two scopes
    references/
      changes.md                 reviewing a change rather than a screen
      copy.md                    the rules for interface copy
      performance.md             motion that is right and still drops frames
  README.md                      the four skills, grouped by how they start
review/
  tear-it-apart/SKILL.md          a staff engineer's review, round by round
  check-the-instruction/SKILL.md  test a change to a rule, skill, hook or setting first
  README.md                      the bucket's skills
orchestration/
  remember-my-words/SKILL.md     keep the user's constraints in a file
  grill-the-implementation/SKILL.md  settle the technical implementation details
  who-builds/SKILL.md            pick the model for each sub-agent
  README.md                      the bucket's skills
shared/
  scripts/
    link-skills.sh                 symlink every skill into the local skill directories
    list-skills.sh                 print every SKILL.md path
  brand/
    banner.svg                     the README banner
    social-preview.png             the same design, for GitHub's social preview
  docs/
    decisions/
      adr-0001-architecture.md     why this shape
      adr-0003-pick-the-look-from-live-variants.md  the look is picked from live variants
      restructure-plan.md          the plan to adopt the upstream skills layout
    guides/
      install-and-invoke.md        this file
      examples.md                  worked invocations
      maintenance.md               adding a source, refreshing the research
    research/
      source-research.md           every supplied url, read on 2026-10-27, with four later rounds
      ab-test.md                   one prompt built with and without design-the-ui
      testing-report.md            what was run and what came back
    images/                        figures the docs and READMEs show
  demo/
    ab/                            the two A/B builds and their screenshots
    console/
      console.html                 a dispatch console built through the stages
      landing.html                 its public page, same direction
      console-shot.png             the console, used as the landing page's proof
      console-plain.html           the same console before the craft pass
      console-light.html           the craft pass before the dark band
```

Some skills call skills from the mstack and pstack packages. The README's
Install section lists which. When one is missing, the skill does that step
itself and says which skill was missing.

`shared/demo/` is not part of the skill. It is what the skill produced, kept so the
output can be looked at, and so `console-plain.html` can be put beside
`console.html` to see what the craft pass changed. Serve it over HTTP — the
Playwright MCP server blocks `file:` urls:

```bash
cd shared/demo/console && python3 -I -m http.server 8731 --bind 127.0.0.1
```

## Install

### Every project on this machine

```bash
./shared/scripts/link-skills.sh
```

It symlinks every skill, at `<bucket>/<name>/`, into `~/.claude/skills` and
`~/.claude-personal/skills`. A symlink means a `git pull` updates the
installed skill. Re-run it after you add, remove, or rename a skill.

To copy instead of linking:

```bash
cp -R "$REPO/ui/design-the-ui" ~/.claude/skills/
cp -R "$REPO/ui/find-a-component" ~/.claude/skills/
cp -R "$REPO/ui/review-the-ui" ~/.claude/skills/
```

On this machine `~/.claude` is installed from `~/Claude-System`, so the right
move there is to copy into `~/Claude-System/claude/skills/` and run
`./install.sh`. That is a change to a shared runtime: ask first.

### What it needs

| Need | Why | Without it |
|---|---|---|
| Node 20 or newer | the two scripts | no component search, no measuring |
| Network | the registry directory and catalogues | `--curated-only` still works from the cache; the rest of the skill is unaffected |
| A Playwright MCP server | stages 8 and 9, `match-the-prototype`, and the companion skills that use a browser | fall back to headless Chrome for renders; interaction is not possible, and the report says so. `match-the-prototype` stops |

Check the browser before relying on it:

```bash
claude mcp list                     # playwright: ... ✔ Connected
ls ~/Library/Caches/ms-playwright   # a chromium build
```

To add the server if it is missing:

```bash
claude mcp add playwright -- pnpm dlx @playwright/mcp@latest
```

Adding an MCP server is a dependency. Ask the user first.

### Better with, not required

| Skill | What it adds | Install |
|---|---|---|
| `ui-ux-audit` | a deeper measuring script and 16 category references | `cp -r ui-ux-audit ~/.claude/skills/` from EnchStyle/ui-ux-audit-skill; needs Python Playwright |
| `design-taste-frontend` | art direction for a public page, from a researched library | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` |
| `customer-research` | the method for real customer evidence | the marketingskills plugin marketplace |

Each is the user's decision, and each is referenced rather than required.

## Invoke

By name:

```
/design-the-ui
/find-a-component
/review-the-ui
```

Or in plain words, which is what the descriptions are written for:

| Say | What runs |
|---|---|
| "Build the run list screen for dispatchers" | the entry point, at screen depth |
| "Find me a timeline component with expandable logs" | `find-a-component` |
| "Does the signup flow work on a phone?" | `review-the-ui`, which walks it |
| "Audit this dashboard" | `review-the-ui`, review-only |
| "Audit this dashboard and fix what you find" | `review-the-ui`, review and fix |
| "Make this screen modern" | `design-the-ui`, in full |

## Run the scripts directly

```bash
S=ui/design-the-ui

node $S/scripts/find-components.js timeline stepper --limit 15
node $S/scripts/find-components.js data table filter --curated-only
node $S/scripts/find-components.js chart --type any --registries 25 --json
node $S/scripts/find-components.js button --refresh        # ignore the day-old cache

node $S/scripts/check-sources.js                            # shape only
node $S/scripts/check-sources.js --links                    # also ask every url

$S/tests/run.sh
$S/tests/run.sh --network
```

The search caches the directory and each catalogue for a day under
`${XDG_CACHE_HOME:-~/.cache}/product-experience`.

## Measuring a page

1. Start the application, or serve a static page over HTTP: the MCP server
   blocks `file:` urls.
2. `browser_navigate` to it, then `browser_resize` to 1440 × 900.
3. `browser_evaluate` with the whole contents of `scripts/measure.js`, and a
   `filename` inside the workspace such as `.pxe-audit/measure-1440.json`.
   Paths outside the workspace root are rejected.
4. For each further width: `browser_resize`, then `browser_evaluate` with
   `() => window.pxeMeasure()`. A page reload clears it; paste the file again.
5. `browser_take_screenshot` at each width, and open every image.

Add `.pxe-audit/` to the project's `.gitignore`.
