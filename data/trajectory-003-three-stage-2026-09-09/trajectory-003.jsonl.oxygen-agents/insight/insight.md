# I001

Evidence: L043, L045, L047, L053

When comparing user-simulation models, hold every auxiliary role fixed and configure the simulated user, assistant, document generator, and judge independently. Allowing the target model to fill those auxiliary roles changes the conversation and evaluation itself, so score differences can reflect assistant quality or self-evaluation behavior rather than the target's ability to simulate a user.

# I002

Evidence: L049, L057, L059, L063, L067, L071, L073

When correcting an auxiliary model in an evaluation, decide whether stored target outputs remain valid by tracing whether that auxiliary role participates before the output is produced. A HUMANUAL response is generated directly from persona and context, so changing only its downstream judge permits rejudging saved responses; a SimArena assistant shapes the multi-turn trajectory and final document, so changing it requires regenerating the interaction. This preserves comparability where possible without treating causally changed trajectories as reusable.

# I003

Evidence: L057, L067, L069, L071, L073, L083

When an evaluation combines HUMANUAL and SimArena, report suite and task results alongside any overall mean. HUMANUAL supplies 600 of the 800 episodes, so the pooled score gives it 75 percent of the weight, while the suites also measure different behavior: HUMANUAL judges single responses and SimArena judges simulated-user interactions, with rewards that differ between math and document tasks. A single mean can therefore hide both weighting and construct differences.

# I004

Evidence: L019, L021, L025

For quota-limited model routes, treat a successful one-row generation-and-judge preflight as evidence of access and compatibility, not evidence that a full evaluation can finish. The free routes here passed individual checks but later exhausted daily request quotas after only 2 and 77 usable episodes. A future runner should propose a capacity check based on the evaluation's expected request count before submitting the full job and should keep partial scores out of comparisons with completed runs.

# I005

Evidence: L053, L077, L079, L089, L091

When publishing benchmark results, record enough provenance to reproduce both the dataset slice and the served model. Here, the 100-row SOUL subsets could be matched to the larger corpora, but their selection algorithm and seed were unavailable, and the evaluator stored requested model names without provider-returned backend identifiers. A future evaluation should propose saving an explicit row manifest or selection seed together with any backend identity returned by the provider, because requested model names and aggregate corpus descriptions do not fully specify the run.

# I006

Evidence: L013

When a Slurm job uses project-relative environments or files, resolve them from the submission directory supplied by Slurm rather than from the spool script's runtime location. In this run, resolving the environment under `/var/slurmd` caused the job to fail before its first API request; using `SLURM_SUBMIT_DIR` made the replacement job runnable.
