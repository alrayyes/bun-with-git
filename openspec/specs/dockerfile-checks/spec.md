# dockerfile-checks Specification

## Purpose

Proves the Dockerfile is both well-formed (hadolint) and actually builds
(`docker build`), at commit time, at push time and in CI — a linter alone
never proves the second half.

## Requirements

### Requirement: hadolint runs against every change to the Dockerfile

hadolint SHALL run against `Dockerfile`, configured by `.hadolint.yaml`, at
commit time (scoped to the staged Dockerfile), at push time and in CI
(unconditional in both).

#### Scenario: An unpinned or malformed instruction fails the checks

- **WHEN** the Dockerfile adds an instruction hadolint's ruleset flags,
  outside what `.hadolint.yaml` explicitly ignores
- **THEN** the pre-push hook and the CI `dockerfile` job both fail

### Requirement: docker build proves the image still builds

A plain `docker build` SHALL run in pre-commit (scoped to changes touching
the Dockerfile), pre-push (unconditional) and CI (unconditional), tagging
and removing the image afterward in the two hooks.

#### Scenario: A syntactically valid but unbuildable Dockerfile is caught locally

- **WHEN** a Dockerfile change is syntactically fine but fails to build
- **THEN** the pre-push hook's `docker build` step fails before the push
  reaches CI

#### Scenario: A commit that doesn't touch the Dockerfile skips the local build

- **WHEN** a commit stages files other than `Dockerfile`
- **THEN** the pre-commit `docker build` job is skipped, and only the
  unconditional pre-push and CI copies still run
