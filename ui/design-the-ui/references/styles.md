# Styles

Loaded at stage 3 for a new surface, a redesign or "make this modern". The
user picks a style by looking at it when no live brand exists. Each entry carries values a build can follow without taste of its own.

No style is the default. The gallery shows them all, in a fixed order, and the
user picks.

## The order of work

1. Run the gallery with the client's own name, colour and font. Pass their
   real hero picture with `--image` where one exists.

   ```bash
   node scripts/style-gallery.js --name "Lingaasys" --brand "#F05B36" \
     --font Manrope --out style-gallery.html [--image hero.jpg]
   ```

2. Open it in a browser and look at it before showing it. Then ask, with the
   question tool, which one or two styles the user wants, by number. Offer
   "none of these" as an answer, and on it ask what the page should feel like
   in their own words.
3. Read only the entries picked. The picked style passes on only its ground,
   colour, type and imagery; `SKILL.md` stage 3 builds the live variants
   inside it and records the pick.

"You pick" at step 2: pick the style whose **Fits** row names this product,
say which and why in one line, and carry on.

## A redesign keeps the brand

On a redesign, the brand's existing imagery, colours and type stay unless the
user asks to replace them. A style changes how they are framed, never whether
they appear.

A review finding is fixed inside the look, never by deleting the element:

| Finding | Wrong fix | Right fix |
|---|---|---|
| Text over a photo fails contrast | Remove the photo | A measured scrim, or move the text onto a solid band beside it |
| A gradient reads as generated | A flat grey section | The brand's own two colours, one direction, under a real picture |
| Too many dark sections | All sections white | Keep the dark ones that carry imagery, lighten the ones that carry reading |
| A busy hero | A text-only hero | One picture, one headline, one action |

A page with less on it than before is not a fix. Show the user a before and
after of the same section before changing every section.

## How the list was chosen

The list starts from the style names people use when they brief a site:
rich, glassmorphism, minimal, brutalist, editorial, Swiss, bento, dark,
claymorphism, corporate, retro, organic. `tactile.md` already existed and joins
it for product screens. A style stays only if it differs from every other one
on at least two of these six axes. Monochrome minimal and Swiss grid differ on
structure, type voice and colour. Corporate clean and Monochrome minimal
differ on imagery, density and colour.

| # | Style | Ground | Surface | Colour | Type voice | Imagery | Density |
|---|---|---|---|---|---|---|---|
| 1 | Rich and immersive | dark, picture | flat on picture | brand as light | large grotesque | full-bleed photo | low |
| 2 | Corporate clean | white | bordered cards | brand on actions | neutral sans | framed photo | medium |
| 3 | Editorial | warm paper | none, rules | brand as ink | serif display | captioned photo | medium, long text |
| 4 | Swiss grid | off-white | none, grid lines | one solid field | tight grotesque | none, or cropped | low |
| 5 | Monochrome minimal | near-white | none, hairlines | greys, brand on one action | quiet sans | product only | very low |
| 6 | Glassmorphism | colour field or photo | translucent panes | brand as the field | rounded sans | the field | low |
| 7 | Bento | light grey | rounded tiles | brand on one tile | grotesque | one tile | high, modular |
| 8 | Dark tech | near-black | hairline panels | brand as signal | sans plus mono | code, product | medium |
| 9 | Bold and neo-brutalist | brand tint | thick borders, hard shadows | loud flats | heavy display | stickers, flat | medium |
| 10 | Soft pastel and clay | pastel | pillowy raised | pastel tints | rounded display | clay objects | low |
| 11 | Retro and Y2K | sky gradient | bevelled windows | saturated | pixel plus display | pixel, chrome | medium |
| 12 | Organic and earthy | warm paper | soft tinted bands | earth-shifted brand | soft serif | natural photo, arches | low |
| 13 | Tactile | neutral | ring and 1px drop | almost none | one weight | none | high |

Left out, because each is a variant of one above: neumorphism (clay with less
contrast, and it fails the field-edge Floor rule by design), aurora gradients
(Reflex rule 31), flat design (Corporate clean), skeuomorphism (Tactile and
Retro), Memphis (Neo-brutalist with pattern).

## What holds in every style

- **A style overrides a number and a Reflex rule. It never overrides a Floor
  rule** in [gates.md](gates.md): contrast, focus, names, status by more than
  colour, reduced motion, targets, layout, tokens. Where the two meet, the
  look gives way. Each entry lists what it overrides; on a pick, every one of
  those goes into `DESIGN.md`, which is what makes it legitimate.
