#!/usr/bin/env bash
set -euo pipefail

# Dev-only script for maintainers of this repo. It is not an installer.
#
# Links every skill under skills/ into the local skill directories this
# machine reads:
#   - ~/.claude/skills
#   - ~/.claude-personal/skills
# Each entry is a symlink into this repo, so a `git pull` keeps the installed
# skills current. Re-run after adding, removing, or renaming a skill.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DESTS=("$HOME/.claude/skills" "$HOME/.claude-personal/skills")

names=()
srcs=()
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  names+=("$(basename "$src")")
  srcs+=("$src")
done < <(find "$REPO/skills" -name SKILL.md -not -path '*/node_modules/*' -print0)

if [ "${#names[@]}" -eq 0 ]; then
  echo "error: no SKILL.md found under $REPO/skills" >&2
  exit 1
fi

for DEST in "${DESTS[@]}"; do
  # A destination that resolves into this repo would write the per-skill
  # symlinks back into the working copy. Stop instead.
  if [ -L "$DEST" ]; then
    resolved="$(readlink -f "$DEST")"
    case "$resolved" in
      "$REPO"|"$REPO"/*)
        echo "error: $DEST is a symlink into this repo ($resolved)." >&2
        echo "Remove it (rm \"$DEST\") and re-run." >&2
        exit 1
        ;;
    esac
  fi

  mkdir -p "$DEST"

  for i in "${!names[@]}"; do
    name="${names[$i]}"
    src="${srcs[$i]}"
    target="$DEST/$name"

    if [ -e "$target" ] && [ ! -L "$target" ]; then
      rm -rf "$target"
    fi

    ln -sfn "$src" "$target"
    echo "linked $name -> $src ($DEST)"
  done
done
