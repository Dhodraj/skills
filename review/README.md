# review

Skills for reviewing finished work before it is handed over.

## Model-invoked

A model-invoked skill starts on its own when the work matches its description.
You can also name it.

- [`tear-it-apart`](tear-it-apart/SKILL.md): review substantial work the way a
  staff engineer would. Builds a coverage matrix, runs a fresh reviewer,
  fixes what it finds and asks before each further round.
- [`check-the-instruction`](check-the-instruction/SKILL.md): test a change to
  CLAUDE.md, a rule, a skill, a hook, a setting or a permission before it is
  applied. A fresh reviewer returns the wording to apply.

## User-invoked

None.

## Needs

- `check-the-instruction` uses `writing-for-agents` from
  [mstack](https://github.com/Dhodraj/mstack). When the change is a skill, it
  also uses the skill-writing playbook in `poteto-mode` from
  [pstack](https://github.com/Dhodraj/pstack).
- `tear-it-apart` can use `interrogate` from pstack, for code where only
  findings proven by a run count. This is optional.

If a needed skill is missing, the calling skill does that step itself, tells
you which skill was missing, and installs nothing.