- **Brand colour, measured.** From one brand hex, compute these, and keep the
  measurement in `DESIGN.md`. `scripts/style-gallery.js` computes them the same
  way, and its foot prints the values.

  | Token | How | Used for |
  |---|---|---|
  | `brand` | as given | fills, fields of colour, glows |
  | `on-brand` | the light or the dark ink, whichever passes 4.5:1 on `brand`; if neither, the higher | text on a brand fill |
  | `brand-deep` | `brand` mixed towards the ink in 2% steps until it passes 4.5:1 on the darkest light ground the page uses | brand text on light grounds, and a fill under light text |
  | `brand-glow` | `brand` mixed towards the paper until it passes 4.5:1 on the darkest dark ground | brand text on dark grounds |

  A brand orange such as `#F05B36` passes only 3.4:1 under white text. So
  either its button carries dark text, or the button takes `brand-deep`. Never
  set white on it and hope.
- **Text over a picture or a translucent pane** passes 4.5:1 against the
  lightest pixel behind it, not the average. Darken with a scrim whose
  opacity is measured against that pixel. For a glass pane, mix the pane
  colour over the lightest colour behind it at the pane's opacity, measure
  the dimmest text against that, and raise the opacity until it passes. The
  gallery does this for the brand field. `measure.js` cannot see behind a
  picture, so check these by hand and record the ratio.
- **No invented content** (`gates.md` 1). A style that leans on proof, such as
  logo walls, figures or quotes, gets a labelled empty slot until the real one
  arrives.
- **No placeholder service** (`gates.md` 36). Imagery is the client's own, a
  licensed photo, or an empty slot the page admits is empty.
- **"Look at" sites are inspiration only.** Take what they make dominant and
  how they handle density. Copy no code, no assets, no text and no palette.
  They are not in [sources.json](../sources.json); treat each as `inspiration`.
- **Free fonts only.** Every face named here is on Google Fonts. Where the
  brand has its own face, it replaces the body face and, unless the entry says
  the display face defines the style, the display face too.

---

## 1. Rich and immersive

Full-bleed pictures, deep dark sections and the brand colour used as light.

| Fits | Does not fit |
|---|---|
| A firm whose work is physical and photogenic: engineering, energy, construction, automotive, travel, hospitality | A product with no pictures of its own, which ends up with stock; draw the work instead ("Without photographs") |
| A brand that already has strong photography and dark sections | Dense comparison or documentation pages |
| A homepage, a sector page, a case study | A form-heavy flow |

| Value | Setting |
|---|---|
| Ground | `#0D0E12` for dark sections; light sections `#F7F5F2` where reading is long |
| Surfaces | none on the picture; on dark bands a card is `#16181D` |
| Colour roles | text `#F4F1EC`, secondary `#C9C3BA` (11.0:1 on the ground), brand on the primary action and as light: a radial glow, `brand` at 30% fading to transparent within 60% of the band, once per band |
| Radius | 999px on buttons, 10px on pictures and cards |
| Shadow | none on dark; the picture carries the depth |
| Blur | none |
| Border | a ghost button has a 1px inset ring of white at 50% |
| Type | display "Archivo" 700 at width 110, or the brand face at 700; body "Manrope" 400 |
| Type scale | 46/1.05 hero at −0.03em, 22/1.2 band title, 16/1.5 body, 15 for secondary |
| Spacing | loose: 96 to 128px between sections at desktop; hero at least 80svh |
| Imagery | full-bleed photography of the client's own work. Scrim `linear-gradient(90deg, rgb(8 9 12 / .88), rgb(8 9 12 / .55) 55%, rgb(8 9 12 / .1))` behind the text side |
| Motion | the hero picture may scale from 1.04 to 1 over 1200ms on load; sections fade and rise 12px. Reduced motion: none |

**Build it from:** a transparent nav over the hero; one headline, one line,
one primary and one ghost action; alternating picture-and-text bands; a
full-width picture break between bands; a dark footer.

**Traps:**
- Stock photos of handshakes and server racks. Without the client's own
  pictures, ask for them, or draw the work ("Without photographs").
- Text set over the bright part of the picture. Put the text where the scrim
  is darkest, and measure.
- Every section dark. Alternate: dark for showing, light for reading.
- A glow on every element. One glow per band, from the brand, behind content.

**Brand colour:** `brand` fills the primary action with `on-brand` text. Links
and labels on dark take `brand-glow`. The glow is `brand` at 30%.

**Overrides:**

| Rule | Here | Why |
|---|---|---|
| `directions.md` No default aesthetic: a dark theme | Dark bands are the style | Picked by the user |
| `gates.md` 31: decorative chrome | One brand radial glow per dark band | It is the brand used as light, tied to the picture beside it |
| `directions.md` numbers: nothing at rest carries a shadow | Unchanged; depth comes from the picture | — |

**Floor:** text over the picture passes 4.5:1 against its lightest pixel;
the hero scale has a reduced-motion path; the hero uses `svh`, not `vh`
(`gates.md` 16).

**Without photographs: draw the work.** For a firm whose work is data,
software or a service, a live 3D scene takes the place of the picture.

