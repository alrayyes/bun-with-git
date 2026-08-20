# scaffold-typescript-cli

[![CI](https://github.com/alrayyes/scaffold-typescript-cli/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/alrayyes/scaffold-typescript-cli/actions/workflows/ci.yml)
[![release](https://img.shields.io/github/v/release/alrayyes/scaffold-typescript-cli?sort=semver)](https://github.com/alrayyes/scaffold-typescript-cli/releases/latest)
[![licence](https://img.shields.io/badge/licence-unlicensed-lightgrey)](LICENSE)

A GitHub template for a TypeScript/bun command-line tool. Run `gh repo
create my-real-project --template alrayyes/scaffold-typescript-cli` and you
get a project with the conventions already wired in — pinned tooling, Biome
linting, prose linting, secret scanning, and release automation — rather
than a blank directory and a checklist to work through by hand.

It isn't a tool on its own. The one thing it does, greet a name back,
exists so the whole chain — the script, its tests, hooks, CI — has
something real to run against. Replace it with your first real command and
delete this paragraph.

## Requirements

- **[bun](https://bun.sh) 1.3 or newer.** It's the runtime, the test
  runner, the package manager for the linter, and the
  [lefthook](https://lefthook.dev) that runs the git hooks — nothing else
  to install.
- No external services and nothing to configure.

## Installation

```sh
git clone https://github.com/alrayyes/scaffold-typescript-cli.git
cd scaffold-typescript-cli
bun install
```

## Usage

```sh
bun run index.ts --name Ada
bun run index.ts
```

No build step: `index.ts` runs as it is, directly.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the toolchain, the hooks, and how
a change gets reviewed and released.

Hosting a project stamped from this template somewhere other than GitHub?
See [FORGEJO.md](FORGEJO.md) for what `release-please`, Dependabot and
`.github/workflows/` need to become on a Forgejo instance.

## Licence

No licence has been chosen yet — see [`LICENSE`](LICENSE). Pick one before a
project stamped from this template goes anywhere public.
