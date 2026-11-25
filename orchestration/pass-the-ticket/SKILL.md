---
name: pass-the-ticket
description: Pass implementation tickets to another agent CLI, such as Codex, in Herdr Core terminals and take the results back. Use when the user asks to give tickets to another agent, or to split a batch between Claude and another agent.
---

You are the Master. A worker agent builds one ticket in its own worktree, commits there and writes the result file. A background watcher tells you when it stops. You review and merge its work as you would a Claude worker's.

Each agent has an adapter in `adapters/<agent>.md`: its model table, start command, session lookup and known failures. Read the adapter before you start a worker. If no adapter exists for the agent the user names, say so and stop.

`hc` below is `~/.local/bin/herdr-core`. `<agent>` is the adapter name, such as `codex`. `NN` is the two-digit ticket number.

## Triggers

- `HC_TERMINAL_ID` is empty → you are not in a Herdr Core terminal. Say so and stop.
- The worker shows an error the adapter lists under known failures → do what the adapter says, even if it ended with a `question` line.
- Choosing tickets for another agent → keep tickets with an open blocker or a pending user decision. Choose sonnet or haiku tickets and keep instruction changes. When the user names work for the agent (for example, "use Codex"), send that work on any `who-builds` row, including instruction changes. Use the adapter's model for that row. Keep credentials, `.claude/` and the agent's own config folder excluded unless the user explicitly names them.
- The watcher for `<agent>-NN` ends → read its last line with `hc read <agent>-NN`. A `done` line names the result file. A `question` line needs an answer: send it with `hc send <agent>-NN` (`--if idle` only when the state is `idle`; a `done` worker takes input without `--if`), or bring it to the user if the choice is theirs, then start the wait again.
- The watcher prints `stalled` or `no-status`, or `hc read` shows no `done` or `question` line → the worker is stuck or stopped for another reason. If `hc get` still shows `working` and the working timer is moving, start the watcher again. Check the adapter's known failures, then read more of its screen. Do not resend the prompt blindly.

## Start one worker

Run from the repo root. `RUN` is the run folder that holds the ticket, `queue.md` and `results/`.

1. Make the worktree:
   ```bash
   git fetch origin
   git worktree add ".claude/worktrees/<agent>-NN" -b "worktree-<agent>-NN" origin/main
   # A new worktree has no trail code map; build it so the worker can search with trail.
   (cd ".claude/worktrees/<agent>-NN" && [ -d .trail ] && trail build)
   ```
2. Start the worker with the adapter's start command, named `<agent>-NN`, in that worktree. The adapter says what the worker can reach; use no wider access than it gives.
3. Poll `hc get <agent>-NN | jq -r '.status.state'` every few seconds until it prints `idle`. Save `hc get <agent>-NN | jq -r '.turn'` as `<turn>`. If it is not `idle` within 90 seconds, read the screen with `hc read <agent>-NN` and check the adapter's known failures; a startup dialog is the usual cause. Then send the prompt below through a quoted heredoc, so the shell expands nothing in it:
   ```bash
   hc send --if idle <agent>-NN "$(cat <<'EOF'
   <filled prompt>
   EOF
   )"
   ```
   Do not pass the task to `hc run`: a task sent while the agent boots can be dropped.
4. Start the watcher with the Bash tool's `run_in_background`, so you are told when the worker needs you:
   ```bash
   <this skill's folder>/scripts/watch-worker.sh <agent>-NN <turn>
   ```
   It prints one line: `stopped <state>`, `gone`, `stalled` (no screen change for 20 minutes) or `no-status`.
5. In `queue.md`, set the ticket's owner to `<agent>-NN`. Once it has started, add its session ID as the adapter says.

## The prompt

Fill every `<...>`. Take the commit format from the `commit` skill for this repo.

```text
RUN <run id> ticket #<NN>. You are a build worker for a Claude Master that reads your last line.
1. Read <ticket path>, then <brief path, or "no brief">. Where they name Claude-only tools (the Skill tool, sub-agents, .claude/rules), use git and the commands they name. Search code with the trail CLI first (`trail ask "<what you need>" --source`, `trail grep`, `trail skeleton`, `trail callers`); use rg only where trail has no answer.
2. Work only in <worktree path>, on branch worktree-<agent>-<NN>. Start no other agents. Do not push or open a pull request.
3. Run every acceptance command the ticket names. Each must pass.
4. Commit with a one-line message in this form: <commit format>. Add no co-author trailer and no AI attribution.
5. Write <absolute RUN>/results/<NN>.md as Situation, Background, Assessment, Recommendation. List each acceptance criterion with the command you ran and its result.
6. End your turn with exactly one line: RUN <run id> #<NN> done | <absolute RUN>/results/<NN>.md
To ask a question, end your turn with exactly one line: RUN <run id> #<NN> question: <one line>. The answer comes as your next message.
<the worker rules from the who-builds skill, word for word>
```

## Take the result back

1. Read `RUN/results/NN.md`.
2. For every result from another agent, start an opus review of `git diff origin/main...worktree-<agent>-NN` against the ticket. Have the reviewer run the repository's full check command (for example, `checks/run.sh`) in the worker's worktree if the repository defines one. Check also that `.git/hooks` and `.git/config` are unchanged.
3. Merge through the project's usual path, such as its `merge.sh`. If that path expects a pushed branch or an open PR, push and open it yourself. With no such path, merge the branch locally after the review. Update `queue.md`.
4. Close the worker with `hc kill <agent>-NN`, then `hc rm <agent>-NN`. Remove the worktree and its branch after the merge.
