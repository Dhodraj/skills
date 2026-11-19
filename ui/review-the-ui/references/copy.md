# Copy, decoration and charts

Read every visible string and every decorative element on the surface, and
tag each problem with the rule it breaks. The rules live in
[gates.md](../../design-the-ui/references/gates.md); this file is the order to
check them in and the cases they miss. The checks are adapted from
`felipebasurto/unslop-ui` (MIT); its rule ids are kept in brackets so a finding
can be traced. [NOTICE](../../design-the-ui/NOTICE) records what was taken.

A good interface is used, not read. Keep the words a person needs to act.
Interface strings are checked here; long-form prose goes to the writing skill.

## Interface copy

| Check | Rule |
|---|---|
| Small capitals or tracked text above a heading, as a pill with a dot, or as a caption over a menu (U1) | gates 30 |
| `01 02 03`, `§` or `//` before items whose order the customer does not follow (U2) | gates 31 |
| A subtitle under every heading, or a blurb under every item of a list whose names already tell the items apart (U3) | gates 47 |
| A caption that narrates what the element visibly does, a design note, or an instruction on how to read a chart (U4, U5, U13) | gates 51 |
| Facts chained with `·` or `\|` ("12 items · Updated 2m ago · Synced"): keep the one the customer acts on (U6) | gates 32 |
| A label that repeats the placeholder, the icon, the button or the heading (U7) | gates 47 |
| A staccato slogan ("Built different.") (U8) | gates 43 |

## Decoration

The test for real state: the element renders from a condition or a value (a
prop, `status === "online"`, a query result). Markup that always renders with
fixed text is decoration.

| Check | Rule |
|---|---|
| A badge or pill ("LIVE", "NEW", "AI") that fails the real-state test (U9). A fixed "Beta" states a product fact, not live state, and stays | gates 3, and gates 31 |
| A pulsing or coloured dot beside text that fails the real-state test (U10). A skeleton's pulse is not a status dot | gates 3, and gates 32 |
| A status word claiming live state ("Synced", "All systems operational") that fails the test (U6) | gates 3 |
| An emoji or icon in a heading, button, KPI label or feature list, or an icon in a tinted square (U11) | gates 26 and 27 |

An icon stays where it is the control itself (an icon button with a name),
where it carries meaning the text does not, or in a toolbar or action menu
where every item has one. A generic pictograph beside each destination in a
menu says nothing the name does not, and is decoration.

A fixed badge or dot that claims a live state is a false result, so it is a
Floor finding: at least Critical. Decoration that claims nothing is a Warning.

## Charts and dashboards

All under gates 52.

| Check | Fix |
|---|---|
| The title names the chart type ("Bar chart of monthly revenue") (U12) | "Monthly revenue". A chart of fixed data may state its finding; one fed by live data keeps the neutral title, because a finding goes stale |
| One value carried by a bar, a printed number, a gridline and a tick; or a KPI with an arrow, a percentage, the word "up" and a sentence (U14) | One encoding per quantity. A KPI keeps its figure, one direction cue and the period it compares against |
| A frame, dark gridlines, minor ticks, 3D, shadows or glows on marks (U15) | Remove them, or a hairline in a light grey. Same chart type, same data, same colours |
| A legend for four series or fewer (U16) | Label each series at its end or beside its bar, ideally with its latest value |

## When fixing

In review-and-fix mode, deleting is the default fix. A rewrite may state only
what the product already shows: its own copy, its feature names, the data
bound to the screen (gates 1).

- Delete what existed only for the element you removed: an empty wrapper, a
  margin, an unused import.
- Never delete an `aria-label`, an `alt` or screen-reader-only text. Where the
  cut text was the only accessible name, move it into `aria-label`.
- A field keeps its visible label (gates 7).
- Text from data, translation files or a CMS is fixed at its source, or
  reported. Never hard-code a replacement in the component.
- A disclosure the product must show (AI use, a legal notice) stays; report
  it if it looks like decoration.
- A claim you cannot verify from the code (a customer count, uptime, a
  rating) is reported for the owner, not deleted or rewritten.
- A screen with nothing to cut is a result. Say so and change nothing.
