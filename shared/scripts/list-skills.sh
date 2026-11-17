#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"

cd "$REPO"
find . -mindepth 3 -maxdepth 3 -name SKILL.md -not -path './.*' | sed 's#^\./##' | sort
