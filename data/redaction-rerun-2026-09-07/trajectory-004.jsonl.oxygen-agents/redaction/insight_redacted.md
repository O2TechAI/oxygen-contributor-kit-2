# I001

Evidence: L003, L004

For resumable batch evaluations, path resolution is part of correctness. Resolving resources from the submission location avoids failures caused by scheduler-controlled temporary directories.

# I002

Evidence: L005

Single-example provider preflights can detect route-access failures, but they do not establish whether a full run fits within quota limits. Batch planning therefore needs separate access and capacity checks.

# I003

Evidence: L009, L010

A combined score can conceal suite-specific reversals when one suite contributes most episodes. Model comparisons should therefore report suite and task results separately.

# I004

Evidence: L011, L012, L013, L014

Auxiliary-role routing is an experimental variable in interactive evaluation. Changing a judge can support rejudging saved single-turn responses, but changing an assistant alters multi-turn trajectories and requires regeneration.

# I005

Evidence: L016, L018

Dataset source, subset selection, interaction roles, requested models, and served backends are distinct levels of evaluation provenance. Missing any of them can leave reproducibility or comparability gaps.

# I006

Evidence: L007, L008

A reusable evaluator analysis benefits from shared token accounting, explicit suite-level aggregation, and extension hooks. Checking extracted quantities against evaluator-recorded invariants provides evidence that the analysis preserves task semantics.

# I007

Evidence: L019, L020

Randomizing candidate order and recording position counts supports bias audits, but anonymous identifiers should be constrained to fixed schema values. Free-form identifiers can create parsing failures that retries do not reliably resolve.

# I008

Evidence: L021

Candidate count alone does not determine comparative-judging cost. Prompt compression can offset additional response context, while generated output length and sequential judges may dominate latency.
