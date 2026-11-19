# Markup

The element carries meaning; the class carries the look. Pick an element for
what it is, never for how it renders. Adapted from `textura-agency/ai-design-vault`
(Unlicense); [NOTICE](../NOTICE) records what was taken.

- **Native first.** A real `button`, `a` or `nav` beats a `div` with ARIA.
  Use ARIA only for a gap the platform leaves.
- **Every wrapper earns its place.** Prefer a semantic element, or no element.
- **DOM order is reading order.** Do not reorder meaningful content with CSS.

## Landmarks

| Element | Use |
|---|---|
| `header` | The site or page header |
| `nav` | A navigation block; give each one an `aria-label` where there are several |
| `main` | The primary content: exactly one, never nested |
| `section` | A thematic group, with an accessible name: a heading and `aria-labelledby`, or `aria-label` |
| `article` | Content that stands on its own |
| `aside` | Tangential content |
| `footer` | The site or page footer |

A skip link (`<a href="#main">Skip to content</a>`) goes first when navigation
comes before `main`.

## Headings

- One `h1`, describing the page.
- No skipped levels. The outline is the page's table of contents.
- A heading that must look small keeps its level and is restyled. Never
  change the level to change the size.

## Content

Lists in `ul`, `ol` and `li`. Captioned media in `figure` and `figcaption`.
Dates in `time` with a `datetime`. Terms and values in `dl`, `dt` and `dd`.
`strong` and `em` only for real emphasis.

## Controls

- `button` does something on the page; `a href` goes somewhere. Never a
  `div` or `span` with a click handler.
- `<button type="button">` unless it submits a form.
- A link styled as a button is still an `a`; a button styled as a link is
  still a `button`.
- `aria-current="page"` on the active navigation link.

## Media

- A meaningful image has a short `alt`; a decorative one has `alt=""`.
- Every image has a `width` and `height`, so nothing shifts when it loads.
  The largest image above the fold loads eagerly; images below it load lazily.
- A video has captions (`<track kind="captions">`) and never autoplays with
  sound.

## Forms

- Every control has a visible `label` tied to it (`for` and `id`, or a
  wrapping `label`). Related controls sit in a `fieldset` with a `legend`.
- The right `type`, `name`, `autocomplete` and `inputmode`.
- An error sets `aria-invalid` on the field and links its message with
  `aria-describedby`.

## Animated elements

A motion wrapper renders a `div` unless told otherwise. Pass the real element
(`tag="section"`, `tag="h2"`), so an animated heading is still a heading.
Motion changes how content looks, never whether it is in the DOM: see
[motion.md](motion.md).

## `data-*`

For tooling only: test selectors, analytics, script hooks. Never for styling,
and never to carry content.

## Check

- [ ] One `h1`, and no skipped heading level.
- [ ] One `main`; every `section` and every repeated `nav` named.
- [ ] Buttons and links used for what they do; no clickable `div`.
- [ ] Every image has `alt` and dimensions.
- [ ] Every field has a visible, tied label.
- [ ] Every motion wrapper renders its semantic element.
- [ ] Content is in the DOM with scripts and motion at any state.
