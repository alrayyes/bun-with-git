## Why

This repo shipped every capability below through Dockerfile, CI and hook
changes, and a run of GitHub tickets (#11-#17) that audited it against the
global rules — but never wrote any of it down as an OpenSpec spec. Nothing
describes what the system is supposed to do independently of reading the
Dockerfile, `lefthook.yml` and six workflow files side by side. Doing this
now, while the tickets that shaped most of it are still fresh, is cheaper
than reconstructing intent from the diff later.

## What Changes

- No behaviour changes. This backfills specs for capabilities that already
  exist and are already shipping, using the closed tickets and the current
  implementation as the source of truth.

## Capabilities

### New Capabilities

<!-- vale Vale.Terms = NO -->
<!-- "sort-package-json" is the literal tool name, not the JSON acronym
     mis-cased. -->

- `ci-checkout-image`: the built image carries `git`, `ca-certificates` and
  bun/node so a CI checkout job clones instead of silently falling back to
  a tarball fetch.
- `code-quality-linting`: Biome, Prettier, markdownlint and
  sort-package-json enforced identically in hooks and CI.

<!-- vale Vale.Terms = YES -->

- `dockerfile-checks`: hadolint and a real `docker build` run in
  pre-commit, pre-push and CI.
- `prose-linting`: Vale (style) and ltex-cli-plus (mechanics) as two
  separate tiers over the repo's own prose.
- `dependency-security`: `bun audit`, Dependabot, dependency-review-action
  and gitleaks secret scanning.
- `release-automation`: release-please-driven versioning, auto-merge of
  its release pull request, and attested image publishing to `ghcr.io`.
- `vulnerability-reporting`: a private channel for reporting a security
  issue, instead of a public issue.
- `contribution-workflow`: the issue forms, pull request template and
  CONTRIBUTING/README a contributor actually needs.

### Modified Capabilities

None — nothing in `openspec/specs/` exists yet.

## Impact

Documentation only: adds `openspec/specs/**` for the capabilities above.
No Dockerfile, workflow, hook or config change.
