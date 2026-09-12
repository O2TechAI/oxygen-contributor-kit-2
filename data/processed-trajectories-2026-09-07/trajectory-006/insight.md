# I001
Evidence: L002, L004, L006

Replacing a heavy benchmark harness with a small runner can preserve task-level semantics while introducing new execution and routing semantics. The replacement should therefore be described and validated as a protocol port, with both preserved logic and intentional differences explicit; otherwise infrastructure success can be mistaken for benchmark equivalence.

# I002
Evidence: L005, L006, L009, L013

Cheap end-to-end preflights catch distinct failure classes before expensive evaluation waves: schema incompatibility, scheduler path assumptions, model-access restrictions, and provider policy filters. A preflight should exercise generation and judging through the actual submission environment, because a locally valid model call does not expose a Slurm spool-path failure.

# I003
Evidence: L009, L014, L015

Provider failures that look similar at submission time need different recovery paths. Inkling's harness restriction persisted across credentials, Nemotron's first failure depended on account policy, and later free-model runs exhausted daily quotas; switching keys can address credential-scoped policy but cannot solve model-level access rules or capacity quotas.

# I004
Evidence: L012, L019, L020, L023

Evaluation roles are part of the experimental treatment. Allowing the target model to act as assistant, generator, and judge confounds simulator behavior with interaction quality and judge calibration; fixing and independently configuring those roles improves comparability, but SimArena still requires regenerated conversations because assistant behavior changes the trajectory itself.

# I005
Evidence: L021, L027, L028

Dataset provenance must include both row selection and interaction context. Even though every local SimArena row was traced to the full corpus, the 100-row selection algorithm was unknown and the human references came from heterogeneous assistants, so naming the exact SOUL/OdysSim adaptation and its assistant mismatch is necessary to delimit what the scores measure.

# I006
Evidence: L025, L026, L027

A combined benchmark mean can conceal both task semantics and sampling weights. Here HUMANUAL contributes 75% of the 800-row mean, SimArena math measures behavioral fidelity rather than correctness, and document scores partly reflect an auxiliary generator; suite- and task-level aggregates are therefore required for meaningful model comparisons.

# I007
Evidence: L016, L030

Long evaluation campaigns benefit from separating logical dependencies from resource-management constraints. Removing an unnecessary dependency let Gemini overlap a slow but healthy DeepSeek run, while consolidating per-pair jobs into judge lanes preserved coverage under a five-job QOS cap; both adaptations changed scheduling without changing the intended evaluation matrix.

# I008
Evidence: L031, L032, L033

Correct statistical aggregation cannot compensate for selecting the wrong experiment. The first report carefully used a common-item intersection but still answered with comparative-run data; only explicit provenance filtering to vanilla outputs satisfied the user's question and changed both the candidate set and scores.

# I009
Evidence: L033, L034

Multi-judge comparisons should report both common-example coverage and judge calibration. Intersecting examples prevented DeepSeek's 13 structurally missing responses from creating unequal samples, while the large spread in judge macro means showed that absolute scores depend materially on evaluator choice even when candidate ordering is aggregated.