- [3d-scene.md](3d-scene.md) governs every scene.
- The scene is the client's work: data moving between two stores, a network
  of nodes, a monolith splitting into modules. A blob, a nebula or a shape
  with no meaning fails `slop-signs.md`.
- Points and glows use additive blending, which disappears on a light ground.
  Put each scene on a dark band.

Patterns to offer. Show these to the user with the question tool, and build
only the ones they pick:

| Pattern | What it does |
|---|---|
| Depth down the page | Each band that makes a claim gets its own scene or depth, such as a grid floor under a row of figures, or cards tilted in a rising row |
| One canvas for tabs | A tabbed band shares one canvas, moved into the open panel; one set of points takes a new shape for each tab |
| Change as structure | A before and after shows tangled links straightening into layers, with a control for each state and one play on arrival |
| Dark to show, light to read | Scenes on dark bands; reading bands on the brand's light ground |

**Look at:** apple.com product pages, spacex.com, porsche.com.

## 2. Corporate clean

White, ordered and photographic. Trust comes from structure.

| Fits | Does not fit |
|---|---|
| Enterprise services, consulting, finance, health, public sector | A consumer brand that has to be loved, not trusted |
| A site with many sections, sectors and services | A single-product launch |
| Buyers who compare suppliers | A brand whose colour is meant to carry the screen |

| Value | Setting |
|---|---|
| Ground | `#FFFFFF`, with bands of `#F4F5F7` |
| Surfaces | cards `#FFFFFF` with a 1px `#E4E6EA` border |
| Colour roles | ink `#14171C`, secondary `#4A515B` (8.0:1), lines `#E4E6EA`, brand-deep on primary actions and links |
| Radius | 6px on controls, 8px on cards and pictures |
| Shadow | none at rest; a card lifts on hover with `craft.md` `--lift-hover` |
| Blur | none |
| Border | 1px `#E4E6EA` on cards; secondary button 1px inset `#C5CAD1` |
| Type | display "Plus Jakarta Sans" 700, body "Source Sans 3" 400; or the brand face for both |
| Type scale | 36/1.12 hero at −0.02em, 28 section, 17 card title, 16 body, 14 meta |
| Spacing | medium: 64 to 80px between sections; 18 to 24px card padding |
| Imagery | photography of real people and sites, framed in 8px corners, never full-bleed except once |
| Motion | hover lift 150ms; no entrances beyond one fade on the hero |

**Build it from:** a nav with four or five sections and one filled action; a
split hero with text and one picture; service cards in varied widths;
sector or case-study rows with a picture each; a contact band.

**Traps:**
- The template page (`gates.md` 28): hero, three equal cards, call to
  action. Vary card widths and give each section a different job.
- Grey everywhere and the brand only on one button, which reads as a template.
  Use brand-deep on links, active nav and section markers too.
- Copy full of buzzwords (`gates.md` 41). Name the service in the buyer's
  nouns.

**Brand colour:** `brand-deep` for fills under white text and for links.
`brand` at 10% as a tint behind an active row or a highlighted band.

**Overrides:** none.

**Floor:** the secondary button's ring measures 3:1 against white
(`#C5CAD1` measures 1.7:1; `#8A919B` measures 3.2:1, so use it or darker
where the ring is the only edge).

**Look at:** ibm.com, siemens.com, deloitte.com.

## 3. Editorial

A magazine page: a serif voice, long reading and captioned pictures.

| Fits | Does not fit |
|---|---|
| A studio, a publisher, a research group, a brand with things to say | A dashboard or a tool |
| Case studies and essays as the main content | A site with little text |
| Readers who stay | Visitors who scan for a price |

| Value | Setting |
|---|---|
| Ground | warm paper `#F5F0E6` |
| Surfaces | none; sections are divided by rules |
| Colour roles | ink `#1C1A16`, secondary `#3B372F`, meta `#5A544A` (6.6:1), brand-deep on the kicker, drop cap and pull-quote rule |
| Radius | 0 |
| Shadow | none |
| Blur | none |
| Border | 2px ink rule under the masthead, 1px ink rules between sections, 2px brand rule above a pull quote |
| Type | display "Instrument Serif" 400, reading "Source Serif 4" 400, UI and meta in the brand face. The display face defines the style: keep it even with a brand face |
| Type scale | 52/1.0 headline, 19/1.4 italic deck, 17/1.6 reading at 60 to 65ch, 26/1.2 italic pull quote, 13 meta |
| Spacing | a 12-column grid with text on 7 columns and pictures on 5; 48 to 64px between sections |
| Imagery | photographs with a caption under each, in italic, 13px |
| Motion | none beyond the page's own scroll |

**Build it from:** a masthead with the name in the display face; a kicker,
headline, deck and byline; a picture with its caption; a drop cap on the
lede; a pull quote; a footer index of articles.

**Traps:**
- A serif headline on an otherwise default page. The style is the rules,
  the measure and the captions, not the font.
- Text wider than 75 characters (`gates.md` 38).
- A pull quote nobody said (`gates.md` 1). Quote the article itself.

