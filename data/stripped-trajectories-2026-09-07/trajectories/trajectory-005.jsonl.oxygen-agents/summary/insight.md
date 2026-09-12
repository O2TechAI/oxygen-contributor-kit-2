# I001

Evidence: L019, L020, L021, L023, L024

Model routing is part of the evaluation protocol, not an implementation detail. A compatibility override silently collapsed four roles into one model and changed the experiment into self-play and self-judging. Role-specific provenance and routing tests are necessary before interpreting cross-model scores.

# I002

Evidence: L022, L024, L025

Fixing the auxiliary assistant improves comparability across evaluated simulators, but it does not reproduce human-reference conditions when the original conversations used heterogeneous assistants. Evaluations of interactive user behavior should record this environment mismatch and, when feasible, stratify or recreate the reference assistant.

# I003

Evidence: L028, L029, L030, L033

Top-one win rate is sensitive to candidate composition and discards score margins. A model can have comparable average quality yet win rarely when its strong examples overlap with a stronger competitor. Absolute scores, pairwise credit, margin distributions, and uncertainty convey distinct information and should remain separate outputs.

# I004

Evidence: L031, L040, L046

Opaque identifiers can cause structured-output failures even when task content is valid. Neutralizing identities in context and using short batch-local response IDs reduces parser errors while preserving substantive evidence, and resumable item-level recovery limits the cost of remaining failures.

# I005

Evidence: L035, L036, L038, L040, L043

A lower-assumption validation metric still requires tight controls over support and information flow. Fixed source-derived comparisons, identical support across systems and judges, removal of assistant and identity leakage, and dataset-level aggregation prevent the audit from measuring distractor choice, metadata, or unsupported per-user effects.

# I006

Evidence: L041, L042, L055, L057

Distance-based audit components deliberately discard direction, so a low or high gap is ambiguous without signed diagnostics. Low specificity distance can mean shared correctness, shared uncertainty, or shared error, while high source distance can reflect confident correct or incorrect discrimination. Report direction, selection rates, and midpoint frequency beside every distance.

# I007

Evidence: L048, L049, L050

Order reversal revealed substantial judge instability in the smoke test, yet the full run removed reversal to reduce cost. This creates a clear tradeoff: scale increased while a measured reliability control was dropped. Future full evaluations should retain reversals on a fixed calibration subset so order sensitivity remains estimable.

# I008

Evidence: L048, L053, L054, L055, L056

Aggregate rankings can appear stable even when judge behavior dominates the scale. Gemini's strong preference for extreme labels pushed source distances near one, while system differences in the composite were small. Calibration controls such as human-human or same-source pairs are needed before interpreting the absolute magnitude as simulator distinguishability.

# I009

Evidence: L044, L046, L047, L051, L053

A small end-to-end smoke test can expose operational defects before a large judging wave. The smoke found identifier-transcription failures and enabled targeted recovery before the 11,300-item configuration, although the later full run still produced a small number of malformed-batch omissions, showing that recovery paths must remain part of the full protocol.

# I010

Evidence: L033, L043, L048, L054, L057

Agreement between a benchmark evaluator and a direct audit is itself an empirical result. The smoke showed opposite orderings, and the full Gemini audit produced only small pairwise differences; therefore a validation claim requires uncertainty estimates and cross-judge comparison rather than selecting the ranking that best matches an expected benchmark.
