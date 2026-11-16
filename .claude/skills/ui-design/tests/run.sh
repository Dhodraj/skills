#!/usr/bin/env bash
# Tests for this skill's scripts.
#
#   ./tests/run.sh            the offline tests: no network, no browser
#   ./tests/run.sh --network  also search the real registries
#
# The browser checks are not here: measure.js runs inside a page, and the
# testing report records what it returned against the fixtures in
# tests/fixtures/.
# No `-e`: a failing assertion must be counted and reported, not abort the run.
set -uo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
skill="$here/.."
check="$skill/scripts/check-sources.js"
find_components="$skill/scripts/find-components.js"
network=0
[[ "${1:-}" == "--network" ]] && network=1

pass=0; fail=0
tmp="$(mktemp -d)"
[[ -n "$tmp" && -d "$tmp" ]] || { echo "could not make a temporary directory"; exit 2; }
trap '[[ -n "${tmp:-}" && -d "$tmp" ]] && rm -rf "$tmp"' EXIT

ok()  { if [[ "$2" == "$3" ]]; then pass=$((pass+1)); else fail=$((fail+1)); printf 'FAIL %s\n  want: %s\n  got:  %s\n' "$1" "$3" "$2"; fi; }
# -- so a pattern that starts with a dash is a pattern, not an option.
has() { if grep -q -- "$3" <<<"$2"; then pass=$((pass+1)); else fail=$((fail+1)); printf 'FAIL %s (missing %s)\n  got: %s\n' "$1" "$3" "$2"; fi; }
hasnt() { if grep -q -- "$3" <<<"$2"; then fail=$((fail+1)); printf 'FAIL %s (unexpected %s)\n' "$1" "$3"; else pass=$((pass+1)); fi; }

run()  { node "$check" "$1" 2>&1; }
code() { node "$check" "$1" >/dev/null 2>&1; echo $?; }

# ---------------------------------------------------------------- sources.json

good='{"version":1,"updated":"2026-10-27",
 "components":[{"id":"@a","url":"https://a.test","registry":"https://a.test/r/{name}.json",
   "for":["table"],"stack":"react","licence":"MIT","licence-read":"a/LICENSE, 2026-10-27"}],
 "screens":[{"id":"b","url":"https://b.test","for":["dashboard"],"stack":"react",
   "licence":"MIT","licence-read":"b/LICENSE, 2026-10-27"}],
 "rejected":[{"url":"https://c.test","reason":"paid"}]}'

printf '%s' "$good" > "$tmp/good.json"
ok  "a good file passes" "$(code "$tmp/good.json")" "0"
has "it counts the sources" "$(run "$tmp/good.json")" "2 sources (1 searchable), 1 rejected"

