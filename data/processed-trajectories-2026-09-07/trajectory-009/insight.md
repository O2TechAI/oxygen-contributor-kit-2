# I001
Evidence: L002, L003, L005, L006

A lightweight benchmark port can preserve task-level prompts and scoring while replacing a heavy training harness, but equivalence must be stated at the correct layer. Successful completion and checksum-valid data establish operational fidelity; changed role routing, output representation, and orchestration prevent claiming bit-for-bit protocol fidelity.

# I002
Evidence: L006, L013, L014, L016, L017

Model-comparison runs become confounded when the evaluated model also acts as assistant and judge: changing the simulator simultaneously changes the interaction it receives and the ruler used to score it. Separating simulator, assistant, generator, and judge configuration, then fixing auxiliary roles, is necessary for a controlled comparison.

# I003
Evidence: L015, L017, L019

Fixing an auxiliary assistant improves cross-system control but does not recreate human-reference collection when references used heterogeneous assistants. The resulting score can still include assistant-mismatch effects, so controlled reruns and historical-reference fidelity answer different questions and should be reported separately.

# I004
Evidence: L007, L010, L032, L035, L036

One-row preflights catch deterministic access and schema failures, but they do not reveal full-run quotas or rare malformed batches. Resumable output, explicit unresolved counts, and recovery of only missing judgments are therefore needed even after a clean smoke test.

# I005
Evidence: L011, L034

Scheduler redundancy can improve time-to-start without duplicating expensive API work when multiple submissions share an exclusive lock and resumable result store. Partition overrides should remain run-specific when the user does not want temporary cluster conditions encoded into long-lived policy.

# I006
Evidence: L022, L023, L024, L025

Mean score, three-way win rate, and pairwise/Borda credit measure different properties of a score distribution. A model may have a competitive mean yet rarely finish first when it loses narrowly and wins by larger margins; reporting all three exposes this behavior and prevents treating a ranking discrepancy as an automatic evaluator defect.

# I007
Evidence: L026, L027, L028, L029, L030

A useful validation audit can deliberately trade variance for fewer structural assumptions while remaining a diagnostic rather than a new ground truth. Anonymous order randomization, source-dataset histories, matched task context, and dataset-level pairwise comparisons reduce identifiable confounds, but LLM-judge dependence and profile leakage still limit claims about bias.

# I008
Evidence: L031, L032, L033

Pilot and final protocols must be distinguished explicitly when design parameters change after smoke testing. Here the pilot used five histories and both orders, while the full run used two histories and one deterministic randomized order; operational success of the pilot does not directly establish reversal reliability for the final protocol.

# I009
Evidence: L040, L041, L042, L043

System-level rank agreement among three models can coexist with near-zero instance-level pair-gap agreement. With only three systems, aggregate tau is coarse and may reflect stable differences in model averages; pair-gap tau tests the harder and more decision-relevant question of whether the evaluator identifies which simulator is better on each matched task.

# I010
Evidence: L041, L043, L044

The naive HUMANUAL baseline's improvement was specific to target-user specificity rather than source indistinguishability. This localization matters: an aggregate improvement could otherwise be misread as evidence that the baseline validates every intended behavioral dimension.

# I011
Evidence: L037, L044, L045, L046

Close rankings should be treated as judge-sensitive even when evaluators agree on the broad order. Both audit judges consistently placed Sol last, yet swapped the nearly tied GLM and Claude in component views; agreement on the weakest system is stronger evidence than a definitive claim about the best system.

# I012
Evidence: L047, L048, L049

A repeated midpoint in a composite score may encode a specific extreme component pattern rather than moderate behavior. Decomposing the 0.5 mass showed equal specificity combined with maximal distinguishability; tie-adjusted correlation alone could not reveal this semantic collapse, and removing ties did not rescue the original evaluator's pair-gap agreement.

# I013
Evidence: L050, L051, L052, L053

Absolute distance from an “indistinguishable” midpoint measures detectability but erases who the judge believed was human. When answers are polarized, this makes correct source identification and successful simulator deception equivalent, so indistinguishability and directional fooling rate should be retained as separate outcomes.

# I014
Evidence: L054, L055, L056

Absolute real-versus-generated specificity gaps can hide systematic over-personalization. Generated responses scored as more target-associated than real responses overall and especially on HUMANUAL, so a signed generated-minus-human diagnostic is needed to distinguish stronger explicit profile signaling from faithful matching.

# I015
Evidence: L018, L019, L020

Dataset provenance and aggregation weights materially change what a headline result means. The SOUL 100+100 SimArena adaptation differs from the original 50/51 assistant benchmark, and an 800-row overall mean gives HUMANUAL 75% weight; suite-specific reporting is required to avoid conflating distinct tasks and benchmark claims.
