## Purpose

A minimal container image — `oven/bun`'s Alpine base plus `git` and
`ca-certificates` — so a CI job's checkout step clones the repository
instead of silently falling back to a tarball fetch with no `.git`.

## ADDED Requirements

### Requirement: Image carries git and CA certificates

The image SHALL install `git` and `ca-certificates` on top of a
digest-pinned `oven/bun:*-alpine` base image.

#### Scenario: Checkout clones instead of falling back to a tarball

- **WHEN** a CI job's container runs `actions/checkout` against this image
- **THEN** the step clones the repository over HTTPS and leaves a working
  `.git` directory, instead of falling back to a REST API tarball fetch

### Requirement: The image is verified in CI, not assumed

CI SHALL build the image on every push and pull request and assert that
`bun`, `node` and `git` resolve on `PATH` and that a CA store exists.

#### Scenario: A missing tool fails this repo's own build, not a consumer's

- **WHEN** an Alpine package this image depends on is renamed or dropped
  from the branch
- **THEN** the `build` job's assertion step fails here, rather than the
  failure only surfacing in another repository's checkout step
