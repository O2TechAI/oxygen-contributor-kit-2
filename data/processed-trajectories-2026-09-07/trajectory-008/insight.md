# I001
Evidence: L002, L007, L016, L017, L018

A lightweight compatibility layer can preserve task prompts and scoring code while silently changing the experiment's causal structure. Model-role routing is part of the protocol: collapsing simulator, assistant, generator, and judge onto one target model turns a controlled simulator evaluation into self-play and self-judging, so implementation reuse alone does not establish benchmark comparability.

# I002
Evidence: L020, L021, L022, L023

Evaluation infrastructure should expose simulator, interaction partner, artifact generator, and judge as separate configuration dimensions and record them per run. Once those roles were separated, HUMANUAL answers could be rejudged economically, whereas SimulatorArena had to regenerate conversations because changing the assistant changes the evidence being judged.

# I003
Evidence: L003, L008, L011, L012, L034

Small end-to-end preflights catch qualitatively different failures before expensive batch work: schema incompatibility, provider access policy, credential-lane routing, and data-adapter mistakes. Passing one request is still insufficient for free endpoints, because daily quotas can allow a smoke test yet fail almost the entire full run; quota capacity must be checked independently.

# I004
Evidence: L009, L012, L035

Incomplete evaluations need coverage-aware interpretation. Comparing partial results only on matched examples, preserving completion counts by task, and separating structured-output failures from low scores prevents scheduler, quota, or parsing failures from being mistaken for model quality.

# I005
Evidence: L004, L005, L013, L031

Reliable cluster evaluation requires treating scheduling as recoverable state: resolve paths from the submission directory, preflight partitions and limits, modify pending jobs in place, preserve completed output, and consolidate work when QOS limits appear. These practices let the experiment adapt to resource constraints without duplicating API calls or losing provenance.

# I006
Evidence: L019, L026

An interactive benchmark's reference distribution includes the assistants that elicited the human behavior, not only user prompts and labels. When reference conversations span heterogeneous assistants, evaluating every simulator against one fixed assistant improves cross-model control but changes the environment relative to individual references; reporting or stratifying by recorded assistant provenance can reveal that mismatch.

# I007
Evidence: L036, L037, L038, L039

Average fidelity and top-one win rate answer different questions. Hard winners discard margins and require beating every competitor simultaneously, so a consistently close second can have a comparable mean but a low win rate; pairwise credit, distance-to-winner distributions, and cross-judge stability retain information that top-one aggregation throws away.

# I008
Evidence: L033, L041, L045, L046

Anonymous randomization reduces identity and position bias but does not eliminate presentation effects or contrast effects from showing candidates together. Recording candidate positions, using judge-specific shuffles, and checking position-standardized aggregates distinguishes a stable model ordering from a near-tie that should not be reported to sub-percent precision.

# I009
Evidence: L025, L026, L027, L042

Composite benchmark scores can obscure both sampling weights and construct coverage. Here the combined mean gives the six HUMANUAL domains three quarters of the weight, while the style-only comparative SimulatorArena experiment omits fulfillment and task-quality components. Suite-level and component-level reporting is therefore necessary to state what improved and what was never measured.

# I010
Evidence: L024, L041

Auditability should cover both inputs and external execution. Hashing reconstructed trajectories verifies exactly what judges saw, while recording only the requested model name leaves the provider's actual backend unresolved; robust evaluation metadata should preserve both the submitted model identifier and the returned backend identifier.
