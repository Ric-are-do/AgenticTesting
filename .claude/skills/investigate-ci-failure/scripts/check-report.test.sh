#!/usr/bin/env bash
# Checks a report the skill wrote for the many-failures fixture.
# Usage: check-report.test.sh REPORT [--partial]
#   --partial: the run was cut off on purpose; only check headings and the placeholder.
REPORT="$1"; MODE="${2:-}"
FAILS=0
check() { if [ "$2" -eq 0 ]; then echo "PASS $1"; else echo "FAIL $1"; FAILS=$((FAILS+1)); fi; }
section() { awk -v h="## $1" '$0==h{f=1;next} /^## /{f=0} f' "$REPORT"; }

[ -f "$REPORT" ]; check report_exists $?
[ -f "$REPORT" ] || { echo "1+ FAILED"; exit 1; }

expected="## Summary
## Failure type
## Failing tests
## Not investigated
## Test vs UI
## Flaky tests
## Live site check
## Evidence
## Run"
[ "$(grep '^## ' "$REPORT")" = "$expected" ]; check nine_headings_in_order $?

if [ "$MODE" = "--partial" ]; then
  grep -q "Investigation in progress" "$REPORT"; check placeholder_left_when_cut_off $?
else
  ! grep -q "Investigation in progress" "$REPORT"; check no_placeholder_left $?
  section "Not investigated" | grep -q "fixture hard failure 6"; check sixth_failure_not_investigated $?
  ! section "Not investigated" | grep -qE "fixture hard failure [1-5]\b"; check first_five_not_in_not_investigated $?
  ! section "Test vs UI" | grep -q "fixture hard failure 6"; check sixth_failure_not_analysed $?
  section "Flaky tests" | grep -q "fixture flaky checkout"; check flaky_listed $?
  ! section "Failing tests" | grep -q "fixture flaky checkout"; check flaky_not_a_hard_failure $?
  section "Evidence" | grep -q "error-context.md"; check evidence_cites_error_context $?
  section "Evidence" | grep -iE "hard failure 5" | tr -d '`' | grep -qiE "no error-context|error-context.md (was |is )?(missing|absent|not)|without error-context|missing"; check evidence_says_context_missing_for_5 $?
fi

[ "$FAILS" -eq 0 ] && echo "ALL PASSED" || { echo "$FAILS FAILED"; exit 1; }
