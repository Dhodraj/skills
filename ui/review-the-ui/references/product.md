# Reviewing a whole product

Loaded when the review covers every screen of an application. The question is
"where, across the product, does an element break a principle". A sample
cannot answer it: the faults that matter here are on the screens nobody
opened.

In review-only mode the review changes no project files. Seed data only into a
throwaway project or store, never into one a customer or a colleague uses.

## 1. Derive the space before rendering anything

The space is screens crossed with states. Take both from the code, never from
memory or the navigation, which hides screens reached only by a link or an
address.

- **Screens:** every route the router or navigator declares, or every page
  file or sitemap entry where there is no router; every panel, drawer or
  dialog with its own content; and every page a link opens that the
  router does not list. Search for routes registered outside the main router.
  Record the source of each row.
- **States:** the lifecycle axis of the main skill, step 5, plus every state
  the screen's own data types add (for example `queued`, `running`,
  `cancelled`). Take them from the types, not from the screenshots you happen
  to get.

Write the grid first: one row per screen and state, each cell "to render",
"not applicable" (why) or "cannot reach" (what is missing).

## 2. Each cell

Render the cell at 1440 and 375 and run step 3 of the main skill. Then judge
it in three layers, in this order:

1. **The critique.** Run [critique.md](../../design-the-ui/references/critique.md)
   on each screenshot, one at a time.
2. **The principle rows.** List every element a person can see or press. An
   element left off the list is an element nobody judged. Ask each element
   the rows the [principles.md](../../design-the-ui/references/principles.md)
   index lists for its kind. Record the element kinds found and the row IDs
   skipped for each kind. A principle never asked anywhere goes under "Not
   checked" with the reason. Then ask of the arrangement:

   - **Mapping and proximity (principles.md 2.5, 3.5).** A cancel or remove
     control placed apart from its item, and one icon set on two different
     edges in one panel, are findings. Check alignment against `craft.md`,
     Spacing and alignment.
   - **Repeated chores (principles.md 1.7).** For example, clear every
     finished item, retry every failed one, or select all. A repeated chore
     with no control is a finding.
3. **The measured sweeps.** Section 3 of the main skill ran the sweeps;
   confirm their hits here.

## 3. Compare across the product

After every cell, build these tables from the element lists, and work through
the "Principles a single element cannot show" section of
[principles.md](../../design-the-ui/references/principles.md):

| Table | One row per | A fault looks like |
|---|---|---|
| Icons | icon | One icon with two meanings |
| Status words | state | Two words for one state, or one word for two |
| Action labels | action | One action named differently on two screens |
| Placement | action | One action placed differently on two screens |

The main skill's step 8 still applies: drop a finding only where the design
system states the choice in writing, and cite the line.

## 4. Verify with a fresh reviewer

Give one fresh read-only `general-purpose` agent all the findings at once,
each with its screenshot and the principle it cites, and not your reasons. It
returns confirmed, rejected (why) or changed for each. Report confirmed and
changed findings; list rejected ones apart with the reason.

## 5. Report

Use the main skill's report, with these additions: the grid with each cell's
result and finding count, the element kinds and skipped row IDs for each
cell, the section 3 tables with each fault marked, and the rejected findings. Cells not rendered and
principles never asked go under "Not checked".

In review-and-fix mode, continue with step 11 of the main skill.
