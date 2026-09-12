# I001

Evidence: L007, L008, L009, L010

Role routing is part of an evaluation protocol, not merely infrastructure. A compatibility layer that globally overrides model names can silently turn a controlled simulator evaluation into self-play and self-judging; correcting judge labels alone is insufficient when the assistant already changed the generated interaction. Role-specific configuration, recorded runtime metadata, and end-to-end routing preflights should precede large runs.

# I002

Evidence: L014, L016, L017

Anonymous comparative judging needs both margin-aware reporting and robust identifiers. Top-one win rates can make a consistently close second-place system appear much worse than its continuous scores or pairwise performance, while candidate labels embedded in realistic content can corrupt structured outputs. Pairwise credit, score margins, rank frequencies, short batch-local IDs, and explicit missingness provide a more stable account.

# I003

Evidence: L019, L020, L023, L024

A lower-assumption audit becomes scientifically useful only after its claim and support are fixed. Treating it as an independent diagnostic, freezing comparison histories and randomization, matching support, separating judge replications, and defining a smoke gate prevents later implementation choices from being mistaken for evidence that the audit is ground truth.

# I004

Evidence: L025, L026, L027, L028

Small smoke tests can reveal failures that aggregate validation misses, including identifier transcription, presentation-order sensitivity, and proxy-audit disagreement. They should test the exact rendered prompts, recoding, batching, and recovery path before scale-up; however, their rankings should remain operational observations because one target per dataset cannot support stable model conclusions.

# I005

Evidence: L031, L033, L034, L035, L036

Evaluator validity must be compared with the reliability of the reference audit itself. Weak proxy agreement against a moderately reproducible HUMANUAL audit is more informative than disagreement against the weakly reproducible SimulatorArena audit. System-level agreement can coexist with weak target-level agreement, so dataset-level ranks should not be presented as evidence that the evaluator identifies the better simulator on individual tasks.

# I006

Evidence: L034, L035, L037, L040

Within-simulator correlation and simulator-pair gap correlation answer different questions. The original HUMANUAL score weakly tracked which examples looked better for a fixed simulator but almost completely failed to track which simulator was relatively better on the same example. The naive profile-alignment baseline improved relative comparisons mainly through user specificity, suggesting that additional rubric structure can add noise or bias without improving the intended discrimination.

# I007

Evidence: L038, L039

A weighted scalar can conceal qualitatively different component states. Here, the frequent score of 0.5 usually combined perfect specificity agreement with maximal source distinguishability, producing many ties and low ranking resolution. Combined audit scores should therefore be accompanied by component distributions, tie rates, and conditional analyses on non-tied support.

# I008

Evidence: L041, L042

Absolute distance from an indistinguishable midpoint discards the direction of source judgments, treating correct human identification and simulator fooling equally. Likewise, an absolute specificity gap hides whether simulation is under-personalized or over-personalized. Reporting directional human-selection rates and signed specificity differences preserves behavior that is central to diagnosing how a simulator differs from real users.

# I009

Evidence: L012, L021, L042

Dataset provenance constrains what personalization results mean. SOUL's SimulatorArena rows derive profiles and references from example-level conversations, while HUMANUAL uses held-out responses conditioned on persona and context. The opposite raw specificity directions across these suites are therefore consistent with different evaluation constructs, and aggregate claims should distinguish example-conditioned profile reproduction from held-out user-response prediction.
