# I001

Evidence: L011, L012, L013, L014

Model routing is part of an evaluation protocol. A compatibility override silently collapsed several roles into one model and changed the experiment into self-play and self-judging. Role-specific configuration and routing checks are necessary before interpreting cross-model scores.

# I002

Evidence: L015, L016, L017, L018

Top-one win rate is sensitive to candidate composition and discards score margins. A system can have comparable average quality yet win rarely when its strongest examples overlap with a stronger competitor. Absolute scores, pairwise credit, margin distributions, and uncertainty should remain separate outputs.

# I003

Evidence: L020, L021, L022, L024

A lower-assumption validation metric still requires tight controls over support and information flow. Fixed source-derived comparisons, identical support across systems and judges, removal of identity and assistant leakage, and dataset-level aggregation reduce the risk that the audit measures metadata or unsupported per-user effects.

# I004

Evidence: L025, L026, L029

A small end-to-end smoke test can expose operational defects before a large judging wave. Short batch-local identifiers reduced structured-output failures, and resumable item-level recovery limited the cost of missing judgments, though recovery paths remained necessary in the full protocol.

# I005

Evidence: L027, L028

Order reversal revealed judge instability in the smoke test, but the larger run omitted reversal to reduce cost. Future large evaluations can retain reversals on a fixed calibration subset so order sensitivity remains measurable.

# I006

Evidence: L021, L023, L030

Distance-based audit components discard direction, so a low or high gap is ambiguous without signed diagnostics. Low specificity distance can mean shared correctness, uncertainty, or error, while high source distance can reflect confident correct or incorrect discrimination. Direction, selection rates, and midpoint frequency should accompany distance measures.

# I007

Evidence: L024, L027, L029, L030

Agreement between a benchmark evaluator and a direct audit is an empirical result. Differing smoke-test rankings and small full-audit system differences require uncertainty estimates and cross-judge comparison before supporting a validation claim.
