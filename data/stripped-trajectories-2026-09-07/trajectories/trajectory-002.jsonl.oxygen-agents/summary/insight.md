# I001

Evidence: L002, L003, L005, L006, L010

Task-level benchmark logic can often be separated from a heavy training harness, but equivalence must be stated at the correct layer. This runner preserved prompts, loops, parsing, and rewards while changing orchestration, output format, and initially model routing; smoke tests established operability, not protocol equivalence.

# I002

Evidence: L033, L034, L035, L036, L037

A broad compatibility override can silently collapse distinct experimental roles. When one environment variable replaced every requested model, the intervention changed the simulator, interaction partner, generator, and evaluator at once, making model rankings confounded even though all jobs completed successfully.

# I003

Evidence: L036, L039, L042, L043, L051, L052

The minimum valid rerun depends on where the changed component enters the causal path. HUMANUAL answers can be held fixed and rejudged because the judge runs after generation, whereas changing a SimArena assistant requires regenerating the conversation and document because assistant behavior shapes later simulator actions and every downstream score.

# I004

Evidence: L045, L046, L047, L049

Protocol corrections are easier to audit when outputs are immutable and every run records role-specific settings. Isolated run directories preserved the invalidated self-play evidence for comparison, while explicit assistant, generator, and judge parameters made the corrected wave inspectable at configuration, call-site, and request-transport levels.

# I005

Evidence: L012, L016, L018, L019

One-episode API preflights detect deterministic access and schema failures but do not establish quota sufficiency for a full benchmark. Nemotron and ox-alpha passed end-to-end preflights yet failed during 800-item runs when daily request limits were reached, so launch validation should also estimate requests per episode and compare the total with provider quotas.

# I006

Evidence: L013, L015, L031, L032, L053

An overall mean can hide both protocol confounding and dataset weighting. Here HUMANUAL contributes 600 of 800 episodes, so similar overall scores can coexist with materially different HUMANUAL and SimArena behavior; model comparisons should report suite and task aggregates and only compare runs with the same role assignments.

# I007

Evidence: L020, L021, L022, L023, L024

Separating scheduler dependencies from API-capacity decisions allows a slow model to stop blocking unrelated providers. The agent first verified that the active job was error-free, then released only Gemini's dependency and later changed partitions without duplicating jobs or disturbing downstream ordering.

# I008

Evidence: L039, L052, L055, L056, L057

Dataset row counts must be interpreted together with provenance and evaluation purpose. The SOUL files contain conversation instances sampled from the full SimulatorArena human corpus, including repeated underlying problems or intents and heterogeneous assistant contexts; they are a different evaluation set from the 50/51 assistant-benchmark subset despite sharing the same source project.

# I009

Evidence: L028, L029, L030, L031, L032

A reusable behavioral-analysis layer benefits from normalizing each task into shared episode concepts before aggregation. Converting distinct raw schemas into simulated-user turns, human-reference turns, and common token counts enabled the same metrics to scale from task to suite to model while preserving plugin points for later analyses.
