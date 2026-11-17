# Restructure plan: adopt the mattpocock/skills layout

This repo moves to the shape of `mattpocock/skills`. The skills move to
`<bucket>/<name>/` at the repo root. The repo gains a contract, a scope bar, a rejected-ideas
folder, a human page per skill, cross-agent manifests, a plugin manifest and
versioned releases. Prose loses its em dashes.

Changed on 2026-11-17, after stage 2: the user moved the buckets to the repo
root, so `skills/ui/` became `ui/`. The user also added two buckets from
Claude-System: `review` (`staff-review`) and `orchestration`
(`colony-orchestrate`, `constraint-ledger`). Stages 1 and 2 below describe
the old path. Later stages use the new one and cover all six skills.

Also on 2026-11-17, the user moved `docs/`, `demo/` and `scripts/` into
`shared/`, so the repo root holds only the skill buckets, `README.md` and
`LICENSE`. Read `docs/`, `demo/` and `scripts/` below as `shared/docs/`,
`shared/demo/` and `shared/scripts/`. The user also removed trail from this
repo: `.trail/` and its session hook are gone. Its three learnings are in git
history at commit `eb962f7`.

The user then asked for the files a public repository needs. `.github/` now
holds `CONTRIBUTING.md`, `SECURITY.md`, a pull request template and two issue
templates, so those two rows left the deferred table.

Nothing in the plan is done yet. Each stage below is a commit.

## Questions, answered

Both were asked and answered on 2026-11-17.

1. The plan lands in its own commit, and stage 1 runs straight after it.
2. `scripts/link-skills.sh` writes to `~/.claude/skills` and
   `~/.claude-personal/skills`, which is where the six links sit today.
   Upstream writes to `~/.claude/skills` and `~/.agents/skills`, so the second
   path is adapted to this machine. No link goes back into this repo.

## Where the shape comes from

The upstream tree was read on 2026-11-17 at `HEAD`, with
`git clone --filter=blob:none --no-checkout`. It holds 184 tracked paths.
Counts: 61 skill files under `skills/engineering/`, 20 under
`skills/productivity/`, 22 under `skills/in-progress/`, 10 under
`skills/misc/` and 1 under `skills/deprecated/`.

Three counts set the limits of the copy:

- Zero `references/` directories.
- Zero tests.
- Two subdirectory names inside a skill, `agents/` and `scripts/`.

## Decisions taken

| Decision | Chosen |
|---|---|
| Skill path | `<bucket>/<name>/SKILL.md`, buckets at the repo root |
| Em dashes | removed repo-wide, in their own commit |
| Plugin manifests | yes |
| `agents/openai.yaml` and the invocation split | yes |
| Changesets and `CHANGELOG.md` | yes, with pnpm, private at `0.1.0` |
| Package and plugin name | `skills`, matching the remote |
| ADR home | `docs/` only, no `.agents/adr/` |
| A docs page per skill | dropped, no site to publish it to |
| Splitting `craft.md` by moment | deferred, recorded as such |
| `CLAUDE.md` size | four blocks, 60 lines at most |
| This plan | `docs/decisions/restructure-plan.md` |

## Stage 1: move the tree (done, 2026-11-17)

Move each skill with `git mv`, so history follows:

```
.claude/skills/ui-design  -> skills/ui/ui-design
.claude/skills/ui-find    -> skills/ui/ui-find
.claude/skills/ui-review  -> skills/ui/ui-review
```

`.claude/settings.json` stays where it is. It holds the trail hook, which is
not a skill. Delete `.claude/skills/` once it is empty.

Six symlinks point into the old path today, three in `~/.claude/skills` and
three in `~/.claude-personal/skills`. All six break on the move. Add
`scripts/link-skills.sh`, adapted from upstream, to recreate them from
`skills/`. Keep both destinations, because both exist on this machine.

Add `scripts/list-skills.sh`, which is six lines upstream and prints every
`SKILL.md` path.

**Verify:** run `bash skills/ui/ui-design/tests/run.sh`, which resolves its
own directory and must still report 93 passed. Run it again with `--network`
for 96. Run `scripts/link-skills.sh` and read back all six symlinks with
`ls -l`. Then start a session in another folder and confirm a skill loads.

**Risk:** claude Code auto-discovers `.claude/skills/` for the folder it is
working in. After the move, these skills load in this repo only through the
symlinks in the home directory. If that proves wrong in practice, the
fallback is a `.claude/skills/<name>` symlink into `skills/ui/<name>`.

## Stage 2: the lists that must agree (done, 2026-11-17)

