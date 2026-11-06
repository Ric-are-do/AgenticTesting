#!/usr/bin/env bash
# Checks for write-fallback-report.sh. Runs in a temp directory; needs nothing else.
SCRIPT="$(cd "$(dirname "$0")" && pwd)/write-fallback-report.sh"
cd "$(mktemp -d)"
FAILS=0
check() { if [ "$2" -eq 0 ]; then echo "PASS $1"; else echo "FAIL $1"; FAILS=$((FAILS+1)); fi; }

expected="## Summary
## Failure type
## Failing tests
## Not investigated
## Test vs UI
## Flaky tests
## Live site check
## Evidence
## Run"

# writes_when_missing
bash "$SCRIPT" 123 "turn limit reached"; code1=$?
f=reports/ci-failure-123.md
[ -f "$f" ] && grep -q "Investigation did not finish: turn limit reached" "$f" \
  && [ "$(grep '^## ' "$f")" = "$expected" ] && grep -q "123" <(awk '/^## Run/{f=1;next} f' "$f")
check writes_when_missing $?

# keeps_existing_report
mkdir -p reports; printf 'real report' > reports/ci-failure-456.md
bash "$SCRIPT" 456 x; code2=$?
[ "$(cat reports/ci-failure-456.md)" = "real report" ]
check keeps_existing_report $?

# exits_zero_always
[ "$code1" -eq 0 ] && [ "$code2" -eq 0 ]
check exits_zero_always $?

[ "$FAILS" -eq 0 ] && echo "ALL PASSED" || { echo "$FAILS FAILED"; exit 1; }
