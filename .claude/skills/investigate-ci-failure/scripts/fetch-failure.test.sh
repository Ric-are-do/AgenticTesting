#!/usr/bin/env bash
# Checks for fetch-failure.sh, run against this repo's real GitHub Actions history.
# Needs `gh` logged in. Known runs (artifacts expire after 30 days, early Dec 2026):
#   41894900615  failed main run ("failed on purpose throwing error")
#   41891862700  run on PR branch add-claude-github-actions-1793818471215
#   41895842655  Claude Code Review run (has no Playwright artifacts)
cd "$(git rev-parse --show-toplevel)"
SCRIPT=".claude/skills/investigate-ci-failure/scripts/fetch-failure.sh"
FAILS=0
OUT=""; CODE=0

run() { OUT=$(bash "$SCRIPT" "$@" 2>/dev/null) && CODE=0 || CODE=$?; }
check() { # name, condition result (0 = pass)
  if [ "$2" -eq 0 ]; then echo "PASS $1"; else echo "FAIL $1 (exit=$CODE out=$(echo "$OUT" | tr '\n' ' '))"; FAILS=$((FAILS+1)); fi
}
field() { echo "$OUT" | sed -n "s/^$1=//p"; }

failed_main_ids=$(gh run list --branch main --workflow "Playwright Tests" --status failure --limit 50 --json databaseId --jq '.[].databaseId')

# default_finds_failed_main_run
run
id=$(field RUN_ID)
[ "$CODE" -eq 0 ] && [ "$(field HEAD_BRANCH)" = "main" ] && echo "$failed_main_ids" | grep -qx "$id"
check default_finds_failed_main_run $?

# looks_back_past_passing_runs
newest=$(gh run list --branch main --workflow "Playwright Tests" --limit 1 --json databaseId,conclusion --jq '.[0] | "\(.databaseId) \(.conclusion)"')
if [ "${newest#* }" = "success" ]; then
  run
  [ "$(field RUN_ID)" != "${newest% *}" ] && [ -n "$(field RUN_ID)" ]
  check looks_back_past_passing_runs $?
else
  echo "SKIP looks_back_past_passing_runs (newest main run is $newest)"
fi

# explicit_pr_run_id
run 41891862700
[ "$CODE" -eq 0 ] && [ "$(field HEAD_BRANCH)" = "add-claude-github-actions-1793818471215" ]
check explicit_pr_run_id $?

# no_failed_run_exits_3
CI_WORKFLOW="No Such Workflow" run
[ "$CODE" -eq 3 ]
check no_failed_run_exits_3 $?

# no_artifacts_exits_4
run 41895842655
[ "$CODE" -eq 4 ] && [ "$(field RUN_ID)" = "41895842655" ] && [ -f ".ci-failure/41895842655/failed.log" ]
check no_artifacts_exits_4 $?

# downloads_report_and_results
run 41894900615
[ "$CODE" -eq 0 ] && [ -d ".ci-failure/41894900615/playwright-report" ]
check downloads_report_and_results $?

# branch_flag_looks_on_that_branch: --branch picks the latest failure on another branch
run --branch add-claude-github-actions-1793818471215
[ "$CODE" -eq 0 ] && [ "$(field HEAD_BRANCH)" = "add-claude-github-actions-1793818471215" ]
check branch_flag_looks_on_that_branch $?

# branch_flag_with_no_failures_exits_3: a branch with no failed runs
run --branch no-such-branch
[ "$CODE" -eq 3 ]
check branch_flag_with_no_failures_exits_3 $?

# run_id_wins_over_branch_flag: an explicit run ID is used even if --branch names another branch
run --branch no-such-branch 41894900615
[ "$CODE" -eq 0 ] && [ "$(field RUN_ID)" = "41894900615" ]
check run_id_wins_over_branch_flag $?

[ "$FAILS" -eq 0 ] && echo "ALL PASSED" || { echo "$FAILS FAILED"; exit 1; }
