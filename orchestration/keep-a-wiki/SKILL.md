---
name: keep-a-wiki
description: "Keep a repo's history in docs/wiki/: an index.md plus one dated page per topic, kept through ingest, query and lint. Use when the repo has docs/wiki/index.md, or when the user asks to start or lint a wiki."
---

The **wiki** is `docs/wiki/`, committed with the code: the history of topics that span files (decisions and why, how subsystems fit, recurring problems). Write to it only in a repo that has `docs/wiki/index.md`. Create one only when the user asks.

## Layout

- `index.md` lists every page with a relative link and a one-line summary, under `##` category headings.
- Each other page is `docs/wiki/<topic>.md`, kebab case, one topic. Link related pages to each other.

## One home per finding

Write each finding to its owner. The wiki page gets one dated line linking to it, never a copy.

| Finding | Owner |
|---|---|
| a fact about named files | `trail note` |
| an accepted decision, where the repo keeps records | the decision record |
| a preference, correction or lesson about how the user works | memory |
| a limit on this piece of work | `remember-my-words` ledger |
| state of open work | handoff |
| how topics connect over time, owned by none of the above | the wiki page |

## Keep private details out

Anyone with the repo reads the wiki. Write only what a stranger may read: no personal details, preferences, other clients or projects, secrets or `~` paths. Cite memory by file name in backticks, not as a link.

## Write history

- Date every claim. A claim about code cites `repo@commit`.
- Write "currently" or "now" only beside a date or commit.
- When a claim goes stale, add a new dated claim and mark the old one `Superseded on <date> by <link>`. Leave the old text as written. This marking is how a wiki page is fixed after a change.

## Ingest

After a durable finding, update every page it touches and the index in the same piece of work. Add a page only when no page covers the topic.

## Query

Before a decision about the repo, read `index.md`, then only the pages it points to for the question. File an answer worth keeping as a page.

## Lint

Run `python3 -I <this skill's folder>/scripts/lint-wiki.py docs/wiki`. Fix every error. Fix each advisory, or say why it stands. Then read for pages that contradict each other and claims a newer source has overtaken. Suggest a lint after a session adds several pages.
