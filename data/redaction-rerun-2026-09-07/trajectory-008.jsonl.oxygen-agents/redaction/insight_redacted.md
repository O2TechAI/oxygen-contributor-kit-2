# I001

Evidence: L005, L015, L016, L017, L019, L020, L021

A compatibility layer that rewrites model selection globally can silently change the experimental unit by assigning the target model to auxiliary roles. Role-specific configuration, routing tests, and retained backend identity evidence are needed before scores can be treated as comparable with a source protocol.

# I002

Evidence: L011, L012, L013, L014

A reusable evaluation analyzer benefits from separating schema adaptation, text normalization, shared tokenization, per-episode metrics, and aggregation. This lets the same saved outputs support several task-, suite-, and model-level comparisons without changing generation.

# I003

Evidence: L006, L007, L008, L009

Small end-to-end preflights can detect access and schema failures before a large submission, but they do not establish that a route has enough request quota for a full batch. Functional validation should therefore be paired with capacity estimation.

# I004

Evidence: L004, L010, L023

Scheduled evaluation is more resilient when launch paths are resolved from the project context, outputs are isolated, and work is organized into resumable lanes. Consolidating comparisons can also be necessary when scheduler limits constrain job count.

# I005

Evidence: L024, L025, L026

Anonymous comparative grading requires input-adapter validation and strict output-label validation. Preflights can expose empty-reference bugs, while label checks prevent plausible-looking but corrupted aggregate results from judge identifier confusion.

# I006

Evidence: L026, L027

Mean score and top-one win rate answer different questions. Because top-one selection discards margins and requires beating every rival, pairwise credit and near-win margins are useful alongside exact wins, and incomplete judge results should remain separate rather than be imputed.

# I007

Evidence: L018, L028, L029

Fixing the counterpart model improves experimental control but does not fully isolate simulated-user behavior, because counterpart responses remain conditioned on the simulator's preceding messages. Interaction scores therefore characterize a closed-loop trajectory, while writing-only scores more directly reflect the simulator's text.

# I008

Evidence: L029, L032, L033, L034

Putting all candidates in one judging prompt provides shared context but introduces position and contrast effects absent from separate grading. Balanced shuffling, position audits, and careful treatment of judge scales help bound these effects.

# I009

Evidence: L030, L031, L033

Aggregate rankings can conceal task-specific variation and judge calibration differences. Reports should retain task strata and account for scale differences before producing cross-judge totals.
