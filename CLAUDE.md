# scaffold-typescript-cli

A GitHub template repo, not a distributed tool. It's built from
`~/.config/claude/CLAUDE.md` and `~/.config/claude/rules/*.md` — read those
for the "why" behind everything below. This file only says what's specific
to this repo.

## What this is

Bootstrapped in the PR sequence documented in
`~/.config/claude/plans/adaptive-conjuring-karp.md`: chassis, prose tooling,
docs, language scaffold, CI, prose/secret CI, release automation, Dependabot
— each in its own PR. Keep new work in that shape: one concern per PR.

## Commands

```sh
bun install
bun test
bun run lint                # biome check ., bun run format to fix
bun run format:check        # bun run lint:md, lint:prose, lint:mechanics too
```

Full list and what each one does: [CONTRIBUTING.md](CONTRIBUTING.md).

## Gotchas

- **No branch protection.** GitHub requires a paid plan for it on a private
  repo, which this account doesn't have. The PR-only discipline is
  enforced by nobody but whoever's committing — never push straight to
  `main`.
- **Single `index.ts`, on purpose.** No build step, no framework, no
  `ts-node`/`tsx` — `bun run index.ts` runs it as it is. `index.test.ts`
  uses `bun:test` next to it. Don't reach for a `src/` tree or a bundler
  until a second concern justifies one.
- **Biome, not ESLint/Prettier, for JS/TS/JSON.** One tool, one
  `biome.json`, one pass. Prettier stays scoped to Markdown and YAML, the
  two formats Biome doesn't cover.
- **`LICENSE` is deliberately unpicked.** Don't default it to GPL-3.0 or
  anything else; that's a decision the project stamped from this template
  makes, not this template.
- **Renovate can't reach this repo.** It's GitHub-primary; Dependabot
  (`.github/dependabot.yml`) is what raises dependency pull requests here.
