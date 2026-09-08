# I001
Evidence: L015, L016, L017, L018, L019, L020

User-simulator evaluation must treat the assistant, generator, and judge as experimental factors rather than plumbing. Collapsing them onto the target model changed both the interaction environment and the measurement process; isolating each role behind an explicit fixed-model control restored a more interpretable comparison, although matching the historical assistant per row would be needed to reproduce the human data-collection environment exactly.

# I002
Evidence: L002, L003, L004, L006, L007

A lightweight benchmark port can preserve task semantics without carrying the original training stack, but equivalence must be stated at the task-logic level rather than the whole-harness level. Smoke tests that exercise every split and scheduler-context execution are especially valuable because API-schema compatibility and Slurm spool paths failed independently of the benchmark logic.

# I003
Evidence: L008, L010, L011, L012

Model availability needs a staged admission process: authorize and preflight a single complete generation-and-judge episode before scheduling a full run. Provider policy, privacy configuration, daily quotas, model latency, and cluster allocation were distinct failure modes here, so a successful endpoint lookup alone would not have established run viability.

# I004
Evidence: L025, L026, L027, L028, L029

Mean scores and top-one win rates answer different questions. Hard winners amplify tiny margins and ignore consistent second-place performance, while correlated strengths can raise two models' averages on the same items without giving both wins. Pairwise or Borda credit and margin distributions preserve useful relative information without discarding the absolute scale.

# I005
Evidence: L029, L030, L032, L033

Stable aggregate rankings can coexist with weak item-level judge agreement and judge-specific formatting or position effects. Independent judge replications, balanced anonymous ordering, support counts, and position-standardized sensitivity checks are therefore necessary evidence when a benchmark will be used for system ranking.

# I006
Evidence: L034, L035, L036, L037, L038, L039, L040

A lower-assumption audit still requires many explicit design commitments: sampling unit, distractor source, context boundary, anonymity, comparison isolation, presentation order, and aggregation level. The grilling process improved the study by replacing an unsupported per-user claim with dataset-level agreement and by distinguishing an adapted Turing-style audit from an existing benchmark metric.

# I007
Evidence: L041, L042, L043, L044, L045, L046

A minimal smoke study should test scientific invariants as well as code execution. Here it exposed judge transcription of opaque IDs, exercised reversal recoding and identity-leak checks, and revealed large judge sensitivity before the expensive full run; resumable item keys allowed recovery of only the missing judgments instead of repeating completed calls.

# I008
Evidence: L047, L048, L049, L050, L051

Reproducible evaluation manifests should encode comparison pools and order policy explicitly, reuse frozen controls, and deterministically randomize across judges. Coupling that design with shared resumable output and mutual-exclusion locks allowed aggressive multi-partition scheduling without duplicate API calls, while incomplete batches could be excluded transparently rather than imputed.

# I009
Evidence: L053, L054, L055, L057, L058

An unsigned distance from “indistinguishable” measures decisiveness, not correctness. It can be maximal whether the judge correctly selects the human or confidently selects the simulator, and an evaluator biased toward extreme categories will inflate it. Signed direction, identification accuracy, response-category calibration, and same-source controls are needed to interpret such a distance as evidence about realism.

# I010
Evidence: L052, L059, L060

Agreement-gap metrics can look favorable for uninformative or jointly wrong judgments. Low specificity gap only says real and simulated responses receive similar history-association scores; selection rates, indistinguishable rates, and signed simulation-minus-real differences are needed to tell faithful personalization from shared ambiguity or caricature.

# I011
Evidence: L018, L038, L039, L056, L058

Removing assistant text does not fully remove assistant confounding from multi-turn behavior, because assistant policy changes the user's number, sequence, and content of follow-ups. User-only audits isolate visible authorship cues better than full-conversation comparisons, but causal claims about simulator fidelity should still account for the interaction environment that generated those user turns.

# I012
Evidence: L013, L014, L022, L023

Cross-model analysis becomes more reusable when raw outputs are normalized into a common episode representation while suite-specific semantics remain explicit. Shared tokenization and model-by-suite aggregation make descriptive comparisons consistent, but provenance checks are still required because equal row counts may refer to different corpus subsets and evaluation purposes.
