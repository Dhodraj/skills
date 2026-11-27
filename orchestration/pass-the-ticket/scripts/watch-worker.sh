#!/usr/bin/env bash
# watch-worker.sh <name> <turn> [stall-minutes]
# <turn> is the worker's turn read with `hc get` before the send; a stop
# counts only once the turn has moved past it.
# Ends, with one line on stdout, as soon as a worker needs the Master:
#   stopped <state>   its turn ended, or it is blocked or errored
#   gone              the terminal exited or no longer exists
#   stalled           its screen has not changed for stall-minutes (default 20)
#   no-status         no status for stall-minutes, such as a dialog Herdr Core
#                     does not classify
# Lines that tick on their own (the Codex working timer, the agy spinner line
# ending in "..." or "... 12s") are ignored when the screen
# is compared.
set -euo pipefail
hc="$HOME/.local/bin/herdr-core"
name="${1:?usage: watch-worker.sh <name> <turn> [stall-minutes]}"
sent="${2:?usage: watch-worker.sh <name> <turn> [stall-minutes]}"
minutes="${3:-20}"
stall=$((minutes * 60))
last=""
since=$(date +%s)

screen() { "$hc" read "$name" 2>/dev/null | grep -vE 'Working \(|esc to interrupt|\.\.\.( [0-9]+s)?[[:space:]]*$' | shasum; }

while :; do
  if ! info="$("$hc" get "$name" 2>/dev/null)"; then echo "gone"; exit 0; fi
  if [[ "$(jq -r '.state' <<<"$info")" != live ]]; then echo "gone"; exit 0; fi
  state="$(jq -r '.status.state // ""' <<<"$info")"
  turn="$(jq -r '.turn // 0' <<<"$info")"
  case "$state" in
    blocked|error) echo "stopped $state"; exit 0 ;;
    done|idle) (( turn > sent )) && { echo "stopped $state"; exit 0; } ;;
  esac
  now=$(date +%s)
  s="$(screen || true)"
  if [[ "$s" != "$last" ]]; then last="$s"; since=$now
  elif (( now - since >= stall )); then
    if [[ -z "$state" ]]; then echo "no-status"; else echo "stalled"; fi
    exit 0
  fi
  # Returns early when the worker's state changes; otherwise checks in after 60 s.
  "$hc" wait "$name" --timeout 60 >/dev/null 2>&1 || true; sleep 3
done
