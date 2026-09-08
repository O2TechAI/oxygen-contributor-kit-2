# I001
Evidence: L002, L004, L005, L007

A lightweight compatibility runner can preserve benchmark task logic without inheriting a training stack, but parity depends on validating both API-specific schemas and batch-environment behavior. Here, endpoint smoke tests found strict-schema requirements while the first real Slurm launch found a spool-path assumption that local tests had not exercised.

# I002
Evidence: L009, L011, L012, L013

Model access should be preflighted with a complete, minimal evaluation path before submitting a large batch. Authentication, provider policy, privacy eligibility, and daily quotas are distinct failure classes: changing keys solved credential routing but could not remove harness restrictions, and one successful request did not reveal quotas that later stopped full jobs.

# I003
Evidence: L010, L013, L044

Comparisons are only meaningful over aligned, complete samples. The trajectory consistently separated complete paired results from preliminary subsets, and the very small partial free-model samples and early comparative win rates illustrate how easily incomplete coverage can create misleading rankings.

# I004
Evidence: L020, L021, L022, L025, L028

Evaluation infrastructure must keep target and auxiliary model roles explicit. A broad model override silently converted a user-simulation benchmark into self-play and self-judging, changing both generated interactions and score calibration; role-specific configuration plus request-level audits restored interpretable attribution.

# I005
Evidence: L022, L025, L029, L030, L031

Whether saved outputs can be reused depends on where the changed component sits in the causal path. HUMANUAL responses precede the judge and can be rejudged in isolation, whereas a SimArena assistant shapes every later turn and the final artifact, so changing it requires regenerating the whole rollout.

# I006
Evidence: L023, L030, L031, L034

Conversation-level provenance is part of the evaluation condition, not incidental metadata. Human behavior was collected against several assistant models, while corrected reruns used one fixed assistant; scores therefore reflect both simulator fidelity and a changed interaction environment and should be described as the SOUL/OdysSim adaptation rather than the original 50/51 assistant benchmark.

# I007
Evidence: L014, L015, L038, L039

Reliable batch orchestration needs to treat API capacity, cluster availability, dependencies, and scheduler QOS as separate constraints. The useful recoveries here were targeted: release an unnecessary dependency when API health supported concurrency, apply temporary partition overrides, and consolidate per-pair jobs when the scheduler rejected job count—not blindly resubmit entire waves.

# I008
Evidence: L041, L042, L043

An N-way judge design benefits from a same-item, all-judge preflight that checks semantic outcomes rather than schema acceptance alone. Valid JSON initially concealed empty ground truth caused by a nested-field adapter bug; inspecting the surprising all-zero scores exposed the data error before 1,800 calls were launched.

# I009
Evidence: L041, L046, L051

Anonymous labels should be encoded as fixed schema fields when possible. Asking a model to emit arbitrary `response_id` values allowed it to copy identifiers from the prompt, producing retries and missing records even though candidate randomization and aggregation logic were correct.

# I010
Evidence: L047, L048, L050, L051, L052

Prompt cost does not scale simply with candidate count. Joint comparison shared the dominant context and reference, and removing redundant rubric text nearly offset two additional responses; latency still rose because generated judgment output tripled. Optimize fixed instructions and output shape separately, and estimate cost from component-level token counts rather than the number of candidates alone.

# I011
Evidence: L029, L030, L031, L032

An aggregate benchmark number can obscure both task intent and weighting. The overall score gave HUMANUAL three quarters of the weight, while SimArena rewards emphasized behavioral fidelity and did not directly measure math correctness; suite and component scores are necessary to state what a model actually performed well on.

# I012
Evidence: L016, L017, L018, L019

Reusable evaluation analysis is easier to extend when raw-format normalization, shared tokenization, per-episode metrics, and aggregation levels are separate. That structure allowed suite-level comparisons and an additional model to be added without redesigning the analyzer, while machine-readable outputs and plugin metrics preserved room for later analyses.
