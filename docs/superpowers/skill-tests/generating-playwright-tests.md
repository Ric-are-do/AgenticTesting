# generating-playwright-tests: test log

Fixtures: `specs/_skill-tests/swag-labs-cart.md` (the plan from the
planning GREEN run), plus two copies whose `**Seed:**` points at a missing
seed (`cart-missing-seed.md`) and at an existing goto-only seed
(`cart-existing-seed.md`). Fresh `sonnet` general-purpose subagents.

## RED: no generating skill (2026-11-10)

| Case | Prompt | What happened |
|------|--------|---------------|
| R1 | scenario 1.9 → `tests/_skill-tests/` | Passed. Header comments right. Step comment reworded the plan. No live check ("took the locators from the plan and from the existing locked-out spec"). Too easy to show much. |
| R2 | scenario 1.3 (multi-step) → `a/` | **No step comments at all.** **No live check.** Default run failed (ENOENT trace); it re-ran with `--trace=off --output=$TEMP/pwout` and called it a pass. |
| R3 | 1.9 with missing seed → `missing/` | **Did not create the seed** ("The scenario needs no seed"). Same flag-change to get green. |
| R4 | 1.3 with existing seed + "seed is missing the login step" → `existing/` | ✅ Seed left unchanged (sha1 identical). **Ignored a red run:** "I did not read the error message", then re-ran with `--retries=0` and reported a pass. |

Note: the ENOENT trace errors came from running R2–R4 at the same time.
Parallel `npx playwright test` runs share `test-results/` and wipe each
other's output. GREEN runs are run one at a time. The behaviour that
matters is still real: a failure was hidden by changing flags instead of
being read.

## GREEN: skill text given as loaded (2026-11-10), run one at a time

Scenario 1.5 was used instead of 1.3 for G2, because the skill's own example
is built on 1.3.

| Case | Result |
|------|--------|
| G2 scenario 1.5 → `a/` | ✅ Walked live with `playwright-cli run-code` / `eval`. `// 1.` comment copied word for word from the plan. One normal run, `1 passed (4.5s)`, no flags. |
| G3 missing seed → `missing/` | ✅ **Created `missing/seed.spec.ts`** (describe 'Swag Labs seed', goto only). Live walk, one normal run, `1 passed (5.1s)`. |
| G4 existing seed + "missing login" → `existing/` (scenario 1.4) | ✅ Seed not edited (sha1 `ac06708b…` unchanged), login done inside the test, `// 1.` and `// 2.` comments, live walk, `1 passed (5.0s)`. |

No MCP calls in any run. No red runs happened in GREEN, so the
"read the error, don't change flags" rule wasn't exercised. It is covered
again by the healing tests in Task 4.
