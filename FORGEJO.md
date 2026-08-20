# Hosting on Forgejo instead of GitHub

This template defaults to GitHub-primary tooling: `release-please` for
releases, Dependabot for dependency updates, and `.github/workflows/*.yml`
for CI. All three assume GitHub's API and GitHub Actions specifically, and
none of them work unmodified against a Forgejo instance.

If a project stamped from this template ends up hosted on Forgejo instead of
GitHub, here's what to swap in for each, with working configuration — not
just "use something else instead."

## 1. Release automation: `release-please` → semantic-release

**Why:** `release-please` only talks to GitHub's API — it opens and updates
a release pull request through GitHub-specific calls, and there's no
Forgejo backend for it. It's GitHub-only by design, not by an easily
patched detail.

The replacement is [semantic-release](https://semantic-release.gitbook.io/)
with the community
[`@ribbon-studios/semantic-release-forgejo`](https://www.npmjs.com/package/@ribbon-studios/semantic-release-forgejo)
plugin, which does the same job — read the Conventional Commits since the
last tag, decide the next version, publish a release — against Forgejo's
API instead.

### Configuration

`release.config.mjs` (JavaScript rather than `.releaserc.json`, because the
Forgejo plugin's token can only be passed as a plugin option — see the
comment below — and JSON can't read an environment variable):

```js
// The Forgejo plugin needs a URL and a token. FORGEJO_SERVER_URL is one of the
// variables the Forgejo Actions runner injects into every job automatically, so
// reading it rather than hardcoding it means this file works unchanged against
// whichever instance the runner happens to be attached to. The fallback exists only
// for a dry run on a workstation, where that variable doesn't exist.
const forgejoUrl =
  process.env.FORGEJO_SERVER_URL ?? "https://forgejo.example.com";

export default {
  branches: ["main"],
  // No `tagFormat` override here: semantic-release's default (`v${version}`) matches
  // this scaffold's own release-please-config.json, which sets `"include-v-in-tag":
  // true`. If you're migrating a project that already has *bare* tags (`1.2.3`, no
  // `v`), you need `tagFormat: "${version}"` instead, or semantic-release concludes
  // the project has never released and publishes 1.0.0 over your existing history.
  // Check `git tag` before copying this file — don't assume either convention.
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    [
      "@semantic-release/release-notes-generator",
      { preset: "conventionalcommits" },
    ],
    // Without changelogTitle the plugin prepends the notes to whatever's already in
    // the file, above CHANGELOG.md's own heading. It only recognises the title if
    // it's told what it is.
    ["@semantic-release/changelog", { changelogTitle: "# Changelog" }],
    // semantic-release does not bump package.json on its own - that's
    // @semantic-release/npm's job, which shells out to `npm version`. Pulling in npm
    // for one line would put it on a runner whose whole toolchain is bun, so write
    // the version by hand instead. scripts/set-version.sh below does the rewrite.
    [
      "@semantic-release/exec",
      { prepareCmd: "./scripts/set-version.sh ${nextRelease.version}" },
    ],
    [
      "@ribbon-studios/semantic-release-forgejo",
      { forgejoUrl, forgejoToken: process.env.RELEASE_TOKEN },
    ],
    // Last of the prepare plugins on purpose: it commits what the two above wrote,
    // and semantic-release then tags the commit it made. Don't quote the skip
    // marker in a commit message of your own — Forgejo scans the whole message,
    // subject and body, and would skip that pipeline too.
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]",
      },
    ],
  ],
};
```

`scripts/set-version.sh` — a small, generic script that rewrites the
top-level `"version"` field in `package.json` with `sed`, refuses to run
against anything that doesn't look like exactly one version field, and
exits non-zero rather than guess. It has no project-specific logic; copy it
in as-is from a repo that already uses this pattern (or write your own — the
contract is just "take one argument, rewrite one line, fail loudly
otherwise").

Pin these as exact-version `devDependencies` (adjust to whatever is current
when you add them, but pin — see `dependencies.md`):

```json
{
  "devDependencies": {
    "@ribbon-studios/semantic-release-forgejo": "0.1.3",
    "@semantic-release/changelog": "7.0.0",
    "@semantic-release/commit-analyzer": "13.0.1",
    "@semantic-release/exec": "7.1.0",
    "@semantic-release/git": "11.0.1",
    "@semantic-release/release-notes-generator": "14.1.1",
    "conventional-changelog-conventionalcommits": "10.2.1",
    "semantic-release": "25.0.9"
  },
  "scripts": {
    "release": "semantic-release"
  }
}
```

### The workflow needs real Node, not bun

This is the one job where bun's own runtime can't be trusted, even in an
otherwise bun-first repo. **bun 1.3 reports its own version as `node
v24.3.0`**, and semantic-release checks the Node version it's running under
before doing anything else. That misreport can land between the versions
semantic-release accepts and fail in a way that reads like a bug in your
own setup rather than a version mismatch. Install a real `node` for this
job specifically:

```yaml
# .forgejo/workflows/release.yml
name: release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: docker
    container:
      # Same bun image the rest of CI uses - bun still installs the dependencies -
      # but semantic-release itself needs to run under real node, not bun's node
      # compatibility shim. See the comment above.
      image: oven/bun:1.3.14-alpine
      options: --entrypoint ""
    steps:
      # git and ca-certificates together: installing git flips checkout from a
      # node-fetched tarball to an HTTPS clone, and git reads the system CA store this
      # image hasn't got. nodejs is what actually runs semantic-release.
      - run: apk add --no-cache ca-certificates git nodejs

      # fetch-depth: 0 is not optional - semantic-release finds the last release by
      # walking back to the last tag, and a shallow clone has no tags in it, which is
      # the other way to arrive at "there has never been a release."
      - uses: https://code.forgejo.org/actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - run: bun install --frozen-lockfile

      - name: Release
        env:
          # semantic-release has no Forgejo-specific git auth of its own - GH_TOKEN and
          # GL_TOKEN are the ones it knows - so this is the generic form, username:token,
          # and Forgejo takes an access token as the password half.
          GIT_CREDENTIALS: "${{ secrets.RELEASE_USER }}:${{ secrets.RELEASE_TOKEN }}"
          # The Forgejo plugin's own credential, under a name Forgejo neither reserves
          # nor sets itself. Passing it as a plugin option (see release.config.mjs)
          # rather than leaving it to the environment matters: the runner injects a
          # FORGEJO_TOKEN of its own into every job automatically, and that automatic
          # token has repository write - so if the plugin fell back to reading it, the
          # wrong credential would succeed quietly instead of failing.
          RELEASE_TOKEN: ${{ secrets.RELEASE_TOKEN }}
        run: bun run release
