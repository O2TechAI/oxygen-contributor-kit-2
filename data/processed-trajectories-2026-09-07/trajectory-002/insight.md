# I001
Evidence: L002, L003, L010

A lightweight replacement can preserve benchmark prompts, interaction logic, parsers, and scoring while changing its execution infrastructure, but that boundary must be documented explicitly. “Reused the benchmark code” is too coarse when the rollout representation, model routing, and supporting framework differ.

# I002
Evidence: L005, L011, L018, L019

One-episode end-to-end preflights are effective at catching invalid model IDs, access-policy blocks, and structured-output incompatibilities before a large submission. They do not reveal usage limits that emerge only after many requests, so quota discovery or a small request-budget probe is also needed for free endpoints.

# I003
Evidence: L014, L019

Persisted partial results make slow or quota-limited runs diagnosable, but comparison must use matched examples and clearly label incompleteness. A partial mean from the beginning of one task is not interchangeable with a complete benchmark score.

# I004
Evidence: L017, L018

When evaluations use multiple credential classes, selecting the credential by environment-variable name and overwriting inherited credentials prevents silent fallback to the wrong account. Separate dependency lanes can then exploit allowed parallelism without mixing billing or provider policies.

# I005
Evidence: L020, L021, L022, L023

A dependency graph for expensive evaluations should remain adjustable as runtime and cluster conditions become known. Releasing an existing pending job, while preserving downstream dependencies and avoiding duplicate submissions, allowed useful parallelism without sacrificing provenance or overloading the API.

# I006
Evidence: L025, L026, L027, L029

A reusable cross-model analyzer benefits from normalizing task-specific schemas into a common episode representation, applying one shared tokenizer, and exposing multiple aggregation levels plus plugin metrics. This separates extraction and normalization from future analytical questions.

# I007
Evidence: L030, L038

An overall average can conceal benchmark composition: here HUMANUAL supplies 75% of episodes, so its behavior dominates the combined score. Suite-level and per-task aggregates are necessary for interpreting model differences rather than treating the overall mean as balanced across capabilities.

# I008
Evidence: L031, L032, L033, L034

Compatibility layers that globally override model names can silently collapse distinct experimental roles. When the target model becomes its own assistant, generator, and judge, scores confound simulator quality with interaction dynamics, generation quality, and judge calibration, making model rankings methodologically different from the fixed-role benchmark.

# I009
Evidence: L039, L040, L041, L042, L043

Auxiliary roles should be independently configurable even when they temporarily share one model. Correcting a role-routing error requires reasoning about causal reuse: single-turn HUMANUAL answers can be held fixed and rejudged, while SimArena conversations must be regenerated because the assistant participates in creating the trajectory being scored.

# I010
Evidence: L047, L048

Verifying configuration, call sites, and transport establishes which model the client requested, but not necessarily which backend the provider served. Reproducible routing audits should persist both the requested model and the response's reported model identifier.

# I011
Evidence: L049, L050

Interactive user-simulation ground truth is conditional on the counterpart model. Row-level assistant provenance is therefore analytically meaningful: using a single fixed assistant improves cross-target control, while stratifying by the original assistant can expose mismatch with the human-reference environment.

# I012
Evidence: L051, L052, L053, L054

Benchmark cardinality must be traced at the correct unit. Counts of unique questions, annotated conversations, assistant-benchmark examples, and downstream validation samples can all differ legitimately; provenance matching and distinct-ID counts prevent a repackaged conversation subset from being mislabeled as the original benchmark split.
