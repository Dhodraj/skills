# Codex adapter

## Model

| `who-builds` row | Model | Effort |
|---|---|---|
| sonnet | `gpt-5.6-terra` | `high` |
| haiku | `gpt-6-luna` | `medium` |

## Start command

Give Codex no network and no access to Herdr Core: with the Herdr Core socket it could run commands outside its sandbox.

```bash
hc run --bg --name codex-NN --cwd "$PWD/.claude/worktrees/codex-NN" -- \
  codex -m <model> -c model_reasoning_effort=<effort> \
  -s workspace-write -a never \
  --add-dir "$(git rev-parse --path-format=absolute --git-common-dir)" \
  --add-dir "<absolute RUN>"
```

The sandbox keeps `.git` read-only unless it is added, so the git folder is what lets Codex commit.

## Session ID

The UUID at the end of the file name that this prints:

```bash
rg -l --fixed-strings "<worktree path>" ~/.codex/sessions/$(date +%Y/%m/%d)
```

## Known failures

- "access token could not be refreshed" → once no other Codex worker is mid-turn, run `codex app-server daemon restart`, close that worker, and start a fresh one.
- A commit fails with "Operation not permitted" under `.git` → stop passing tickets to Codex and tell the user.