**Brand colour:** `brand-deep` for the kicker, the drop cap and links;
`brand` for the 2px rule above a pull quote. Nothing else is coloured.

**Overrides:**

| Rule | Here | Why |
|---|---|---|
| `slop-signs.md` Type: italic for emphasis | Italic for the deck, captions and pull quotes | These are the roles italic has in print, not emphasis |
| `directions.md` numbers: heading line height 1.1 to 1.3 | 1.0 on the display headline | A serif display face at 52px sets solid |
| `directions.md` numbers: two font weights | One weight, 400, across three families | Hierarchy comes from face and size |

**Floor:** captions at 13px stay at or above 12px (`gates.md` 39 is waived
only for captions and meta, never for reading text).

**Look at:** kinfolk.com, theatlantic.com.

## 4. Swiss grid

A strict grid, flush-left grotesque type and one solid field of colour.

| Fits | Does not fit |
|---|---|
| Architecture, design, engineering and a brand that wants to look exact | A playful consumer product |
| A portfolio, an annual report, a service overview | A page that needs many pictures |
| A short, confident site | Long marketing copy |

| Value | Setting |
|---|---|
| Ground | `#F7F7F5` |
| Surfaces | none; the grid is the structure |
| Colour roles | ink `#111111`; one solid field of `brand`; numbers and links in `brand-deep` |
| Radius | 0 |
| Shadow | none |
| Blur | none |
| Border | 3px ink rule between the hero and the sections; optional 1px column guides at 6% ink |
| Type | "Instrument Sans" or "Schibsted Grotesk" 700 and 400, or the brand face |
| Type scale | 58/0.98 at −0.045em for the headline, 32 numerals, 17 heading, 15 body, 13 meta. Ratio about 1.5 |
| Spacing | a 6-column grid with 16px gutters at tile width, 12 columns at desktop. Text starts on a column line, always |
| Imagery | none, or one photo cropped hard to a grid cell |
| Motion | none |

**Build it from:** a top row of three meta blocks on columns; a headline
spanning five columns; one field of brand colour on the last column; a
numbered list of three to five items on equal columns.

**Traps:**
- Centred anything. Everything is flush left on a column line.
- A loose grid. Off-grid by 4px reads as a mistake; check every left edge.
- Colour on several elements. One field, one ink, and brand-deep for numbers.

**Brand colour:** `brand` as one large field; `brand-deep` for numbers. The
field carries no text unless `on-brand` passes on it.

**Overrides:**

| Rule | Here | Why |
|---|---|---|
| `gates.md` 40: the accent past 5% of the viewport | One field up to 15% | The field is composition, not a signal; signals use ink |
| `directions.md` numbers: heading line height 1.1 to 1.3 | 0.98 on the headline | Tight leading is the style; only on display sizes |
| `gates.md` 31: a `01 / 04` counter | Large numerals on a numbered list | Each numeral heads real content |

**Floor:** column guides are decoration (`aria-hidden` if drawn as elements);
headline at −0.045em only at 40px and above.

**Look at:** vitsoe.com, experimentaljetset.nl, swissted.com.

## 5. Monochrome minimal

Greys, space and one quiet type voice. Colour only where the visitor acts.

| Fits | Does not fit |
|---|---|
| A premium product, a studio, an architecture practice, a developer tool | A brand whose colour is its identity |
| Few sections with a lot of space | A content-heavy site |
| A product that is itself the picture | A firm with nothing to show |

| Value | Setting |
|---|---|
| Ground | `#FAFAF9` |
| Surfaces | none; sections divided by a 1px `#DEDEDB` line |
| Colour roles | ink `#121212`, secondary `#5E5E5C` (6.2:1), meta `#6B6B68` (5.1:1), `brand-deep` on the one primary action only |
| Radius | 8px on controls, 0 elsewhere |
| Shadow | none |
| Blur | none |
| Border | 1px `#DEDEDB` |
| Type | "Geist" 500 and 400, or the brand face |
| Type scale | 44/1.08 at −0.035em, 15 body, 13 meta. Ratio about 1.6, few steps |
| Spacing | very loose: 56px above the headline in a hero, 120 to 160px between sections at desktop |
| Imagery | the product, on the same ground, no frame |
| Motion | fade only, 200ms |

**Build it from:** a nav with three links; a left-aligned headline, one line,
one action; a definition list of three facts on a hairline; product pictures
on the ground.

**Traps:**
- It is close to the template look in `slop-signs.md`: a grey page with the
  brand on one button. What separates them is the type scale ratio, the
  space and exact alignment. Without all three, pick another style.
- Grey text below 4.5:1. `#9A9A97` on `#FAFAF9` is 2.7:1; never use it for
  words.
- Centring everything (`slop-signs.md` Landing pages).

**Brand colour:** `brand-deep` on the one primary action. Nowhere else.

