# dependency-security Specification

## Purpose

Catches a vulnerable or already-known-bad dependency and a committed
secret before either reaches `main`, across every ecosystem this repo
actually uses.

## Requirements

### Requirement: bun audit blocks only what a pull request introduces

`bun audit` SHALL run in pre-push. In CI, the `audit` job SHALL run
`alrayyes/advisory-scan` in gate mode whenever `package.json` or `bun.lock`
changed, and fail only on advisories the pull request adds over its base. No
pipeline SHALL ignore an advisory.

#### Scenario: A pull request adds a vulnerable devDependency

- **WHEN** a pull request's `bun.lock` pins a package with an advisory the base
  `bun.lock` doesn't have
- **THEN** the CI `audit` job fails

#### Scenario: Advisory already on main

- **WHEN** a pull request leaves the advisories as they were
- **THEN** the CI `audit` job passes

### Requirement: A scan keeps one ticket for the advisories already present

`advisory-scan.yml` SHALL audit `main` daily, on a push that changes
`package.json` or `bun.lock`, and on demand, and keep one open issue titled
`Dependency advisories` that lists them. It SHALL close the issue when the
audit is clean.

#### Scenario: Advisory published against a pinned version

- **WHEN** the daily scan finds an advisory
- **THEN** the `Dependency advisories` issue is created or updated

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
