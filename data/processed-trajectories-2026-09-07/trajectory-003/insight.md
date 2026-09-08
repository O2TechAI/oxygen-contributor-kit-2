# I001
Evidence: L002, L003, L004, L005, L008, L009

A benchmark can often be decoupled from its training-oriented infrastructure without discarding its task semantics. Reusing task prompts, interaction loops, parsers, and reward formulas inside a small resumable runner removed heavy runtime dependencies, while checksums, split-wide smoke tests, and a full output-integrity audit supplied the evidence needed to trust the new execution path. The spool-path failure also shows that batch portability must be tested from the scheduler's execution context, not only from the submit directory.

# I002
Evidence: L010, L014, L016, L017

One successful request is only a partial compatibility test for a hosted model. Preflight should exercise both target generation and structured judging, use the exact credential lane intended for production, and still treat quota capacity as a separate concern. Here, preflight exposed deterministic access-policy failures, but free endpoints that passed one row later exhausted request quotas during the full workload.

# I003
Evidence: L011, L018, L019, L020

Serialized dependency chains are useful for limiting shared API pressure, but scheduler dependencies and compute placement should remain independently adjustable. Releasing Gemini from a slow predecessor preserved downstream ordering, and moving only pending jobs to temporary partitions restored progress without duplicating work or rewriting the durable partition policy.

# I004
Evidence: L022, L023, L024, L025, L026

Reusable benchmark analysis benefits from a normalized episode layer before aggregation. Task-specific wrappers, role conventions, and reference shapes were converted into common simulated-user and human-turn representations, after which one tokenizer and plugin-friendly numeric metrics supported per-task, per-suite, and per-model reports. Validating extracted turns against evaluator-recorded counts guarded against silently plausible but incorrect aggregates.

# I005
Evidence: L013, L027, L028, L029, L030

Role isolation is a validity requirement in interactive model evaluation. A compatibility override that silently mapped simulator, assistant, and judge to the same evaluated model turned a purported simulator comparison into self-play and self-judging. Because the assistant shapes the trajectory itself, replacing only the judge cannot repair the resulting SimArena scores; the conversations must be regenerated under controlled auxiliary roles.

# I006
Evidence: L033, L034, L035, L036, L037, L039, L040

Correcting a confounded evaluation is safest as an isolated new wave with explicit role configuration and preserved artifacts. Separate assistant, judge, and document-generator settings made routing inspectable; existing HUMANUAL responses could be rejudged because generation is single-turn and independent of the judge, whereas interactive SimArena outputs required regeneration. Preserving old directories also allows the effect of the protocol correction to be studied rather than erased.

# I007
Evidence: L040, L041

Configuration metadata and call-site tracing establish which model the client requested, but they do not fully establish which backend the provider served. For auditable routed-model experiments, persist both the requested model and the provider-returned model identifier with each response.

# I008
Evidence: L031, L032, L046, L055

Fixing the auxiliary assistant across target models improves between-model control, yet it does not necessarily recreate the human-reference environment. When reference behavior was elicited by heterogeneous assistants, behavioral similarity can partly reflect assistant mismatch. Evaluation reports should record this mismatch, stratify by original assistant when possible, or explicitly frame the result as fidelity under a new common interaction environment.

# I009
Evidence: L042, L043, L044, L045

HUMANUAL's six dimensions are judge-inferred constructs rather than independent ground-truth labels. The target receives persona-derived priors and situational context, while the judge receives the response pair and context but no persona. Scores therefore measure a particular judge model's assessment of latent-state similarity, and interpretation should distinguish that proxy from agreement with human-annotated stance, emotion, belief, value, goal, or communication labels.

# I010
Evidence: L046, L047, L048

Dataset fields do not by themselves define what a benchmark rewards. SimArena Math includes a correct answer but its implemented reward emphasizes style, interaction, and profile fulfillment; Document adds downstream artifact quality produced by a fixed auxiliary model. Model claims should follow the actual reward components, which here support behavioral-fidelity conclusions more directly than claims about tutoring correctness or task success.

# I011
Evidence: L049, L025

An overall episode mean can encode an unintended suite weighting. Because HUMANUAL contributes 600 of 800 rows, it controls 75% of the combined score even though SimArena is a distinct interactive protocol. Suite-level aggregates make this weighting visible and prevent an overall ranking from concealing opposing behavior across the two suites.

# I012
Evidence: L050, L051, L052, L053, L054, L056

Benchmark row counts must be interpreted together with the unit of evaluation and model role. The original 50/51 files are assistant-benchmark cases, whereas SOUL's 100+100 files are sampled conversation-level references for user-simulator fidelity; repeated questions or workers do not make them 100 independent problem identities. Provenance checks should therefore compare row identifiers and distinct task/persona counts, not infer protocol equivalence from superficially related corpus sizes.
