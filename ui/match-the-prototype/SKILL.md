---
name: match-the-prototype
description: "Match a product screen to its approved prototype, state by state, by measuring both sides at the project's widths. Use when building, checking or fixing drift from a screen an approved prototype draws. Not for a look not yet approved or a screen no prototype draws (design-the-ui), or a usability review (review-the-ui)."
---

# Match the prototype

The approved prototype is the design, and the product copies it. A screen is
done when a measurement of each state finds no difference the user has not
ruled on. Looking close is not a pass.

## Triggers

- The look is not approved yet, or no prototype draws the screen → `design-the-ui`.
- Asked whether the screen is usable or harms customers → `review-the-ui`.
- Tempted to judge a state by eye from a screenshot → measure it (step 3).
- A product component draws something other than the prototype → change the shared component. List every screen that uses it in the report. Never fork it into a local copy.
- The prototype and the project's word list disagree on a word → ask the user. No word list → the prototype's words stand.

## Inputs

Settle these before step 1. Ask with the question tool for any the caller did
not give.

| Input | What it is |
|---|---|
| **Prototype** | The mock on the `Approved mock:` line of `DESIGN.md`, and the address in it that draws this surface |
| **Surface** | The product screen and how to reach it |
| **Widths** | The widths the project ships at, plus a phone width where the prototype has a narrow layout |
| **Data and sign-in** | A copy of the data the product reads, never the live store. The names of the secrets that sign in, never their values |
| **Review folder** | A folder inside the Playwright MCP's workspace root, for the frames |

## 1. List the states before any code

Write a table of states from both sources before you build or change anything.

1. **The prototype's states.** Read the prototype's render code and its data.
   List every state it draws, and the address or the clicks that reach each.
2. **The product's states.** List every state the product can be in: loading,
   empty, one item, many, running, done, failed, refused, no permission. Add
   any other value its data or its requests can take.

```
state        | prototype draws it at | product reaches it by       | rule
loading      | no                    | first frame, responses held | frame + placeholders
empty        | <address>             | <data with no items>        | prototype
failed read  | no                    | a read that answered 500    | ask: back to the prototype
```

Give each state the prototype lacks a rule before any code:

- **Loading** is the page's own frame: the same header, title, panels and
  controls as the settled page, in the same places. Placeholders fill the
  regions that hold data. A spinner or a sentence in place of the page fails.
- **Any other missing state** goes back to the prototype. Draw it there with
  the prototype's own classes and words. Get the user's approval before you
  build it. Until then it is `waits for the prototype`.

## 2. Build from the prototype

- Sizes, spacing, type, colours, radii and borders come from the prototype's
  computed styles and stylesheet. Never take a size from the product's scale
  because it looks close.
- Structure comes from its markup: the same elements in the same order.
- Every word comes from the prototype, word for word.
- Use a product component only when it draws exactly what the prototype draws.

## 3. Measure both sides

No Playwright MCP in this session → stop and tell the user. Install nothing.

The page guards are partial. A local address can still front live data, and
`navigator.sendBeacon` and form posts are not blocked. So every server runs on
the data copy, and every step only reads.

1. Start your own server for each side on a free port, on the data copy. Check
   that nothing listens on the port first, and never reuse a server someone
   else started. Record each one's PID, port and how to stop it.
2. Write `pairs.json` in the review folder in the format of
   [references/pairs.md](references/pairs.md). Give one pair per state, and
   name every element a person would point at.
3. Sign in to the product in the Playwright MCP's browser. Type each secret
   by its name from the MCP's secrets file, never its value. No secrets file →
   ask the user to sign in in that browser.
4. Print the calls, run each one in order with the Playwright MCP, then
   compare. `R` is the review folder; `scripts/` is the folder beside this
   file:

```bash
R=<review folder>
S=<this skill's folder>/scripts
node "$S/plan.js" "$R/pairs.json" "$R/frames" > "$R/plan.jsonl"
node "$S/compare.js" "$R/pairs.json" "$R/frames"
```

`plan.js` refuses a page address that does not resolve to localhost,
127.0.0.1 or [::1], and `capture.js` refuses such a page again. `plan.js`
writes a `.gitignore` into the frames folder, because the frames hold the
product's data. Never stage the review folder. In its output, `<capture.js>`
stands for the whole contents of `capture.js`. A **first** frame is a copy of
the page with its fetch and XHR requests held back; a **settled** frame is the
page itself.

`capture.js` blocks every fetch and XHR that is not a GET, and lists each one
under `blocked` in the frame. On the page itself it starts only once it is
installed. Treat every line under `blocked` as a finding.

`compare.js` writes `differences.md` and exits 1 while it has a row.

5. Open the screenshots of every state with a row. A row caused by the data,
   not the screen, is fixed by a pair whose data matches. Never fix it by
   marking the element `data`.

## 4. Done only when the table is empty

Fix each row in the product, then capture and compare again. Stop when
`differences.md` is empty, or each row left has the user's ruling. Ask for
each ruling with the question tool and write it beside the row.

Report the states table, the last `differences.md` and the rulings. Name each
shared component you changed and the screens that use it. List each state that
waits for the prototype. Stop every process you started, and say so.
