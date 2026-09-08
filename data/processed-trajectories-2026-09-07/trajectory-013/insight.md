# I001
Evidence: L011, L012, L015

In multi-role simulation benchmarks, model routing is part of the experimental treatment. A seemingly convenient global override silently turned a simulator comparison into a self-play and self-judging comparison, so role-specific configuration and provenance checks are necessary before interpreting rankings.

# I002
Evidence: L013, L018

Benchmark lineage and interaction context matter as much as nominal dataset identity. The 100/100 SOUL subsets were drawn from SimulatorArena's larger human corpus rather than its 50/51 assistant benchmark, and the human traces were conditioned on heterogeneous assistants; consequently, results should be labeled by exact subset and assistant regime rather than only by benchmark name.

# I003
Evidence: L006, L007, L008

Provider availability and scheduler availability are separate failure domains. Independent credential lanes, resumable outputs, and flexible cluster placement allowed healthy paid evaluations to continue while restricted endpoints, daily quotas, and pending partitions affected other models without contaminating the completed comparisons.

# I004
Evidence: L022, L023, L031

Mean score and top-score win rate answer different questions: means retain performance margins, whereas win rates discard margins and change with the competitor set. Pairwise/Borda credit is a useful intermediate view when a model is consistently close but rarely the maximum, but it still should not be treated as an absolute quality score.

# I005
Evidence: L023, L024, L027

Aggregate rankings can conceal distinct task regimes and judge preferences. Claude's comparable HUMANUAL mean but low win rate, its SimulatorArena math lead, and GLM's document lead only became legible after reporting task-level scores, win rates, and judge-specific ranks alongside the aggregate.

# I006
Evidence: L029, L030

Plot semantics must be derived from the latest experimental requirement, not merely regenerated from existing data. The distinction between excluding models as simulators versus evaluators and the later restriction of SimulatorArena reward to interaction dimensions both changed what the figures legitimately represented.

# I007
Evidence: L035, L038

Absolute distance metrics can hide the direction and nature of disagreement. Separating specificity from source detection and inspecting signed raw scores revealed that a stronger naive-alignment association was concentrated in specificity, source agreement remained near zero, and normalized absolute gaps obscured systematic negative source judgments.

# I008
Evidence: L009, L026, L039

Reusable evaluation tooling becomes more trustworthy when it preserves intermediate evidence: shared tokenization, trajectory hashes, item-level plot data, support counts, role provenance, and reproducible scripts make later metric changes and visualization requests auditable without rerunning expensive generation.

# I009
Evidence: L014, L015, L019, L025, L026

Separating generation from judging reduces both cost and experimental drift. Reusing saved HUMANUAL responses for new judges and validated SimulatorArena trajectories for comparative style grading isolated evaluator changes while preserving the generated behavior being compared.

# I010
Evidence: L007, L016, L021, L034

Incomplete coverage should remain explicit rather than being silently normalized away. Partial free-model runs, missing nano judgments, absent Chat audit records, and unrecorded provider backend identity each impose different limits on comparison, so reports should identify the missingness mechanism and avoid imputing unsupported equivalence.
