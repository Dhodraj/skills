# Codex adapter

## Model

| `who-builds` row | Model | Effort |
|---|---|---|
| sonnet | `gpt-6.1-terra` | `high` |
| haiku | `gpt-6-luna` | `medium` |

## Start command

The worker has network access, which the user chose. With network on, it can also reach the Herdr Core socket, and through it run commands outside its sandbox, so treat it as an unsandboxed worker.

```bash
hc run --bg --name codex-NN --cwd "$PWD/.claude/worktrees/codex-NN" -- \
  codex -m <model> -c model_reasoning_effort=<effort> \
  -s workspace-write -a never \
  -c sandbox_workspace_write.network_access=true \
  --add-dir "$(git rev-parse --path-format=absolute --git-common-dir)" \
  --add-dir "$(git rev-parse --path-format=absolute --git-common-dir)/worktrees/codex-NN" \
  --add-dir "<absolute RUN>"
```

The sandbox keeps `.git` read-only, and the worktree's own git folder too, unless each is added. Both are what let Codex commit.

## Session ID

The UUID at the end of the file name that this prints:

```bash
rg -l --fixed-strings "<worktree path>" ~/.codex/sessions/$(date +%Y/%m/%d)
```

## Known failures

- "access token could not be refreshed" → once no other Codex worker is mid-turn, run `codex app-server daemon restart`, close that worker, and start a fresh one.
- A commit fails with "Operation not permitted" under `.git` → check that both git folders were added. If they were, stop passing tickets to Codex and tell the user.
- A startup dialog says a model retires → do not answer it. Close the worker, start it again with the successor model in `-m`, and tell the user so the model table gets updated.
