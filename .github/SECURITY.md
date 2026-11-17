# Security

## Reporting a problem

Do not open a public issue for a security problem. Report it privately:
open the **Security** tab of this repository and select **Report a
vulnerability**.

## What counts

A skill is a set of instructions that an agent follows with your
permissions. Report any of these:

- A skill that tells an agent to run, download or send something the user
  did not ask for.
- A script in a skill folder that writes outside the project, reaches the
  network without saying so, or runs code from a fetched source.
- A secret, token or private path committed to the repository.

## Supported versions

Only the latest commit on `main` gets fixes.
