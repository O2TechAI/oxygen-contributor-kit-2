# I001

Evidence: L004, L010, L032

Live, one-item end-to-end preflights are especially valuable for LLM evaluation pipelines because they test provider access, structured-output constraints, and dataset adapters together. In this segment they prevented large guaranteed-failing submissions and caught a silent empty-ground-truth bug that ordinary schema inspection and unit tests had missed.

# I002

Evidence: L019, L020, L021, L023, L024

Evaluation roles are causal parts of the benchmark. Collapsing simulator, interaction partner, generator, and judge onto the target model changes both the generated evidence and its scoring. Saved responses can support a controlled judge replacement for single-turn HUMANUAL, while SimulatorArena requires trajectory regeneration after an assistant change because later turns depend on earlier assistant behavior.

# I003

Evidence: L022, L027, L028

Dataset row count alone does not identify the evaluation protocol. The same source project contained a full human-conversation corpus, a smaller assistant-benchmark subset, and a separate SOUL validation sample. Reliable reporting therefore needs row-level provenance and a precise statement of whether the evaluated object is an assistant, a simulated user, or a repackaged conversation sample.

# I004

Evidence: L005, L012, L013, L014, L015, L030

Resumable outputs, isolated model directories, explicit credential selection, one active job per logical lane, and dependency-aware consolidation make long API evaluations recoverable across scheduler failures, access restrictions, quotas, maintenance, and QOS limits. These controls preserved usable partial results and prevented duplicate work when the execution plan changed repeatedly.

# I005

Evidence: L034, L035, L036, L038

Mean score and multi-candidate win rate measure different properties. A model can remain close to the winner on most examples and still have a low top-one rate when its strongest cases coincide with another model's strongest cases. Pairwise credit, loss margins, rank frequencies, and fixed-anchor comparisons preserve competitiveness and are less dependent on the current candidate pool.

# I006

Evidence: L035, L038, L041, L042, L043

Stable aggregate rankings can coexist with low item-level judge agreement, task-specific reversals, and presentation-position effects. Evaluation reports should retain judge-by-task results and position-balance diagnostics even when the overall order is unanimous, because the aggregate can hide materially different judgments about individual behaviors.

# I007

Evidence: L047, L053, L054, L055

Absolute-value audit distances remove direction and can merge qualitatively opposite outcomes. Source distinguishability should be accompanied by whether the judge selected the simulator as human, and specificity distance should be accompanied by a signed over- or under-specificity measure. This separates uncertainty, successful imitation, confident misclassification, and profile caricature.

# I008

Evidence: L048, L049, L050, L051

A proxy score can correlate with one audit dimension while remaining unrelated to another. The HUMANUAL naive baseline tracked target-user specificity more than source indistinguishability, whereas SimulatorArena style scores weakly tracked both. Direct audits therefore help name the behavior a benchmark score captures and prevent a broad label such as human likeness from hiding narrower measurement validity.

# I009

Evidence: L016, L017, L044, L045, L046

Keeping immutable raw results separate from reusable analysis code made repeated methodological corrections inexpensive: suite aggregation, model inclusion, evaluator inclusion, reward reinterpretation, and slide exports could all change without overwriting trajectories. This separation is useful when an evaluation protocol is still being refined and earlier outputs must remain auditable.
