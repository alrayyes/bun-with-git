# Contributing

## Getting set up

- **[bun](https://bun.sh) 1.3 or newer.** Runtime for the linter and the
  [lefthook](https://lefthook.dev) that runs the git hooks.
- **A container runtime** (Docker or compatible) to build the image and run
  `hadolint` locally through `compose.yaml`.
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
docker build --pull -t bun-with-git:local .
docker compose run --rm hadolint hadolint --config .hadolint.yaml Dockerfile

bun run lint                # biome check ., the check-only form
bun run format               # biome check --write ., the fixer

bun run format:check        # prettier --check, add --write to fix
bun run lint:md
bun run lint:prose          # vale
bun run lint:mechanics      # ltex-cli-plus
```

## How it fits together

One `Dockerfile`. No entry point, no runtime code — the image exists to be
a container other jobs run in, not to run anything itself. CI asserts what
it needs to (`git`, `ca-certificates`, `bun` itself) resolve inside it on
every build, the same way [deploy-ssh](https://github.com/alrayyes/deploy-ssh)
does for its own package list.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/):
`type(scope): description`, types `feat`/`fix`/`docs`/`style`/`refactor`/
`perf`/`test`/`build`/`ci`/`chore`/`revert`. Subject under 50 characters,
lowercase, no trailing full stop. commitlint enforces the shape at
commit-msg and again in CI; the length and case rules are tighter than what
it checks, so hold to them anyway.

A base image bump is `fix(deps):`, not `chore(deps):` — the base image is
what this repo ships, so a bump to it is a change to the artefact, not
housekeeping.

## Branching, review, and release

Every change goes through a pull request — nothing is pushed straight to
`main`. GitHub's branch protection needs a paid plan this account doesn't
have, so nothing enforces that mechanically here; it's discipline, not a
gate.

Once a pull request's checks are green, squash-merge it and delete the
branch. [release-please](https://github.com/googleapis/release-please)
reads the Conventional Commits on `main` and keeps a release pull request
open with the next version and changelog entry; merging that one tags the
release, builds the image, and pushes it to `ghcr.io`. Nobody picks a
version by hand.