Upstream requires every promoted skill to appear in the top-level `README.md`
and in its bucket's `README.md`, with the name linked to its `SKILL.md`.
Entries group under **User-invoked** and **Model-invoked**.

- Write `skills/ui/README.md` with one line per skill.
- Rewrite the `README.md` file tree for the new paths.
- Fix `docs/guides/install-and-invoke.md`, which prints the old tree and the test
  counts.

**Verify:** `scripts/list-skills.sh` output matches both README files.

## Stage 3: the bar, and the ideas already rejected

Upstream `SCOPE.md` holds a two-part bar. An idea stays open only if it
describes an observed failure in a real session, and fits the philosophy.
Each rejected concept gets one file in `.out-of-scope/`, named in kebab-case
after the concept.

`.out-of-scope/` is the single home for a rejection. Where a rejection came
from one of the three removed trail learnings, the file states it and names
the learning's path at commit `eb962f7`. `docs/research/testing-report.md` keeps its commands, counts and browser
measurements. Its two narrative passages move here: the four blocking
instruction-check findings from 2026-11-13, and the three parts rejected on
2026-11-16.

Each file carries four parts: what was proposed, why it was rejected, what to
do instead, and the date it was decided. An undated rejection cannot be
reopened on new evidence.

Ten files to write, each from a decision this repo already made:

| File | What it rejects |
|---|---|
| `score-as-a-stop-condition.md` | a rating out of ten or a hundred as the reason to stop |
| `pass-cap-that-ends-in-a-report.md` | a fixed number of fix passes, after which defects are reported |
| `exit-condition-against-measure-js.md` | a stop rule written against a script that returns no verdict |
| `re-look-scoped-to-the-filing.md` | re-checking only the width a finding was filed at |
| `vendoring-a-borrowed-style.md` | copying an upstream style repo into this one |
| `one-house-style-for-every-rule.md` | putting a borrowed palette and scale into the always-loaded files |
| `source-recorded-but-unused.md` | recording a source and changing no rules |
| `a-default-aesthetic.md` | one look applied before the user picks a direction |
| `a-score-in-a-review-report.md` | a number out of 100 at the top of a review |
| `per-skill-docs-pages.md` | a human page per skill, with no site to publish it to |

An eleventh records a deferral rather than a rejection:
`splitting-craft-md-by-moment.md`. The split is unproven and invites a rule
landing in the half nobody loaded, so it waits for a measured need.

**Verify:** every file carries the four parts and a date. `SCOPE.md` links
all eleven.

## Stage 4: the invocation split

Upstream marks a skill user-invoked with `disable-model-invocation: true` in
its frontmatter, and `policy.allow_implicit_invocation: false` in
`agents/openai.yaml`. A model-invoked skill carries neither.

Its `agents/openai.yaml` is four lines:

```yaml
interface:
  display_name: "TDD"
  short_description: "Test-driven red-green-refactor"
```

All six skills stay model-invoked. The depth table at `SKILL.md:17` scales
a copy edit down to three stages, so a wrong start costs little. A
user-invoked design skill would not run when it should. Add the three
`agents/openai.yaml` files and record that decision.

**Verify:** no file gains `disable-model-invocation`. Each
`agents/openai.yaml` parses as YAML. Each bucket `README.md` says the same
thing.

## Stage 5: the plugin manifests

Upstream ships `.claude-plugin/plugin.json` with a `skills` array of 27
paths, and `.claude-plugin/marketplace.json` describing its own marketplace.

- Write both, named `skills` to match the remote, with six skill paths
  and the MIT licence this repo already carries.
- Keep the version in step with `package.json`.

The symlink is the route on this machine. The manifests exist so anyone else
can install. `CLAUDE.md` block three states that, and states the hazard.

**Verify:** `claude plugin validate . --strict` exits zero. `plugin.json` and
`package.json` carry the same name and the same version.

## Stage 6: versioned releases

Upstream uses changesets, a private `package.json` at version 1.3.2, a
`CHANGELOG.md`, and `scripts/sync-plugin-version.mjs` to copy the version
into `plugin.json`.

Upstream sets `"packageManager": "npm@10.9.4"`. This machine forbids npm, so
the equivalent here is pnpm, and every command runs as `pnpm` or `pnpm dlx`.

- Write `package.json`, named `skills`, `private: true`, MIT, version
  `0.1.0`. The version exists only to keep `plugin.json` in step; nothing is
  published to a registry.
- Add `.changeset/config.json` with `baseBranch` set to `main` and the
  GitHub changelog pointed at `Dhodraj/skills`.
