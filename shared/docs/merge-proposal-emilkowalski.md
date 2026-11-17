# Proposal: take three things from emilkowalski/skills

Source read at `64eb3de`, dated 2026-11-15. MIT, Copyright (c) 2026 Emil
Kowalski. He is already a credited source in `craft.md` and in `NOTICE`.

**Status: applied on 2026-11-17.** The first draft of this
file proposed 103 lines. An instruction check cut it to about 12 and found
three blocking conflicts. This version is the reduced set. The errors in the
first draft are recorded at the end, because two of them were mine rather
than the source's.

## What the check returned, per group

| Group | First draft | Verdict |
|---|---|---|
| A, motion | 25 lines | apply 4. Drop the frequency table, the keyboard prohibition and the drawer curve |
| B, performance | 60 lines | apply, moved from `ui-design` to `ui-review`, with three corrections |
| C, worst-case data | 18 lines | apply 2 bullets, moved into `journey-and-states.md`. Drop the rest |

## Group A: apply four lines

`transform-origin` appears nowhere in `ui/`, so a popover scaling from its
centre is a real and uncovered miss. Add to the `## Motion` list in
`craft.md`:

```markdown
- **Scale a popover from its trigger, not its centre.** Set
  `transform-origin` from the trigger's position, which Base UI and Radix
  both expose as a variable. A modal is exempt, because it appears in the
  middle of the viewport, so `transform-origin: center` is correct there.
```

The frequency idea is already in `craft.md`, under
`## Entrances, and where they are allowed`, so it gates entrances rather than
all motion. Widen that paragraph in place rather than adding a table:

```markdown
Frequency decides how much motion is allowed, before any curve or duration,
and it applies to every kind of motion, not only an entrance. An arrival the
customer meets once, such as a first paint, a success state or an empty
state, can be staged. A repeated interaction cannot. A row hover, a
keystroke, a tab change or a command palette costs attention on every
trigger, so it gets instant feedback, or a colour or opacity change under
150ms, with no travel, blur or stagger. Anything the customer triggers all
day takes the settled end of every range below.
```

Dropped from the first draft, with the reason:

- **The frequency table.** It restates the paragraph above. Its thresholds,
  "100+ times a day" and "fifty times a day", are measured nowhere in either
  repository.
- **"Never animate a keyboard-initiated action."** It contradicts the line it
  was meant to join, which allows a colour or opacity change under 150ms on a
  keystroke. It also contradicts the press rule, which keeps `scale(.96)` on
  press even under reduced motion. And in `tactile.md`, Enter or Space closes
  a sheet that then animates for 200ms.
- **The drawer curve.** `tactile.md` already carries
  `ease-drawer | cubic-bezier(.32, .72, 0, 1)`. Putting it in `craft.md` would
  supersede `adr-0001-architecture.md:131`, which says one house's taste
  belongs in a direction file.

## Group B: apply, in ui-review

Seven of the eight symptom rows diagnose motion that already drops frames,
which is review work. The file goes to `ui/ui-review/references/performance.md`
and is read at `ui-review` step 5, with one pointer line in `craft.md` after
the property rules.

Three corrections to the first draft:

1. The opening line named a stage that does not exist. It names
   `ui-review` step 5 instead.
2. "A 120Hz screen, which is most phones now" is a population claim with no
   source. The sentence keeps the two numbers and drops the claim.
3. `will-change` was gated on "measured dropped frames", which nothing here
   can produce: `measure.js` measures geometry and `playwright.md` films
   motion without timing it. The rule needs a stated fallback, which is the
   visible pixel shift at the start or end of the motion.

Content is otherwise as drafted. It covers the symptom table and the frame
budget of 16.7ms and 8ms. It covers writing to `ref.current.style` rather
than state, and the inherited CSS variable trap. It caps an animated blur at
20px, and puts `will-change` only on the element that animates.

## Group C: apply two bullets

Fold into the real-data list in `journey-and-states.md`, where real names
already live, rather than opening a block in `craft.md`:

```markdown
- A name in a script that is not Latin: stacked diacritics that a tight
  `line-height` with `overflow: hidden` clips, a CJK name with no spaces, so
  initials logic that splits on a space finds one word, and an Arabic name
  that needs `dir="auto"` or the punctuation lands on the wrong side.
- A name that starts with an emoji. `.charAt(0)` returns half a surrogate
  pair. A joined sequence has a `.length` of 5 or more, and 7 once a skin
  tone joins it, so slicing by index cuts it into pieces. Count and slice
  with `[...value]`.
```

Dropped, with the reason:

- **"Absent".** `craft.md` already says a missing or null value takes an en
  dash in the faint ink, never an empty cell and never `0`.
- **The one-character bullet.** Its consequence is real: a bare `J` at the
  body floor renders about 8px wide, which breaches the 24px target floor.
  But the remedy is already in `craft.md` under Hit areas, so the bullet
  would be a restatement unless it cited both.
- **The worst-case toggle paragraph.** `journey-and-states.md` already
  demands real fixtures, so the paragraph adds only "behind a toggle".

## What has to follow

1. Thirteen checks in `ui/ui-design/tests/run.sh`, each failing without its
   text, including two that fail if the drawer curve or the absent-value rule
   is duplicated into `craft.md`.
2. `NOTICE` needs a sentence rewritten, not only a new entry. It currently
   says none of this source's guidance beyond the motion section is reused,
   and group B makes that false.
3. The new reference listed in `README.md` and in the install guide.
4. The run figures in the testing report.

## Errors in the first draft of this file

Recorded so the next session does not repeat them.

- It claimed nothing gates whether a thing may animate. `craft.md` already
  does, in the entrances section, and names a keystroke.
- It proposed a rule that contradicted the line it was joining.
- It proposed a curve `tactile.md` already carries.
- It said a joined emoji has a `.length` of 7 or more. Measured with
  `node -e`, a two-person sequence is 5. Seven needs a skin tone.
- It proposed a rule for the absent value that `craft.md` already states.
- It counted itself at 67 lines. The code blocks measure 103. In a proposal
  whose argument is load, that was the worst of the six.
- It cited `.out-of-scope/one-house-style-for-every-rule.md`, which did not
  exist. The file was planned in the restructure plan and never written. All
  thirteen rejection files were written on 2026-11-17, so the citation is now
  true. The argument it carries belongs to `adr-0001-architecture.md:131`.
