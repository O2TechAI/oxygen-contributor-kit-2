# I001

Evidence: L007, L008, L009, L010

In interactive simulator evaluation, auxiliary-role routing is part of the experimental treatment. Changing the assistant changes the trajectory later judged, so a controlled correction requires regenerating interactions; judge-only rescoring is sufficient for saved single-response tasks whose target output is fixed.

# I002

Evidence: L012, L014, L015

Human-reference behavior depends on the interaction environment. When reference conversations come from heterogeneous assistants, evaluating every simulator against one fixed assistant measures fidelity under a new common environment. Reports should document that change and control for the reference assistant when the data permits.

# I003

Evidence: L002, L005, L019

Small end-to-end preflights can catch inaccessible routes, schema failures, and malformed dataset adaptation before an expensive run. They are most useful when they exercise generation, structured judging, and data loading together.

# I004

Evidence: L018, L020, L021

Comparable mean scores and low multi-candidate win rates can coexist when a candidate frequently loses by small margins and shares its strongest examples with a competitor. Exact top-score credit discards distance and requires beating every competitor at once, which amplifies close, correlated differences.

# I005

Evidence: L020, L021, L022, L028

Continuous fidelity, pairwise strength, and multi-candidate top-score frequency answer different questions. Reporting them separately with margins and judge uncertainty preserves information lost by a single win rate; fixed anchors are needed to map relative comparisons to a stable absolute scale.

# I006

Evidence: L024, L025

Stable aggregate rankings can coexist with low item-level judge agreement and evaluator-specific position effects. Balanced randomization and position standardization protect aggregate comparisons, but close differences should not be interpreted more precisely than judge and presentation variability allow.

# I007

Evidence: L013, L026, L027, L029, L030

Metric decomposition can change the substantive conclusion. Separating interaction style from output quality clarifies what an interactive reward measures, while separating audit components and retaining score signs can reveal patterns hidden by a single absolute-distance metric.

# I008

Evidence: L001, L004, L007, L015

Reusing benchmark prompts and scoring logic does not by itself reproduce the benchmark protocol. Execution changes, model-role overrides, subset selection, and aggregation choices all affect score meaning and should be documented as adaptations.

# I009

Evidence: L005, L006

Compute-scheduler constraints and external-service limits require separate controls. Dependency management and compute-pool selection address local availability, while isolated credential lanes, bounded concurrency, and resumability address provider capacity without duplicating work.
