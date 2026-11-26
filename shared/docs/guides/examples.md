# Four worked invocations

Each shows what to say, what the skill does, and what comes back.

## 1. A new product surface

> Build the operations console for Consign. Dispatchers watch runs against a
> schedule and move the ones that are slipping.

**Depth**: a new surface, so stages 0 to 10 in full. Nothing is built until the
user picks a live variant.

**Stage 0** reads the repository, then finds the live brand: the live site,
its repository or a brand file.

**Stage 2** writes the outcome and criteria a browser can check:

```
Outcome    A dispatcher sees which run is late and reassigns it without
           leaving the list.
Accept  1  The late count is the largest thing on the screen.
        2  Every run's status is readable without colour.
        3  At 375px every run's reassign control is reachable, no sideways
           scroll.
        4  The empty state says what to do first.
```

**Stage 3** takes colour, type and imagery from the live brand. With no brand,
the user picks a style from the gallery. The `prototype` skill then builds
three live variants beside the real header and navigation, with sample data
marked as sample. Each variant has its own layout, hierarchy and primary
action:

```
A  Control room   one dense table, late runs pinned on top, reassign in the row
B  Timeline       runs on a schedule axis, the late ones drawn past their deadline
C  Inbox          one late run at a time, with its reassign choices beside it
```

The skill gives the address and stops. The user flips through the variants in
the browser and picks one. The picked variant stays in a lasting mock folder,
and `DESIGN.md` records its values and the mock's address.

**Stage 7** builds the picked variant with `match-the-prototype`. A screen no
prototype draws is composed whole in one pass. Then `find-a-component` swaps in
the project's own components. Last, every state from stage 4 is built: empty,
one item, many, loading, partial failure, error, no permission.

**Stages 8 and 9** start the application and walk the journey as a
dispatcher. The review reads `gates.md`, `craft.md` and `markup.md`, and
checks the built screen against them. It measures, then fixes in severity
order until a pass finds nothing new.

**Stage 10** reports what was verified, by what means, at which widths, and
what was not.

### The build matches the mock

> Build the runs screen from the approved mock.

`match-the-prototype` lists every state from the mock and from the product,
then builds from the mock's markup, styles and words. `plan.js` prints the
Playwright MCP calls that capture both sides. `compare.js` lists every
difference:

```
| state | width | frame   | element         | prototype | product | difference                    |
| many  | 1280  | settled | late count: font-size | 40px | 32px    | not the same                  |
| many  | 1280  | first   | first row       | drawn     | absent  | product lacks it              |
```

The screen is done when the table is empty, or the user has ruled on each row
left.

## 2. Find a component

> I need a modern workflow execution timeline with running, failed, retrying
> and completed states, expandable logs, and links to job details.

`find-a-component` splits that into requirements, searches the project, then:

```
$ node ui/design-the-ui/scripts/find-components.js \
    timeline stepper activity --limit 10 --registries 16

@stepper   stepper              15  not read: check at the source
    A lightweight, composable stepper primitive for shadcn/ui-style multi-step flows.
   deps: @radix-ui/react-slot; files: 1
    read: pnpm dlx shadcn@latest view @stepper/stepper
@reui      timeline             13  MIT
   deps: @base-ui/react, cn; files: 1
    read: pnpm dlx shadcn@latest view @reui/timeline
@uiarc     timeline             13  not stated on the site's pages that were read
    Follow what happened, newest first, grouped by day.
   deps: lucide-react, motion; files: 2
    read: pnpm dlx shadcn@latest view @uiarc/timeline
...
searched 24 registries for: timeline, stepper, activity
licences marked "check at the source" were not read; read one before shipping a component
```

Then it reads the two serious candidates, rather than ranking from the
descriptions, and reports:

> `@uiarc/timeline` is the only candidate that already does what you
> described: a `detail` slot per row wired with `aria-expanded` and
> `aria-controls`, a status tone per event, keyboard handling on the list, and
> motion that honours `prefers-reduced-motion`. Its source even carries the
> rule you would otherwise have to add: "Always say the outcome in the title
> too, so it never rests on color."
>
> One thing stops me recommending it outright: **its licence is not stated**
> on any page I read, and it brings `motion` and a motion-tokens item with it.
> https://uiarc.dev/r/timeline.json
>
> `@reui/timeline` is MIT, verified at `keenthemes/reui`, but it is a stepper
> with an `activeStep`, not an event log, and has no status and no expandable
> detail. Using it means rewriting most of it.
> https://reui.io/r/default/timeline.json
>
> Which do you want: Arc with its licence question settled first, or a
> timeline composed from the `@shadcn` primitives this project already has?

## 3. Audit something that exists

> This dashboard looks off. Can you check it?

`review-the-ui` opens with the mode, because that is the thing most easily
got wrong:

> Mode: audit only. I will not change any files.

Then it measures at 1440, 1024 and 375, opens every screenshot, walks the main
journey, and reports findings in severity order, each with its kind and its
evidence:

```
C1. Run status shown by colour alone  (.run-row .dot, 40 rows)  [accessibility]
Found:  a coloured dot with no word or shape; amber measures 2.9:1 against
        the row background
Why:    a colour-blind dispatcher cannot tell a late run from a running one,
        which is the screen's whole job
Fix:    add the status word beside the dot, and give each status its own shape
Evidence: .pxe-audit/shot-1440.png, measure-1440.json contrastFailures[3]

W2. Twelve equal tiles, nothing dominant  (.tiles)  [product]
Found:  twelve figures at one size; the late count is the fourth of twelve
Why:    the screen does not say what to do first, so the dispatcher scans
        instead of acting
Fix:    make the late count the dominant figure; the rest become one quiet row
```

It ends with what is sound, so the next session does not undo it, and at most
three questions. It does not start editing.

## 4. Walk a journey

> Does the trial signup work on a phone?

`review-the-ui` finds or starts the application, writes the journey down before
walking it, then drives it at 375 × 812:

```
JOURNEY: start a 14-day trial — completed
WALKED:  375x812 and 1440x900, signed out, Chromium via the MCP server

STEP 1  hero "Start a 14-day trial"   -> moves to the form           friction none
STEP 2  submit empty                  -> two messages beside their
                                         own fields, focus moves to
                                         the first                    friction none
STEP 3  submit dispatch@yourdepot     -> "missing an @ or a domain",
                                         with an example              friction none
STEP 4  submit a valid address        -> success, names the depot,
                                         says nothing is charged      friction none

STATES: empty n/a · loading not reachable (no request) · error verified ·
        recovery verified · permission n/a
CONSOLE: 0 errors, 0 warnings
NOT VERIFIED: the email is never sent — there is no endpoint on this page, so
              "we have sent the link" is unproven from here
```

That last line is the point of the skill. The journey completes, the claim on
screen is not verified, and the report says which is which.