**Overrides:**

| Rule | Here | Why |
|---|---|---|
| `slop-signs.md` The template look: grey page, brand on one button | Picked on purpose, with the scale and space above | The user chose restraint |

**Floor:** the meta grey passes 4.5:1; the action is the only coloured thing,
so its focus ring must be visible on the grey ground (3:1).

**Look at:** vercel.com, nothing.tech.

## 6. Glassmorphism

Frosted panels floating over a rich colour field or a photograph.

| Fits | Does not fit |
|---|---|
| A product launch, an app or platform marketing page, an event | A long reading page |
| A brand with a bright colour or a striking picture to put behind the glass | A brand with only a pale colour |
| Few panels on one screen | Dense tables or forms |

| Value | Setting |
|---|---|
| Ground | a field made from the brand: `radial-gradient` of `brand` from the top corner, a second hue near the brand from the opposite corner, over a deep navy `#10142C`; or the client's photograph |
| Surfaces | panes `rgb(16 18 30 / A)` where A is computed (see Floor), `backdrop-filter: blur(22px)` |
| Colour roles | text `#FFFFFF`, secondary `#E4E2F0`; buttons near-white `rgb(255 255 255 / .92)` with `#141625` text |
| Radius | 18px on panes, 999px on buttons and the nav |
| Shadow | `0 10px 30px -10px rgb(0 0 0 / .35)` plus `inset 0 1px 0 rgb(255 255 255 / .18)` |
| Blur | 22px backdrop blur; 16 to 28px is the range |
| Border | 1px `rgb(255 255 255 / .22)` |
| Type | "Plus Jakarta Sans" or "Outfit" 700 and 400, or the brand face |
| Type scale | 38/1.08 at −0.025em, 18 pane title, 15 body |
| Spacing | 16px between panes, 22 to 28px inside |
| Imagery | the field itself, or one photograph behind all panes |
| Motion | panes fade in, 300ms; never animate the blur |

**Build it from:** a floating pill nav pane; a hero pane; one or two smaller
panes offset to one side; near-white solid buttons.

**Traps:**
- Glass over a flat or pale ground: nothing to blur, so it reads as grey. The
  field must have colour and shape behind every pane.
- Floating orbs added to give the glass something to blur (`gates.md` 31).
  The field is the brand colour or the client's picture, nothing else.
- Panes over panes. Translucent fills must not overlap (`craft.md`, Nothing
  translucent overlaps).
- Text contrast measured against the average of the field.

**Brand colour:** `brand` is the field. It does not appear on panes or buttons.

**Overrides:**

| Rule | Here | Why |
|---|---|---|
| `directions.md` No default aesthetic: glassmorphism | The style | Picked by the user |
| `slop-signs.md` Surfaces: a glass card with a white inner highlight | A 1px inset highlight at 18% | It is the edge of the glass; no coloured shadow |
| `gates.md` 23: hue-to-hue gradients | A brand field with two hues | The field is the subject of the blur, not decoration on a flat page |

**Floor:**
- Contrast: compute the pane opacity A so the dimmest text passes 4.5:1
  against the pane mixed over the lightest colour behind it. With the pane
  colour `#10121E` and `#E4E2F0` text, a mid orange such as `#F05B36` needs A =
  0.40 and a yellow such as `#FFD400` needs A = 0.60. `style-gallery.js`
  `glassAlpha()` does this. No `saturate()` in the backdrop filter; it
  brightens the colour behind and breaks the measurement.
- `@media (prefers-reduced-transparency: reduce)` and
  `@supports not (backdrop-filter: blur(1px))`: an opaque pane, `#1A1C2C`.
- A blur over 20px is never animated (`review-the-ui/references/performance.md`).

**Look at:** apple.com/visionos, raycast.com.

## 7. Bento

A grid of rounded tiles in mixed sizes, each showing one idea.

| Fits | Does not fit |
|---|---|
| A product or service with several distinct features to show at once | A story told in order |
| A feature overview, an about page, a portfolio summary | Fewer than four things to show |
| Visitors who scan | Long reading |

| Value | Setting |
|---|---|
| Ground | `#F1F0EE` |
| Surfaces | tiles `#FFFFFF` with a 1px ring at 4%; one tile `brand`, one tile `#161616` |
| Colour roles | ink `#161616`, secondary `#55534F` (6.7:1 on the ground, 7.7:1 on a tile) |
| Radius | 20px on tiles, 999px on buttons; inner pictures 20px minus padding |
| Shadow | none, or the 1px ring only |
| Blur | none |
| Border | none beyond the ring |
| Type | "Geist" or "Onest" 700 and 400, or the brand face |
| Type scale | 34/1.05 at −0.03em in the lead tile, 18 tile title, 14 tile text |
| Spacing | 12px gap, 20px tile padding, rows of at least 150px |
| Imagery | one or two tiles hold a picture edge to edge; one may hold a product screenshot |
| Motion | tiles fade and rise 8px in order, 40ms apart; reduced motion: fade only |

