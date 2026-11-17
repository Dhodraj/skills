# Contributing

Thank you for helping. This file says what a change needs before it can merge.

## What belongs here

A skill or a change to a skill must fix a failure you saw in a real agent
session. Describe that failure in the issue or pull request: what you asked,
what the agent did, and what it should have done. An idea with no observed
failure stays open as a discussion, not a change.

## How the repository is laid out

- Each skill is one folder at `<bucket>/<name>/`, with a `SKILL.md`.
- The folder name and the `name:` field in `SKILL.md` are the same.
- Each bucket (`ui`, `review`, `orchestration`) has a `README.md` that lists
  its skills.
- Everything that is not a skill is in `shared/`.

## Before you open a pull request

1. Read the `SKILL.md` you change from top to bottom.
2. If you change `ui/ui-design`, run its tests:

   ```bash
   bash ui/ui-design/tests/run.sh
   bash ui/ui-design/tests/run.sh --network
   ```

3. If you add, rename or remove a skill, update its bucket `README.md`, the
   table in the root `README.md` and the `skills` list in
   `.claude-plugin/plugin.json`. Run `bash shared/scripts/list-skills.sh`
   to see every skill.
4. If you adapt text or code from another project, name it in the skill's
   `NOTICE` file, with its licence.
5. Fill in the pull request checklist.

## Style

- Write a skill as instructions for a model: what to do and when. Keep
  history, measurements and stories out of `SKILL.md`. Put them in
  `shared/docs/`.
- Use plain English, short sentences and active voice.
- Use `pnpm`, not `npm`, in commands.

## Licence

By contributing, you agree that your work is licensed under the MIT licence
in [LICENSE](../LICENSE).
