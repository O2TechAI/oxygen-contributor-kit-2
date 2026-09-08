# I001

Evidence: L015, L016, L017, L019, L020

In interactive simulator evaluation, auxiliary-role routing is part of the experimental treatment. Changing the assistant changes the trajectory that is later judged, so a controlled correction requires regenerating interactions; replacing only the judge is sufficient only for saved single-response tasks whose target output is held fixed.

# I002

Evidence: L018, L022, L024

Human-reference behavior is conditioned on the interaction environment. When reference conversations were collected with heterogeneous assistants, evaluating every simulator against one fixed assistant measures fidelity under a new common environment. Results should therefore document this change and, where possible, stratify or control for the reference assistant.

# I003

Evidence: L009, L011, L029

Small end-to-end preflights prevented three expensive failure modes: inaccessible model routes, provider quota exhaustion, and malformed dataset adaptation. Preflights are most useful when they exercise the complete generation, structured judging, and data-loading path rather than checking endpoint authorization alone.

# I004

Evidence: L030, L031, L032, L033

Comparable mean scores and low three-way win rates can coexist when a model frequently loses by small margins and its strongest examples overlap with another model's strongest examples. Exact top-one credit discards distance and requires beating every competitor at once, which amplifies close and correlated differences.

# I005

Evidence: L031, L033, L034, L043

Continuous fidelity, pairwise strength, and multi-candidate top-one frequency answer different questions. Reporting them separately with margin bands and judge uncertainty preserves information that a single win rate loses; fixed anchors are needed if relative comparisons must be mapped to a pool-stable absolute scale.

# I006

Evidence: L037, L038, L039

Stable aggregate rankings can coexist with low item-level judge agreement and evaluator-specific position effects. Balanced randomization and position standardization can protect aggregate comparisons, but close model differences should not be interpreted more precisely than the observed judge and presentation variability supports.

# I007

Evidence: L023, L042, L045, L047, L049

Metric decomposition can change the substantive conclusion. Restricting SimulatorArena reward to interaction style separated behavioral fidelity from document quality and fulfillment, while splitting audit distance into source and specificity revealed that apparent alignment was driven mainly by specificity and that absolute values hid systematic directionality.

# I008

Evidence: L003, L008, L015, L024

Reusing benchmark prompts and scoring code does not by itself reproduce the benchmark protocol. Execution harness changes, model-role overrides, dataset subset selection, and result aggregation all affect what the scores mean, so provenance should describe the adapted protocol rather than imply equivalence to the original benchmark.

# I009

Evidence: L011, L013, L014, L027

Scheduler and provider constraints require separate control planes. Dependency chains and partition moves manage compute availability, while isolated API-key lanes, bounded concurrency, resumability, and QOS-aware consolidation manage external-service capacity without duplicating work.
