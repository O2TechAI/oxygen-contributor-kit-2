# I001

Evidence: L002, L003, L005, L006

A lightweight compatibility harness can preserve task-level evaluation logic while removing large training dependencies, but launcher behavior remains part of evaluation reliability. A successful local smoke test did not cover the scheduler's execution context, so resolving paths from the submission directory was necessary for a reliable remote run.

# I002

Evidence: L004, L007, L009

One-row end-to-end preflights can detect schema incompatibility and deterministic access restrictions before large evaluations are submitted. They cannot predict later quota exhaustion, so resumability and quota-aware scheduling remain necessary.

# I003

Evidence: L008, L010

Explicit credential lanes support concurrent provider use without accidental fallback, while dependency chains and temporary scheduler overrides control load. One-time infrastructure exceptions can remain separate from persistent scheduling policy.

# I004

Evidence: L011, L012, L017

A reusable multi-model analysis layer benefits from schema normalization, a shared tokenizer, extensible episode measures, and machine-readable output. Suite-level aggregation improves comparison while per-task results remain necessary when task counts weight a combined score unevenly.

# I005

Evidence: L013, L014, L015, L020, L022

Evaluation-role routing is a methodological parameter. Collapsing simulator, assistant, generator, and judge onto the target changes both the interaction and its scoring; in multi-turn evaluations, later rejudging cannot reconstruct the trajectory that a fixed assistant would have produced. Role-specific configuration should therefore be explicit before a large run.

# I006

Evidence: L016, L018, L019

Conversation-level benchmarks carry interaction context beyond the user prompt. Adapted samples from larger human-conversation corpora should be described according to their actual simulator protocol, especially when their selection procedure is unknown and they overlap only partly with another benchmark subset.

# I007

Evidence: L021, L022, L023

Saved responses make judge replacement relatively controlled for single-turn evaluations because generation can remain fixed while scoring changes. Multi-turn evaluations require full regeneration after an assistant change. Preflights should cover response reuse, interaction routing, and task-specific generation separately because each exercises a distinct boundary.

# I008

Evidence: L027, L028

A job-per-pair evaluation matrix can exceed scheduler limits even when runtime concurrency is low. Consolidating multiple pairings into one resumable lane per judge reduces queued-job pressure, while retaining started work and cancelling only pending duplicates avoids wasted computation.

# I009

Evidence: L029, L030, L031

Aggregation must filter results by evaluation protocol. A numerically valid comparison from a different experiment can answer the wrong question; restricting inputs to the intended protocol and intersecting covered examples per target makes missing responses explicit. Judge-level averages also reveal scale differences that can influence an uncalibrated combined score.
