# I001

Evidence: L009, L011, L012, L014

Auxiliary-role routing is part of the experimental treatment in interactive simulator evaluation. Changing the assistant changes the trajectory that is later judged, so correcting the protocol requires regenerating interactions; judge-only reevaluation is sufficient only when a saved target response remains fixed.

# I002

Evidence: L013, L015, L016

Reference behavior depends on the interaction environment. When reference conversations were collected with heterogeneous assistants, testing every simulator against one fixed assistant measures fidelity in a new common environment. Reports should document that change and control for reference-assistant context where the available data permits it.

# I003

Evidence: L006, L007, L019

Small end-to-end preflights can expose inaccessible model routes, service limits, scheduling constraints, and malformed data adaptation before expensive evaluation begins. They are most useful when they exercise data loading, generation, and structured judging together.

# I004

Evidence: L020, L021, L022

Similar mean scores and different multi-candidate win rates can coexist when losses are narrow and strong cases overlap. Exact top-score credit discards margins and requires beating every competitor simultaneously, so continuous fidelity, pairwise strength, margin profiles, and judge uncertainty should be reported separately.

# I005

Evidence: L023, L024

Stable aggregate rankings can coexist with low item-level judge agreement and evaluator-specific candidate-order effects. Balanced randomization and position standardization protect aggregate comparisons, but close differences should not be interpreted more precisely than judge and presentation variability supports.

# I006

Evidence: L026, L028, L029, L030

Metric decomposition can change the substantive conclusion. Separating interaction fidelity from other quality measures and splitting audit distance into source and specificity components revealed relationships and directional effects that combined or absolute-value metrics concealed.

# I007

Evidence: L001, L005, L009, L016

Reusing benchmark prompts and scoring logic does not reproduce a benchmark protocol by itself. Execution-harness changes, role overrides, dataset subset selection, and aggregation choices all affect what the resulting scores mean.

# I008

Evidence: L003, L004, L006, L007, L008, L010

Reliable evaluation requires separate handling of compute scheduling and external-service capacity. Resumability, dependency control, route preflights, bounded concurrency, and separation of partial from complete runs reduce duplicate work and prevent incomplete evidence from entering full-run comparisons.
