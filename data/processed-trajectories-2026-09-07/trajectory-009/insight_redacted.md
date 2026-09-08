# I001

Evidence: L005, L006, L007, L008

Role routing is part of the evaluation protocol. A global model override can silently convert a controlled simulator evaluation into self-play and self-judging, and correcting the judge later is insufficient when the generated interaction was already affected. Role-specific configuration and end-to-end routing checks should precede large runs.

# I002

Evidence: L009, L011, L012, L016

Anonymous comparative judging benefits from margin-aware reporting, robust identifiers, and realistic smoke tests. Top-rank wins can exaggerate small score differences, while ambiguous candidate labels and presentation position can corrupt or bias structured judgments. Pairwise credit, score margins, position checks, short local labels, and explicit missingness produce a more stable account.

# I003

Evidence: L013, L014, L015, L016

A lower-assumption audit is most useful when its claim and support are fixed before scaling. Defining it as an independent diagnostic, freezing comparison support and randomization, separating judge replications, and requiring a smoke gate prevents later implementation choices from being mistaken for evidence of ground truth.

# I004

Evidence: L017, L018, L019, L020

Evaluator validity should be interpreted alongside the reliability of the reference audit. System-level agreement can coexist with weak individual-example agreement, and judge-dependent rankings limit claims that an evaluator reliably identifies the better simulator on a particular task.

# I005

Evidence: L021, L022

Within-system association and same-example system-pair discrimination answer different questions. An evaluator may weakly track which examples look better for one simulator yet fail to track which simulator is relatively better on the same example. The stronger specificity behavior of a simple baseline suggests that added rubric structure can introduce noise without improving the intended distinction.

# I006

Evidence: L015, L023

A weighted scalar can hide qualitatively different component states. When distinct patterns collapse to the same score, ties increase and ranking resolution falls. Combined scores should therefore be accompanied by component distributions, tie rates, and analyses on non-tied support.

# I007

Evidence: L024

Absolute gaps discard direction. Signed specificity differences and directional source-selection rates preserve whether a simulation is under- or over-specific and whether a judge correctly identifies real responses or is fooled by generated ones.
