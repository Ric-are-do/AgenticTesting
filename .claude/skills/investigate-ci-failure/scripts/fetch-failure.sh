#!/usr/bin/env bash
# Find a failed Playwright CI run and download its artifacts and failed log.
#
# Usage: fetch-failure.sh [RUN_ID]
#   No RUN_ID: use the latest failed run of $CI_WORKFLOW on $CI_BRANCH, looking
#   back past newer runs that passed. An explicit RUN_ID may be from any branch.
#
# Env: CI_WORKFLOW (default "Playwright Tests"), CI_BRANCH (default "main").
# Needs `gh` logged in locally, or GH_TOKEN set on GitHub.
#
# Stdout: RUN_ID=, HEAD_SHA=, HEAD_BRANCH=, RUN_DIR=
# Exit: 0 downloaded, 3 no failed run found, 4 run found but no artifacts.
set -euo pipefail

WORKFLOW="${CI_WORKFLOW:-Playwright Tests}"
BRANCH="${CI_BRANCH:-main}"
RUN_ID="${1:-}"

if [ -z "$RUN_ID" ]; then
  # `gh run list` errors when the workflow name does not exist; treat that as "none found".
  RUN_ID=$(gh run list --workflow "$WORKFLOW" --branch "$BRANCH" --status failure \
    --limit 1 --json databaseId --jq '.[0].databaseId // empty' 2>/dev/null || true)
  if [ -z "$RUN_ID" ]; then
    echo "No failed '$WORKFLOW' run found on $BRANCH." >&2
    exit 3
  fi
fi

HEAD_SHA=$(gh run view "$RUN_ID" --json headSha --jq .headSha)
HEAD_BRANCH=$(gh run view "$RUN_ID" --json headBranch --jq .headBranch)
RUN_DIR=".ci-failure/$RUN_ID"
mkdir -p "$RUN_DIR"

echo "RUN_ID=$RUN_ID"
echo "HEAD_SHA=$HEAD_SHA"
echo "HEAD_BRANCH=$HEAD_BRANCH"
echo "RUN_DIR=$RUN_DIR"

# The failed log is useful even when there are no artifacts (for example an install failure).
gh run view "$RUN_ID" --log-failed > "$RUN_DIR/failed.log" 2>/dev/null || true

# Download each artifact into its own folder so the layout is the same for one or many.
ARTIFACTS=$(gh api "repos/{owner}/{repo}/actions/runs/$RUN_ID/artifacts" \
  --jq '.artifacts[] | select(.expired == false) | .name')
if [ -z "$ARTIFACTS" ]; then
  echo "Run $RUN_ID has no downloadable artifacts. See $RUN_DIR/failed.log." >&2
  exit 4
fi
while IFS= read -r name; do
  # `gh run download` refuses to overwrite, so clear the folder to allow re-running.
  rm -rf "${RUN_DIR:?}/$name"
  gh run download "$RUN_ID" --name "$name" --dir "$RUN_DIR/$name"
done <<< "$ARTIFACTS"
