# I001

Evidence: L002, L003, L004

Replacing a heavyweight remote-model harness can preserve task logic, but the smaller runner assumes responsibility for endpoint compatibility and batch execution semantics. Structured-output normalization and scheduler-aware environment resolution were both necessary before the workflow ran reliably.

# I002

Evidence: L006, L007

A one-item preflight can establish authorization and basic response compatibility without proving sustained endpoint capacity. Batch readiness should include a modest multi-item or concurrent soak test plus explicit retry and error-budget criteria.

# I003

Evidence: L008

Dependency chains control shared service load but can couple progress to the slowest evaluation and current compute availability. Isolated outputs and editable dependencies make rescheduling safer and reduce duplicate work.

# I004

Evidence: L011, L012, L013

Model routing is part of an evaluation's experimental definition. Silently substituting the target model into auxiliary roles can convert a fixed-environment comparison into self-play, changing trajectories and score calibration even when the task logic appears unchanged.

# I005

Evidence: L013, L014, L015

Explicit target, assistant, document-generator, and judge settings make reruns auditable and support selective recomputation. Target responses can be reused when only judging changes, while conversations must be regenerated when assistant responses influence later turns.

# I006

Evidence: L009, L010

Cross-model behavior analysis benefits from normalizing stored message wrappers before applying one shared tokenizer and from retaining episode-, task-, and model-level aggregates. Extension hooks allow new metrics to reuse the same parsing and aggregation pipeline.

# I007

Evidence: L017, L018, L019

Judge-generated behavioral dimensions are interpretations of free-text responses rather than independently labeled latent variables. Conclusions should therefore be framed as judge-mediated response alignment rather than direct recovery of latent state.

# I008

Evidence: L020, L021, L022

An evaluation can contain prompts for capabilities that its active reward does not measure. Metric interpretation should follow the executed evaluation path and aggregation formula rather than the inventory of available prompt templates.

# I009

Evidence: L023, L024, L025

Conversation-level human-versus-simulator judgments require matched assistant conditions because the judge sees both sides of the exchange. Without matching, distinguishability can reflect environmental differences rather than user behavior.

# I010

Evidence: L022, L023, L025

The presence of a paper prompt in copied source does not establish metric reproduction. A defensible claim requires evidence that the prompt is invoked and aggregated according to the described procedure; modified diagnostic variants need distinct names and scopes.
