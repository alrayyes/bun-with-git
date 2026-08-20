FROM oven/bun:1.3.14-alpine@sha256:5acc90a93e91ff07bf72aa90a7c9f0fa189765aec90b47bdbf2152d2196383c0

# What commitlint needs that oven/bun's alpine image doesn't already carry.
#
# oven/bun:*-alpine already ships node (bun's own compatibility shim), which is
# what actions/checkout needs to run at all. It has no git, so checkout falls
# back to fetching a tarball through the GitHub/Forgejo REST API instead of
# cloning — and that fallback does not fail. It just leaves the job with no
# .git, which commitlint needs to diff against the merge base and gitleaks needs
# to have any history to scan. A secret scan that runs against an empty history
# goes green having read nothing, and nothing in the job says so.
#
#   git             so checkout clones instead of falling back to a tarball
#   ca-certificates git needs it to clone over HTTPS at all
#
# Deliberately unpinned. An apk version belongs to the Alpine branch this image
# is built on, not to this file — see .hadolint.yaml for the rest of that
# reasoning.
RUN apk add --no-cache \
        ca-certificates \
        git
