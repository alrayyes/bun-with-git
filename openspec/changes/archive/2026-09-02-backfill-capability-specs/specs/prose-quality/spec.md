## Purpose

Holds this repo's own prose (README, CONTRIBUTING, SECURITY, docs) to four
separate tiers — layout, structure, mechanics and style — so each one can
fail (or just advise) independently instead of one tool trying to catch
everything.

## ADDED Requirements

### Requirement: Layout is Prettier's, over Markdown and YAML

Prettier SHALL format every `.md`, `.yml` and `.yaml` file, with
`proseWrap: preserve`, fixed at commit time and checked at push time and
in CI.

#### Scenario: A misformatted workflow file fails CI

- **WHEN** a `.yml` file under `.github/workflows/` isn't Prettier-formatted
- **THEN** `bun run format:check` fails in CI

### Requirement: Structure is markdownlint's

markdownlint-cli2 SHALL check heading structure, list markers and the
rest of `markdownlint/style/prettier`'s ruleset, plus `line-length`
re-enabled under its alias, over every Markdown file this repo owns
(excluding the generated `CHANGELOG.md` and downloaded Vale style
packages).

#### Scenario: A skipped heading level fails CI

- **WHEN** a Markdown file this repo owns skips a heading level or exceeds
  the configured line length
- **THEN** `bun run lint:md` fails in CI

### Requirement: Mechanics are ltex-cli-plus's, and fail the build

<!-- vale Vale.Terms = NO -->
<!-- ".ltex.json" is the literal config filename, not the JSON acronym
     mis-cased. -->

ltex-cli-plus SHALL check grammar and spelling over the same file set,
using `.ltex.json`'s dictionary and disabled-rules configuration, at push
time and in CI, and a non-zero exit SHALL fail the check.

#### Scenario: A misspelt word or grammar error fails the build

- **WHEN** a word not in `.ltex.json`'s dictionary is misspelt in owned
  prose
- **THEN** `scripts/lint-mechanics.sh` exits non-zero and fails both the
  pre-push hook and the CI `mechanics` job

<!-- vale Vale.Terms = YES -->

### Requirement: Style is Vale's, and mostly advises

Vale SHALL check house style (Google plus proselint, scoped in
`.vale.ini`) over the same file set, at commit time, at push time and in
CI, failing the build only on `error`-level findings.

#### Scenario: A style warning doesn't block a commit

- **WHEN** Vale reports a warning-level style finding
- **THEN** the commit still succeeds — only an error-level finding fails
  `scripts/lint-prose.sh`
