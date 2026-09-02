# code-quality-linting Specification

<!-- vale Vale.Terms = NO -->
<!-- "package.json" and "sort-package-json" recur throughout this file as
     literal identifiers, not the JSON acronym mis-cased. -->

## Purpose

Keeps JavaScript, TypeScript, JSON and `package.json` in one canonical
shape via Biome and sort-package-json, enforced identically at commit
time, at push time and in CI.

## Requirements

### Requirement: Biome is the sole formatter and linter for JS/TS/JSON

Biome SHALL format and lint every file type it supports, with fixes
applied and restaged at commit time and check-only at push time and in CI.

#### Scenario: A malformed JSON file fails CI

- **WHEN** a `.json` or `.jsonc` file doesn't match Biome's formatting or
  lint rules
- **THEN** `bun run lint` (`biome check .`) fails in CI

#### Scenario: A fixable issue is fixed, not just reported, at commit time

- **WHEN** a staged JSON file has a fixable formatting issue
- **THEN** the pre-commit hook runs Biome with `--write` and restages the
  result, rather than failing the commit over something a tool can settle

### Requirement: package.json stays canonically sorted

sort-package-json SHALL keep `package.json`'s key order canonical, fixed
at commit time and checked at push time and in CI.

#### Scenario: An out-of-order package.json fails CI

- **WHEN** `package.json`'s keys aren't in sort-package-json's canonical
  order
- **THEN** `bun run sort-package-json:check` fails in CI
