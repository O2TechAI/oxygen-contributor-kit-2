# I001

Evidence: L005, L007, L008

For resumable Slurm evaluations, path resolution and output isolation are part of correctness. Resolving resources from the submission directory prevented the spool-path failure, and checking for an existing active or partial run before resubmission avoided duplicate evaluation state.

# I002

Evidence: L010, L014, L015

Single-example provider preflights can prevent large batches that will fail immediately because of model access policy, but they do not establish full-run feasibility under daily quotas. Batch planning for hosted free models therefore needs separate checks for route access and quota capacity.

# I003

Evidence: L011, L016, L017

Dependency chains are useful for limiting shared-endpoint concurrency, but scheduler conditions and observed endpoint health can justify selectively releasing a job from the chain. Preserving downstream dependencies while detaching only the ready job provides controlled parallelism without rebuilding the entire submission wave.

# I004

Evidence: L012, L034

An overall score can conceal suite-specific reversals when one suite contributes most episodes. Reporting HUMANUAL and SimArena separately is necessary for model comparisons because the raw combined mean weights HUMANUAL at 75% and can obscure stronger SimArena performance.

# I005

Evidence: L023, L024, L025, L028

Role routing is a central experimental variable in interactive evaluation. A compatibility override that applies the target model to assistant and judge roles changes both the generated trajectory and its scoring, so fixing only the judge is sufficient for reused single-turn responses but insufficient for multi-turn simulations that must be regenerated.

# I006

Evidence: L026, L031, L036

Evaluation provenance has multiple levels: dataset source, row selection, original interaction model, requested evaluation model, and provider-served backend. Recording only some levels leaves distinct reproducibility gaps, as shown by the undocumented SOUL subset selection and the absence of provider-returned backend identities.

# I007

Evidence: L019, L020, L021

A reusable evaluation analyzer benefits from a shared tokenizer, explicit suite-level aggregation, and a plugin interface. Validating extracted quantities against evaluator-recorded invariants, such as turn counts, provides stronger evidence than unit tests alone that the abstraction preserves task semantics.

# I008

Evidence: L039, L040, L043

Randomizing candidate order and recording position counts supports bias audits, but anonymous identifiers should be encoded as fixed schema keys when possible. Allowing free-form response IDs created avoidable parsing failures that retries did not fully resolve.

# I009

Evidence: L044, L045, L046, L047

The number of candidates alone does not determine comparative-judge input cost. Shared context and a shorter rubric nearly offset two extra responses in this run, while output length and sequential judges dominated latency; prompt components and generated output should therefore be measured separately when optimizing evaluation throughput.

# I010

Evidence: L032, L033, L034

Benchmark labels should follow the actual reward objective and sampling protocol. The evaluated SimArena math score primarily measures behavioral fidelity rather than mathematical success, and the SOUL 100/100 adaptation differs from the original 50/51 assistant benchmark, so collapsing these settings under one benchmark name risks invalid comparisons.
