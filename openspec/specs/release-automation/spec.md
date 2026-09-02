# release-automation Specification

## Purpose

Nobody picks a version by hand. release-please reads Conventional Commits
on `main` and cuts the release; the same run publishes an attested image.

## Requirements

### Requirement: release-please computes the version from commit history

release-please SHALL keep a release pull request open on `main` carrying
the next version (from `feat:`/`fix:`/`BREAKING CHANGE:` commits) and the
changelog entry, computed from its manifest rather than a hardcoded
starting version.

#### Scenario: A fix-only branch cuts a patch release

- **WHEN** only `fix:` commits have landed on `main` since the last
  release
- **THEN** release-please's pull request proposes a patch version bump

### Requirement: The release pull request merges itself once green

release-please's pull request SHALL be armed for auto-merge as soon as
it's opened or updated, gated on its own `autorelease: pending` label
rather than a session noticing it exists.

#### Scenario: A green release pull request merges without manual action

- **WHEN** release-please's pull request's checks all pass
- **THEN** `release-auto-merge.yml` merges it without further action

### Requirement: A release publishes an attested image

Merging the release pull request SHALL build the image, tag it with the
release version and `latest`, push it to `ghcr.io`, and attach a signed
build-provenance attestation.

#### Scenario: A consumer can verify where an image digest came from

- **WHEN** a release has published an image
- **THEN** `gh attestation verify oci://ghcr.io/alrayyes/bun-with-git:<tag>
--repo alrayyes/bun-with-git` succeeds
