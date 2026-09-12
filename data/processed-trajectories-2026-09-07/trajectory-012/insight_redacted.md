# I001

Evidence: L002, L004, L005

A lightweight runner can avoid unnecessary training infrastructure for an evaluation, but batch execution can change path semantics. Launchers should resolve resources from an explicit project location and validate that behavior before a full run.

# I002

Evidence: L007, L008

A small end-to-end access check can prevent deterministic compatibility failures from consuming a full evaluation budget, but it does not prove that quota is sufficient for a complete run. Capacity handling and resumability remain separate requirements.

# I003

Evidence: L012, L013, L014, L015

Model routing is part of the experimental protocol. Collapsing target and auxiliary roles changes both generated interactions and judgments. Roles should be configured and tested independently, and multi-turn data must be regenerated when the interaction partner changes.

# I004

Evidence: L016, L017

Conversation provenance can affect the meaning of a reference response. Evaluation design should distinguish prompts, conversation instances, benchmark subsets, and the assistant that conditioned each human interaction.

# I005

Evidence: L018, L019

Judge-only evaluation over saved target responses can expand a target-by-judge comparison without regenerating model behavior. Consolidating such work can also reduce scheduler pressure while preserving previous results.

# I006

Evidence: L020, L021, L022

Undifferentiated structured judgments may reflect a data-adapter error rather than evaluator behavior. A realistic preflight that requires nonempty nested fields and differentiated outputs can reveal this failure before a large run.

# I007

Evidence: L023, L024, L025, L026

Average score, pairwise success, and top-one win rate capture different properties. Close losses and correlated strengths can preserve a model's mean while lowering its win rate, so margins and pairwise measures should accompany top-one results. Incomplete judgments should retain task-specific denominators because their missingness may be nonrandom.

# I008

Evidence: L027, L028, L029, L030

Anonymous randomization reduces identity cues but does not eliminate presentation bias. Position counts and sensitivity checks remain necessary when differences are small, even if balanced assignment supports broad aggregate comparisons.

# I009

Evidence: L031, L032, L033

Analysis outputs should state target filters, evaluator filters, reward dimensions, tie handling, and aggregation rules explicitly. Cross-suite figures should combine only comparable measures and disclose unavailable metrics or omitted subsets.
