---
name: check-the-instruction
description: "The instruction check. Use when a change to CLAUDE.md, a rule, a skill, a hook, a setting or a permission is about to be applied, including one a retro, a correction or a review proposes. A fresh reviewer tests the proposed text for need, spread, generic wording, load, conflict and security, and returns the wording to apply. Other review work is `tear-it-apart`; work that also changes how Claude is steered runs both."
---

Before a change that steers Claude is applied, have a fresh reviewer test it and return the wording to apply.

## Triggers

- About to edit CLAUDE.md, a rule, a skill, a hook, a setting or a permission → run this check first. Applying it comes after.
- The change is a skill → the reviewer also checks it against `~/.claude/skills/poteto-mode/playbooks/authoring-a-skill.md` and the principle skill it names.
- Drafting a rule from one project's misses → give the reviewer every incident behind it, with its project and who found it.
- The returned wording loosens a permission, check, secret or confirmation → apply it only with the user's explicit approval.
- The reviewer returns → show the user the wording and the test lines. Apply only with their approval.
- A skill named here is not installed → do that step as this file describes it (without `writing-for-agents`, the eight tests below stand alone), say which skill was missing, and do not install it without the user's consent.

## The reviewer

Start a fresh read-only `general-purpose` agent on opus. Give it the proposed text, the evidence behind it (each incident, its project, and who found it), and the current file. Tell it to read the `writing-for-agents` skill first, for its context pointers, the two loads and pruning. It returns the wording to apply and one line per test:

1. **Spread.** How many projects the incidents come from, and who found them. Narrow evidence does not block a rule; it tells the reviewer how far to generalise the wording.
2. **Generic wording.** Name the reasoning that failed, as generally as the evidence allows. No product names, domain terms or project specifics, except an example marked as one.
3. **Transfer.** Read the rule against three unrelated tasks, such as writing a document, debugging, and researching a tool. It must help or stay silent on each.
4. **Overlap.** If an existing line covers part of it, tighten that line instead.
5. **Load.** Lines added and removed, and when the text loads: every request (`CLAUDE.md`, a skill description), matching files (a scoped rule), on use (a skill body), or when a hook fires. Prefer the narrowest. `CLAUDE.md` stays under 200 lines.
6. **Conflict.** It must not contradict another rule or an accepted decision record.
7. **Need.** Would deleting it change what Claude does, given what the system prompt, tool descriptions, hooks and other loaded files already say? Name the miss it prevents, or drop it.
8. **Security.** Does it loosen or tighten a permission, check, secret or confirmation, and what does that reach, including runs nobody watches?

## Output

Record the eight test lines and the applied wording next to the change, such as in the decision record it belongs to.