**Build it from:** a 3-column grid (4 or 6 at desktop) with a 2×2 lead tile
holding the headline; one brand tile; one dark tile; one picture tile; one
wide tile.

**Traps:**
- Equal tiles (`gates.md` 27). Mix at least three sizes.
- A tile per trivial point. Each tile carries one real idea with content.
- Tiles inside tiles (`gates.md` 22).
- A lone tile on the last row (`gates.md` Finish, orphans).

**Brand colour:** one tile filled with `brand`, its text `on-brand`. No other
brand use beyond focus and links in `brand-deep`.

**Overrides:**

| Rule | Here | Why |
|---|---|---|
| `directions.md` No default aesthetic: a bento grid | The style | Picked by the user |

**Floor:** the tile order in the source matches the reading order; at 375px
the grid becomes one column in that order.

**Look at:** apple.com (feature grids on product pages), framer.com,
bentogrids.com.

## 8. Dark tech

Near-black, hairlines, monospace detail and the brand as a signal light.

| Fits | Does not fit |
|---|---|
| Developer tools, APIs, infrastructure, data products | A consumer brand for a broad public |
| A product whose buyers read code | A firm with no product to show |
| Docs, changelogs, pricing for technical buyers | Long editorial reading |

| Value | Setting |
|---|---|
| Ground | `#0A0B0D`, with `brand` at 22% as a soft glow from the top centre |
| Surfaces | panels `#0F1114` and `#111318` |
| Colour roles | text `#EDEEF0`, secondary `#A3A8B0` (8.2:1), comments `#868C96` (5.6:1 on a panel), lines `#1E2127` and `#2C3038`, `brand-glow` on code keywords and links |
| Radius | 8px on controls, 12px on panels |
| Shadow | none; panels are separated by a 1px line and a step of surface |
| Blur | none |
| Border | 1px `#1E2127` structure, 1px `#2C3038` on controls |
| Type | "Geist" 600 and 400 with "Geist Mono" or "JetBrains Mono" 400 for code, keys and commands |
| Type scale | 42/1.05 at −0.035em, 17 heading, 15 body, 13 code |
| Spacing | medium: 48px hero top, 20px panel padding |
| Imagery | the real product: code, a real screenshot, a real terminal output as text |
| Motion | 150ms colour transitions; no glow animation |

**Build it from:** a nav with docs, changelog and sign-in; a headline with a
near-white primary and an install command as a second action; a code panel
with real code beside its explanation; a changelog list.

**Traps:**
- A glowing everything: neon borders, glow on buttons (`slop-signs.md`
  Surfaces). One glow, at the top, from the brand.
- A pill above the headline announcing a version (`slop-signs.md` Landing
  pages). Put real news in the changelog.
- A drawn terminal window with traffic-light dots (`gates.md` 37). Code is
  set as a plain panel.
- Grey text on near-black below 4.5:1. Measure every grey.

**Brand colour:** `brand` only as the top glow at 22%. `brand-glow` for code
keywords and links. The primary action is near-white, not brand.

**Overrides:**

| Rule | Here | Why |
|---|---|---|
| `directions.md` No default aesthetic: a dark theme | The style | Picked by the user |
| `gates.md` 31: a radial wash behind content | One brand glow at the top, at 22% | It marks the top of the page; nothing else glows |

**Floor:** focus rings measure 3:1 on `#0A0B0D`; code panels scroll
inside themselves, never the page (`gates.md` 14).

**Look at:** linear.app, supabase.com, warp.dev.

## 9. Bold and neo-brutalist

Thick black lines, hard offset shadows, loud flat colour and chunky type.

| Fits | Does not fit |
|---|---|
| A creative studio, a consumer app for a young audience, a shop, an event | A regulated buyer: finance, health, government |
| A brand that wants to look confident and fun | A brand whose voice is quiet |
| Few, loud sections | Dense data |

| Value | Setting |
|---|---|
| Ground | `brand` mixed 14% into cream `#FFF8EC`; bands of `#FFF8EC` |
| Surfaces | cards in flat colours: `#FFE14D` yellow, `#9EE6C4` mint, `#111111` black |
| Colour roles | ink `#111111` on every light fill; cream text on black |
| Radius | 10 to 12px, or 0 for a harder look; 999px on stickers |
| Shadow | hard offset, no blur: `4px 4px 0 #111` on buttons, `5px 5px 0 #111` on cards; on a black card, `5px 5px 0` in `brand` |
| Blur | none |
| Border | 3px solid `#111` on every surface and control |
| Type | display "Archivo Black" 400, uppercase for the hero only; body "Space Grotesk" 500, or the brand face for body |
| Type scale | 44/1.0 hero at −0.02em, 20/1.1 card title, 16 body at 500 |
| Spacing | medium: 24px gutters, 14px between cards |
| Imagery | flat illustration, stickers, cut-out photos with a black outline |
| Motion | press moves the element 3px down and right and shrinks the shadow to 1px, 80ms; reduced motion: the colour change only |

