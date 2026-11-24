---
title: "A section that reveals once on scroll is craft, not a slop sign"
author: Dhodraj
date: 2026-11-24
branch: main
id: l-4e779940
scope: repo
status: active
src: agent
touches:
  - ui/design-the-ui/references/craft.md
  - ui/design-the-ui/references/slop-signs.md
  - ui/design-the-ui/references/gates.md
  - ui/design-the-ui/tests/fixtures/landing.html
  - ui/design-the-ui/sources.json
---

## Decided
Popular "AI design slop" lists name "sections fading in on scroll" as a sign. We keep our own rule instead: below the first screen, a section reveals the first time it arrives and never again. The slop is every block sliding in with the same effect, not one quiet reveal. Decided by the user on 2026-11-24.
On 2026-11-24 we checked three social-media "AI design slop" lists against the UI rules. Only signs that describe a fault were added: a dithered or ASCII-art image used as decoration, a cream page with a serif headline when nothing in the product's world is paper, print or warm, and one italic word in a headline. The user approved each wording after an instruction review.
Skiper UI was added to the curated sources at the user's request on 2026-11-24, as check-licence with a warning, even though it has no licence text and its robots.txt disallows JSON files for every agent. To respect robots.txt, its registry is left empty, so the component finder never fetches its registry. The user copies from the site.

## Tried and ruled out
- Narrowing the reveal to sections where the order of arrival explains something, and listing the blanket fade as slop. Rejected: the current rule is already restrained.
- Dropping scroll reveals so only the first screen animates. Rejected for the same reason.
- Banning Instrument Serif and squircles. Rejected: a ban on one trend ages fast, and the directions step should pick a face and a shape, not a blocklist.
- Banning cream pages outright. Rejected: the landing test fixture uses a cream page and a serif face on purpose, because its world is paper run sheets.
- A new line for three feature cards in a row. Rejected: gates rule 27 already covers it, and restating our own rule is out of scope.
- Banning sections that fade in on scroll. Rejected: craft keeps a single reveal when a section first appears.
- Listing it under rejected. The instruction review recommended this, but the user chose to keep it visible with a warning.
- Giving it its registry URL like other shadcn sources. Ruled out: robots.txt forbids agents from fetching those files.

## Watch out
When importing slop lists from social media, check each sign against the craft and motion rules first. Some signs contradict rules this skill deliberately keeps.

In the code: ui/design-the-ui/references/craft.md, the paragraph starting "Below the first screen, reveal a section"; ui/design-the-ui/references/slop-signs.md has no scroll-fade line on purpose.
Most items on these lists are already covered under other words, such as dots between words (gates 32) and coloured left borders (the directions numbers table). Search by meaning before you add a line.

In the code: ui/design-the-ui/references/gates.md rule 31; ui/design-the-ui/references/slop-signs.md, the Type, Landing pages and Template look sections; ui/design-the-ui/tests/fixtures/landing.html uses --paper: #f3efe7.
The tier "browse-only" means agents never fetch the whole site. Skiper is narrower: only its JSON files are blocked, so the site pages may be read, but its registry may not.

In the code: ui/design-the-ui/sources.json, entry "@skiper-ui", registry null, install "the user copies it from the site".
