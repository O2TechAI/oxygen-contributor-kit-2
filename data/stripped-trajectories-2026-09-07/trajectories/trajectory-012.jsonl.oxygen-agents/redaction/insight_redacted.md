# I001

Evidence: L002, L003, L004

A lightweight compatibility runner can remove unnecessary training infrastructure from an API-only evaluation, but scheduled execution can change path semantics. Batch launchers should resolve resources from an explicit project root and verify that behavior before a full run.

# I002

Evidence: L005

Small authorization and end-to-end checks prevent deterministic access failures from consuming full evaluation budgets, but they do not prove that a route has enough quota for a complete run. Capacity planning and resumable scheduling are separate concerns.

# I003

Evidence: L007, L008, L009, L010

Model routing is part of the experimental protocol. Collapsing auxiliary roles into the evaluated model changes both generated interactions and scores. Each role should be configured and tested independently, and multi-turn data must be regenerated when the interaction partner changes.

# I004

Evidence: L012

Judge-only evaluation over saved target responses can expand a target-by-judge comparison without regenerating model behavior. Consolidating judge lanes can also reduce scheduler pressure while preserving prior results.

# I005

Evidence: L013, L014

Structured grading can appear to reveal evaluator behavior when the actual cause is misread nested data. A realistic preflight requiring nonempty fields and differentiated outputs can expose adapter failures early, and the discovered schema case should become regression coverage.

# I006

Evidence: L015, L016

Average score and top-one win rate measure different properties. Close losses receive no top-one credit, and strong responses may coincide with a competitor's strongest responses. Structured-output failures concentrated by task also require per-task coverage reporting because the missingness may be nonrandom.

# I007

Evidence: L017, L018, L019

Anonymous candidate randomization reduces identity leakage but does not eliminate presentation bias. Position counts and sensitivity checks are needed when differences are small, and task-specific results should accompany aggregate rankings.

# I008

Evidence: L020, L021, L022

Presentation revisions can expose unresolved analysis semantics. Separating target filters from evaluator filters, stating reward dimensions, and aggregating only comparable metrics prevents a figure revision from silently changing the research question.
