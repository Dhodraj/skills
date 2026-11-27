# Antigravity adapter

`agy` is the Google Antigravity CLI. The worker only edits files and leaves them uncommitted. The Master runs the commands, reviews the changes and commits them.

## Tickets agy takes

agy is signed in to the work Google account. Tickets from repositories under `~/Documents/Raw by Dhodraj/` stay with Claude or Codex.

Keep these tickets with Claude unless the user names that ticket for agy: a ticket that reads content from outside the repository (web pages, issue or pull request text, downloaded files), and a ticket that installs or updates dependencies. The ticket rules in the skill's Triggers apply too.

## Model

| `who-builds` row | Model |
|---|---|
| opus | `gemini-4-hydrogen-xhigh` |
| sonnet | `gemini-4-hydrogen-high` |
| haiku | `gemini-3.8-flash-medium` |

The effort is part of the slug. Pass no `--effort`: agy rejects it for these models and can fall back to a different model without stopping. When a model retires, check the slugs with `agy models`.

## Tickets in another repository

Use a clone in the folder for the account that owns the target repository. Run `git-whoami` in that clone and confirm the identity matches the owner. From the clone root, create the worktree and run the start command below.

## Start command

After `git worktree add`, which writes the new branch into `.git/config`, save the git control files from the repository root:

```bash
shasum .git/config .git/hooks/* > "<absolute RUN>/agy-NN-git.txt"
```

```bash
WT="$(pwd -P)/.claude/worktrees/agy-NN"
hc run --bg --name agy-NN --cwd "$WT" -- \
  agy --model <model> --sandbox --mode accept-edits \
  --settings "{\"trustedWorkspaces\":[\"$WT\"]}" \
  --add-dir "<absolute RUN>"
```

Give every path in its physical form (`pwd -P`). agy compares paths without resolving symlinks, so a worktree under a symlinked folder such as `/tmp` counts as outside the workspace and each edit stops for approval.

`--settings` trusts the worktree for this session only and writes nothing to `~/.gemini/antigravity-cli/settings.json`. Without it, a "Trust this folder?" dialog blocks the start.

## What it can reach

In `accept-edits` mode, agy applies edits inside the workspace and the added folders without asking. Every shell command stops at "Run this command?", sandboxed or not. Never answer that prompt: a "Yes" can run the command outside the sandbox, as the user, with network.

## Prompt

Use these in place of the prompt's steps 1, 3, 4 and 5:

```text
1. Read <ticket path>, then <brief path, or "no brief">. Use your file read, search and edit tools only. Run no shell command: every command stops your turn for approval.
3. List the acceptance commands the ticket names in the result file. The Master runs them.
4. Leave every change uncommitted in the worktree.
5. Write <absolute RUN>/results/<NN>.md as Situation, Background, Assessment, Recommendation. List every file you created, changed or deleted.
```

## Commit

After reading the result file, in the worktree:

1. From the repository root, `shasum .git/config .git/hooks/* | diff "<absolute RUN>/agy-NN-git.txt" -` prints nothing. Run it before any git command in the worktree. Git runs hooks and config commands, such as `core.fsmonitor`, as you.
2. `git log --oneline origin/main..HEAD` prints nothing. If it prints commits, the worker committed: run `git reset --soft origin/main` to keep the changes and drop the commits.
3. `git status --porcelain` lists the same files as the result file. Read the diff of any file that only one of them lists.
4. Run the acceptance commands from the result file. Each must pass.
5. Stage by name each file that both lists name, and each file from step 3 that you accept. Commit with the commit format from the `commit` skill. The opus review then reads this commit.

## Session ID

The conversation ID for the worktree:

```bash
sqlite3 -readonly ~/.gemini/antigravity-cli/conversation_summaries.db \
  "select conversation_id from conversation_summaries where workspace_uris like '%\"file://$WT\"%' order by last_modified_time desc limit 1"
```

Resume it with `agy --conversation <id>`.

## Herdr state

`hc get agy-NN` reads the state from the screen: `idle`, `working`, `blocked` with `.status.msg` naming the approval, and `done` with `.status.msg` holding the worker's last line. Right after the start, Herdr Core shows `blocked` with kind `auth` and "Sign in required" for under a second, then `idle`. Wait for `idle` as the skill says.

## Known failures

- `blocked` with "Approve Bash: <command>" → the worker tried a shell command. Do not answer it. Copy the command into `queue.md`, close the worker, and tell the user. Take its edits through the Commit steps only if the user says so.
- A start shows `--effort is not supported`, or the status bar names a model other than `--model` → close the worker and start it again without `--effort`.
- `blocked` with "Reason: outside workspace" on a file in the worktree → a path was not physical. Close the worker and start it again with the start command as written.
- `working` with no new output for about a minute, and `~/.gemini/antigravity-cli/cli.log` shows "No capacity available for model" → agy retries on its own. Wait.
