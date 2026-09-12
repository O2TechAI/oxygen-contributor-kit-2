# I001

Evidence: L006, L011, L012

Reusing task code does not preserve an evaluation protocol when a compatibility layer changes model-role routing. Auxiliary roles are part of the experimental condition because they affect the interaction, evaluated artifact, and score calibration. A lightweight harness should make role assignments explicit and validate them before producing model comparisons.

# I002

Evidence: L013, L015, L016

The cheapest valid correction depends on whether a benchmark is interactive. Saved target responses can be rejudged in a single-turn setting, while an interactive conversation must be regenerated when the assistant changes because later actions depend on earlier messages.

# I003

Evidence: L007, L008

A one-example preflight can test authorization, schema compatibility, and basic routing without proving that an endpoint has enough capacity for a full evaluation. Preflight design should estimate the total request budget and compare it with available quota before submission.

# I004

Evidence: L007, L009

Separating credentials into independent execution lanes prevents accidental fallback, but it does not remove provider policy or quota constraints. Credential routing, endpoint eligibility, scheduling, and capacity require separate validation.

# I005

Evidence: L014, L015, L020

Using one fixed auxiliary assistant improves comparability among tested user simulators, but it does not reproduce every human reference environment when references were collected with different assistants. Reports should state which interaction environment was controlled.

# I006

Evidence: L019

Judge-inferred latent-state similarities should not be described as accuracy against independently labeled attributes. Claims should reflect the judge's asymmetric inputs and describe the result as response-level alignment under that judging protocol.

# I007

Evidence: L010, L021

An overall mean can obscure suite behavior when the sampling design weights suites unequally. Model-by-suite and per-task aggregates make those differences easier to interpret.

# I008

Evidence: L022

Dataset size must be interpreted using the sampling unit and evaluated role. Conversation records may repeat tasks or participants, and a subset designed for assistant evaluation should not be used to describe the coverage of a user-simulator study.

# I009

Evidence: L016, L018

Route tests establish which model identifier the client requested, but auditability also requires recording the provider-returned identity. Persisting both values helps detect aliases, fallbacks, or backend substitutions.

# I010

Evidence: L010

A normalization layer lets one analysis pipeline operate across single-turn and multi-turn benchmarks. Shared episode representations support consistent tokenization, human-reference pairing, aggregation, and extensible metrics.
