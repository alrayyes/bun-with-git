## Purpose

Gets a contributor set up and reporting a bug or proposing a feature with
the information needed to act on it, instead of a blank box or a stale
README.

## ADDED Requirements

### Requirement: A bug report and a feature request each require the full shape

GitHub's YAML issue forms SHALL require, as separate textareas: a
description, reproduction steps and expected behaviour for a bug report;
a user-story description, Given/When/Then acceptance criteria and a
definition of done for a feature request.

#### Scenario: A required field left blank blocks submission

- **WHEN** someone opens "New issue" and leaves a required field empty
- **THEN** GitHub's form validation blocks submission until it's filled in

### Requirement: The pull request template stays terse

`PULL_REQUEST_TEMPLATE.md` SHALL carry only a summary section and a
test-plan checklist.

#### Scenario: Opening a pull request shows the template

- **WHEN** a pull request is opened against this repository
- **THEN** its description is pre-filled with the summary and test-plan
  sections

### Requirement: README and CONTRIBUTING stay true to what a checkout needs

`README.md` SHALL document what the image is, its requirements and how to
use it; `CONTRIBUTING.md` SHALL document the toolchain, every hook and CI
command verbatim, and how a change is branched, reviewed and released —
kept true in the same commit as whatever change made either stale.

#### Scenario: Every command in CONTRIBUTING.md is one a contributor can paste

- **WHEN** a contributor copies a command from CONTRIBUTING.md's "Everyday
  commands" section
- **THEN** it's the exact invocation a hook or CI actually runs, not a
  paraphrase of it
