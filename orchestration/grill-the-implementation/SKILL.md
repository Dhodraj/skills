---
name: grill-the-implementation
description: "Use when a plan is agreed, tickets are next, and how it is built is still open: how systems talk (API, webhook, event, queue), where data lives, auth, what happens on failure, how it ships. Also for 'grill the implementation'. Writes the decisions to a file that `to-tickets` reads. Not for what to build or whether: a plain 'grill' is `grilling`. Terms are `domain-modeling`; ADRs are `to-adr`."
---

Settle every technical choice the build needs, so no builder guesses. What the feature does is already agreed; this settles how it is built.

Call the Skill tool with "grilling", and run it on how the agreed plan is built, with these changes:

1. **Scope first.** Before round one, state in a few lines what is built and which parts of the system it touches. Mark each area below **in** (the build makes a choice there) or **out** (it makes none, with a one-line reason). The design tree holds only the areas marked in.
2. **Ask with the question tool** instead of grilling's text format, recommended option first. Without the tool, use grilling's format. The tool takes up to four questions per call. A frontier of more than four takes several calls in the same round: ask first the four that unblock the most others.
3. **Frame each question** by the rules under "Each question".
4. **End with the result file.** In the last round, list the areas marked out so the user can pull one back in. Then write the result file and stop. Do not start building until the user says to.

## Triggers

- An option turns on how an outside service, library or protocol behaves (delivery guarantees, retries, rate limits, limits on size or time) → have a sub-agent read its current docs, and cite the page in the question.
- The codebase already solves this choice somewhere → recommend that pattern, and show the file. Recommend a new one only when the deciding quality says so, and say which.
- Tempted to ask about an area marked out → mark it in first, with the reason.
- Nobody can answer → stop, and write the open questions under "Open" in the result file.
- A question is about terms or the domain model → run `domain-modeling` for that branch. A question about an ADR → run `to-adr`.
- A skill named here is not installed → do that step as this file describes it, say which skill was missing, and do not install it without the user's consent. Without `grilling`, run the interview as in the next section.

## Without grilling

Map the choices as a design tree: each decision branches into the decisions that hang off it. The frontier is every decision whose prerequisites are settled. Each round, ask the whole frontier, numbered, each with your recommended answer, then wait for the answers. A question that depends on another one still open waits for a later round. Have a sub-agent find facts; never ask the user for one. The interview is done when the frontier is empty and the user confirms.

## The areas

Each area names the choices to look for.

- **Domain:** the data model and the process it follows.
- **Integration and communication:** who starts the exchange (push or pull); synchronous call or asynchronous message; API, webhook, event, queue, polling, schedule or file; the contract and its versioning; delivery (at most once, at least once), ordering and idempotency.
- **Persistence:** where data lives, the read and write pattern, schema changes and migration, retention and deletion.
- **Process control and business rules:** where each rule lives, state and its transitions, what runs in parallel, what runs in batches.
- **Validation and errors:** what is checked at which boundary; what happens on each failure: retry, backoff, dead letter, compensation, or tell the user.
- **User interface:** where state lives, loading, empty and error states; output and exit codes for a CLI; language.
- **Security and safety:** authentication and authorisation at every boundary, secrets, data protection, abuse and threats, rules the product must comply with.
- **Patterns:** reuse of the patterns the codebase already has, or a new one and why.
- **Development:** how it is tested, built, configured and released; feature flags; how a later change stays cheap.
- **Operation:** logging and tracing, monitoring and alerts, scaling, availability, recovery, setup.

## Each question

- Say which choice it settles, and give two to four real options with their trade-offs.
- Name the quality that decides between them, in ISO 25010 terms: performance (time, resources, capacity), compatibility, reliability (availability, fault tolerance, recoverability), security, maintainability, flexibility (scalability, replaceability), safety, interaction capability.
- Recommend one, and show what already exists: the file, config or service that does this today.

## The result

When the frontier is empty and the user confirms, write one file of decisions. Put it next to the plan or spec when there is one, else in `.scratch/<feature-slug>/technical-decisions.md`. One row per decision:

| Decision | Choice | Why | Quality it serves | Rejected, and why |
|---|---|---|---|---|

Under the table, list the areas marked out, each with its reason, then any questions under "Open".

Hand the file to `to-tickets`: each ticket names the decisions it implements, so a builder's brief carries the choice and never says "decide".
