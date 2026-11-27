# Antigravity adapter

`agy` is the Google Antigravity CLI.

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

Give every path in its physical form (`pwd -P`). agy compares paths without resolving symlinks, so a worktree under a symlinked folder such as `/tmp` counts as outside the workspace and each edit stops for approval.

`--settings` trusts the worktree for this session only and writes nothing to `~/.gemini/antigravity-cli/settings.json`. Without it, a "Trust this folder?" dialog blocks the start.

## What it can reach

Inside the sandbox, a command reaches the workspace, the added folders and `/tmp`, with no network. It cannot read `~/.config/git`, so a commit fails there when the git identity comes from an included config file.

In `auto` mode the model can rerun any command with `BypassSandbox: true`, and agy approves it without asking. That command runs as the user, with network and the Herdr Core socket. Treat the worker as unsandboxed.

## Prompt

Add this line to the prompt:

```text
Commit with the repository's git identity as it is. Do not set GIT_CONFIG_GLOBAL, GIT_CONFIG_SYSTEM, user.name or user.email.
```

## Session ID

The conversation ID for the worktree:

```bash
sqlite3 -readonly ~/.gemini/antigravity-cli/conversation_summaries.db \
  "select conversation_id from conversation_summaries where workspace_uris like '%\"file://$WT\"%' order by last_modified_time desc limit 1"
```

Resume it with `agy --conversation <id>`.

## Herdr state

`hc get agy-NN` reads the state from the screen: `idle`, `working`, `blocked` with `.status.msg` naming the approval, and `done` with `.status.msg` holding the worker's last line.

## Known failures

- A start shows `--effort is not supported`, or the status bar names a model other than `--model` → close the worker and start it again without `--effort`.
- The worker's commit has an author other than the `git-whoami` identity, or no signature (`git log --format='%an <%ae> %G?'`) → the worker overrode the git config. Do not merge it. Have the worker reset the commit and commit again with the line under Prompt.
- `blocked` with "Reason: outside workspace" on a file in the worktree → a path was not physical. Close the worker and start it again with the start command as written.
- "No capacity available for model" → agy retries on its own after about a minute. Wait.
