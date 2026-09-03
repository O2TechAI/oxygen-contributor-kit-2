# Trajectory Summarization and Insight Extraction

Given a trajectory, generate two files:

* `summary.md`: a compressed and faithful summary of the trajectory.
* `insight.md`: non-trivial, reusable insights grounded in the trajectory, with each insight referencing the relevant lines in `summary.md`.

The trajectory may be a conversation between a human and a coding agent or a transcript between multiple humans.

---

# Stage A — Generate `summary.md`

The Summary should preserve the information that is important for understanding what happened, especially information that captures meaningful state changes, actions, outcomes, and reasoning.

A good Summary should be:

### Faithful

Every factual statement should be supported by the trajectory.

Represent motivations, causal relationships, conclusions, beliefs, and uncertainty according to how they appear in the trajectory.

### Insight-sufficient

Preserve observations and state changes that may support useful reasoning, abstraction, or learning from the trajectory.

### Insight-neutral

Keep the Summary primarily at the level of events, evidence, actions, states, outcomes, and participant reasoning.

Place newly inferred generalizations, diagnoses, patterns, and reusable lessons in `insight.md`.

---

## What the Summary should preserve

Prioritize information that changes the state or interpretation of the trajectory.

### User / participant intent

Preserve:

* what the participants were trying to accomplish;
* important constraints or requirements they introduced;
* changes in requirements over time;
* explicit corrections or feedback given to another participant.

### Agent / participant actions

Clearly distinguish what each participant did.

For coding-agent trajectories, distinguish at minimum:

* user actions and statements;
* agent actions and statements.

For human-human transcripts, preserve the relevant speaker attribution.

When different participants hold different positions, preserve the attribution rather than merging them into a single collective position.

### State changes

Pay special attention to transitions such as:

`initial state -> action -> observed result -> reaction -> updated state`

Examples include:

* a hypothesis being tested;
* an implementation being changed;
* a requirement being revised;
* an assumption being invalidated;
* a decision being reversed;
* a new constraint being discovered.

Preserve enough information for both the earlier and later states to be recoverable.

### Attempts and outcomes

Preserve important:

* attempted approaches;
* failed approaches;
* partially successful approaches;
* errors;
* fixes;
* regressions;
* workarounds;
* unexpected outcomes.

Do not collapse:

`A failed -> B partly worked -> C was adopted`

into only:

`C was adopted`.

The path may contain more learnable information than the final state.

### Negative and surprising evidence

Preserve cases where:

* an expected improvement did not occur;
* a proposed solution failed;
* a supposedly solved problem reappeared;
* a result contradicted an earlier assumption;
* implementation success did not translate into workflow or user success.

### Repeated friction

When the same issue appears repeatedly in meaningfully different situations, preserve enough occurrences for the recurrence itself to remain visible.

### Disagreement and uncertainty

Preserve:

* disagreement between participants;
* competing hypotheses;
* unresolved questions;
* uncertainty;
* speculation;
* incomplete evidence.

Represent uncertain statements as uncertain statements.

For example:

`The user suspected X might cause Y.`

rather than:

`X caused Y.`

### Decisions and rationale

Preserve important decisions together with their rationale when the rationale is available.

Distinguish among:

* a proposed decision;
* a tentative preference;
* a decision that was actually made.

### Technical evidence

Preserve technical details when they materially affect:

* behavior;
* architecture;
* constraints;
* failures;
* decisions;
* outcomes;
* future generalization.

Relevant details may include:

* important interfaces;
* architectural boundaries;
* functions or modules;
* test behavior;
* recurring code patterns;
* data assumptions;
* system constraints.

Full code snippets, filenames, command outputs, or implementation details are useful when they constitute meaningful evidence.

---

## Sensitive information

Remove or abstract sensitive information, including:

* credentials and secrets;
* unnecessary personally identifiable information;
* private information unrelated to the project;
* sensitive non-project information;
* information that creates unnecessary privacy, safety, or ethical risk.

When a sensitive detail is important for understanding the trajectory, preserve the relevant abstract fact while removing unnecessary identifying information.

---

## Observation and interpretation

The Summary should primarily record the evidence from which broader interpretations can be made.

For example:

**Summary:**

`After search latency was reduced, users still spent substantial time manually checking candidate-part compatibility.`

A broader interpretation such as:

`Compatibility verification, rather than retrieval, was the main workflow bottleneck.`

belongs in `insight.md` when supported by the trajectory.

When a participant explicitly expresses an interpretation or conclusion and that statement matters to the trajectory, preserve the attribution:

`The user concluded that ...`

---

## Summary line format

Write `summary.md` as individually numbered lines:

```text
L001 ...
L002 ...
L003 ...
```

Prefer chronological ordering unless grouping tightly related evidence substantially improves clarity.

Each line should identify the relevant actor when attribution matters.

Examples:

```text
L001 User initially asked the agent to optimize search latency.
L002 Agent changed the retrieval implementation and reported lower search latency.
L003 User observed that manual compatibility checking still required roughly the same amount of time.
L004 Engineer A favored adding supplier-specific parsing rules, while Engineer B questioned whether that approach would scale.
```

Each line should represent a coherent event, action, observation, state, decision, or transition.

---

# Stage B — Generate `insight.md`

After drafting the Summary, inspect the full trajectory for useful insights.

Insights should capture learnable knowledge that requires reasoning, synthesis, abstraction, comparison, or pattern recognition beyond merely restating what happened.

Use the full trajectory when identifying candidate insights.

For every useful insight, check whether `summary.md` preserves the evidence needed to support it.

If important supporting information from the trajectory is missing from the Summary, revise `summary.md` to preserve that evidence, then reference the corresponding Summary lines from the insight.

The added Summary content should preserve the underlying evidence rather than replacing it with the inferred conclusion.

---

## What qualifies as an insight

### Non-trivial

An insight should require a meaningful reasoning step.

It may connect multiple events, explain a recurring pattern, identify a condition behind success or failure, or abstract a reusable lesson from the trajectory.

### Evidence-grounded

Every insight should reference the smallest useful set of line IDs from `summary.md` that supports it.

### Learnable

An insight should contain knowledge that could improve reasoning or behavior on related future tasks.

Useful forms of insight may include:

* recurring failure modes;
* architectural patterns;
* workflow bottlenecks;
* debugging strategies;
* decision-making patterns;
* useful abstractions;
* requirement-management lessons;
* interaction patterns;
* evaluation lessons;
* process improvements;
* conditions under which an approach succeeds or fails.

### Appropriately scoped

Match the strength and scope of the insight to the available evidence.

For example:

`For the supplier formats encountered in this trajectory, accumulating supplier-specific branches repeatedly increased maintenance work.`

is better supported than:

`Supplier-specific parsers never scale.`

### Distinct from retelling

Prefer insights that synthesize or generalize beyond a direct restatement of a single event or participant statement.

---

# Output Files

Create exactly two files.

## `summary.md`

Use numbered lines:

```markdown
L001 ...
L002 ...
L003 ...
```

## `insight.md`

Use the following format:

```markdown
# I001
Evidence: L003, L007, L011

<insight>

# I002
Evidence: L014, L018

<insight>
```

Each insight must reference specific lines from the final version of `summary.md`.

Before finishing, ensure that every referenced line exists and that the cited lines contain sufficient evidence for the corresponding insight.
