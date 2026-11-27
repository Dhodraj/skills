---
name: to-adr
description: "Architecture decision records (ADRs): write, review or sort them, or record a structural technology choice. Gates each decision first: product decisions, code conventions and ops choices are not ADRs and go elsewhere."
---

An ADR records one decision that sets system structure, after the decision has been interrogated hard enough to be **durable**: it holds until one of its inputs changes. Run the steps in order. A decision that fails the gate never reaches the interrogation.

## 1. Gate: is it architecture?

A decision is architecture only if all three hold:

- **Structure.** It sets components and their boundaries, where data lives, a runtime or technology choice, or how the system meets an external system.
- **Cross-cutting.** More than one component, team or flow depends on it.
- **Costly to undo.** Reversing it means a migration, a rewrite or a contract change, not an edit.

Apply the gate strictly. **Doubt means not an ADR.** Everything that fails goes where it governs:

| Kind | Tell | Goes into |
|---|---|---|
| Product or functional | Says what a person or role can do, or what a screen, workflow or feature does | The spec requirement it governs |
| Code convention | How code is written, named, laid out or tested | The repo's conventions file or a rules file |
| Ops choice | Deploy, certificates, backups, infra secrets, alerts | The infra doc |

A record that mixes kinds keeps only its architecture part. For each other part, name the kind and the file it goes into, and move it there or hand it over as a list.

When sorting a set of records, give every record one verdict from the table (architecture, product, convention, ops), with the reason in one line. Merge architecture records that decide the same thing.

The gate is done when each decision, or each part of a mixed record, has one verdict and a destination.

## 2. Interrogate the four inputs

The four inputs are **Goals, Assumptions, Options, Decider(s)**. They are the spine of the interrogation and of the record. `references/durable-decisions.md` gives the reasoning behind each; read it before the first interrogation in a session.

Diagnose first which input is thin or missing, and probe there. "Let's use Postgres" has usually skipped Goals and Options and smuggled in Assumptions. Ask a few sharp questions, listen, follow up; adapt them to the decision. A question the user cannot answer yet becomes a loose point in the record, with the condition that will resolve it.

1. **Goals.** Classify each goal: result-bound (done when metric X reaches Y), delivery-bound (done when artifact A ships) or time-bound (done in N days whatever the scope). State the non-goals: what this decision chooses not to solve.
2. **Assumptions.** Hunt the load-bearing ones about volume, load, time, money, people, and compute, memory, disk or network. Ask which one, if false, flips the answer, and the risk if it is wrong.
3. **Options.** Include "do nothing". Run the **peer check**: options must be peers; a tool against a library that wraps it is a category error, so name the right first-level comparison. **Steelman** every option, chosen and rejected: its best case, argued as its champion would argue it, with the champion absent. An option you cannot steelman has not earned its place or its rejection. Assess cost and security for every option. Apply the **boring test**: is this the standard choice, or a preference dressed as a decision? Deviate from the standard only for a stated, meaningful gain. The decision rests on the inputs, never on who advocates it.
4. **Decider(s).** Ask the user who makes the call, a named person or committee, and who is consulted, reviews and is informed. Confirm the consulted people were asked before the call.

Close with the **durability** question: if none of the four inputs change, will this decision hold in six months? An unstable input becomes a loose point.

The interrogation is done when every goal has a bound type, every load-bearing assumption has a risk, every option has a steelman, and the decider is named or recorded as open.

## 3. Write the record

Use `references/adr-template.md` as the skeleton. Use the ID and file name pattern of the repo's existing records; with none, ask the user. Fill only what the interrogation established. One record holds one decision, unless the decisions are sequential and dependent; then number them Decision 1, Decision 2 inside it.

Every record meets these rules:

- **Decision and reasons only.** Each sentence states the decision, a reason, a consequence or an open point. The record has no sentence about itself, its history, its sources, a merge, who wrote it or what changed.
- **No tautology.** No heading, label, table row or sentence restates its own name or the line above it. Cut the row, or replace it with what it was standing in for.
- **Legend.** In the body, cite another record by its ID only. A record that cites any ends with a `Records named here` table: ID, title, kind.
- **Steelman every option.** Each option, chosen or rejected, has a `Steelman` line that argues for it as its champion would. Each rejected option also has a `Why it lost` line. A case against an option is never its steelman.
- **True now.** Read the code before you state what it does. Where the code does not yet do what the decision says, say so in plain words, and add the gap as an open step in the implementation plan and as a loose point, each with `file:line`. No sentence claims the code does what it does not.
- **Evidence label on every number.** Each number carries one of: Measured (you ran the command or query), Reported (a named person or document states it), Inferred (derived; give the reasoning), Open (not known yet).
- **Cast from the user.** Decision maker, authored, reviewed, consulted and informed name only the people the user names. Leave out any role the user names nobody for. Never fill a role from git history, an owners file, or yourself.
- **Writing check.** Save the record, run `node ~/.claude/scripts/writing-check.js FILE`, and fix every flag. Name any flag you leave, with the reason, in your reply.

## 4. Self-check

Before you deliver a record, or a review of records, check each item and fix what fails:

- [ ] Every option has a steelman that argues **for** it. A chosen option with only a case against it fails.
- [ ] Every claim about current code matches the code at the `file:line` you read. A claim the code contradicts fails.
- [ ] Every fact this record shares with another record agrees with it: the same number, name, component or status. Where two disagree, find the true one in the code or ask the user, and fix both.
- [ ] Nothing in the record failed the gate: no product, convention or ops content left in it.
- [ ] Goals classified, non-goals stated, each load-bearing assumption has a risk, the decider is named or open.
- [ ] Every number has an evidence label; every cited record is in `Records named here`.
- [ ] Nothing rests on who proposed the decision.

When reviewing existing records, report per record: the gate verdict, each rule it breaks with the line, and the fix.
