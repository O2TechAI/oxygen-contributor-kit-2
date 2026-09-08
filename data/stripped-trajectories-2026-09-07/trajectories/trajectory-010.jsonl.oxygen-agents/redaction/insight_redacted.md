# I001

Evidence: L004, L009, L022

Live, one-item end-to-end preflights are valuable for language-model evaluation pipelines because they jointly test provider access, structured-output constraints, and dataset adapters. Here they prevented guaranteed-failing batch submissions and exposed a silent empty-ground-truth bug before large-scale execution.

# I002

Evidence: L014, L015, L017, L018

Evaluation roles are causal parts of a benchmark. Assigning the simulator, interaction partner, generator, and judge roles to the target model changes both the generated evidence and its scoring. Saved responses can support a controlled judge replacement for a single-turn task, while a multi-turn task requires trajectory regeneration after an assistant change.

# I003

Evidence: L016, L020

Dataset row count alone does not identify an evaluation protocol. A larger conversation corpus, a smaller assistant-oriented benchmark, and a separate validation sample can contain related examples while evaluating different objects. Reliable reporting therefore needs clear provenance and a precise statement of whether the evaluated object is an assistant, a simulated user, or a repackaged conversation sample.

# I004

Evidence: L005, L009, L010, L011

Resumable outputs, isolated run locations, explicit credential selection, and dependency-aware scheduling make long API evaluations recoverable across scheduler failures, access restrictions, quotas, and resource changes. These controls preserved usable partial results and prevented duplicate work as the execution plan changed.

# I005

Evidence: L021, L023

Mean score and multi-candidate win rate measure different properties. A candidate can remain close to the winner on many examples and still have a low top-one rate when its strongest cases coincide with another candidate's strongest cases. Pairwise credit, loss margins, rank frequencies, and fixed-anchor comparisons preserve information that a hard top-one rate discards.

# I006

Evidence: L024, L026

Stable aggregate rankings can coexist with missing-data risk, low item-level evaluator agreement, task-specific reversals, and presentation-position effects. Reports should retain evaluator-by-task results, missingness, and position-balance diagnostics even when the overall ordering is consistent.

# I007

Evidence: L029, L030, L031

Absolute-value audit distances remove direction and can merge qualitatively opposite outcomes. Source distinguishability should be accompanied by whether the evaluator selected the simulator as human, and specificity distance should be accompanied by a signed over- or under-specificity measure. This separates uncertainty, successful imitation, confident misclassification, and profile caricature.

# I008

Evidence: L029, L030, L031

A proxy score can track one audited behavior while remaining unrelated to another. Direct behavioral audits help identify what a benchmark score actually captures and prevent broad labels such as human likeness from hiding narrower measurement validity.

# I009

Evidence: L012, L013, L027, L028, L032

Separating immutable evaluation outputs from reusable analysis code makes methodological corrections inexpensive. Aggregation, model and evaluator inclusion, reward interpretation, and presentation exports can change without overwriting the underlying results, which is useful while an evaluation protocol is still being refined.
