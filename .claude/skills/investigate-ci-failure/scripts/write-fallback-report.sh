#!/usr/bin/env bash
# Write a short report when the investigation left none, so a failed run always has one.
#
# Usage: write-fallback-report.sh RUN_ID REASON
#   Does nothing if reports/ci-failure-RUN_ID.md already exists (a real or partial report).
#   Uses the same headings as the skill's report. Always exits 0.
RUN_ID="${1:-none}"
REASON="${2:-unknown}"
REPORT="reports/ci-failure-$RUN_ID.md"

[ -f "$REPORT" ] && exit 0
mkdir -p reports || exit 0

cat > "$REPORT" <<EOF || true
# CI failure report: run $RUN_ID

## Summary

Investigation did not finish: $REASON. See the playwright-report artifact.

## Failure type

Not investigated

## Failing tests

Not checked

## Not investigated

Not checked

## Test vs UI

Not checked

## Flaky tests

Not checked

## Live site check

Not checked

## Evidence

None

## Run

Run ID: $RUN_ID
EOF
exit 0