**Build it from:** a nav band with a 3px rule under it; a heavy uppercase
headline; brand and cream buttons with hard shadows; one tilted sticker
carrying a real label; cards in three flat colours.

**Traps:**
- Borders of different widths, or soft shadows. Every line is 3px, every
  shadow is hard.
- More than three card colours. The palette is brand, yellow, mint, black,
  cream.
- A sticker announcing something false (`gates.md` 3).
- Uppercase in body text or buttons. Uppercase is for the hero only.

**Brand colour:** `brand` on the primary button with `on-brand` text, and as
the 14% tint of the ground. Keep the yellow and mint as fixed partners.

**Overrides:**

| Rule | Here | Why |
|---|---|---|
| `slop-signs.md` Type: a heading at 800 or 900 | A black display face | The heavy face is the style |
| `directions.md` numbers: nothing at rest carries a shadow | Hard offset shadows at rest | The shadow is drawn as a shape, not as depth |
| `gates.md` 31: rotated text | One sticker tilted up to 8° | It carries a real label and stays horizontal enough to read |
| `gates.md` 33: three weights | Display 400, body 500 and 700 | Unchanged |

**Floor:** text on the yellow and mint passes (`#111` on `#FFE14D` is 14.5:1, on `#9EE6C4` 13.1:1);
the 3px border is the field's 3:1 edge; press feedback has a reduced-motion
path.

**Look at:** gumroad.com, mschf.com.

## 10. Soft pastel and clay

A pastel ground, pillowy rounded shapes and soft, friendly depth.

| Fits | Does not fit |
|---|---|
| Wellbeing, education, family, consumer apps, onboarding | Enterprise engineering, finance, legal |
| A product that wants to feel safe and easy | A brand built on precision |
| Few elements with lots of space | Dense content |

| Value | Setting |
|---|---|
| Ground | `brand` mixed 12% into `#FFF9F5` |
| Surfaces | cards `#FFFDFB`; clay objects in pastel tints: brand at 35 to 55% into peach, `#CDE7FF` blue, `#D9F2E3` mint |
| Colour roles | ink `#2B2235`, secondary `#5A4E63` (7.7:1 on a card) |
| Radius | 28px cards, 14px icons, 40px large objects, 999px buttons |
| Shadow | clay: `inset -5px -6px 10px rgb(60 30 20 / .08), inset 5px 6px 10px rgb(255 255 255 / .85), 0 18px 30px -14px` brand at 45% |
| Blur | none |
| Border | none |
| Type | display "Fredoka" 600, body "Nunito" 400 or the brand face; the display face defines the style |
| Type scale | 40/1.05 hero, 19 card title, 15 body |
| Spacing | loose: 28px gutters, 20px card padding, 16px gaps |
| Imagery | clay objects that stand for a real thing: an icon, a device, a step |
| Motion | objects float 4px over 4s only on the hero; buttons press 0.97; reduced motion: no float |

**Build it from:** a hero with a rounded display headline, one pill button
and a group of clay objects; feature cards with a clay icon each.

**Traps:**
- Floating blobs that stand for nothing (`gates.md` 31). Every object is an
  icon or a thing from the product.
- Pastel text. Text stays ink; pastels are fills only.
- Everything a pill (`slop-signs.md` Components). Radius by size, as above.
- No edges on fields: a clay field has no 3:1 edge (see Floor).

**Brand colour:** `brand` on the primary button with `on-brand` text and a
brand-tinted drop; brand tints for objects and the ground.

**Overrides:**

| Rule | Here | Why |
|---|---|---|
| `directions.md` numbers: nothing at rest carries a shadow | Clay shadows at rest on cards and objects | The soft depth is the style |
| `slop-signs.md` Surfaces: a coloured glow | A brand-tinted drop under clay surfaces, at 45% | It is the shadow colour, not a glow round an element |
| `slop-signs.md` Visuals: glossy 3D blobs | Matte clay objects that stand for real things | Matte, and each one means something |

**Floor:** a form field gets a 1px edge that measures 3:1 against the card
(`gates.md` 5), whatever the clay look; the float has a reduced-motion path.

**Look at:** headspace.com, duolingo.com.

## 11. Retro and Y2K

Bevelled windows, pixel labels and a saturated sky. Nostalgic on purpose.

| Fits | Does not fit |
|---|---|
| A music, gaming, culture or creative brand; a campaign; a playful side project | Any buyer who needs to trust a firm with serious work |
| An audience that remembers or loves early computing | Accessibility-critical public services |
| A short, memorable site | Long reading |

