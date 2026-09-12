# I001

Evidence: L002, L003, L005, L006

Remote-model evaluation can often avoid a large training stack, but replacing the harness transfers responsibility for compatibility and execution semantics to the new runner. Here, strict JSON-schema handling and Slurm submit-directory resolution became necessary even though the copied task logic itself was unchanged.

# I002

Evidence: L012, L017, L018

A one-item preflight validates model identity, authorization, and basic response compatibility, but it does not establish sustained endpoint capacity. Batch readiness for free or capacity-limited routes should include a small concurrent or multi-item soak test and explicit retry/error-budget criteria before committing hundreds of episodes.

# I003

Evidence: L013, L019, L020, L021

Dependency chains are useful for controlling shared API load, but they also couple progress to the slowest model and current cluster availability. Keeping job outputs isolated and dependencies editable allowed Gemini to be released safely and jobs to move to temporary partitions without duplicate evaluation work.

# I004

Evidence: L010, L026, L027, L028

Model routing is part of an evaluation's experimental definition. A compatibility layer that silently replaces assistant and judge model names can turn a fixed-environment benchmark into model-specific self-play, changing both generated trajectories and score calibration while leaving the high-level task code apparently intact.

# I005

Evidence: L030, L031, L032, L033, L034

Separating model roles into explicit target, assistant, document-generator, and judge settings makes reruns auditable and supports selective recomputation. HUMANUAL target answers could be reused because only judging changed, whereas SimArena conversations required regeneration because assistant responses influence later simulated-user turns.

# I006

Evidence: L023, L024, L025

Cross-model behavior analysis benefits from normalizing stored message wrappers before applying one shared tokenizer and from retaining episode-, task-, suite-, and model-level outputs. A plugin interface for episode metrics lets later analyses extend the same normalization and aggregation pipeline without duplicating parsing logic.

# I007

Evidence: L038, L039, L040

HUMANUAL's six named dimensions are judge-generated interpretations of two free-text responses rather than independently labeled latent variables. Reported dimension scores therefore measure judge-mediated response alignment, and conclusions about latent-state recovery should remain narrower than conclusions about text similarity under that judge.

# I008

Evidence: L041, L042, L043

An evaluation may contain prompts for capabilities that its active reward never measures. The current SimArena math path emphasizes user-style and profile similarity without math correctness, while the document path adds outcome quality; metric interpretation should follow the executed call graph and aggregation formula rather than the inventory of prompt templates.

# I009

Evidence: L029, L044, L046, L048, L049

Conversation-level human-versus-simulator judgments require assistant-model matching because both sides of the conversation are visible to the judge. Row-level assistant provenance makes matched reconstruction or filtering possible; without it, a Turing score can reflect environment differences rather than user-source distinguishability.

# I010

Evidence: L046, L047, L050

The presence of a paper prompt in copied source does not establish metric reproduction. A defensible claim requires evidence that the prompt is invoked, its output is aggregated with the paper's ordering and tie-breaking procedure, and the result enters the reported artifact; a modified diagnostic audit should retain a distinct name and scope.
