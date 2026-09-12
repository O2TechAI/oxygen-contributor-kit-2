# I001

Evidence: L002, L004, L007

A lightweight compatibility runner can remove unnecessary training infrastructure from an API-only benchmark, but scheduler execution changes path semantics. A smoke test from the submission directory does not cover spool execution, so batch launchers should resolve resources from an explicit submission or project root and verify that behavior before a full run.

# I002

Evidence: L009, L012, L013

One-item authorization and end-to-end preflights prevent deterministic model-access failures from consuming full evaluation budgets, but they do not establish that a free route has enough daily quota for a complete benchmark. Capacity checks or resumable quota-aware scheduling are needed separately from compatibility checks.

# I003

Evidence: L018, L019, L020, L022, L023

Model routing is part of the experimental protocol. A broad compatibility override silently turned fixed-role evaluation into self-play and self-judging, which changed both generated trajectories and scores. Auxiliary roles should have explicit, independently tested configuration, and multi-turn data must be regenerated when the interaction partner changes.

# I004

Evidence: L021, L026

Conversation-level provenance can matter more than nominal task labels. The human SimulatorArena records were drawn from a larger interaction corpus and were conditioned on multiple assistants, so evaluation design should distinguish unique prompts, conversation instances, benchmark subsets, and the assistant associated with each human reference.

# I005

Evidence: L027, L028, L029

Judge-only evaluation over persisted target responses provides a low-cost way to expand a target-by-judge matrix without regenerating model behavior. Consolidated judge lanes also reduce scheduler job-count pressure, provided each output retains the target, judge, source-response, and task identity needed for auditing.

# I006

Evidence: L031, L032

Structured grading can appear to reveal evaluator behavior when the actual cause is an empty or misread reference field. A single realistic preflight that requires nonempty nested data and differentiated outputs can expose adapter failures before a large comparison, and the discovered schema shape should become a regression test.

# I007

Evidence: L033, L034, L035, L036, L037

Average score, pairwise success, and three-way top-one rate measure different properties. A model can remain close to the winner on many examples and achieve a similar mean while winning less often because close losses receive zero top-one credit and its strongest examples overlap a competitor's strongest examples. Reporting margins and pairwise credit alongside win rate preserves this distinction.

# I008

Evidence: L033, L038

Structured-output failures concentrated in particular content domains create nonrandom missingness. Partial judge results should retain per-task denominators and should not be averaged as though they cover the same examples as complete judges.

# I009

Evidence: L040, L041, L042, L043

Anonymous candidate randomization reduces identity leakage but does not eliminate presentation bias. Position counts and position-standardized sensitivity checks are necessary when model differences are small; balanced assignment can support broad rankings while still leaving close comparisons uncertain.

# I010

Evidence: L044, L045, L046, L047, L050

Presentation requests often reveal unresolved analysis semantics. Separating target-model filters from evaluator filters, writing the reward dimensions explicitly, and stating whether evaluator results are pooled or equally averaged prevents plot revisions from silently changing the research question.

# I011

Evidence: L048, L049, L050

Metrics cannot always be transferred across suites: naive alignment required a human profile and therefore applied only to HUMANUAL, while SimulatorArena exposed different audit components. Cross-suite figures should aggregate only comparable quantities and should make omitted subsets and metric availability explicit.
