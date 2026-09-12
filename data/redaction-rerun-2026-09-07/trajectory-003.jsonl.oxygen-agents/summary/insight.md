# I001

Evidence: L009, L026, L027, L028, L029, L030

Reusing task code does not preserve an evaluation protocol when a compatibility layer changes model-role routing. Auxiliary roles are part of the experimental condition: changing the assistant affects the generated interaction, changing the document generator affects an evaluated artifact, and changing the judge affects score calibration. A lightweight harness should therefore make role assignments explicit and validate them before producing model rankings.

# I002

Evidence: L031, L034, L036, L037

The cheapest valid correction depends on whether the benchmark is interactive. Reusing saved HUMANUAL target responses while replacing only the judge isolates much of the judge change because generation is single-turn. SimArena must regenerate the conversation when the assistant changes because later user actions depend on earlier assistant messages; rejudging an old trajectory cannot reconstruct that counterfactual interaction.

# I003

Evidence: L010, L011, L016, L017

A one-example preflight tests model authorization, schema compatibility, and basic request routing, but it does not establish capacity for a full evaluation. Nemotron and ox-alpha passed end-to-end preflights and then exhausted daily quotas after only 2 and 77 usable episodes. Preflight design for quota-limited endpoints should include an estimated requests-per-episode budget and compare the full-run requirement with account limits before submission.

# I004

Evidence: L015, L016, L017

Separating credentials into independent execution lanes prevents accidental paid-key fallback and allows concurrent scheduling, but credential separation does not remove provider policy constraints. Access restrictions remained for Inkling under the dedicated key, and free-tier quotas still terminated other runs. Scheduling, credential routing, endpoint eligibility, and quota capacity require separate validation.

# I005

Evidence: L032, L033, L043, L047, L049

Using one fixed auxiliary assistant improves comparability among tested user simulators, yet it does not reproduce the environment of every human reference when rows were collected with nine different assistants. Because user behavior is conditioned on counterpart behavior, a fixed-assistant study and a row-provenance-matched study answer different questions. Reports should state which interaction environment is controlled and may benefit from stratification by the original assistant metadata.

# I006

Evidence: L041, L042, L050

HUMANUAL's six scores are judge-inferred similarities, not direct accuracy against labeled stance, emotion, belief, value, goal, or communication states. The target and judge also receive asymmetric inputs: the target sees the persona, while the judge sees the reference response but not the persona. Evaluation claims should therefore be framed as the fixed judge's assessment of response-level latent-state alignment rather than independent attribute-ground-truth accuracy.

# I007

Evidence: L046, L024, L025

An overall mean can obscure suite behavior when the sampling design weights one suite more heavily. Here, HUMANUAL supplies 600 of 800 episodes, so the combined score is 75% HUMANUAL by construction. Model-by-suite and per-task aggregates are necessary for interpreting differences that may reverse across HUMANUAL and SimArena.

# I008

Evidence: L047, L048, L049

Dataset size must be interpreted using the sampling unit and evaluated role. The SOUL adaptation contains 100 conversation records per SimArena task, including repeated problems, intents, or workers, while the 50/51 subsets belong to an assistant-evaluation protocol. Counting rows as unique questions or applying the assistant-benchmark size to a user-simulator study would misstate both coverage and protocol; unresolved subset-selection provenance should remain explicit.

# I009

Evidence: L033, L036, L037, L040

Role-specific configuration and route tests establish which model identifier the client requested, but full auditability also requires recording the provider-returned model identifier. Persisting both requested and returned model values would allow later detection of aliases, fallbacks, or backend substitutions without relying only on configuration metadata.

# I010

Evidence: L021, L022, L023, L024

A reusable multi-benchmark analyzer benefits from a normalization layer before metric computation. Converting different message conventions and ground-truth shapes into a common episode representation allowed one shared tokenizer, paired human comparisons, suite aggregation, and external metric plugins to operate across single-turn HUMANUAL and multi-turn SimArena outputs.