bad() { python3 -I -c "
import json,sys
d=json.loads(open('$tmp/good.json').read())
exec(sys.argv[1])
open('$tmp/bad.json','w').write(json.dumps(d))
" "$1"; }

bad "d['components'][0].pop('licence')"
ok  "a missing licence fails" "$(code "$tmp/bad.json")" "1"
has "it names the field" "$(run "$tmp/bad.json")" "has no licence"

bad "d['components'][0].pop('licence-read')"
has "a licence with no reading note is caught" "$(run "$tmp/bad.json")" "no licence-read note"

bad "d['components'][0]['registry']='https://a.test/r/button.json'"
has "a registry url without {name} is caught" "$(run "$tmp/bad.json")" "must contain {name}"

bad "d['components'][0]['catalogue']='r/index.json'"
has "a catalogue that is not a url is caught" "$(run "$tmp/bad.json")" "catalogue is not a url"

bad "d['screens'][0]['id']='@a'"
has "a repeated id is caught" "$(run "$tmp/bad.json")" "repeats"

bad "d['screens'][0]['url']='https://a.test'"
has "a repeated url is caught" "$(run "$tmp/bad.json")" "repeats"

bad "d['rejected'].append({'url':'https://a.test','reason':'x'})"
has "a source that is also rejected is caught" "$(run "$tmp/bad.json")" "also listed"

bad "d['components'][0]['url']='a.test'"
has "a url without a scheme is caught" "$(run "$tmp/bad.json")" "not a url"

bad "d['components'][0]['for']=[]"
has "an empty for list is caught" "$(run "$tmp/bad.json")" "is empty"

bad "d['components'][0]['for']='table'"
has "a for that is not an array is caught" "$(run "$tmp/bad.json")" "must be an array"

bad "d['updated']='27-10-2026'"
has "a bad date is caught" "$(run "$tmp/bad.json")" "YYYY-MM-DD"

bad "d['version']=2"
has "a wrong version is caught" "$(run "$tmp/bad.json")" "version must be 1"

bad "d['rejected'][0].pop('reason')"
has "a rejection without a reason is caught" "$(run "$tmp/bad.json")" "has no reason"

printf 'not json' > "$tmp/broken.json"
ok "an unreadable file exits 2" "$(code "$tmp/broken.json")" "2"
ok "a missing file exits 2" "$(code "$tmp/absent.json")" "2"

ok "the shipped file is valid" "$(code "$skill/sources.json")" "0"

# ------------------------------------------------------------- find-components

usage="$(node "$find_components" 2>&1; echo "exit=$?")"
has "no terms prints the usage" "$usage" "Usage:"
has "no terms exits 2" "$usage" "exit=2"
has "an unknown option is rejected" "$(node "$find_components" x --nope 2>&1)" "unknown option"
has "a bad limit is rejected" "$(node "$find_components" x --limit 0 2>&1)" "--limit must be"

# An empty curated file and no directory leaves nothing to search.
printf '{"version":1,"updated":"2026-10-27","components":[],"screens":[],"rejected":[]}' > "$tmp/empty-sources.json"
mkdir -p "$tmp/skill/scripts"
cp "$find_components" "$tmp/skill/scripts/"
cp "$tmp/empty-sources.json" "$tmp/skill/sources.json"
out="$(node "$tmp/skill/scripts/find-components.js" button --curated-only 2>&1; echo "exit=$?")"
has "no registries to search is an error, not a silent pass" "$out" "no registries to search"
has "and it exits 2" "$out" "exit=2"

# ------------------------------------------------------------------- fixtures

for fixture in dashboard-before.html dashboard-after.html geometry-faults.html; do
  if [[ -f "$here/fixtures/$fixture" ]]; then pass=$((pass+1)); else
    fail=$((fail+1)); printf 'FAIL fixture %s is missing\n' "$fixture"; fi
done

before="$(cat "$here/fixtures/dashboard-before.html")"
after="$(cat "$here/fixtures/dashboard-after.html")"
has   "the before fixture carries colour-only status" "$before" 'class="dot'
hasnt "the after fixture has no colour-only status"   "$after"  'class="dot'
has   "the before fixture scrolls sideways by design" "$before" 'min-width: 760px'
has   "the after fixture names its row controls"      "$after"  'aria-label="Actions for run'
# Every run in the before fixture still has its row control in the after one.
for id in 000418-GLA 000419-EDI 000420-ABD 000421-INV 000422-GLA; do
  has "run $id kept its row control" "$after" "Actions for run RUN-2026-10-27-$id"
done

# The geometry fixture has to carry one of each fault, and the script has to
# look for all five. What the script returns against it is a browser result,
# recorded in docs/testing-report.md; this only keeps the pair in step.
geometry="$(cat "$here/fixtures/geometry-faults.html")"
has "the geometry fixture hides an overflowing avatar" "$geometry" "overflow: hidden"
has "it carries a 3px inset"        "$geometry" "padding: 16px 3px 16px 3px"
has "it carries a cramped bottom"   "$geometry" "padding: 28px 20px 6px"
has "it carries a 2px gap"          "$geometry" "gap: 2px"
has "it carries a wrapped unit"     "$geometry" "128 GB"
has "and one with its unit in a span" "$geometry" "64 <span>TB</span>"
has "and prose that wraps without being a fault" "$geometry" 'class="prose"'
has "it carries a panel with no fault" "$geometry" 'id="sound"'

measure="$(cat "$skill/scripts/measure.js")"
for fault in clipped tightInsets unevenPadding nearTangents wrappedUnits; do
  has "measure.js reports $fault" "$measure" "$fault: $fault.length"
done
has "measure.js exempts a chosen crop" "$measure" 'hasAttribute("data-crop")'
has "craft.md names the measured faults" "$(cat "$skill/references/craft.md")" "measured\*\*: \`tight inset\`"

# ------------------------------------------------------------------ references
# The tactile direction is loaded only when it is picked, so nothing reads it
# by accident. These keep its claims traceable: a file that says it overrides a
# rule has to name a rule that exists.

if [[ -f "$skill/references/tactile.md" ]]; then pass=$((pass+1)); else
  fail=$((fail+1)); printf 'FAIL references/tactile.md is missing\n'; fi

tactile="$(cat "$skill/references/tactile.md")"
craft="$(cat "$skill/references/craft.md")"
gates="$(cat "$skill/references/gates.md")"

has "the direction names its source"      "$tactile" "kosta4a/tactile-design"
has "it lists what it overrides"          "$tactile" "gates.md\` 39"
has "it keeps the Floor rules"            "$tactile" "A Floor rule outranks it"
has "it carries its own never-ship list"  "$tactile" "## Never ship, in this direction"
has "it names the sheet flick threshold"  "$tactile" "0.11 px/ms"
has "directions.md deals it as one of three" "$(cat "$skill/references/directions.md")" "It is still one of three"
has "SKILL.md points at it from stage 3"  "$(cat "$skill/SKILL.md")" "references/tactile.md"
has "craft.md points at it"               "$craft" "tactile.md"
has "NOTICE records the source"           "$(cat "$skill/NOTICE")" "kosta4a/tactile-design, MIT"

# What the direction overrides has to exist where it says it does.
has "gates.md still forbids text under 16px" "$gates" "^39\. \*\*Running text below 16px"
has "gates.md still forbids overshoot"       "$gates" "^35\. \*\*Overshoot easing"
has "gates.md still forbids the default face" "$gates" "^29\. \*\*The default system face"

# The craft rules taken from the same source.
has "gates.md rule 48 is the copy punctuation" "$gates" "^48\. \*\*Title Case"
has "rule 49 is the button label"              "$gates" "^49\. \*\*A button label"
has "rule 50 is the confirmation"              "$gates" "^50\. \*\*A confirmation"
has "Floor rule 3 covers a premature label"    "$gates" "before the real"
has "craft.md carries the worst-case values"   "$craft" "## The shortest and longest real value"
has "craft.md carries the touch rules"         "$craft" "## Touch, where the pointer is a finger"
has "craft.md records the shadow disagreement" "$craft" "holds the opposite on shadow colour"
has "craft.md presses by target size"          "$craft" '`.92` at 22px'
has "craft.md carries the sheet numbers"       "$craft" "0.11 px/ms"

# A direction may bend a number. The floor outranks it, and the file has to say
# where its own look loses to a Floor rule rather than claiming it never does.
has "the direction yields to a Floor rule"     "$tactile" "Floor rule wins and the look"
has "it names the field edge rule"             "$tactile" "A field needs a 3:1 edge"
has "it names the target rule"                 "$tactile" "gates.md\` 11"
has "it names the height rule"                 "$tactile" "does not animate \`height\`"
has "it writes targets in px, not points"      "$tactile" "44pt\` in CSS is 58.7px"
hasnt "its never-ship list stops repeating gates 48" "$tactile" "Title Case labels"
has "directions.md counts the overrides"       "$(cat "$skill/references/directions.md")" "nine rows of the"
has "and names the Reflex rules"               "$(cat "$skill/references/directions.md")" "25, 29, 35, 38 and 39"
has "ui-review keeps the floor out of a waiver" "$(cat "$skill/../ui-review/SKILL.md")" "waive a Floor rule in"

has "craft.md excepts the dark lift ring"      "$craft" "lift ring above is the exception"
has "its travel ladder matches its keyframe"   "$craft" "10 to 12px for a page"

# --------------------------------------------------------------------- network

if (( network )); then
  out="$(node "$find_components" data table --curated-only --limit 5 2>&1)"
  has "a curated search returns results" "$out" "searched"
  has "it names the licence it read" "$out" "MIT"
  out="$(node "$check" "$skill/sources.json" --links 2>&1; echo "exit=$?")"
  has "every source url answers" "$out" "exit=0"
else
  printf 'skipped: the network tests. Run with --network.\n'
fi

printf '%s passed, %s failed\n' "$pass" "$fail"
(( fail == 0 ))
