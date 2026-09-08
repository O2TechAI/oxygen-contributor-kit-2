# I001

Evidence: L001, L002, L004, L005, L006

Task-level benchmark logic can be separated from a heavy training harness, but equivalence must be claimed at the correct layer. Preserving prompts, interaction loops, parsing, and rewards can retain core task behavior even when orchestration changes; successful smoke tests establish operability, while protocol equivalence still requires checking model routing and execution semantics.

# I002

Evidence: L019, L020, L021, L022, L023

A broad compatibility override can silently collapse distinct experimental roles. When one setting replaces the simulator, interaction partner, generator, and evaluator at once, model comparisons become confounded even if every job completes successfully.

# I003

Evidence: L022, L025, L026, L027, L031, L032

The minimum valid rerun depends on where a changed component enters the causal path. A saved single-turn answer can be rejudged because the judge runs after generation, whereas changing an interactive assistant requires regenerating the trajectory and downstream output because assistant behavior shapes later actions and scores.

# I004

Evidence: L025, L028, L029, L030

Protocol corrections are easier to audit when outputs remain separate and runs expose role-specific settings. Isolated corrected results preserve evidence from the earlier protocol, while focused preflights and runtime tracing verify that each auxiliary role receives the intended model.

# I005

Evidence: L008, L009

A small end-to-end API preflight can detect deterministic access and schema failures, but it does not establish that provider quota is sufficient for a full benchmark. Launch validation should also estimate the total request volume and compare it with applicable limits.

# I006

Evidence: L016, L023, L033, L034

An overall mean can hide both protocol confounding and unequal suite weights. Model comparisons should report task and suite aggregates and compare only runs with the same role assignments.

# I007

Evidence: L009, L010, L011, L012

Separating scheduler dependencies from provider-capacity decisions lets unrelated work proceed without losing the intended order. Before releasing a dependency or moving pending work, verify the active job's health and preserve clear distinctions among complete, partial, blocked, running, and queued states.

# I008

Evidence: L031, L032, L035, L036

Dataset row counts must be interpreted together with provenance and evaluation purpose. Sets derived from the same source corpus can represent different evaluation protocols, and an undocumented sampling procedure should remain an explicit uncertainty rather than being inferred from overlap.

# I009

Evidence: L013, L014, L015, L016, L017

A reusable behavioral-analysis layer benefits from normalizing distinct tasks into shared episode concepts before aggregation. Consistent tokenization and common representations allow the same measures to scale from episodes to tasks, suites, and models while still supporting task-specific extensions.
