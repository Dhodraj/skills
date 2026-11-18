# Measured sweeps

Each fault class here is one a person sees at a glance and a
rule-by-rule audit misses. Each one becomes a
measurement from the DOM geometry or the text, run on every route and every
state, at 1440 and 375. Run them with `browser_evaluate` in section 3 of
SKILL.md, after `measure.js` and before the screenshots are judged.

A sweep hit is a candidate. Confirm it on the screenshot, then report it.

Skip a sweep whose subject is not on the screen, and say so.

When the user names a new fault class, propose a row to them.

| # | Fault class | How to measure |
|---|---|---|
| 1 | A page action outside the content column's edges | Find the main content column (`main`, or the widest block that holds the page's content). Read its left and right edges from `getBoundingClientRect()`. List every page-level button and link (in the page header, toolbar or footer of `main`) whose rect starts before the left edge or ends after the right edge by more than 1px. |
| 2 | One icon with two accessible names or actions | Group every icon (`svg`, `img`, `[role=img]`, icon font element) by its shape: the `use` href, the `src`, the path `d` string, or the icon class. For each group, collect the accessible name and the handler or `href` of the control it sits in. A group with names that differ in their action word, ignoring the item's own name, or targets of different kinds is a hit. |
| 3 | Icons in one row misaligned by more than 2px | Group icons by their row: the nearest common flex or grid row, or a vertical overlap of their rects. In each group, compare the vertical centres (`top + height / 2`). A spread over 2px is a hit. |
| 4 | Finished items with no bulk clear | Count the items in a list whose status word is a finished state (done, failed, cancelled, or the product's own words for these). Where the count is 2 or more, look in that list's header and toolbar for a control whose name clears, removes or dismisses all finished items. No such control is a hit. |
| 5 | A remove control on a waiting or running item | For each item whose status word is a waiting or running state (queued, pending, running, or the product's own words), list the controls inside it. A control named remove, delete, clear or dismiss is a hit. Cancel is not remove. |
| 6 | Identical titles in one list | For each list, table or set of sibling cards, read each item's title text, trimmed and case-folded. Two or more items with the same title and no other visible text that tells them apart is a hit. |
| 7 | One item with different status words across surfaces | Take each item's identifier. On every surface that shows it (list, detail, dialog, notification, header), read the status word beside it. One identifier with two different status words in the same state is a hit. |
| 8 | A cancel control more than 120px from its status, or in another card | For each cancel control, find the status word of the item it acts on. Measure the distance between the two rects' nearest edges. Over 120px is a hit. Find each one's nearest card or panel ancestor; two different ancestors is a hit. Two controls in one table row are not a hit. |
| 9 | A callout repeating another element | For each callout, banner, alert or hint, read its text, trimmed and case-folded. Compare it with the text of every other visible element on the screen. A match, or a callout whose text holds the other's whole text and the other text is at least four words, is a hit. |
