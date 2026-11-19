---
name: tear-it-apart
description: Review substantial work the way a staff engineer would. Use only when the user asks for a review, an audit or a gap search, asks "would a tech lead approve this", or says yes to an offered review. Builds a coverage matrix, runs a fresh reviewer, fixes, and asks before each further round. Also defines the instruction check for every change that steers Claude.
---

Whoever wrote a piece of work shares its blind spots. A staff review finds the gaps before the user does, by making the work's claims checkable and handing them to a reviewer who did not write it.

## When to offer it

Offer a review in one line before handing over a spec, a design or ADR, a catalogue or mapping, an API or schema contract, a change across several files or a public interface, or anything that claims to cover "all" or "every" case. Say what it covers. Run it only when the user says yes or asks for one. Skip it for one-line fixes, answers to questions, and drafts.

The instruction check at the end is separate: it runs on every change that steers Claude.

## 1. Acceptance criteria

Write three to eight criteria for "done", each checkable by someone who did not write the work. If the request left scope open, state the assumption you made.

## 2. The coverage matrix

Any claim of completeness ("all", "every", "complete", "any") is a claim about a **space**. A list written from memory stops wherever it looks plausible; a **coverage matrix** shows where it stops.

1. Name the **dimensions** of the space. Common ones are the kinds of thing involved, the operations on them, the conditions they run under (modes, versions, roles, scale), the effects of each operation, and the ways each can fail. Use the dimensions this problem actually has.
2. Take each dimension's values from an authoritative source: vendor docs, the real schema, the codebase, a standard, the user's own material. Note the source. At least one source must sit outside the work, such as what comparable tools or standards cover, or you will only find gaps inside the work's own categories.
3. Cross the dimensions. Every cell is **covered** (say where), **not applicable** (say why), or a **gap** (say what is missing).
4. If the cross product is too big, prune it by a stated rule and list what the rule cut.

A missing dimension is the worst miss, because every cell it would have made is missing too. Before trusting the matrix, ask what dimension an expert in this domain would add, and whether boundaries, absence, change over time, concurrency and partial failure all have a place.

## 3. The reviewer

Never review your own work in your own context. Start a fresh `general-purpose` agent, read-only. Give it claims and evidence, not your reasons for believing the work is right. Keep any evidence against a claim, such as a caller, guard, test or source that contradicts it. Give it every file path in the work, the acceptance criteria, the matrix, and this brief word for word:

> You are a staff engineer deciding whether to approve this work. Your job is to find what is missing or wrong, not to confirm what is right; a review that finds nothing is only credible if you can show where you looked. Do not edit any file.
>
> Check, in this order:
> 1. Is a **dimension** of the problem missing from the coverage matrix? This is the most important question.
> 2. Is every cell marked *covered* actually covered where it says?
> 3. Are the acceptance criteria met?
> 4. The cases that break things in any domain: boundaries (empty, zero, maximum, minimum), absence (missing, null, unknown), change over time (versions, time zones, state that moves while you work), concurrency and ordering, partial failure, retries and idempotency, rollback. Translate each into what it means for this work.
> 5. Claims stated as fact without a source, or that contradict the codebase or another part of the work.
> 6. What would break first in production, and would anyone notice?
>
> For each finding give: location, what is wrong or missing, why it matters, severity (blocking, should-fix, minor), and the evidence. End with a verdict: would you approve this, yes or no, and the blocking reasons if no.

Bound the brief: name the files and cap the tool calls. One round suits a moderate change; a spec others will build on may need three.

## 4. Judge, then fix

A finding is evidence, not a ruling. Before acting on a blocking or should-fix finding, check it at the source it names: that the reviewer read the current file, and that its claim survives a wider look. Fix what holds. List the findings you rejected and why, next to the ones you fixed. Never reject a finding about security, data loss or credentials on your own reading alone; if the source does not settle it, keep it open.

Before another round, ask the user, showing the open findings. Each new round gets a new reviewer. Stop after three rounds and report whatever is still blocking.

## 5. Handover

Hand over what was done against the criteria, the matrix (or its path) with counts per disposition, each round's verdict and findings by severity (fixed and rejected counted apart), the gaps and risks that remain, and what the user should still check. Never call the work complete while the matrix has open gaps.

## The instruction check

Any change that steers Claude (`CLAUDE.md`, a rule, a skill, a hook or a setting) gets this check before it is applied. A rule drafted from one project's misses tends to describe that project; the check makes it generic, needed and cheap to carry.

Give a fresh read-only `general-purpose` reviewer the proposed text, the evidence behind it (each incident, its project, and who found it), and the current file. It returns the wording to apply and one line per test:

1. **Spread.** How many projects the incidents come from, and who found them. Narrow evidence does not block a rule; it tells the reviewer how far to generalise the wording.
2. **Generic wording.** Name the reasoning that failed, as generally as the evidence allows. No product names, domain terms or project specifics, except an example marked as one.
3. **Transfer.** Read the rule against three unrelated tasks, such as writing a document, debugging, and researching a tool. It must help or stay silent on each.
4. **Overlap.** If an existing line covers part of it, tighten that line instead.
5. **Load.** Lines added and removed, and when the text loads: every request (`CLAUDE.md`, a skill description), matching files (a scoped rule), on use (a skill body), or when a hook fires. Prefer the narrowest. `CLAUDE.md` stays under 200 lines.
6. **Conflict.** It must not contradict another rule or an accepted decision record.
7. **Need.** Would deleting it change what Claude does, given what the system prompt, tool descriptions, hooks and other loaded files already say? Name the miss it prevents, or drop it.
8. **Security.** Does it loosen or tighten a permission, check, secret or confirmation, and what does that reach, including runs nobody watches? A loosening needs the user's explicit approval.

Apply the returned wording only with the user's approval, and record the results next to the change.