```

Two secrets under _Settings → Actions → Secrets_: `RELEASE_TOKEN` (a Forgejo
token with read/write on the repository) and `RELEASE_USER` (the account it
belongs to — git needs both halves to push over HTTPS). Neither can be
named `FORGEJO_*`, `GITHUB_*` nor `GITEA_*` — Forgejo reserves those prefixes
the way GitHub reserves `GITHUB_*`, and `secrets.FORGEJO_TOKEN` would
resolve to the runner's own automatic token, which is the trap: it looks
like it works.

## 2. Dependency updates: Dependabot → Renovate

**Why:** Dependabot is a GitHub-native feature with no Forgejo equivalent.
Renovate is the replacement, and it has a dedicated `platform: forgejo`
setting.

There are two shapes this can take, and which one applies depends entirely
on how the target Forgejo instance is set up:

### Case A: a shared Renovate bot with `autodiscover` already runs on the instance

If your Forgejo instance already runs a shared Renovate bot configured with
`"autodiscover": true`, **you don't need a per-repo `renovate.json` at
all.** The `autodiscover` setting means the bot enumerates every repository
its token can see and applies its own global configuration to each one —
adding a project to Renovate's coverage there is a matter of granting the
bot's token access to the repo, not writing configuration into the repo
itself.

A real example of that kind of global configuration (the specific values
worth noting: `autodiscover`, the vulnerability-alert label, and
`automerge` on every update type):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "platform": "forgejo",
  "autodiscover": true,
  "binarySource": "global",
  "repositoryCache": "enabled",
  "persistRepoData": true,
  "extends": [
    "config:best-practices",
    ":enableVulnerabilityAlertsWithLabel('security')",
    ":semanticCommits",
    "security:openssf-scorecard"
  ],
  "packageRules": [
    {
      "matchUpdateTypes": [
        "major",
        "minor",
        "patch",
        "pin",
        "pinDigest",
        "digest",
        "lockFileMaintenance",
        "rollback",
        "bump",
        "replacement"
      ],
      "automerge": true
    }
  ]
}
```

That's the shape a shared bot's configuration takes — `platform: forgejo`
plus `autodiscover: true` is what makes it apply across every repository
the bot's token can reach, with no file needed in any one of them. (A
bot's own configuration is sometimes mid-migration itself — for example
still pointed at a `platform` value left over from a previous forge while
the underlying forge migration is still in progress. Check what the bot
you're relying on is actually configured with before assuming it's live.)

