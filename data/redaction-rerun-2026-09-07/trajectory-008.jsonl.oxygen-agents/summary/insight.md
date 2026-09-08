# I001

Evidence: L008, L026, L028, L029, L033, L034, L035, L036, L037, L038

Compatibility layers that rewrite model names globally can silently change the experimental unit: the target model can become simulator, assistant, generator, and judge at once. Role-specific configuration, routing tests, and runtime metadata are required before benchmark scores can be treated as comparable to the source protocol.

# I002

Evidence: L019, L020, L021, L022, L023, L039

A reusable evaluation analyzer benefits from separating schema adaptation, text normalization, shared tokenization, per-episode metrics, and aggregation. This structure allowed the same outputs to support token, turn, human-reference, task, suite, and model comparisons without changing the generation pipeline.

# I003

Evidence: L003, L040, L041

Dataset row counts must be interpreted by data purpose and sampling unit. The 100+100 SOUL files represent sampled human-conversation records from larger SimulatorArena corpora, while 50/51 refers to a separate assistant-benchmark subset; matching identifiers and content to upstream sources prevented a false duplicate-data diagnosis.

# I004

Evidence: L010, L012, L013, L014

One-row end-to-end preflights prevent large guaranteed failures when model routes have harness restrictions, privacy policies, schema incompatibilities, or authorization problems. They do not predict quota sufficiency for a full evaluation, so route validation should be paired with request-budget estimation before submission.

# I005

Evidence: L015, L016, L017, L034, L035, L036, L037, L044, L045, L065

Batch evaluation scheduling is more reliable when outputs are isolated and work is organized into resumable lanes with explicit dependencies. Consolidating pairings can also be necessary under per-user job-count limits, while in-place dependency or partition updates avoid duplicate jobs and preserve partial work.

# I006

Evidence: L046, L047, L048, L049, L050

Anonymous comparative grading needs adapter and identifier validation as much as prompt design. A single preflight exposed an empty-reference bug caused by nested parquet fields, and strict A/B/C validation later revealed response-content interference; both failures could otherwise have produced plausible but corrupted aggregate scores.

# I007

Evidence: L051, L052, L053, L054, L055, L056

Mean quality and top-one win rate answer different questions. When models often score closely and their strengths are correlated, a consistently strong second-place model can retain a comparable mean yet lose most three-way contests; pairwise credit and margin-aware near-win statistics preserve competitive information discarded by exact winner selection.

# I008

Evidence: L050, L057

Partial judge results should remain judge-specific and carry observed denominators. Combining GPT-5.4 nano's 574 valid comparisons with complete judges without preserving the missingness pattern would obscure identifier-confusion failures concentrated in particular tasks.

# I009

Evidence: L031, L032, L058, L059, L060, L061, L062, L063, L064

Fixing the assistant model improves control but does not isolate simulated-user behavior completely, because the assistant's responses remain conditioned on each simulator's preceding messages. Comparative interaction scores therefore describe the closed-loop trajectory, while writing-only scores more directly target the simulator's own text.

# I010

Evidence: L061, L062, L063, L064, L070, L071, L072

Showing all candidates in one judge prompt enables direct comparison and shared context, but it introduces order and contrast effects absent from single-candidate grading. Deterministic balanced shuffling, position audits, and post-hoc standardization can bound position bias, while separate absolute scores avoid asking the judge to force a ranking.

# I011

Evidence: L067, L068, L069, L070, L071

Aggregate rankings can conceal task-specific specialization and judge calibration. GLM led overall through a strong document result, Claude led math, and Gemini used a lower absolute scale; reports should preserve task strata and calibrate or equally weight judges before producing cross-judge totals.

# I012

Evidence: L018, L038

Recorded configuration and participant reports provide weaker evidence than returned API metadata and preserved tool output. Future runs should store the provider-returned model identifier and durable execution evidence so later audits can distinguish requested routing from the backend actually served.
