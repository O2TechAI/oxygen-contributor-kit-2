# I001

Evidence: L002, L003, L005, L006

A lightweight compatibility harness can preserve task-level evaluation logic while removing large training dependencies, but launcher behavior remains part of the evaluation's reliability surface. A successful local smoke test did not cover the scheduler's spool execution context; anchoring runtime paths to the submission directory was necessary for reliable batch execution.

# I002

Evidence: L004, L008, L009

One-row end-to-end preflights are an effective admission gate for expensive evaluations because they can detect schema incompatibility, access failures, and routing restrictions before large batches are submitted. They cannot predict daily quota exhaustion, so quota capacity needs a separate check or a resumable schedule sized to provider limits.

# I003

Evidence: L009, L010

Separating credentials into explicit execution lanes allows independent providers to run concurrently without accidental fallback. Temporary infrastructure exceptions should remain outside persistent scheduling policy.

# I004

Evidence: L011, L012

A reusable multi-model analysis layer benefits from stable schema normalization, a shared tokenizer, and extensible episode metrics. Suite-level aggregation above per-task results makes comparisons easier to interpret without discarding task-specific evidence.

# I005

Evidence: L013, L014, L015, L018, L026

Evaluation-role routing is a methodological parameter. Collapsing simulator, assistant, generator, and judge onto the target changes both the generated interaction and scoring calibration; for multi-turn evaluations, later rejudging cannot recover the trajectory that a fixed assistant would have produced. Role-specific configuration should be explicit before any large run.

# I006

Evidence: L016, L017, L020

Conversation-level benchmark examples carry interaction context beyond the user prompt, including the assistant that elicited the human behavior. A common fixed assistant supports controlled comparison among target simulators but can create an environment mismatch with heterogeneous human references. Reports should identify the adapted-dataset and fixed-assistant protocol clearly.

# I007

Evidence: L019, L021, L022

An overall mean across heterogeneous suites can conceal objective and weighting differences. When one suite contributes most episodes and another emphasizes behavioral fidelity rather than direct correctness, suite and task aggregates are needed to interpret the combined score responsibly.

# I008

Evidence: L025, L026, L027

Saved responses make judge replacement relatively controlled for a single-turn evaluation because generation can remain fixed while only scoring changes. A multi-turn evaluation requires full regeneration after an assistant change. Preflights should separately cover response reuse, interactive routing, and task-specific generator paths.

# I009

Evidence: L032, L033

Submitting every judge-target pair as a separate dependency job can exceed scheduler limits even when runtime concurrency is low. Consolidating pairings into resumable lanes reduces queued-job pressure, while retaining already-running work and cancelling only pending duplicates avoids wasted computation.

# I010

Evidence: L034, L035, L036

Aggregation must treat evaluation provenance as a required filter. A numerically valid comparison from a different experiment can answer the wrong question. Restricting inputs to the intended protocol and intersecting examples per target yields a defensible comparison while making incomplete coverage explicit.

# I011

Evidence: L035, L037

Cross-judge averages require both coverage alignment and calibration awareness. Common-example intersections keep missing responses from changing the evaluated sample, while judge-level averages reveal systematic scale differences that can influence an uncalibrated ensemble score.

# I012

Evidence: L030

Verifying a requested model at configuration and transport layers establishes routing intent but does not establish which backend model the provider served. Recording the provider-returned model identity with each result would make routing audits stronger and help detect aliases or substitutions.
