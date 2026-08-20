# Contributing

This file is for whoever changes this template. The [README](README.md) is
for whoever stamps a project out of it.

## Getting set up

- **[bun](https://bun.sh) 1.3 or newer.** Runtime, test runner, package
  manager for the linter, and the [lefthook](https://lefthook.dev) that
  runs the git hooks — bun is the only thing to install.
- **[Vale](https://vale.sh)** on your `PATH`, for the style tier of the
  prose lint:

  ```sh
  go install github.com/errata-ai/vale/v3/cmd/vale@latest
  ```

  `ltex-cli-plus` needs nothing installed: the hook fetches and caches it
  on first use.

One command installs the linter, the git hooks, and their dependencies:

```sh
bun install
```

An uninstalled hook silently does nothing, which is worse than not having
one, so the `prepare` script runs `lefthook install` for you. You find out
at the pipeline otherwise, not at the commit.

## Everyday commands

Every one of these is what a hook or CI runs — see `lefthook.yml` and
`.github/workflows/*.yml` for exactly which.

```sh
bun run start               # bun run index.ts
bun test
bun test --coverage         # bun writes the table to stderr, not stdout

bun run lint                # biome check ., the check-only form
bun run format               # biome check --write ., the fixer

bun run format:check        # prettier --check, add --write to fix
bun run lint:md
bun run lint:prose          # vale
bun run lint:mechanics      # ltex-cli-plus
```

## How it fits together

One entry script, `index.ts`, run directly with `bun run index.ts` — no
build step, no framework, no `ts-node`/`tsx`. `index.test.ts` sits next to
it and uses `bun:test`. There's nothing else to structure yet: a real
project stamped from this template grows files as it needs them, not ahead
of time.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/):
`type(scope): description`, types `feat`/`fix`/`docs`/`style`/`refactor`/
`perf`/`test`/`build`/`ci`/`chore`/`revert`. Subject under 50 characters,
lowercase, no trailing full stop. commitlint enforces the shape at
commit-msg and again in CI; the length and case rules are tighter than what
it checks, so hold to them anyway.

## Branching, review, and release

Every change goes through a pull request — nothing is pushed straight to
`main`, including the bootstrapping that built this repo. GitHub's branch
protection needs a paid plan this account doesn't have, so nothing enforces
that mechanically here; it's discipline, not a gate.

Once a pull request's checks are green, squash-merge it and delete the
branch. [release-please](https://github.com/googleapis/release-please)
reads the Conventional Commits on `main` and keeps a release pull request
open with the next version and changelog entry; merging that one tags the
release. Nobody picks a version by hand.
