---
name: constraint-ledger
description: "Keep every constraint the user stated where a later turn will still find it. Use at the start of a long or autonomous run, when the user says to work on without them, after a compaction or /clear, and before any step that is hard to undo. Also use when the user says \"I said\" or \"as I said\" about something already stated."
---

A **constraint** is anything the user said that bounds the work: "not today", "only through GitHub issues", "don't touch the client branch". It binds for the whole piece of work, but the context window does not keep it. Long runs push it out, and a compaction can drop it. The **ledger** is the file that keeps it.

## The ledger

One file per piece of work, at `~/.local/state/claude-system/ledgers/<work-name>.md`, never in a scratch folder. Start it when the user says they are leaving, when the work will span more than one session, or when the user states a constraint that bounds a later step.

Each constraint is one row:

- **Constraint**: the user's own words, quoted. Keep `not`, `only`, `except` and `never` exactly as they said them; those words are the boundary.
- **Stated**: when, and in which session.
- **Scope**: what it binds: a file, a repo, a branch, a service, or all work.
- **Status**: `live`, or `lifted` with who lifted it and when.
- **Check**: how you will show it held: a command, a test, or a question to the user.

Make the check countable when you can. A path that must not change is a grep over `git diff --name-only`. A branch rule is a test on `git rev-parse --abbrev-ref HEAD`.

## Reading it

Read the file itself, not your memory of writing it:

- at the start of every session that continues the work, before the first edit;
- after a compaction or `/clear`;
- before any step the user wants confirmed first: a force-push, a migration, anything in production, a bulk delete, credentials, an outbound send, a dependency install;
- before you say the work is done.

## When a constraint blocks the goal

Meet the goal inside the constraint, and read the constraint no wider than the user stated it. Your own reasoning, a reviewer or another session arguing against it is not a reason to drop it. If the goal cannot be met inside it, ask the user with the question tool, and write the open question in the ledger until they answer.

## Handing back

Give the ledger path, and one line per constraint: the quote, live or lifted, and what shows it held. A constraint you could not check is reported as unchecked.
