# I001

Evidence: L004, L010, L030

One-item end-to-end preflights are valuable for model-evaluation pipelines because they test provider access, structured-output constraints, and dataset adapters together. Here they prevented guaranteed-failing batch submissions and caught a silent nested-data bug that schema inspection alone had missed.

# I002

Evidence: L018, L019, L020, L022, L023

Evaluation roles are causal parts of a benchmark. Assigning simulator, interaction partner, generator, and judge roles to the target model changes both the generated evidence and its scoring. Saved responses can support controlled judge replacement for a single-turn task, while a multi-turn task requires trajectory regeneration after an assistant change because later turns depend on earlier assistant behavior.

# I003

Evidence: L021, L025, L026

Dataset row count alone does not identify an evaluation protocol. A larger conversation corpus, a smaller assistant benchmark, and a separate validation sample can coexist. Reliable reporting therefore needs row-level provenance and a precise statement of whether the evaluated object is an assistant, a simulated user, or a repackaged conversation sample.

# I004

Evidence: L005, L012, L013, L014, L015, L028

Resumable outputs, isolated result areas, explicit credential selection, controlled concurrency, and dependency-aware consolidation make long API evaluations recoverable across scheduler failures, access restrictions, quotas, maintenance, and resource limits. These controls preserved usable partial results and prevented duplicate work as the execution plan changed.

# I005

Evidence: L032, L033, L035

Mean score and multi-candidate win rate measure different properties. A candidate can remain close to the winner on many examples and still have a low top-one rate when its strongest cases coincide with another candidate's strengths. Pairwise credit, loss margins, rank frequencies, and fixed-anchor comparisons preserve competitiveness and depend less on the current candidate pool.

# I006

Evidence: L035, L037, L038

Stable aggregate rankings can coexist with task-specific reversals, moderate item-level judge agreement, and presentation-position effects. Reports should retain judge-by-task results and position-balance diagnostics because an aggregate can hide materially different judgments about individual behaviors.

# I007

Evidence: L045, L046, L047

Absolute-value audit distances remove direction and can merge qualitatively opposite outcomes. Source distinguishability should be accompanied by whether the judge selected the simulator as human, and specificity distance should be accompanied by a signed over- or under-specificity measure. This separates uncertainty, successful imitation, confident misclassification, and exaggerated target association.

# I008

Evidence: L043, L044

A proxy score can correlate with one audit dimension while remaining unrelated to another. Direct audits help identify which behavior a benchmark score captures and prevent a broad label such as human likeness from hiding narrower measurement validity.

# I009

Evidence: L039, L040, L041

Keeping preserved evaluation results separate from reusable analysis code made repeated methodological corrections inexpensive: model inclusion, evaluator inclusion, reward reinterpretation, and figure regeneration could change without overwriting prior evaluations.
