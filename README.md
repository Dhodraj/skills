# skills

![Dhodraj/skills: habits for your coding agent. A growing set of agent skills for Claude Code.](shared/brand/banner.svg)

A growing set of agent skills for Claude Code. Each skill teaches the agent
one habit a careful engineer already has. One opens the running product
before it calls a screen done. Another writes down every limit you set before
a long run. The skills are grouped in buckets by the kind of work they cover.

The [ui README](ui/README.md#the-same-prompt-with-and-without-the-skill) shows
one prompt built twice, with and without `ui-design`, and what a browser
measured on each.

## The skills

| Skill | Bucket | Say | What it does |
|---|---|---|---|
| [`ui-design`](ui/ui-design/SKILL.md) | [`ui`](ui/README.md) | "Make the pipeline health screen modern" | Writes the design system down, offers three directions for you to pick from, builds, then walks the running app and fixes what it measures |
| [`ui-find`](ui/ui-find/SKILL.md) | [`ui`](ui/README.md) | "Find me a timeline component with expandable logs" | Searches the project, then 508 component registries, and reads the real code and licence before it suggests anything |
| [`ui-review`](ui/ui-review/SKILL.md) | [`ui`](ui/README.md) | "Audit this dashboard", "review my branch" | Measures the live render, walks the journey and checks it against your design principles. Changes no files unless asked |
| [`staff-review`](review/staff-review/SKILL.md) | [`review`](review/README.md) | "Would a tech lead approve this?" | Reviews substantial work the way a staff engineer would: a coverage matrix, a fresh reviewer, fixes, and a question before each further round |
| [`colony-orchestrate`](orchestration/colony-orchestrate/SKILL.md) | [`orchestration`](orchestration/README.md) | "Split this across agents" | Splits work across sub-agents, sessions or worktrees, and keeps the pieces from colliding |
| [`constraint-ledger`](orchestration/constraint-ledger/SKILL.md) | [`orchestration`](orchestration/README.md) | "Work on this while I'm away" | Writes every constraint you state to a file, so it survives long runs and compaction |

Each skill starts on its own when the work matches its description. You can
also name it.

## Install

Install one skill with [APM](https://github.com/microsoft/apm):

```bash
apm install -g Dhodraj/skills/ui/ui-design
```

Change the path to install another skill, for example
`Dhodraj/skills/review/staff-review`. Add `#<commit>` to pin a version. To
update, run `apm update`.

Without APM, copy a skill folder into `~/.claude/skills/`:

```bash
git clone https://github.com/Dhodraj/skills.git
cp -R skills/ui/ui-design ~/.claude/skills/
```

The UI skills need Node 20 or newer. `ui-design` and `ui-review` use a
Playwright MCP server if one is set up. Without one, they fall back to
headless Chrome and mark every journey claim as unverified. Full details are
in [install and invoke](shared/docs/guides/install-and-invoke.md).

## Try it in five minutes

1. Install `ui-review`.
2. Start your web app, then open Claude Code in its project.
3. Ask: "Review the main screen of this app."

It opens the running page in a browser, measures it, walks the journey and
reports each problem with its evidence and severity. It changes no files.

## How the repository is laid out

```
ui/                 ui-design, ui-find, ui-review
review/             staff-review
orchestration/      colony-orchestrate, constraint-ledger
shared/
  brand/            the banner and the social preview image
  docs/             decisions/, guides/, research/ and images/
  demo/             pages the UI skills built, with sample data
  scripts/          link-skills.sh and list-skills.sh, for maintainers
```

Each bucket has a `README.md` with its skills. Each skill is one folder with a
`SKILL.md`, and some have `references/`, `scripts/` and `tests/`.
Every rule this repository refused has a file in `.out-of-scope/`,
with the date it was decided.

## Limits

The skills are instructions, not mechanisms. An agent that skips a step still
passes every automated check. The [ui README](ui/README.md#limits) lists what
is not tested yet.

## Contributing

Issues and pull requests are welcome. Read
[CONTRIBUTING](.github/CONTRIBUTING.md) and the
[code of conduct](.github/CODE_OF_CONDUCT.md) first. To report a security problem,
follow [SECURITY](.github/SECURITY.md) and do not open a public issue.

## Licence

MIT, see [LICENSE](LICENSE). [NOTICE](ui/ui-design/NOTICE) lists every source
the UI skills adapted, with its licence.
