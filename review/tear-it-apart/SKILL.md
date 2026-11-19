---
name: tear-it-apart
description: "Use only when the user asks for a review, an audit or a gap search, asks 'would a tech lead approve this', or says yes to an offered review of a spec, design, catalogue, contract, multi-file change or completeness claim. Builds a coverage matrix, runs a fresh reviewer, judges and fixes, and asks before each further round. A change that steers Claude (CLAUDE.md, a rule, skill, hook, setting or permission) also needs `check-the-instruction`. For a code change where only run-proven findings count, `interrogate` fits."
---

Review the work as a staff engineer who did not write it. Make each claim checkable, then hand the claims to a fresh reviewer.

## Triggers

- The work claims "all", "every", "complete" or "any" → build the coverage matrix before the reviewer starts.
- Part of the work changes CLAUDE.md, a rule, a skill, a hook, a setting or a permission → also run `check-the-instruction` on that part.
- About to brief the reviewer → give it claims and evidence, not your reasons for believing the work is right.
- A finding comes back → check it at its source before you fix or reject it.
- Tempted to start another round → ask the user first, showing the open findings.

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

Start a fresh read-only `general-purpose` agent on opus. Keep any evidence against a claim, such as a caller, guard, test or source that contradicts it. Give it every file path in the work, the acceptance criteria, the matrix, and this brief word for word:

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

When the work is code, add to the brief: "Prove each finding with a command and its output; mark any finding you did not run as unproven."

Bound the brief: name the files and cap the tool calls. One round suits a moderate change; a spec others will build on may need three.

## 4. Judge, then fix

A finding is evidence, not a ruling. Before acting on a blocking or should-fix finding, check it at the source it names: that the reviewer read the current file, and that its claim survives a wider look. Run an unproven code finding's check yourself. Fix what holds. List the findings you rejected and why, next to the ones you fixed. Never reject a finding about security, data loss or credentials on your own reading alone; if the source does not settle it, keep it open.

Each new round gets a new reviewer. Stop after three rounds and report whatever is still blocking.

## 5. Handover

Hand over what was done against the criteria, the matrix (or its path) with counts per disposition, each round's verdict and findings by severity (fixed and rejected counted apart), the gaps and risks that remain, and what the user should still check. Never call the work complete while the matrix has open gaps.
