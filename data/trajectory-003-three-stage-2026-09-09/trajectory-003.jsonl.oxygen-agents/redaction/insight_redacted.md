# I001

Evidence: L037, L039, L041, L045

When comparing user-simulation models, hold every auxiliary role fixed and configure the simulated user, assistant, document generator, and judge independently. Allowing the target model to fill auxiliary roles changes the conversation and evaluation, so score differences can reflect assistant quality or self-evaluation behavior rather than the target's ability to simulate a user.

# I002

Evidence: L039, L041, L049, L055, L059, L063, L065

When correcting an auxiliary model in an evaluation, decide whether stored target outputs remain valid by checking whether that auxiliary role participates before the output is produced. A single-turn response generated directly from persona and context can be rejudged with a changed downstream judge, while changing a multi-turn assistant requires regenerating the interaction because that assistant shapes both the trajectory and any final document.

# I003

Evidence: L049, L051, L053, L059, L061, L063, L065

When an evaluation combines single-turn and multi-turn suites, report suite and task results alongside any overall mean. The single-turn suite contributes more episodes to the pooled score, and the suites measure different behavior with different reward components. A single mean can therefore hide both weighting and construct differences.

# I004

Evidence: L017, L021

For quota-limited model routes, treat a successful one-row preflight as evidence of access and compatibility rather than evidence that a full evaluation can finish. Estimate required request capacity before submitting a full run, and keep quota-truncated partial scores out of comparisons with completed evaluations.

# I005

Evidence: L045, L069, L079, L081

When publishing benchmark results, record enough provenance to reproduce both the dataset slice and the served model. If the subset-selection procedure is unavailable and the evaluator stores only requested model names, neither the corpus description nor the model label fully specifies the run. Future evaluations should save a row manifest or selection seed together with any backend identity returned by the provider.

# I006

Evidence: L011

When a batch job uses project-relative environments or files, resolve them from the submission directory supplied by the scheduler rather than from the spooled script's runtime location. The runtime-relative lookup failed before the first API request, while using the submission directory made the replacement job runnable.
