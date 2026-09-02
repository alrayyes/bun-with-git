<!-- vale Vale.Terms = NO -->
<!-- "package.json" and "sort-package-json" are literal identifiers, not
     the JSON acronym mis-cased. -->

## 1. Verify each backfilled spec against the current implementation

- [x] 1.1 `ci-checkout-image`: confirm `Dockerfile` installs `git` and
      `ca-certificates` on a digest-pinned base, and CI's `build` job
      asserts `bun`/`node`/`git`/CA store — verified against `Dockerfile`
      and `.github/workflows/ci.yml`'s `build` job
- [x] 1.2 `code-quality-linting`: confirm `bun run lint` and
      `bun run sort-package-json:check` exist as CI steps and lefthook
      jobs — verified against `package.json` scripts and `lefthook.yml`

<!-- vale Vale.Terms = YES -->

- [x] 1.3 `dockerfile-checks`: confirm hadolint and `docker build` run in
      pre-commit (glob-scoped), pre-push (unconditional) and CI — verified
      against `lefthook.yml` and `.github/workflows/ci.yml`
- [x] 1.4 `prose-quality`: confirm Prettier, markdownlint, ltex-cli-plus
      and Vale each run as a separate tier — verified against
      `lefthook.yml`, `scripts/lint-*.sh` and `.github/workflows/prose.yml`
- [x] 1.5 `dependency-security`: confirm `bun audit`, Dependabot,
      dependency-review-action and gitleaks are wired in — verified
      against `lefthook.yml`, `.github/dependabot.yml` and the `secrets`/
      `dependency-review` workflow jobs
- [x] 1.6 `release-automation`: confirm release-please, its auto-merge
      workflow and the provenance-attested `ghcr.io` publish exist —
      verified against `.github/workflows/release.yml` and
      `release-auto-merge.yml`
- [x] 1.7 `vulnerability-reporting`: confirm `SECURITY.md` exists and
      private vulnerability reporting is enabled — verified against
      `SECURITY.md` and the private-vulnerability-reporting API endpoint
- [x] 1.8 `contribution-workflow`: confirm the issue forms, pull request
      template and CONTRIBUTING/README exist and stay current — verified
      against `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md`,
      `CONTRIBUTING.md` and `README.md`

## 2. Land the specs

- [x] 2.1 Run `openspec validate backfill-capability-specs --strict` and
      resolve any reported issues
- [x] 2.2 Archive the change with specs synced, so
      `openspec/specs/**` carries the backfilled main specs
