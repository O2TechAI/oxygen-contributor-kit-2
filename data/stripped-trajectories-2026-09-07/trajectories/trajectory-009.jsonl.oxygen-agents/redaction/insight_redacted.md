# I001

Evidence: L005, L006, L007, L008

Role routing is part of an evaluation protocol. A global model override can silently turn a controlled evaluation into self-play and self-judging, and changing the judge later cannot repair interactions generated under the wrong assistant. Role-specific configuration and end-to-end routing checks should precede large runs.

# I002

Evidence: L010, L012, L013, L018

Anonymous comparative judging needs margin-aware reporting and robust identifiers. Top-one rates can make a consistently close second-place system look much worse than continuous or pairwise results, while identifiers resembling natural content can corrupt structured judgments. Pairwise credit, score margins, rank frequencies, short local labels, and explicit missingness provide a more stable account.

# I003

Evidence: L014, L015, L016, L017

A lower-assumption audit becomes useful only after its claim and support are fixed. Defining it as an independent diagnostic, freezing comparison and randomization choices, matching support, separating judge replications, and requiring a smoke gate prevents later implementation choices from being mistaken for evidence that the audit is ground truth.

# I004

Evidence: L017, L018, L019

Small smoke tests can reveal identifier transcription, presentation-order sensitivity, and disagreement between metrics. They should exercise rendered prompts, recoding, batching, and recovery behavior before scale-up, while their rankings remain provisional because the sample is too small for stable system conclusions.

# I005

Evidence: L021, L022, L023, L024, L025

Evaluator validity must be interpreted alongside the reference audit's own reliability. System-level agreement can coexist with weak target-level agreement, so aggregate ranks do not establish that an evaluator identifies the better system on individual tasks.

# I006

Evidence: L023, L024, L026, L029

Within-system correlation and same-example system-gap correlation answer different questions. An evaluator may weakly track which examples look better for a fixed system while failing to track which system is relatively better on the same example. A simpler baseline can improve relative comparisons through one component, suggesting that extra rubric structure may add noise without improving the intended discrimination.

# I007

Evidence: L027, L028, L029

A weighted scalar can conceal qualitatively different component states. Frequent ties can arise from combining equal measured specificity with strong source distinguishability, reducing ranking resolution. Combined scores should therefore be accompanied by component distributions, tie rates, and analyses on non-tied support.

# I008

Evidence: L030

Absolute distance from an indistinguishable midpoint discards the direction of source judgments, and an absolute specificity gap hides whether simulation is under-personalized or over-personalized. Reporting directional source-selection rates and signed specificity differences preserves behavior needed to diagnose how simulated responses differ from real ones.