| Value | Setting |
|---|---|
| Ground | `linear-gradient(180deg, #7CC6FF, #C9B8FF 55%,` brand mixed 55% into pink `)`, with a 16px dot grid at 50% white |
| Surfaces | windows `#DCDCE2` with a bevel: 2px border, `#FFFFFF` top and left, `#5C5C66` bottom and right; a taskbar of the same |
| Colour roles | ink `#141414`; headline `#1A1446`; title bars a gradient from `brand-deep` to brand-deep mixed with violet, white text |
| Radius | 0 |
| Shadow | `4px 4px 0 rgb(20 20 40 / .35)` on windows |
| Blur | none |
| Border | the bevel above; pressed state swaps the bevel colours |
| Type | display "Bungee" 400 with a 3px offset text shadow in light brand; labels "Silkscreen" 400 at 13 to 18px; body the brand face |
| Type scale | 38/1.05 headline, 18 window heading, 15 body, 14 labels |
| Spacing | medium: 20 to 28px |
| Imagery | pixel icons, a progress meter, chrome type; real content inside every window |
| Motion | none, or a 1-step press swap of the bevel |

**Build it from:** a desktop ground; a main window holding the headline and
two bevel buttons; a second window with one piece of content; a taskbar along
the foot.

**Traps:**
- A window that holds a fake screenshot (`gates.md` 37). Every window holds
  real text and controls.
- Pixel font for reading text. Pixel faces are for labels only.
- A gradient everywhere. The sky and the title bars carry it; nothing else.

**Brand colour:** `brand-deep` in the title bars and meter; `brand` mixed
into the sky's lowest stop and the headline's text shadow.

**Overrides:**

| Rule | Here | Why |
|---|---|---|
| `gates.md` 23: hue-to-hue gradients | The sky and the title bars | Period-accurate, and confined to two places |
| `gates.md` 37: a drawn window | Windows as containers for real content | They hold the page's own content, not a fake screen |
| `gates.md` 30: capitals as a label | Pixel labels in capitals | The pixel face has capitals only; no extra tracking is added |
| `gates.md` 25: pure white | `#FFFFFF` bevel highlight | It is a token in the bevel recipe |

**Floor:** white title-bar text passes on `brand-deep` (it is built to);
labels stay at 13px or larger; the bevel is the button's 3:1 edge.

**Look at:** poolsuite.net, windows93.net.

## 12. Organic and earthy

Warm paper, natural pictures, soft serif type and arched shapes.

| Fits | Does not fit |
|---|---|
| Architecture, materials, food, wellbeing, sustainability, craft | A tech product |
| A brand with real photographs of places and materials | A brand with a cold palette it must keep |
| Calm, considered buyers | Urgent, transactional flows |

| Value | Setting |
|---|---|
| Ground | `#F2ECE1` |
| Surfaces | bands `#E8DFD0`, 24px radius |
| Colour roles | ink `#2B261F`, secondary `#5B5246` (6.5:1), outlines `#A8977E`, actions in `earth-deep`: `brand-deep` mixed 30% towards `#3A2C1E`, measured for 4.5:1 under `#F7F2EA` text |
| Radius | 999px buttons and tags; 16px pictures; arches `999px 999px 16px 16px` |
| Shadow | none |
| Blur | none |
| Border | 1px `#A8977E` on tags |
| Type | display "Fraunces" 400 with `"SOFT" 100`; body "Figtree" 400, or the brand face for body |
| Type scale | 46/1.02 at −0.02em, 22 band title, 15 body, 13 tags |
| Spacing | loose: 30px gutters, 18px band padding |
| Imagery | natural photography of real places and materials, in an arch or soft rectangle |
| Motion | fades only, 300ms |

**Build it from:** a soft-serif headline beside an arched picture; a tinted
band with a picture, a short text and material tags.

**Traps:**
- Beige with nothing to see. The style needs real photographs.
- Earth tones that drop contrast: tan text on beige. Text stays ink.
- Leaf and blob shapes as decoration (`gates.md` 31).

**Brand colour:** shifted towards earth for actions (`earth-deep`); the raw
brand appears only in a picture or a small mark.

**Overrides:** none.

**Floor:** tag outlines are decoration; a tag that is a control gets a 3:1
edge (`#A8977E` measures 2.2:1 on `#E8DFD0`; `#857558` measures 3.4:1).

**Look at:** aesop.com, patagonia.com, allbirds.com.

## 13. Tactile

A quiet console where every control looks pressable. For dense product
screens.

Every value, override and Floor clash is in [tactile.md](tactile.md). Read
that file on a pick; it is the full entry for this style.

| Fits | Does not fit |
|---|---|
| A console, dashboard, admin, settings or billing screen | A landing page, a marketing site or an editorial surface |
| A product that ships light and dark | A brand whose colour is meant to carry the screen |

**Brand colour:** almost none. One non-status hue for identity, and the
accent primary only where the brand requires it (`tactile.md`, Controls).

**Look at:** kosta4a/tactile-design, the source of `tactile.md`.
