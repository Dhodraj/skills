---
name: to-codex
description: Hand implementation tickets to OpenAI Codex workers in Herdr Core terminals and take their results back, so Claude and Codex split one batch. Use when the user asks to give tickets to Codex, or to split a batch between Claude and Codex.
---

You are the Master. A Codex worker builds one ticket in its own worktree, commits there and writes the result file. A background wait tells you when it stops. You review and merge its work as you would a Claude worker's.

`hc` below is `~/.local/bin/herdr-core`. `NN` is the two-digit ticket number.

## Triggers

- `HC_TERMINAL_ID` is empty → you are not in a Herdr Core terminal. Say so and stop.
- Choosing tickets for Codex → only tickets with no open blocker whose `who-builds` row is sonnet or haiku. Keep opus rows, tickets that touch `.claude/`, `~/.codex/`, instructions or credentials, and tickets that need the user.
- Codex replies "access token could not be refreshed" → once no other Codex worker is mid-turn, run `codex app-server daemon restart`, close that worker, and start a fresh one.
- A Codex commit fails with "Operation not permitted" under `.git` → stop handing tickets to Codex and tell the user.
- The background wait for `codex-NN` ends → read its last line with `hc read codex-NN`. A `done` line names the result file. A `question` line needs an answer: send it with `hc send codex-NN`, or bring it to the user if the choice is theirs, then start the wait again.
- `hc read` shows no `done` or `question` line → the worker stopped for another reason. Read more of its screen before deciding. Do not resend the prompt blindly.

## Model

| `who-builds` row | Model | Effort |
|---|---|---|
| sonnet | `gpt-5.6-terra` | `high` |
| haiku | `gpt-6-luna` | `medium` |

## Start one worker

Run from the repo root. `RUN` is the run folder that holds the ticket, `queue.md` and `results/`.

1. Make the worktree:
   ```bash
   git fetch origin
   git worktree add ".claude/worktrees/codex-NN" -b "worktree-codex-NN" origin/main
   ```
2. Start Codex in it. Give it no network and no access to Herdr Core:
   ```bash
   hc run --bg --name codex-NN --cwd "$PWD/.claude/worktrees/codex-NN" -- \
     codex -m <model> -c model_reasoning_effort=<effort> \
     -s workspace-write -a never \
     --add-dir "$(git rev-parse --path-format=absolute --git-common-dir)" \
     --add-dir "<absolute RUN>"
   ```
   The sandbox keeps `.git` read-only unless it is added, so the git folder is what lets it commit.
3. Poll `hc get codex-NN | jq -r '.status.state'` every few seconds until it prints `idle`. Then send the prompt below through a quoted heredoc, so the shell expands nothing in it:
   ```bash
   hc send --if idle codex-NN "$(cat <<'EOF'
   <filled prompt>
   EOF
   )"
   ```
   Do not pass the task to `hc run`: a task sent while Codex boots is dropped.
4. Start the wait with the Bash tool's `run_in_background`, so you are told when it ends:
   ```bash
   until hc wait codex-NN --timeout 600 | jq -e '.ended' >/dev/null; do :; done
   ```
5. In `queue.md`, set the ticket's owner to `codex-NN`. Once it has started, add its session ID: the UUID at the end of the file name that `rg -l --fixed-strings "<worktree path>" ~/.codex/sessions/$(date +%Y/%m/%d)` prints.

## The prompt

Fill every `<...>`. Take the commit format from the `commit` skill for this repo.

```text
RUN <run id> ticket #<NN>. You are a build worker for a Claude Master that reads your last line.
1. Read <ticket path>, then <brief path, or "no brief">. Where they name Claude-only tools (the Skill tool, sub-agents, .claude/rules, trail MCP), use the plain equivalent: rg, git, and the commands they name.
2. Work only in <worktree path>, on branch worktree-codex-<NN>. Start no other agents. Do not push or open a pull request.
3. Run every acceptance command the ticket names. Each must pass.
4. Commit with a one-line message in this form: <commit format>. Add no co-author trailer and no AI attribution.
5. Write <absolute RUN>/results/<NN>.md as Situation, Background, Assessment, Recommendation. List each acceptance criterion with the command you ran and its result.
6. End your turn with exactly one line: RUN <run id> #<NN> done | <absolute RUN>/results/<NN>.md
To ask a question, end your turn with exactly one line: RUN <run id> #<NN> question: <one line>. The answer comes as your next message.
<the worker rules from the who-builds skill, word for word>
```

## Take the result back

1. Read `RUN/results/NN.md`.
2. Start an opus review of `git diff origin/main...worktree-codex-NN` against the ticket, as `who-builds` says for any sonnet or haiku result. Check also that `.git/hooks` and `.git/config` are unchanged.
3. Merge through the project's usual path, such as its `merge.sh`. If that path expects a pushed branch or an open PR, push and open it yourself. Update `queue.md`.
4. Close the worker with `hc kill codex-NN`, then `hc rm codex-NN`. Remove the worktree and its branch after the merge.
