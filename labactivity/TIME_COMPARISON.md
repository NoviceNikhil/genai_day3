# AI vs Manual: Time Comparison Report

## Methodology

- Non-trivial code was generated from the prompt chain in `plan.md`.
- Time tracking follows `TIME_LOG.md`.
- Manual estimate baseline comes from section 6 of `plan.md`: approximately 5.8 hours.
- AI model/interface used: Codex in this local workspace on 2026-05-20.

## Results Summary

| Metric | AI-Assisted | Manual Estimate |
| ------ | ----------- | --------------- |
| Total wall-clock time | To be filled after your timed run | ~5.8 hours |
| Time writing prompts | Covered by `plan.md`; exact time to be filled | N/A |
| Time debugging AI output | To be filled after verification | N/A |
| Lines of code written manually | Minimal direct editing; generated from plan prompts | ~all |
| Number of AI iterations needed | 1 implementation pass plus verification | N/A |
| Rework required | To be filled after tests/manual checks | Typically fewer |

## Phase Breakdown

| Phase | AI-Assisted Actual | Manual Estimate | Notes |
| ----- | ------------------ | --------------- | ----- |
| Backend | To be filled | 75 min | Mock data, Pydantic models, FastAPI router, CORS app entry. |
| Frontend | To be filled | 115 min | Types, native fetch API client, self-contained search component, CSS module. |
| Tests | To be filled | 95 min | MSW v2 handlers, Vitest setup, 10 Testing Library tests. |
| Docs and integration | To be filled | 35 min | README, Vite proxy, benchmark docs. |

## Where AI Won

- Generated repetitive product data quickly while satisfying category and price constraints.
- Produced full component and test scaffolding from explicit behavioral requirements.
- Kept backend and frontend contracts aligned through shared model shape.

## Where AI Lost

- Verification still requires local dependency installation and test execution.
- Existing repo shape differed from the requested plan, so structure decisions required human judgment.
- The benchmark still depends on honest manual time logging; AI cannot reconstruct exact wall-clock timing after the fact.

## Quality Comparison

The implementation is intentionally conservative: in-memory backend data, native `fetch`, plain CSS modules, and network-level MSW tests. Quality should be comparable to a competent manual v1 once the test suite and backend curl checks are run locally.

## Honest Conclusion

The AI-assisted path is likely faster for scaffolding and first-pass implementation, especially because the plan supplied precise prompts and negative constraints. The savings become real only if verification passes without substantial rework.

## Surprise Findings

- The workspace already contained a root Vite app, but the plan called for a nested `frontend/` project.
- `spec.md` was referenced by the IDE context but was not present in the workspace.
