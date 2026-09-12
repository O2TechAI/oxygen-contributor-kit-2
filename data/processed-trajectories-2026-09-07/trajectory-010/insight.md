# I001
Evidence: L002, L003, L005, L006

A benchmark can be made operationally lightweight without discarding its task logic, but equivalence must be decomposed explicitly. Data, prompts, interaction loops, and scoring can remain faithful while orchestration, model routing, and output representation change; checksum validation, smoke tests, resumable outputs, and failure-before-API checks establish operational integrity, not protocol equivalence.

# I002
Evidence: L007, L010, L018, L019, L021, L022

Role routing is an experimental variable, not plumbing. Letting the evaluated model also act as its interlocutor, document generator, and judge entangles simulator ability with partner behavior and judge calibration. A credible simulator comparison needs independently configured roles and, for interactive tasks, complete trajectory regeneration after the assistant changes; judge-only rescoring cannot repair interactions already shaped by a different assistant.

# I003
Evidence: L020, L023, L027, L028

Dataset provenance must extend below the file name and row count. The human reference conversations were conditioned on heterogeneous assistants, yet the corrected experiment used one fixed assistant, and the provider's served backend was not recorded. Row-level collection provenance and response-level runtime provenance are both needed to explain residual mismatch and reproduce model-mediated interaction studies.

# I004
Evidence: L008, L011, L012, L013, L014

Model preflights and isolated execution lanes prevent predictable failures from consuming full-benchmark resources. They exposed provider-specific access restrictions, account-policy incompatibility, and daily quotas before or early in full runs, while separate credential lanes and dependency changes allowed healthy paid evaluations to continue. Scheduler availability and API health should be treated as separate constraints, with job reuse preferred when only dependencies or partitions need changing.

# I005
Evidence: L015, L016, L017, L024, L028

Reusable analysis becomes substantially more trustworthy when it standardizes tokenization, validates extracted turns against recorded counts, preserves paired human references, and reports suite-level as well as task-level aggregates. A single 800-example average would overweight HUMANUAL at 75% and conceal the different single-turn and interactive constructs measured by the two suites.

# I006
Evidence: L030, L031, L032, L033, L042

Mean score and top-one win rate answer different questions. Top-one rates discard margins, require beating every concurrent rival, and change when the candidate pool changes; a model can therefore be consistently close in absolute quality yet rarely win. Pairwise credit, distance-to-winner distributions, rank frequencies, and judge uncertainty preserve information that a three-way winner label destroys.

# I007
Evidence: L034, L035, L037, L038

Aggregate rankings can be stable even when item-level judge agreement is weak, and overall scores can conceal opposing task effects. Here all judges agreed on the combined SimArena ordering despite low exact winner agreement, while Math and Document favored different leaders. Conclusions should therefore state both aggregate stability and task-level heterogeneity rather than treating either as sufficient alone.

# I008
Evidence: L024, L025, L026, L041

Metric names should follow the construct actually scored. The original SimArena rewards mixed interaction fidelity with fulfillment and document quality and did not directly measure mathematical correctness; redefining reward around writing and conversation style made the intended interaction-fidelity construct explicit while retaining other components diagnostically. This separation reduces the risk that a convenient composite is interpreted as task success.

# I009
Evidence: L043, L044, L045, L047, L048, L049

Absolute distance from a neutral ordinal point is not a directional human-likeness measure. `|s-3|` assigns the same penalty to confidently identifying the real response and confidently mistaking the simulator for real, even though those outcomes imply opposite behavior. Reporting indistinguishability and simulator-fooling separately preserves both uncertainty and direction and can reverse conclusions hidden by the absolute transform.

# I010
Evidence: L046, L050, L051, L052

Absolute-value aggregation can hide systematic over-personalization. Generated responses looked more target-specific than real responses in the aggregate, but the direction reversed between HUMANUAL and SimArena. Signed generated-minus-human diagnostics and suite-stratified distributions are therefore necessary to distinguish matching human specificity from exaggerating profile cues or failing to express them.

# I011
Evidence: L039, L040, L044, L052

Presentation filters are part of the analytical specification. Confusing evaluator exclusion with simulator exclusion materially changed the plotted rankings, and aggregate charts could not carry the observed suite reversal. Reproducible figures should encode role-specific inclusion rules in their data snapshot and pair overview plots with the smallest subset views needed to prevent misleading interpretation.
