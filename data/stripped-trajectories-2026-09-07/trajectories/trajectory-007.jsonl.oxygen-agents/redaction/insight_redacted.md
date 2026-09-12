# I001

Evidence: L002, L003, L005, L006

Remote-model evaluation can often avoid a large training stack, but replacing the harness transfers responsibility for compatibility and execution semantics to the new runner. Strict schema handling and correct resolution of project resources remained necessary even though the task logic itself was retained.

# I002

Evidence: L008, L009

A one-item preflight can validate authorization and basic response compatibility, but it does not establish sustained endpoint capacity. Batch readiness for capacity-limited routes should include a small multi-item or concurrent soak test and explicit retry and error-budget criteria.

# I003

Evidence: L010, L019

Dependency chains can control shared API load, but they also couple progress to the slowest model and current cluster availability. Isolated outputs and editable dependencies make it possible to release or relocate work without duplicating completed evaluations.

# I004

Evidence: L013, L014, L015

Model routing is part of an evaluation's experimental definition. Silently substituting the target model into assistant and judge roles can turn a fixed-environment benchmark into self-play, changing trajectories and score calibration while leaving the high-level task code apparently intact.

# I005

Evidence: L016, L017, L018

Explicit target, assistant, document-generator, and judge settings make reruns auditable and support selective recomputation. Target answers can be reused when only single-turn judging changes, whereas multi-turn conversations must be regenerated when assistant responses influence later turns.

# I006

Evidence: L011, L012

Cross-model behavior analysis benefits from normalizing stored message wrappers before applying one shared tokenizer and retaining episode-, task-, suite-, and model-level outputs. An extension interface for episode metrics allows later analyses to reuse the same normalization and aggregation pipeline.

# I007

Evidence: L022, L023, L024

The six response dimensions are judge-generated interpretations of two free-text responses rather than independently labeled latent variables. Dimension scores therefore measure judge-mediated response alignment, so claims about latent-state recovery should remain narrower than claims about similarity under that judge.

# I008

Evidence: L025, L026, L027

An evaluation may contain prompts for capabilities that its active reward does not measure. Metric interpretation should follow the executed evaluation path and aggregation formula: the tutoring task measures style and interaction properties without correctness, while the document task also measures output quality.

# I009

Evidence: L028, L031, L032

Human-versus-simulator judgments require matched assistant conditions because the judge sees both sides of each conversation. Recorded assistant provenance can support matched reconstruction or filtering; without matching, the result may reflect environment differences rather than user-source distinguishability.

# I010

Evidence: L029, L030, L033

The presence of a research prompt in copied source does not establish metric reproduction. A defensible claim requires evidence that the prompt is invoked, its outputs are aggregated with the specified ordering and tie-breaking procedure, and the result enters the reported evaluation; a modified diagnostic should retain a distinct scope.
