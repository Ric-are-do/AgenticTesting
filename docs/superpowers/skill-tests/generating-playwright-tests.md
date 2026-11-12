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

## Plan-first dependency (2026-11-11)

Request: "Automate this test case: on Swag Labs, sort the products by price
low to high and check the first product is the cheapest one." No plan in
`specs/` covers sorting. Dry run (list the steps, do nothing), 1 rep each,
fresh `sonnet` general-purpose subagent.

- **RED (old skill):** went straight to writing the test: "The user gave the
  steps directly, so no plan is needed". The `// spec:` header would have
  pointed to "none or the user's request".
- **GREEN (step 0 added):** "Skill step 0: no plan covers this scenario, so
  load planning-playwright-tests", passing the user's steps so the scenario
  is written to `specs/` first, then generated from it. ✅

## 2026-11-12: follow the framework map (plan Task 6)

Prompt: "Write the test for: log in as standard_user, sort products by price
low to high, the first product is Sauce Labs Onesie."

### RED: old skill, standard framework present

No failure seen: the agent copied the existing fixtures, added `sortDropdown`,
`itemNames` and `sortBy()` to the inventory page object, the spec had no raw
locators, `1 passed`. The update is still needed because the skill's own
example used raw `page.locator(...)` (contradicting the standard framework)
and it had no "read the framework map" step for `existing` repos.

### GREEN: new skill

| Case | Result |
|------|--------|
| G1 decision `standard` | ✅ Read the map; spec uses fixtures and page-object methods only (grep clean); locators and `sortBy()` added to the page object; walked live; `1 passed`. |
| G2 decision `existing` (raw-locator repo) | ✅ Followed the map: `@playwright/test`, `[data-test=...]` locators, full URLs, header comments, numbered steps, `test.describe('Swag Labs critical path')`; no `apps/` or page objects created; `1 passed`. |

**Merged with plan-first (2026-11-12):** this branch was built before the
plan-first step existed, so the map step became step 1 and plan-first stays
step 0. The two together have not been re-run: G1 and G2 above were run
without the plan-first step.