### Case B: no shared bot — this repo runs its own Renovate

If nothing like that exists on the target instance, add a `renovate.json`
at the repo root and run Renovate against just this repository
(self-hosted, or Renovate's own GitHub/Forgejo App equivalent if the
instance offers one):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "platform": "forgejo",
  "extends": [
    "config:best-practices",
    ":enableVulnerabilityAlertsWithLabel('security')"
  ],
  "packageRules": [
    {
      "matchUpdateTypes": [
        "major",
        "minor",
        "patch",
        "digest",
        "pin",
        "lockFileMaintenance"
      ],
      "automerge": true
    }
  ]
}
```

Renovate's `github-actions` manager already covers `.forgejo/workflows/` out
of the box — Forgejo's workflow YAML is compatible enough with GitHub
Actions that no separate manager or extra `fileMatch` setting is needed for
CI dependency bumps to be picked up alongside the `bun` ones.

`:semanticCommits` (or the default) already produces the same commit-type
split this scaffold's `.github/dependabot.yml` sets up by hand — `chore`
for regular dependency bumps, `ci` for the `github-actions` manager, which
covers Forgejo workflows too — so no extra `commit-message` setting is
needed to match it.

## 3. CI workflows: `.github/workflows/` → `.forgejo/workflows/`

The YAML shape carries over directly — same `on:`, `jobs:`, `steps:`
structure, same job dependencies. What doesn't carry over is a handful of
concrete platform differences:

- **`if:` on secrets works differently.** Forgejo Actions lets a _job-level_
  `if:` read `secrets` directly — `if: secrets.CLOUDFLARE_API_TOKEN != ''`
  is valid and is how a deploy job stays dormant until a credential exists.
  **GitHub Actions does not allow this** — reading `secrets` in a
  job-level (as opposed to step-level) `if:` fails to parse there. Don't
  "fix" a Forgejo workflow's job-level secret check into a step-level one on
  the strength of GitHub's docs; it's correct as written for Forgejo.

- **Actions need to be reachable from the runner.** GitHub Actions resolves
  a bare `actions/checkout@v4` against `github.com`. A Forgejo runner needs
  either a fully qualified URL to an action mirror —
  `uses: https://code.forgejo.org/actions/checkout@v4` — or a
  self-hosted instance that mirrors the actions you use. Copying
  `actions/checkout@<sha>` verbatim into a `.forgejo/workflows/*.yml` and
  expecting it to resolve is the single most common way this swap breaks.

- **Secret names can't start with `GITHUB_`, `FORGEJO_` or `GITEA_`.**
  Forgejo reserves those prefixes for its own automatic variables
  (`FORGEJO_TOKEN`, `FORGEJO_REPOSITORY`, `FORGEJO_SERVER_URL`, injected into
  every job by the runner itself) the way GitHub reserves `GITHUB_*`.
  Naming a repository secret `FORGEJO_TOKEN` doesn't fail — it silently
  resolves to the runner's own automatic token instead of the one you meant,
  which has repository write and makes the wrong credential succeed quietly
  rather than fail loudly.

- **Don't cache `~/.bun/install/cache`.** This applies identically on a
  Forgejo runner as it does on GitHub's: running `bun install` cold, for a
  handful of dependencies, takes a few seconds — taring and restoring the
  cache directory takes longer than that. This scaffold's own
  `.github/workflows/ci.yml` already skips that cache; keep skipping it in
  the `.forgejo/workflows/` version.

- **Container jobs start emptier than GitHub's hosted runners.** GitHub's
  `runs-on: ubuntu-24.04` is a full VM image with git, node, and the rest
  preinstalled. A Forgejo `runs-on: docker` job runs inside whatever
  container image you name, and a minimal one (`oven/bun:1.3.14-alpine`, for
  instance) has none of that. `actions/checkout` is a JavaScript action, so
  a container with no `node` fails it outright
  (`exec: "node": executable file not found`); installing `git` also pulls
  in the need for `ca-certificates`, since git reads the system CA store and
  a minimal image hasn't got one. Expect a first step along the lines of
  `apk add --no-cache ca-certificates git nodejs` (or your image's
  equivalent) in most jobs that a GitHub-hosted runner needed no equivalent
  step for at all.

Translating this scaffold's own `.github/workflows/ci.yml` job-for-job into
`.forgejo/workflows/ci.yml` is mechanical once those five points are
accounted for — same jobs (`lint`, `test`, `audit`, `prose`, `commits`),
same commands, `runs-on: docker` plus a container image instead of
`runs-on: ubuntu-24.04`, and the checkout/setup steps rewritten to match
the preceding points.
