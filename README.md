# bun-with-git

[![CI](https://github.com/alrayyes/bun-with-git/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/alrayyes/bun-with-git/actions/workflows/ci.yml)
[![release](https://img.shields.io/github/v/release/alrayyes/bun-with-git?sort=semver)](https://github.com/alrayyes/bun-with-git/releases/latest)
[![image](https://img.shields.io/badge/ghcr.io-bun--with--git-2496ED?logo=docker&logoColor=white)](https://github.com/alrayyes/bun-with-git/pkgs/container/bun-with-git)
[![licence](https://img.shields.io/badge/licence-GPL--3.0--or--later-blue)](LICENSE)

`oven/bun`'s Alpine image with `git` and `ca-certificates` added, so CI jobs
that check out a repository stop installing them on every run.

```text
ghcr.io/alrayyes/bun-with-git:latest
```

It exists because nine repositories were each running `apk add --no-cache git`
at the top of their `commitlint` job — the same package, fetched from the
Alpine mirrors, on every push to every branch. Measured on a real pipeline
run, that install ate 40-45% of the job's wall clock. Worse than the time: a
container missing `git` doesn't fail loudly. `actions/checkout` falls back to
fetching a tarball through the REST API instead of cloning, which leaves the
job with no `.git` — `commitlint` notices and fails, but a secret scanner like
`gitleaks` would scan an empty history, find nothing, and go green having read
nothing at all.

## Requirements

A container runtime that can pull from `ghcr.io`, and nothing else. The
package is public, so no registry credentials.

The image is `linux/amd64` only.

## What's in it

| Package           | Why                                                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `git`             | so `actions/checkout` clones instead of silently falling back to a tarball fetch through the API, leaving the job with no `.git` |
| `ca-certificates` | `git` needs it to clone over HTTPS at all                                                                                        |

`node` is already there — `oven/bun`'s Alpine image ships its own Node
compatibility shim, which is what `actions/checkout` (a JavaScript action)
needs to run in the first place. This image adds only what that base is
missing.

## Using it

As the container a CI job runs in:

```yaml
jobs:
  commits:
    runs-on: docker
    container:
      image: ghcr.io/alrayyes/bun-with-git:0.1.0@sha256:<digest-from-a-release>
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: bunx commitlint --from origin/main --to HEAD --verbose
```

Pin the version **and** the digest. The version makes a bump readable in
review; the digest is what actually runs. `latest` on its own is a floating
reference, and a job that silently changes what it runs is the thing this
image exists to stop.

Verify where an image came from:

```sh
gh attestation verify oci://ghcr.io/alrayyes/bun-with-git:latest --repo alrayyes/bun-with-git
```

Every release is built by [the release workflow](.github/workflows/release.yml)
and attested, so that command tells you which commit and which run produced
the digest you're about to run.

## Releasing

Nobody picks a version. release-please reads the Conventional Commits that
land on `main` and keeps a release pull request open carrying the next
version and the changelog entry. Merging it tags the release, and the same
run builds the image, pushes it, and attests it.

Tags are bare semver — `0.1.0`, not `v0.1.0`.

A base image bump raises `fix(deps):` rather than `chore(deps):` on purpose. A
patched Alpine has to cut a release, or the fix never becomes an image anyone
pulls.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the toolchain, the checks, and how
a change gets released.

## Licence

GPL-3.0-or-later. See [LICENSE](LICENSE).
