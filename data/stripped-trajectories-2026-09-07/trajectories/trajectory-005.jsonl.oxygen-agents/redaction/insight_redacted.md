# I001

Evidence: L010, L011, L012, L013

Model routing is part of the evaluation protocol. A compatibility override silently collapsed several roles into one model and changed the experiment into self-play and self-judging. Role-specific provenance checks and routing tests are necessary before interpreting cross-model scores.

# I002

Evidence: L013, L022

Fixing the auxiliary assistant improves comparability across evaluated simulators, but it does not reproduce human-reference conditions when the original conversations used heterogeneous assistants. Evaluations of interactive user behavior should record this environment mismatch and, when feasible, stratify or recreate the reference conditions.

# I003

Evidence: L015, L016, L017

Top-one win rate is sensitive to candidate composition and discards score margins. A candidate can have comparable average quality yet win rarely when its strongest examples overlap with a stronger competitor. Absolute scores, pairwise credit, margin distributions, and uncertainty convey distinct information and should remain separate outputs.

# I004

Evidence: L022, L023, L024

Long opaque identifiers can cause structured-output failures even when task content is valid. Neutralizing identities in context and using short batch-local response identifiers reduces transcription errors, while resumable item-level recovery limits the cost of remaining failures.

# I005

Evidence: L018, L020, L021, L022

A lower-assumption validation metric still requires tight controls over support and information flow. Fixed source-derived comparisons, identical support across systems and judges, removal of assistant and identity leakage, and dataset-level aggregation help prevent the audit from measuring distractor choice, metadata, or unsupported per-user effects.

# I006

Evidence: L021, L031, L033

Distance-based audit components discard direction, so a low or high gap is ambiguous without signed diagnostics. Low specificity distance can mean shared correctness, shared uncertainty, or shared error, while high source distance can reflect confident correct or incorrect discrimination. Direction, selection rates, and midpoint frequency should be reported beside each distance.

# I007

Evidence: L026, L028

Order reversal revealed substantial judge instability in the smoke test, yet the full run removed reversal to reduce cost. Future full evaluations should retain reversals on a fixed calibration subset so order sensitivity remains estimable.

# I008

Evidence: L029, L030, L031, L032

Judge behavior can dominate an evaluation scale even when system differences are small. Strong preference for extreme labels increased source distances, so calibration controls such as same-source comparisons are needed before interpreting absolute magnitude as simulator distinguishability.

# I009

Evidence: L023, L024, L029

A small end-to-end smoke test can expose operational defects before a large judging wave. The smoke found identifier-transcription failures and enabled targeted recovery, while the later full run still had a few unresolved omissions, showing that recovery paths must remain part of the full protocol.

# I010

Evidence: L025, L027, L029, L030, L033

Agreement between a benchmark evaluator and a direct audit is itself an empirical result. Opposite smoke-test orderings and small full-audit differences show that a validation claim requires uncertainty estimates and cross-judge comparison rather than selecting the ranking that best matches an expected benchmark.