- Add `scripts/sync-plugin-version.mjs`.
- Install the two changesets dev dependencies, which needs approval first.

**Verify:** `pnpm check-plugin-version` exits zero. One changeset written by
hand produces the expected `CHANGELOG.md` entry.

## Stage 7: the contract

Upstream keeps its conventions in `CLAUDE.md` and makes `AGENTS.md` a
one-line pointer to it. This file loads on every request made inside this
repo, so it carries a hard cap of 60 lines. Anything needing more than a
sentence links to `docs/`.

- Write `CLAUDE.md` with four blocks and nothing else.
- Write `AGENTS.md` containing `CLAUDE.md`.
- Leave the reasoning in `docs/guides/maintenance.md` and link to it.

Block one, the six invariants:

- The gates file has three tiers.
- A Floor rule is never waivable.
- `craft.md` and `gates.md` load before every UI edit.
- A direction with values lists every override it makes.
- A new rule needs a test in `tests/run.sh`.
- `measure.js` returns measurements, never verdicts.

Block two, the lists that must agree. Every skill appears in the root
`README.md`, in its bucket `README.md`, and in `plugin.json`.

Block three, the install route. The symlink from `scripts/link-skills.sh` is
the route on this machine. The plugin manifests exist for everyone else.
Running both installs every skill twice.

Block four, the prose rule. No em dash in repo prose, headings included.
Rendered page copy is not repo prose: `demo/*.html` and
`tests/fixtures/*.html` are out of scope.

This stage runs late, because three of its four blocks state decisions the
other stages make.

**Verify:** `wc -l CLAUDE.md` is at most 60. Read `docs/guides/maintenance.md` and
confirm no invariant sits only there.

## Stage 8: the decision records

Upstream keeps shared procedures and ADRs in `.agents/`. This repo already
has `docs/decisions/adr-0001-architecture.md`.

Every ADR stays in `docs/`, numbered on from `0001`. There is no
`.agents/adr/`, because two homes guarantee a session writes into the wrong
one.

- Add `docs/decisions/adr-0002-upstream-layout.md` recording this plan.
- Add `.agents/invocation.md` with the rule from the invocation stage.
- `.agents/` holds shared procedure files only.

`adr-0001` records no decision about where skills live or how they install,
so `adr-0002` supersedes nothing and needs no pointer back. Five files cite
`adr-0001`, all by filename.

**Verify:** no two ADRs share a number. Every new file is linked from
`CLAUDE.md`.

## Stage 9: remove the em dashes

Upstream bans the em dash in every `SKILL.md`, document, README, changelog,
ADR, changeset and code comment. It also bans a blind character swap: each
sentence takes the punctuation it wants.

The count today is 180 across 25 tracked files. Three groups come out of
scope:

- `demo/*.html` holds 58 of them inside rendered page copy, which is product
  text on a screen rather than repo prose.
- `tests/fixtures/*.html` holds six across four files, also rendered page
  copy, and changing one could change what a test measures.

`adr-0001`'s own title carries one, and a heading is repo prose, so it is in
scope.

That leaves about 122 in prose to rewrite. The heaviest files are
`docs/research/source-research.md` at 40, `docs/research/testing-report.md` at 16 and
`references/directions.md` at 12.

**Verify:** search with `git ls-files -z | xargs -0 grep -c $'\u2014'`. It
reports zero outside the excluded paths. The escape keeps the character out of
this file. Run `node ~/.claude/scripts/writing-check.js` on each file changed.

## Deferred, with the reason

| Deferred | Reason |
|---|---|
| `in-progress/`, `misc/`, `deprecated/` buckets | no skill needs them; the buckets are `ui`, `review` and `orchestration` |
| `GLOSSARY.md` | no jargon a reader of the skills cannot already see |
| The three upstream workflows | no CI yet |

## Rejected, with the reason

**Flat companion files.** Upstream puts companions beside `SKILL.md` and its
largest set is five. `ui-design` has nine references, three scripts and four
fixtures. Flat gives sixteen files in one directory, so `references/`,
`scripts/` and `tests/` stay.

**Dropping the tests.** Upstream has none. This repo has 93 offline and 96
with `--network`, and they catch a rule that names a gate number which no
longer exists. An absence upstream is not a convention.

## Order and cost

The order is the stage numbers. Stages 1 and 2 are done.

Stage 3 comes next, because the rejections are the most valuable import and
nothing depends on them. Stages 4 to 6 all point into the bucket folders, so none
could start before stage 1. Stage 7, the contract, waits until the decisions
its blocks state are settled. Stage 9 touches the most files and conflicts
with any concurrent edit, so it runs last and alone.
