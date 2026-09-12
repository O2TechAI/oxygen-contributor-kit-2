# I001

Evidence: L002, L003, L018, L019

When replacing a large evaluation harness with a lightweight runner, preserve role routing as part of the benchmark protocol. Reusing prompts and reward functions is insufficient if a compatibility layer changes which model acts as assistant, judge, or document generator, because those roles affect generated trajectories and score calibration.

# I002

Evidence: L009, L012, L013

For large API evaluations, run a complete one-episode generation-and-judge preflight for every model route, then separately estimate request consumption against provider quotas. A successful one-row check can detect invalid model identifiers, access restrictions, and schema incompatibilities, but it cannot establish that a free route has enough daily quota for hundreds of multi-call episodes.

# I003

Evidence: L019, L021, L022, L026, L027

When changing an auxiliary judge, determine whether that model influenced generation. HUMANUAL answers can be reused when only their independent judgment changes, while SimulatorArena conversations must be regenerated after changing the interactive assistant because each assistant reply influences later simulated-user messages and the final trajectory.

# I004

Evidence: L017, L029

When benchmark suites contribute unequal episode counts, publish suite-level aggregates beside the raw overall mean. Here, six HUMANUAL splits account for 75% of all episodes, so one combined mean primarily reflects HUMANUAL and can conceal a different pattern on the two SimulatorArena tasks.

# I005

Evidence: L030, L031, L032

Choose a SimulatorArena subset according to the role under evaluation. The 50-math and 51-document subsets are for evaluating assistants, whereas SOUL's 100-row samples from the larger human-conversation corpora support user-simulator fidelity evaluation; treating these sizes as interchangeable changes the research question and the unit of evaluation.

# I006

Evidence: L020, L027

For interaction-based fidelity evaluation, inspect the assistant provenance attached to each human reference. Human behavior can depend on the counterpart model, so a fixed assistant gives a controlled comparison among simulators but creates an environment mismatch with references collected under heterogeneous assistants; reproduce or stratify by the recorded assistant when reference-environment fidelity is required.

# I007

Evidence: L012, L013

Explicitly bind each evaluation lane to a named credential variable and prevent fallback to another credential. This makes paid and free lanes independently auditable and safe to run concurrently, although route-level restrictions and quotas still require separate validation.

# I008

Evidence: L024

To audit model routing through an API gateway, record both the requested model and the provider-returned model identifier. Configuration and transport checks establish the requested route, while the returned identifier is needed to verify which backend the provider actually served.

# I009

Evidence: L032, L033

Count evaluation units at the row level before interpreting persona or task coverage. A row may combine one profile, task, and reference trajectory even when tasks repeat across rows and people appear in several rows, so the number of conversations does not imply the same number of unique questions or personas.

# I010

Evidence: L034, L035

When HUMANUAL reports stance, emotion, belief, value, goal, and communication alignment, interpret them as judge-inferred similarities to a reference response. The target receives persona and context rather than attribute labels, and no independent attribute ground truth is stored, so these scores measure the judge model's assessment rather than direct labeled-state accuracy.
