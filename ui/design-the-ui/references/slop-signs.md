# Signs of a generated look

Adapted from the signs list in unslop by Damir Sokolovsky
([heydamir/unslop](https://github.com/heydamir/unslop)),
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changed:
reworded in most lines, merged with `gates.md`, and cut where a rule there already says the
same. Keep this credit in any copy of this file. [NOTICE](../NOTICE) records
what was taken.

Use it to audit a screen the user calls generic, dated or AI-made, before
changing anything. Walk every group. Note each sign you find with where it
lives, then fix in this order: spacing, colour, icons, copy, type, layout,
visuals, motion. Each line pairs the sign with its fix. Where a rule in
[gates.md](gates.md) already covers the sign, the line names the rule and the
rule's wording wins.

A `DESIGN.md` value outranks a sign here, as it outranks a Reflex rule.

## Surfaces and colour

- A hue-to-hue gradient on a surface, a button or the active item, or clipped to text → gates.md 23.
- A coloured glow (`shadow-[0_0_20px_rgba(139,92,246,.5)]`, a `drop-shadow` on an emoji, a glowing pill) → remove it. Depth comes from surface steps and hairlines.
- A radial wash or blurred blob behind content → gates.md 31.
- A neon or high-contrast coloured border → a hairline at 6 to 10% opacity.
- Five near-identical tints of one hue for text → three text roles from one neutral ramp.
- Everything highlighted, so nothing leads → gates.md 40.
- A glass card with a white inner highlight and a coloured shadow → a plain raised surface with a hairline.

## Type

- A heading at weight 800 or 900 → 400 to 600, and size for the hierarchy.
- Tracked capitals as a label → gates.md 30.
- Too many sizes and weights on one screen → gates.md 33, and a few sizes from the scale.
- Numbers in mixed formats (`$48,210` beside `$124,860.40`, or `07`) → one format, tabular figures.
- Negative letter-spacing on small text → zero or slightly positive.
- Italic for emphasis → weight or colour instead.

## Icons

- Emoji as navigation, decoration or status → gates.md 26.
- An emoji inside a pill or a count (`18 👤`) → the plain number.
- Icons in several sizes and colours → one size, one stroke, the text role's colour.
- Icons nudged off their column → the same icon box width in every row.
- A sparkle for anything AI → remove it, or a plain icon only where it explains something.

## Spacing

- Arbitrary values (`mt-[13px]`, `h-[31px]`) → steps of the scale. Keep an odd value only where it centres something exactly.
- Rows of one list with different heights or gaps → one height, one gap.
- A group closer to its neighbour than to its own items → smaller gaps inside a group, larger between groups.
- Sibling cards with uneven padding → one padding.
- A large gap above a section and a cramped one below → a balanced rhythm.

## Copy

- A greeting as the headline (`Welcome back, Damir! 👋`) → the page or the period as the title.
- Exclamation marks → a plain statement.
- A change with no reference (`+12%!!`) → `+12% vs last month`.
- A wordy placeholder (`Search anything...`) → `Search`.
- Hype words → gates.md 41.
- A full stop at the end of a label or button → none.
- Fake-looking data (`$123,456`, `[X]`) → gates.md 1: real data, or a labelled empty slot.

## Components

- A glowing pill for a count, a plan, a shortcut or a status → quiet text or a keycap.
- `PRO`, `New ✨`, `Beta 🚀` or `LIVE` badges everywhere → gates.md 3 and 31: keep a badge only where it renders from a state the app tracks. A plain "Beta" that states a product fact stays.
- Every element a full pill, from search to card → radius by size, nested radii concentric.
- A chart with rainbow, glowing or pill-shaped bars, or capitals on its day labels → one or two series, a muted grid, one highlight colour.
- Every series in a shade of the accent, so nothing leads → neutral steps, and the accent on the one series that matters.
- A sparkline or mini bar added to every stat card → the number, its label and its change.
- Equal cards side by side, each with the same chart → one main chart, compact stats, varied widths.
- A logo as a gradient tile with a sparkle, or as a glossy orb → the product name as text and a flat mark in one solid colour.

## Landing pages and heroes

- A pill badge above the headline (`✨ Introducing X 2.0`) → remove it, or a quiet text link if the news is real.
- A headline that fits any product → gates.md 46.
- A shimmer or gradient on the headline → solid text.
- Blobs, orbs, grids or glowing lines behind the hero → gates.md 31: a plain background or one real product visual.
- Everything stacked and centred: headline, text, buttons, picture → an asymmetric split, or text over a large product view.
- Three or more buttons, or chips and avatars under them → one primary and at most one secondary action.
- `Trusted by 10,000+ teams`, avatar rows or a five-star rating with no source → gates.md 1: ask whether it is real, then make it quiet and specific, or remove it.
- Feature cards, each an emoji, a bold title and a vague line → fewer features, concrete copy, line icons or none.

## Visuals

- Glossy 3D blobs, liquid chrome or a purple nebula as the hero → the product itself, or one concrete metaphor for what it does.
- Robots, glowing brains, circuit lines or holograms for AI → remove them, or show what the AI produces.
- Text, buttons or a logo baked into an image → real text in the page and a clean image.
- An image with a hard edge and a different black from the page → a background matched to the page and a soft mask at the edges.
- A visual on every section → one, where it helps, usually only the hero.

## Motion

- `animate-pulse`, `animate-ping` or a breathing glow on something that is not live → static. A pulse that is bound to a live state may stay.
- `transition-all` and `hover:scale` on cards and buttons → gates.md 21, and a colour or surface step on hover with a small scale on press.
- Bouncy springs and overshoot on simple UI → gates.md 35.
- Everything flying in from different directions on load → one short fade and rise with a small stagger ([craft.md](craft.md), Entrances).
- Parallax and floating loops → a static layout. Motion only where it explains something.

## Right to left

- Arabic or Hebrew text aligned left, or a root without `dir="rtl"` and `lang` → set both on the root and align to the start.
- The sidebar, logo and back arrow still on the left of a right-to-left screen → mirror the layout with logical properties: `ms-*`, `me-*`, `start-*`, `text-start` for `ml-*`, `mr-*`, `left-*`, `text-left`.
- Next and back arrows pointing the left-to-right way → mirror directional icons only. Media controls and objects keep their direction.
- A progress bar filling from the left → fill from the right.
- Letter-spacing on Arabic, often inherited from a capitals label → 0.
- Synthetic italic or bold on Arabic, or a Latin face falling back to a system Arabic face → a family drawn for Arabic, with real weights.
- Western and Arabic-Indic digits mixed on one screen → one digit system.
- A Latin word or a signed number pushing punctuation to the wrong side (`12%+`) → `<bdi>`, or `unicode-bidi: isolate`, and `<bdi dir="ltr">` for a signed number.
- Tight Latin line height clipping dots and vowel marks → 1.6 to 1.8 for body, 1.3 to 1.4 for headings.
- Latin punctuation in Arabic (`,` and `?`) → `،` and `؟`.
- Gradient, glow or motion on quoted religious text → plain text in a reading face, exact from a verified source.

## The template look

Not slop, but what a cleaned screen falls back to when nobody decided. Look for
these after the passes.

- A neutral grey page, the default system face, white text and the brand colour on one button, for a product whose world is warm or bright → a ramp tinted toward that world, and an accent taken from it.
- A hero visual that is an empty box or a generic picture → a product preview in code, or an image from the product's world.
- Every product given the same layout, type and palette → let the direction from stage 3 choose.

---

Adapted from [unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky
(@heydamir), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
