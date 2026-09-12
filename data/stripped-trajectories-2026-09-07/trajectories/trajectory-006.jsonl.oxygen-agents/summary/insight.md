# I001

Evidence: L002, L003, L006, L007, L010

A lightweight compatibility harness can preserve task-level evaluation logic while removing large training dependencies, but launcher behavior becomes part of the evaluation's reliability surface. A successful local smoke test did not cover Slurm's spool execution context; resolving paths from the submission directory was necessary before the remote batch run became reliable.

# I002

Evidence: L005, L012, L014, L016, L017

One-row end-to-end preflights are an effective admission gate for expensive model evaluations because they detect schema incompatibility, access policy failures, and provider routing restrictions before hundreds of episodes are submitted. They cannot predict daily quota exhaustion, so quota capacity requires a separate check or a resumable schedule sized to the provider's limits.

# I003

Evidence: L015, L016, L018, L019, L020

Separating API credentials into explicit execution lanes allows independent providers to run concurrently without accidental key fallback, while dependency chains and temporary partition overrides control load and scheduling. The key selector must overwrite inherited credentials, and one-time infrastructure exceptions should remain outside persistent scheduling policy.

# I004

Evidence: L021, L022, L024, L025

A reusable multi-model analysis layer benefits from three stable seams: schema normalization, a shared tokenizer, and extensible episode metrics. Adding suite-level aggregation above per-task rows makes model comparisons interpretable without discarding task-specific evidence, while machine-readable outputs and plugins reduce future changes to the core analyzer.

# I005

Evidence: L026, L027, L028, L041, L043

Evaluation-role routing is a methodological parameter, not an implementation detail. Collapsing simulator, assistant, generator, and judge onto the target model changes both the generated interaction and the scoring calibration; for multi-turn evaluations, later rejudging cannot recover the counterfactual trajectory produced by a fixed assistant. Role-specific configuration should therefore be explicit and recorded before any large run.

# I006

Evidence: L029, L030, L033, L038, L039

Conversation-level benchmark examples carry interaction context beyond the user prompt, including the assistant that elicited the human behavior. Using a common fixed assistant improves controlled comparison among target simulators, but it also creates an environment mismatch with heterogeneous human references. Results should identify the adapted dataset and fixed-assistant protocol rather than inherit the original assistant-benchmark label.

# I007

Evidence: L032, L034, L035, L036

An overall mean across heterogeneous suites can conceal both objective differences and weighting effects. Here, HUMANUAL contributes three quarters of the combined episodes, while SimArena rewards emphasize behavioral fidelity and, for math, omit direct correctness. Reporting suite and task aggregates is necessary to prevent the combined score from being interpreted as a balanced measure of general simulation quality.

# I008

Evidence: L042, L043, L044

Saved responses make judge replacement relatively controlled for single-turn HUMANUAL because generation can remain fixed while only scoring changes. Multi-turn SimArena requires full regeneration after an assistant change. Preflights should separately cover single-turn reuse, multi-turn interaction, and any task-specific generator path because each exercises a distinct routing boundary.

# I009

Evidence: L050, L051, L052

Submitting every judge-target pair as its own dependency job can exceed scheduler QOS limits even when runtime concurrency is low. Consolidating multiple pairings into one resumable lane per judge reduces queued-job pressure while preserving isolation at the output level; retaining the already running pairing and cancelling only unstarted duplicates avoids wasted work.

# I010

Evidence: L053, L054, L055, L056

Aggregation must encode evaluation provenance as a first-class filter. A numerically valid common-item comparison from a comparative experiment answered a different question from the requested vanilla evaluation. Restricting inputs to the intended protocol and intersecting example IDs per target produced a defensible ranking while making incomplete DeepSeek coverage explicit.

# I011

Evidence: L055, L057

Cross-judge averages require both coverage alignment and calibration awareness. Common-item intersections prevent missing responses from changing the evaluated sample, while judge macro means reveal systematic scale differences that can influence an uncalibrated ensemble score even when every judge evaluates the same examples.

# I012

Evidence: L047, L048

Verifying the requested model at configuration and transport layers establishes routing intent but does not establish which backend model the provider served. Recording the provider-returned model identifier alongside each result would make auxiliary-role audits stronger and help detect aliases or backend substitutions.
