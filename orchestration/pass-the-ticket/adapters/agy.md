# Antigravity adapter

`agy` is the Google Antigravity CLI. The worker edits files and leaves them uncommitted. The Master reviews the changes and commits them.

## Model

| `who-builds` row | Model |
|---|---|
| opus | `gemini-4-hydrogen-xhigh` |
| sonnet | `gemini-4-hydrogen-high` |
| haiku | `gemini-3.8-flash-medium` |

The effort is part of the slug. Pass no `--effort`: agy rejects it for these models and can fall back to a different model without stopping. When a model retires, check the slugs with `agy models`.

## Tickets in another repository

Use a clone in the folder for the account that owns the target repository. Run `git-whoami` in that clone and confirm the identity matches the owner. From the clone root, create the worktree and run the start command below so both git `--add-dir` paths point into that clone.

## Start command

```bash
WT="$(pwd -P)/.claude/worktrees/agy-NN"
hc run --bg --name agy-NN --cwd "$WT" -- \
  agy --model <model> --sandbox --mode auto \
  --settings "{\"trustedWorkspaces\":[\"$WT\"]}" \
  --add-dir "$(git rev-parse --path-format=absolute --git-common-dir)" \
  --add-dir "$(git rev-parse --path-format=absolute --git-common-dir)/worktrees/agy-NN" \
  --add-dir "<absolute RUN>"
```

The two git folders let the worker run `git status` and `git diff`. Give every path in its physical form (`pwd -P`). agy compares paths without resolving symlinks, so a worktree under a symlinked folder such as `/tmp` counts as outside the workspace and each edit stops for approval.

`--settings` trusts the worktree for this session only and writes nothing to `~/.gemini/antigravity-cli/settings.json`. Without it, a "Trust this folder?" dialog blocks the start.

## What it can reach

Inside the sandbox, a command reaches the workspace, the added folders and `/tmp`, with no network. It cannot read `~/.config/git` or `~/.ssh`, so a commit with the user's identity and signature fails there.

In `auto` mode the model can rerun any command with `BypassSandbox: true`, and agy approves it without asking. That command runs as the user, with network and the Herdr Core socket. `toolPermission` does not change this: `proceed-in-sandbox` still allows the bypass, and `strict` asks before every edit and command. Treat the worker as unsandboxed.

## Prompt

Use these in place of the prompt's steps 4 and 5:

```text
4. Leave every change uncommitted in the worktree. Run no git add, git commit, git reset or git stash, and set no GIT_CONFIG_GLOBAL, GIT_CONFIG_SYSTEM, user.name or user.email.
5. Write <absolute RUN>/results/<NN>.md as Situation, Background, Assessment, Recommendation. List every file you created, changed or deleted. List each acceptance criterion with the command you ran and its result.
```

## Commit

After reading the result file, in the worktree:

1. `git log --oneline origin/main..HEAD` prints nothing. If it prints commits, the worker committed: run `git reset --soft origin/main` to keep the changes and drop the commits.
2. `git status --porcelain` lists the same files as the result file. Stop and read the diff for any file only one of them lists.
3. Stage those files by name and commit them with the commit format from the `commit` skill. The opus review then reads this commit.

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

- A start shows `--effort is not supported`, or the status bar names a model other than `--model` → close the worker and start it again without `--effort`.
- `blocked` with "Reason: outside workspace" on a file in the worktree → a path was not physical. Close the worker and start it again with the start command as written.
- "No capacity available for model" → agy retries on its own after about a minute. Wait.
