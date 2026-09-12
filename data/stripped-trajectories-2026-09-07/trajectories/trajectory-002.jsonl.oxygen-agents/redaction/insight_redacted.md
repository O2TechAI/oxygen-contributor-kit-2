# I001

Evidence: L002, L003, L004, L007, L008

Task-level benchmark logic can be separated from a heavy training harness, but equivalence must be stated at the correct layer. Preserving prompts, loops, parsing, and scores can establish task-level similarity, while different orchestration or model routing can still change the experimental protocol. Smoke evaluations establish operability rather than protocol equivalence.

# I002

Evidence: L007, L008, L009

A broad compatibility override can silently collapse distinct experimental roles. If the same evaluated model becomes the simulator, interaction partner, generator, and evaluator, rankings are confounded even when every job finishes successfully.

# I003

Evidence: L011, L012, L013, L014

The minimum valid rerun depends on where a changed component enters the causal path. A response can be held fixed when only a downstream judge changes, whereas changing an interaction partner requires regenerating the conversation and any artifact or score derived from it.

# I004

Evidence: L005, L006

A small end-to-end preflight can detect deterministic access or schema failures but cannot establish quota sufficiency for a full benchmark. Launch planning should estimate requests per episode and compare the expected total with provider limits, and partial runs should not be compared directly with complete runs.

# I005

Evidence: L009, L016, L017

An overall mean can hide both protocol confounding and dataset weighting. When one suite contributes more episodes, similar overall scores can coexist with different suite-level behavior; comparisons should report suite and task aggregates and use identical role assignments.

# I006

Evidence: L018, L019

Dataset row counts must be interpreted together with provenance and evaluation purpose. Subsets derived from the same source corpus can still represent different evaluation sets, and an unknown sampling procedure limits claims about representativeness.

# I007

Evidence: L020, L021

A reusable behavioral-analysis layer benefits from normalizing each task into shared episode concepts before aggregation. This permits common metrics to scale from episodes to tasks, suites, and models while retaining extension points for task-specific analysis.

# I008

Evidence: L015, L022

Immutable result locations and explicit scheduler dependencies make protocol corrections and execution changes easier to audit. Releasing only an unnecessary dependency can improve concurrency without duplicating work or changing the intended downstream order.
