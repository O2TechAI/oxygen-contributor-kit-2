# I001

Evidence: L002, L009, L010

When replacing a large evaluation harness with a lightweight runner, preserve model-role routing as part of the benchmark protocol. Retaining prompts and reward logic is insufficient if the compatibility layer changes which model acts as assistant, judge, or document generator, because those roles affect generated trajectories and score calibration.

# I002

Evidence: L005, L006

For large API evaluations, run a complete small compatibility check for each route and separately assess whether the route has enough quota for the full workload. A small check can reveal access and schema problems, but success does not establish capacity for hundreds of multi-call episodes. Bind concurrent evaluation lanes to explicit credentials to prevent unintended fallback between them.

# I003

Evidence: L010, L011, L012, L013

When changing an auxiliary model, determine whether it influenced generation. Existing single-turn answers can be reused when only an independent judge changes, while interactive conversations must be regenerated after changing the assistant because each assistant reply influences later simulated-user messages and the final trajectory.

# I004

Evidence: L008, L019

When benchmark suites contribute unequal episode counts, publish suite-level and task-level aggregates beside the raw overall mean. Otherwise, the larger suite dominates the combined result and can conceal different behavior in a smaller suite.

# I005

Evidence: L017, L018, L020

For interaction-based fidelity evaluation, inspect the assistant context attached to each human reference. A fixed assistant supports controlled comparison among simulators, but it can mismatch references collected under heterogeneous assistants; reproduce or stratify by reference assistant when fidelity to the original interaction environment matters.

# I006

Evidence: L015

To audit routing through an API gateway, record both the requested model and the provider-returned model identifier. Configuration checks establish the requested route, while the returned identifier is needed to verify the backend that actually served the request.

# I007

Evidence: L016

Interpret behavioral-dimension scores in the single-turn suite as judge-inferred similarities to a reference response. Because the target receives persona and context rather than labeled attributes and no independent attribute ground truth is supplied, these scores measure the judge's assessment rather than direct labeled-state accuracy.

# I008

Evidence: L020

Count evaluation units at the row level before interpreting task or persona coverage. A row can combine one profile, task, and reference trajectory even when tasks or participants recur, so the number of conversations does not imply the same number of unique tasks or personas.
