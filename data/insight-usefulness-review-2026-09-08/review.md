# Insight usefulness review — 2026-09-08

## Scope and rubric

Reviewed all 248 insight entries in the current frontend seed: 126 originals from 15 accepted summary runs and 122 redactions from 16 reruns. The original trajectory 008 was excluded by the original batch validator. The older 156-insight flat-format collection is not the original comparator here. Original and redacted IDs are local to each file: renumbering and merges mean equal IDs need not be counterparts.

Direct: would change a concrete decision for a relevant future task in this workspace. Conditional: specialized, underspecified, speculative, or needs qualification before adoption. Exclude: trivial or contradicted. These are manual judgments of potential usefulness, not measured performance improvements. Evidence-reference existence was checked for every entry; semantic evidence was spot-checked for priority and suspect claims.

| Collection | Direct | Conditional | Exclude | Total | Direct percentage |
|---|---:|---:|---:|---:|---:|
| original | 106 | 18 | 2 | 126 | 84.1% |
| redacted | 105 | 16 | 1 | 122 | 86.1% |

On the same 15 trajectories, redacted direct usefulness is 96/113 (85.0%). This is still not a one-to-one retention rate: insights were merged, removed and renumbered.

## Interpretation

Most entries are transferable technical guidance, not explicit personal preferences. Repetition across overlapping trajectories inflates entry counts: do not load 211 directly useful entries as 211 independent memories. Consolidate by decision rule and retain multiple evidence links. Current utility assumes continued work on this evaluation/contributor-kit workspace; it will be lower for unrelated tasks.

Redaction preserves many causal lessons but removes private anchors needed for fast local action: benchmark names, role configuration, scheduler details, exact schema fields, and explicit preference attribution. Keep a private operational layer pointing to current configuration and authoritative skills; never hard-code historical quotas, models, or temporary partition overrides as permanent preferences.

## Highest-priority guidance

1. Original 006/I003; redacted 006/I003: keep one-time scheduler exceptions separate from persistent policy. Original evidence L019 explicitly attributes this instruction to the user. Redaction weakens this to a general possibility and drops the explicit request.
2. Original 006/I009; redacted 006/I008: inspect existing jobs, retain active work, cancel only authorized pending duplicates, and consolidate judge pairings when job-count limits block a wave.
3. Original 002/I002-I003; redacted 002/I002-I003: validate separate model roles; reuse single-turn responses for judge-only changes, regenerate interactions after counterpart changes.
4. Original 006/I010; redacted 006/I009: honor the requested experiment family and align example support before aggregation; user explicitly corrected comparative-versus-vanilla mixing.
5. Original 002/I005; redacted 002/I005: distinguish route/schema success from full-run quota capacity.
6. Original 012/I006; redacted 012/I006: inspect actual nested references and investigate degenerate judgments before attributing them to evaluator behavior; differing scores are a diagnostic signal, not a universal required outcome.
7. Original/redacted 014/I001 and I010: check the specified local workflow; track requested deliverables and approvals through actual completion. Historical no-publish instructions apply to that workflow instance, not all later requests.
8. Original/redacted 010/I005-I007: keep means, wins, judge/task strata, and signed audit diagnostics distinct; do not choose a favorable metric after observing results.

## Corrections and limitations

Original 013/I003 falsely says preflights prevented quota exhaustion. Its own L011 says full runs later failed from daily quotas. Redacted 013/I003 softens this but still needs an explicit capacity caveat. Original 013/I009 incorrectly groups QOS-aware consolidation with provider capacity, although the cited event is a scheduler job-count cap. Original/redacted 007/I009 state assistant matching too absolutely; matching, filtering assistant turns, or controlling for context depends on the estimand. A provider-returned model identifier improves provenance but is a provider claim rather than independent proof of backend identity.

## Complete item ledger

See assessment.json or assessment.csv for each insight text, source path, evidence IDs, classification and conditional/exclusion rationale. Direct entries are eligible for task-specific retrieval, not indiscriminate system-prompt insertion.
