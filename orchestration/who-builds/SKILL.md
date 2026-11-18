---
name: who-builds
description: "Apply before starting any sub-agent, and when writing a ticket or brief that another agent runs. Picks opus, sonnet or haiku for the task and shapes the brief for that model."
---

# Who builds

Opus plans, judges and reviews. Sonnet builds and verifies from a written brief. Haiku does one mechanical step whose result a command can check. Opus reviews every Sonnet or Haiku result before anyone acts on it.

**Why:** A sub-agent with no model runs the planner's model, so routine work pays the planner's price. A smaller model left with an open choice fills it with a guess that passes the tests and fails review. Settle every choice in the brief, let a check prove the work, and let Opus judge the result.

## Triggers

- About to call Agent → pick the first row of the table that fits, and pass `model:`. A call without one runs the agent definition's model, else `CLAUDE_CODE_SUBAGENT_MODEL` if set, else your own model.
- Tempted to fork for a cheaper task → start a fresh agent instead. A fork always runs your own model.
- Writing a ticket or brief → start it with `Model: <model>, because <the row that fits>.`
- Writing a ticket, or a sonnet or haiku brief → use the `writing-for-agents` skill. End a sonnet or haiku brief with the worker rules below.
- The brief still says "decide", "design" or "choose" → the task is opus. Settle the choice yourself, or keep the task.
- Unsure which row fits → opus.
- A sonnet or haiku result comes back → do not act on the worker's summary. For a lookup or a command's output, read the output file yourself if you run opus, else start an opus review. For a build or a change, start an opus review sub-agent that reads the diff against the brief.
- The review finds a gap in the brief → fix the brief as well as the result.

## Pick the model

| Task | Model |
|---|---|
| A plan, a design, a choice between options, or a decision that is the user's | opus |
| A change to a rule, skill, hook, setting or permission, or anything that loosens or tightens a control | opus |
| A review, or a merge of review findings | opus |
| A build whose ticket leaves no design choice, with acceptance tests that decide pass or fail | sonnet |
| Checking findings against evidence: confirm, reject or merge | sonnet |
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
