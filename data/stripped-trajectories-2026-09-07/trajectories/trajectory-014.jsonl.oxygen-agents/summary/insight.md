# I001

Evidence: L002, L003, L004

When a requested workflow is unavailable as an installed plugin, a repository-local implementation may still be authoritative. Checking the user-specified local path before treating the workflow as unavailable prevents premature refusal while preserving the workflow's own safeguards.

# I002

Evidence: L005, L006, L013

Network-mounted workspaces can violate runtime assumptions in several independent ways, including server responsiveness and atomic filesystem operations. Running an unchanged executable copy and mutable workflow state on a private local filesystem can isolate those infrastructure limitations while retaining the workspace as the source and final-artifact location.

# I003

Evidence: L009, L010

Scope decisions should be based on affirmative membership evidence and a verified count. Here, exact-workspace cwd evidence supported inclusion, but the change from 11 to 13 ambiguous sessions shows that the population should be recounted before recording the user's resolution.

# I004

Evidence: L012, L014, L015, L017, L018

Per-shard validation cannot establish global identity consistency. Shard-prefixed identifiers plus a global union and collision check prevented independently valid proposals from producing conflicting authority records, and immutable receipts made a clean restart safer than in-place repair.

# I005

Evidence: L021, L022

Deleting an unsupported field can preserve syntax while destroying meaning when that field was carrying an implicit binding. Schema corrections should first identify the required semantic replacement; re-authoring `turn_index` findings with explicit `event_id` preserved the intended source association.

# I006

Evidence: L025, L026, L027

Privacy offsets, database checks, and transport validators must measure the same preserved text representation. Embedded NUL and control bytes exposed mismatched length semantics even though the source digest was valid; aligning validation with Unicode code-point offsets resolved the gate without rewriting evidence.

# I007

Evidence: L029, L030, L031, L032

Worker self-validation should exercise the authoritative recorder contract early. Proposal wrappers, enum values, phase rules, and participant constraints were discovered only after substantial drafting, consuming both correction waves and forcing a constrained parent takeover.

# I008

Evidence: L033, L034

Chapter-level evidence highlights do not prove coverage of every semantic unit represented by a narrative. Maintaining an explicit unit-to-event authority ledger makes evidence completeness testable without adding prose or unsupported claims.

# I009

Evidence: L038, L039, L040, L041

Order-sensitive equality checks create false tampering or staleness failures when two stages legitimately enumerate the same identities differently. Reindexing by immutable catalog IDs and canonically comparing stable identity sets preserves exact content checks while removing incidental ordering dependence.

# I010

Evidence: L001, L036, L040, L042

Workflow progress should be reported separately from user-visible completion. Reaching Story Privacy and Preference preparation did not satisfy the requested review pause, Preferences, Release Preview, or ZIP delivery, so the segment remains incomplete despite extensive validated intermediate work.
