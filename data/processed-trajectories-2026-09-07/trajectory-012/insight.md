# I001
Evidence: L002, L003, L004, L005, L007

Remote-model evaluation does not inherently require a training stack. Tracing the actual task-level dependencies enabled a lightweight runner, but fidelity still required checksum-verified data, endpoint-specific schema testing, scheduler-path testing, and final output-integrity checks.

# I002
Evidence: L005, L007, L046, L047, L048

Successful process or scheduler status is weaker evidence than validated artifacts. Runtime-path mistakes can fail before useful work begins, and renderers can silently corrupt outputs despite valid sources; checking counts, stderr, visual output, and an independent rendering path catches failures that exit codes miss.

# I003
Evidence: L010, L011, L012

Provider failures should be classified before launching expensive batches. Preflights distinguished deterministic model-policy restrictions from credential-lane and privacy-policy issues, allowing recoverable cases to move to an isolated key lane while avoiding jobs known to fail.

# I004
Evidence: L014, L017, L019, L024, L026

Candidate simulator, role-playing assistant, judge, and generator are separate experimental factors. An explicit role matrix prevents self-evaluation confounds and avoids accidental role filtering, such as removing models as evaluators merely because they are excluded as simulator candidates.

# I005
Evidence: L018, L019, L024, L029

Expensive trajectories can support new evaluation protocols when generation outputs remain immutable. Preserving prior results and separating supplemental judge lanes from candidate-generation lanes permits rejudging and comparative analyses without rerunning role-play or contaminating the intended candidate population.

# I006
Evidence: L020, L021, L022

Absolute scores and fractional win rates answer different questions. A candidate can have a similar mean score yet a low win rate when it repeatedly loses by small margins, so both measures are needed to describe comparative performance.

# I007
Evidence: L030, L034, L035, L038

Coverage must be stated in terms of represented subsets and available metric components. Dataset-family labels alone would conceal the missing HUMANUAL Chat records and the absence of SimulatorArena alignment scores, potentially making aggregates imply nonexistent observations.

# I008
Evidence: L034, L035, L036, L037

Metrics should transfer across datasets only when their required inputs exist. Defining a source-distance aggregate from available source conditions supported a comparable audit analysis without fabricating the profile-alignment component that SimulatorArena lacked.

# I009
Evidence: L032, L038, L039, L040, L041

Aggregation policy is part of the experimental result. Equal evaluator and subset weighting makes dataset means interpretable, while component reporting reveals tradeoffs hidden by the composite—for example, the best overall audit gap and best source distance belonged to different candidates on HUMANUAL.

# I010
Evidence: L042, L043, L044, L045

Diagnostic and presentation artifacts serve different needs. Retaining a detailed combined figure while producing one-metric, aggregate-only figures preserves analytical evidence and accommodates a simpler slide narrative without repeatedly discarding useful outputs.

# I011
Evidence: L049, L050, L051

Privacy-release editing is safer when it operates on an already compressed evidence layer and explicitly forbids returning to raw provenance. A second tightening pass plus mechanical reference validation can remove traceable detail while preserving the causal structure needed by downstream insights.
