## Purpose

Catches a vulnerable or already-known-bad dependency and a committed
secret before either reaches `main`, across every ecosystem this repo
actually uses.

## ADDED Requirements

### Requirement: bun audit runs on every push

`bun audit` SHALL run in pre-push and in CI, separate from whatever raises
the update pull request, and fail on a reported vulnerability.

#### Scenario: A vulnerable devDependency fails CI

- **WHEN** `bun.lock` pins a package with a known advisory
- **THEN** `bun run audit` fails both the pre-push hook and the CI `lint`
  job

### Requirement: Dependabot watches every ecosystem this repo uses

Dependabot SHALL watch the `docker`, `bun` and `github-actions` ecosystems
weekly, prefixing a Docker base-image bump `fix:` (it changes what ships)
and a dev-tooling or Actions bump `chore:`/`ci:` respectively.

#### Scenario: A new base image release raises a pull request

- **WHEN** a new digest is published for the pinned base image
- **THEN** Dependabot opens a pull request prefixed `fix(deps):`

### Requirement: A known-bad dependency is flagged at merge time

`dependency-review-action` SHALL run against every pull request and fail
on a dependency with an existing advisory.

#### Scenario: A newly introduced vulnerable dependency fails the pull request

- **WHEN** a pull request's diff adds a dependency with a known advisory
- **THEN** the `dependency-review` job fails

### Requirement: Every push and pull request is scanned for secrets

gitleaks SHALL scan the full branch and tag history on every push and
pull request, with no path filter.

#### Scenario: A committed credential fails the pipeline

- **WHEN** a commit in the pushed history contains a pattern gitleaks
  flags by default
- **THEN** the `secrets` job fails
