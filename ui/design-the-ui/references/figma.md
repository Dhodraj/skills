# Building from a Figma frame

Build from live Figma data, never from a description, an earlier summary or
memory. A description loses the values that matter. Adapted from
`textura-agency/ai-design-vault` (Unlicense); [NOTICE](../NOTICE) records what
was taken. The steps assume the Figma MCP server; without it, ask the user for
an export and say which values were read from it.

## 1. Read the frame, twice

1. `get_metadata`: the file, its pages and top-level frames, the file key
   and the node ids.
2. `get_design_context` on the target node: the exact text, colours, type,
   spacing and asset urls. This is the source for **values**.
3. `get_screenshot` on the same node: the source for **layout**, meaning
   column count, direction, alignment, order and position.

Use both. The context will not tell you the layout reads as three columns; the
screenshot will not tell you the gap is 28px.

## 2. Record what you read

Write `DESIGN-MAP.md` beside `DESIGN.md`, not inside it, so the linter never
sees it: the file key, the source url, the frame width, and one row per
section with its node id and the component that builds it. A section without a node id cannot be
checked against its design later.

## 3. Download the assets at once

The asset urls expire. Download them before building.

- One folder per section, files named by section in kebab-case:
  `hero-background.webp`, `icon-arrow.svg`.
- Check each file's real type with `file <path>`. Figma often returns an SVG
  where a raster was asked for, or a PNG named `.jpg`. A wrong extension
  renders as a broken image.
- A photo under about 5KB is a vector placeholder, not the export. Flag it;
  do not ship it.
- A download that fails: put an empty slot in its place, say so in the code,
  and tell the user at once.

## 4. Map values to tokens before markup

- Every colour becomes a primitive and a semantic token that names its
  purpose ([design-system.md](design-system.md), Token tiers).
- Reuse an existing spacing, radius or type token where one matches.
  Otherwise add one, with a comment naming the frame it came from.
- A value that cannot be justified as a token goes in the report as a design
  question, not into a class name.
- Check the frame width against the project's breakpoints before converting
  anything. Where the root font size scales with the viewport, design pixels
  map cleanly to `rem` only at that base width.

## 5. Build

- **Copy is character for character** from the design. Never rewrite,
  shorten or invent it, even where it reads badly; flag it instead.
- **Invent no visual feature.** No shadow, gradient, overlay, hover or card
  wrapper the design does not have. An invented wrapper background is the
  usual reason a logo disappears.
- Motion is the one addition a static frame cannot show. Add it only through
  [motion.md](motion.md), and only where the user has asked for motion.
- Content comes in as props or data, never hard-coded in the component.
- Semantic markup, and a semantic element on every motion wrapper
  ([markup.md](markup.md)).

## 6. Check against the design

Fetch the node again. Never check from memory or from your own summary.

- **Copy**: character for character.
- **Layout**: columns, direction, alignment, order, position.
- **Spacing**: margins, padding and gaps against the design's values.
- **Type**: size, weight, line height, letter-spacing. Never assume a heading
  is bold; designs often use 400.
- **Colour**: the exact values, through tokens, not matched by eye.
- **Images**: ratio, crop, radius, overlap, and no effect the design lacks.
  Where an image looks wrong or missing, check its container first.

Report the tokens added and why, the values that would not map to a token, any
asset that failed or looked wrong, and every piece of copy you flagged rather
than changed.
