# TODO

Open this first when we start working again.

## Next up

1. [ ] **Watch the video on ARIA snapshots:**
   https://www.youtube.com/watch?v=P4R6hnsE0UY&t=241s (starts at 4:01)
2. [ ] **Write a new set of tests** based on what we learn in that video.
3. [ ] **Finish this video:** https://www.youtube.com/watch?v=6CaQ9ZFuuKI
4. [ ] **Test the overall flow end to end,** and understand the YAML files and
   the flow logic better. *(Reminder to myself.)*
   - Start with the diagrams in `lessons learned/08-ci-investigator.md`.
   - The files: `.github/workflows/playwright.yml`, `claude.yml` and
     `investigate-ci.yml`.

## Carried over from last session (2026-11-06)

- [ ] **First live test of `@claude investigate`** on `main`: comment exactly
  `@claude investigate` (one space, lowercase). It only works now that the
  change is merged.
- [ ] **Known gaps** in the CI investigator (details in
  `lessons learned/08-ci-investigator.md`, "Known gaps"):
  - the trigger phrase is strict: spacing and capital letters break it;
  - the report name isn't fixed by the run ID yet;
  - no `failed.log` when the test job fails before any test runs;
  - Claude's tool list is broader than it needs to be.
- [ ] **Delete the `ci-investigator-auto-run` branch.** Everything in it is
  in `main`.
