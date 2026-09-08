# I001

Evidence: L004, L005

In resumable scheduler workflows, resolving relative resources from the submission location is part of correctness. Verifying existing active or partial state before replacement submission also helps avoid duplicate evaluation records.

# I002

Evidence: L008, L011

Small provider preflights can catch access-policy failures before a batch starts, but they do not prove that quota capacity is sufficient for a full run. Route access and sustained capacity need separate checks.

# I003

Evidence: L009, L012, L013

Dependency chains limit concurrency on a shared endpoint, while selective release of one ready job can adapt to scheduler conditions. Preserving the remaining dependencies retains controlled ordering without rebuilding the full wave.

# I004

Evidence: L010, L027

A combined score can conceal suite-specific reversals when one suite contributes more episodes. Model comparisons therefore need separate suite-level reporting alongside any aggregate.

# I005

Evidence: L017, L018, L019, L022

Auxiliary-role routing is a central experimental variable. Applying the target model to assistant and judge roles changes both the generated interaction and its score; saved single-turn responses may be rejudged, but multi-turn interactions generated with the wrong assistant must be regenerated.

# I006

Evidence: L020, L024, L028

Reproducibility depends on recording dataset selection, original interaction conditions, requested models, and provider-served model identity. Missing any of these can leave materially different protocols indistinguishable in later analysis.

# I007

Evidence: L014, L015, L016

A reusable evaluation analyzer benefits from consistent tokenization, explicit suite-level aggregation, and an extension interface. Checking extracted measures against evaluator-recorded invariants provides evidence that the analysis preserves task semantics.

# I008

Evidence: L029, L030, L031

Randomized candidate order and recorded position counts support bias audits, but anonymous identifiers should be constrained by a strict schema. Free-form identifiers can create parsing failures that retries do not reliably resolve.

# I009

Evidence: L032, L033

Candidate count alone does not determine comparative-judging cost. Shared context and shorter instructions can offset additional responses, while generated-output length and sequential judges may dominate runtime; prompt components and outputs should be measured separately.

# I010

Evidence: L025, L026, L027, L028

Benchmark labels should reflect the actual reward objective, suite weighting, and sampling protocol. A behavioral-fidelity score, an uneven combined mean, and a derived subset should not be presented as if they were the same evaluation as a correctness-oriented or differently sampled benchmark.
