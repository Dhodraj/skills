---
name: grill-the-implementation
description: "Grill the technical implementation details of a plan: the choices an agent would otherwise guess, such as API, webhook, event or queue, storage, auth, failure handling and deployment. Use when the user says 'grill the implementation', or before to-tickets when a plan leaves open how systems talk, where data lives or what happens on failure. A plain 'grill' is `grilling`."
---

Interview the user about the technical implementation details until every choice the build needs is settled, and nothing is left for a builder to guess. What the feature does is already agreed; this skill settles how it is built.

**Why:** An agent builds whatever it is asked, and fills every unsettled technical choice with a guess. A guess about how two systems talk, where data lives or what happens on failure is cheap to make and expensive to undo. Settle those choices while they are still words.

## The rounds

Map the choices as a **design tree**. The **frontier** is every choice whose prerequisites are settled. Ask the whole frontier in one round, number each question, and give your recommended answer. Then wait. Each answer moves the frontier; recompute it and ask the next round.

Ask each round with the question tool when one is available, up to four questions per call, recommended option first. If nobody can answer, stop and write the open questions into the file.

## Round one: what the build touches

Before any technical question, state in a few lines what is being built and which parts of the system it touches. Then go through the areas below and mark each one **in** (the build makes a choice there) or **out** (it makes none, with a one-line reason). Ask only about areas marked in. List the areas marked out at the end, so the user can pull one back in.

## The areas

Each area names the choices to look for.

- **Domain:** the data model and the process it follows. Terms and ADRs belong to `domain-modeling`.
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
- Recommend one. Prefer what the codebase already uses, unless the quality that decides says otherwise; say so when it does.
- Show what already exists. Finding facts is your job: when a question needs a fact from the code, the config or the running system, send a sub-agent to find it. Questions downstream of an open fact wait; ask the rest now. Never ask the user for a fact you can look up.
- One that only the user can decide (cost, a vendor, a deadline, a risk they accept) is theirs. Put it to them and wait.

## The result

When the frontier is empty and the user confirms, write one file of decisions. Put it next to the plan or spec when there is one, else in `.scratch/<feature-slug>/technical-decisions.md`. One row per decision:

| Decision | Choice | Why | Quality it serves | Rejected, and why |
|---|---|---|---|---|

Under the table, list the areas marked out, each with its reason.

Hand the file to `to-tickets`: each ticket names the decisions it implements, so a builder's brief carries the choice and never says "decide". Do not start building until the user says to.
