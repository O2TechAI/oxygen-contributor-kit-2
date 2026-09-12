# I001
Evidence: L002, L005, L008

Extracting benchmark logic from a heavy training repository can preserve task semantics while sharply reducing operational cost, but infrastructure substitutions create their own compatibility surface. A lightweight runner should therefore be validated at both the task-logic boundary and the scheduler/runtime boundary; successful local imports or smoke calls did not reveal the Slurm spool-path failure.

# I002
Evidence: L003, L004, L009, L012, L014

Small end-to-end preflights are an effective admission gate for large API evaluations. They caught strict-schema incompatibility, unavailable routes, harness restrictions, and privacy-policy constraints before thousands of episodes were submitted, while allowing compatible models to proceed independently.

# I003
Evidence: L009, L014, L015

A successful one-row model preflight establishes immediate compatibility, not sustained capacity. The free models that passed authorization and full single-row checks still collapsed under daily quotas during the 800-row run, so production readiness also requires quota-aware volume checks, retry/error thresholds, or incremental submission sizing.

# I004
Evidence: L006, L016, L017, L018

Scheduler policy benefits from separating durable preferences from incident-specific overrides. The global CPU preference remained stable, while read-only health evidence and partition limits justified a one-time move to `test` and `shared`; preserving that distinction avoided encoding transient maintenance conditions into future scheduling behavior.

# I005
Evidence: L010, L016, L035

Dependency graphs can express both rate-control and latency priorities more precisely than a single serial chain. Releasing Gemini after sustained error-free DeepSeek execution reduced unnecessary blocking, and the corrected wave later used two bounded lanes with the slowest model gated on both endpoints so it would truly run last.

# I006
Evidence: L024, L025, L026, L027

Role routing is part of an evaluation protocol, not an incidental implementation detail. Collapsing target, environment, generator, and judge roles into the evaluated model changed both the data-generating interaction and the scoring process, making early rewards self-play measurements whose rankings could not be assumed to transfer to a fixed-auxiliary benchmark.

# I007
Evidence: L027, L030, L032

Whether old outputs can be reused depends on where the changed component sits in the causal path. HUMANUAL target responses precede an independent judgment and can be rejudged cleanly, whereas a SimArena assistant shapes every subsequent user turn, so changing it requires regenerating the rollout rather than only recomputing the final score.

# I008
Evidence: L028, L029, L040

Fixing one auxiliary assistant improves cross-target control but does not recreate human-reference conditions when references were collected against heterogeneous assistants. Because counterpart behavior influences user behavior, assistant provenance is a meaningful covariate; per-row replay or stratified reporting would answer a different and potentially more faithful comparison question than one common-assistant evaluation.

# I009
Evidence: L030, L031, L034, L036

Correcting a flawed evaluation is safer and more auditable when prior artifacts remain immutable and the corrected protocol writes to isolated outputs. The trajectory preserved completed runs, cancelled only an unstarted dependent job, allowed an active job to finish, and used an explicit suffix for the new wave, retaining both provenance and recovery options.

# I010
Evidence: L033, L037

Configuration metadata alone is insufficient evidence for role isolation. Confidence came from combining focused routing tests, end-to-end examples for every distinct execution path, inspection of live records, and verification of the transport call; even then, the conclusion was appropriately limited because provider-returned backend identity was not captured.

# I011
Evidence: L019, L020, L021, L022, L023

Reusable evaluation analysis needs a normalized episode representation before aggregation. Adapting the two suites' different message and ground-truth schemas, applying one tokenizer, retaining machine-readable output, and exposing plugin metrics made per-task, per-suite, and cross-model comparisons consistent without baking each new question into the evaluator.

# I012
Evidence: L038, L039, L043

Combined benchmark means can obscure both weighting and construct differences. Here HUMANUAL supplies three quarters of all episodes and includes a length adjustment over judge-inferred persona axes, so a single 800-row mean mainly reflects HUMANUAL; suite-level and task-level reporting is needed to interpret model behavior.

# I013
Evidence: L040, L041, L042

SimArena's reward should be interpreted as behavioral fidelity within an interactive environment rather than direct task competence. Math omits explicit correctness despite carrying a correct answer, and document quality is mediated through a fixed generator, so similar aggregate scores can arise from distinct mixtures of style fidelity, interaction behavior, profile fulfillment, and downstream document quality.

# I014
Evidence: L044, L045

The presence of a published metric's prompt in copied source does not show that an evaluation implements that metric. Verifying the active call graph and reward aggregation revealed that the paper's Turing test was dormant; protocol audits should trace prompt invocation through recorded outputs and final scoring before making benchmark-equivalence claims.
