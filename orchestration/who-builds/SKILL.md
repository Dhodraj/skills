---
name: who-builds
description: "Use when about to start a sub-agent, or when writing a ticket or brief that another agent runs. Picks opus, sonnet or haiku, shapes the brief for that model, and sends the result to an opus review. Not for cutting a plan into tickets: that is `to-tickets`. A build of several tickets across workers is `colony:split-the-work`."
---

# Who builds

Opus plans, judges and reviews. Sonnet builds and verifies from a written brief. Haiku does one mechanical step whose result a command can check. Opus reviews every sonnet or haiku result before anyone acts on it.

## Triggers

- About to call Agent → if the user named a model or agent for this task or phase, use it; otherwise pick the first row of the table that fits. Pass it as `model:`. A model from another agent CLI (for example, a Codex model) goes through `pass-the-ticket`, not Agent.
- Tempted to fork for a cheaper task → start a fresh agent instead.
- Writing a ticket or brief → start it with `Model: <model>, because <the row that fits, or "the user named it">.`
- Writing a ticket, or a brief whose output is text an agent will keep reading (a skill, a rule, a prompt) → read the `writing-for-agents` skill first. A one-off sonnet or haiku brief needs only the checklist under "A sonnet or haiku brief".
- Writing a sonnet or haiku brief → end it with the worker rules below.
- The brief still says "decide", "design" or "choose" → the task is opus. Settle the choice yourself, or keep the task.
- Tempted to hand sonnet findings to merge, rank, or weigh against each other → opus. Sonnet only confirms or rejects each finding, one at a time, against the evidence the brief names.
- Unsure which row fits → opus.
- A sonnet or haiku result comes back → do not act on the worker's summary. For a lookup or a command's output, read the output file yourself if you run opus, else start an opus review. For a build or a change, start an opus review sub-agent that reads the diff against the brief.
- A result deletes a check as covered by another → name the fault both catch. If the remaining check misses a case the deleted one caught, or the worker's report names such a case, keep the check and ask the user.
- The review finds a gap in the brief → fix the brief as well as the result.
- A skill named here is not installed → do that step as this file describes it (for `writing-for-agents`, the checklist under "A sonnet or haiku brief"), say which skill was missing, and do not install it without the user's consent.

## Pick the model

| Task | Model |
|---|---|
| A plan, a design, a choice between options, or a decision that is the user's | opus |
| A change to a rule, skill, hook, setting or permission, or anything that loosens or tightens a control | opus |
| A review, or merging, ranking or weighing review findings | opus |
| A build whose ticket leaves no design choice, with acceptance tests that decide pass or fail | sonnet |
| Checking each finding against the evidence the brief names: confirm or reject it | sonnet |
| A read-only search or lookup | sonnet |
| One mechanical step with a command-checked result: run a given command and report its output, apply a given list of renames, copy named files, fill a template from given values | haiku |
| Nothing above fits | opus |

Haiku never gives a verdict, never writes text a person reads, and never decides what to change.

## A sonnet or haiku brief

- Names every input file and every output path.
- Gives the acceptance check as a command and its expected result.
- Lists the rules that bind: forbidden paths, test rules, commit format.
- For haiku, lists the steps in order, one action per step.

## Worker rules

Paste these lines word for word:

> - Tempted to edit, create or delete a file the brief does not name → don't. Write it in your report.
> - Tempted to change a test's inputs or assertions so it passes, and the brief does not ask for that change → don't. Leave the test failing, finish the rest, and report it.
> - Tests pass → you are not done. Check each case the brief names, one by one, and say which you checked.
> - A finding is partly right, or fits no verdict cleanly → use the verdict the brief defines for that case. Do not invent a middle verdict.
> - A choice the brief does not settle changes what you build or conclude → do not pick. Finish the parts it does not touch, then report it as Situation, Background, Assessment, Recommendation.
> - Reporting a check → give the command you ran and its result. Do not claim a check you did not run.
> - The brief sets a reply format → keep it. Put these reports in the result file the brief names.
