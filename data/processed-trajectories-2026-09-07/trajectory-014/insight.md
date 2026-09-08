# I001
Evidence: L004, L005, L010, L012

Workflow infrastructure can fail independently of the data-processing logic. Here, localhost health checks, network-filesystem latency, lost process state, and unsupported atomic rename semantics repeatedly blocked a valid local workflow. Moving the executable runtime and authority-writing lane to a private local filesystem was effective because the verified input and intended durable outputs remained explicitly bound to the original workspace.

# I002
Evidence: L011, L013, L014, L015

Immutable per-shard receipts make global identity rules an input-design concern. Locally valid shards still failed global finalization when workers independently reused semantic-unit IDs with different projections; because accepted receipts could not be edited, the only safe recovery was a full lane restart with enforced shard-prefixed identities. Distributed proposal systems should encode globally unique IDs before workers author results, rather than discovering collisions at finalization.

# I003
Evidence: L011, L012, L017, L018, L019, L026, L029

Proposal-only workers plus a single authoritative recorder contained errors and preserved recoverability, but correctness depended on validating the recorder's exact schema and coverage semantics early. Ordering, helper fields, event binding, object shape, and per-unit evidence coverage all passed some local checks before failing later gates. A representative end-to-end dry run would expose these contract mismatches before dozens of immutable artifacts accumulate.

# I004
Evidence: L021, L022, L023, L024

Privacy authority is reliable only when every component uses the same text-length and serialization model. SQLite's NUL-sensitive `length()` disagreed with receipt offsets measured over loaded Unicode text, and a second validator rejected control-bearing strings even though JSON could transport them safely. Offset validation should operate on the exact decoded text and unit used to create the receipt, while preserving byte-level source digests separately.

# I005
Evidence: L018, L019

An index that is meaningful inside a worker bundle is not necessarily a durable source identity. The nine privacy files appeared structurally close to valid because `turn_index` located turns locally, yet removing that unsupported field revealed that spans lacked the required stable `event_id` binding. Worker formats should distinguish navigational indices from authority-bearing identifiers and validate the latter before global aggregation.

# I006
Evidence: L031, L032, L033, L034

Order-sensitive equality is brittle when two valid producers are allowed to enumerate the same identified objects differently. Story Privacy and Preference preparation both produced false integrity or staleness failures because arrays were compared positionally. Reindexing or canonically sorting by immutable IDs before comparison preserves strict content and digest checks while avoiding failures caused only by scheduling or presentation order.

# I007
Evidence: L006, L008, L009

Scope resolution should report a verified cardinality before asking the user to decide. The ambiguous-session count changed from 11 to 13 after the user said only to continue, forcing the agent to infer both inclusion policy and acceptance of a changed set. Separating affirmative project evidence from missing embedded metadata was reasonable, but an auditable workflow benefits from recounting first and recording an explicit include/exclude decision against the final set.

# I008
Evidence: L025, L026, L027, L028, L029, L030

Narrative quality and authority completeness are separate acceptance dimensions. The chapters passed the parent editorial review yet failed recorder contracts for shape, vocabulary, participant binding, phase ordering, and event coverage. Story pipelines should validate structural and evidence-ledger requirements before spending scarce editorial correction waves, leaving those waves available for actual prose or reasoning defects.

# I009
Evidence: L001, L030, L034, L035

Completing internal Story composition is not the same as completing a contributor-controlled release workflow. The requested outcome required a visible Story-review pause followed by Preferences, Release Preview, and ZIP delivery; the trajectory ended while preparing Preference context, so the user's approval and release-facing deliverables remained outstanding even though substantial upstream artifacts were complete.

# I010
Evidence: L016, L017, L019, L020, L036

Large-scale privacy review remained auditable because every finding was an exact span bound to immutable source material and global coverage was verified before redactions were applied. This design supports deterministic replay and category accounting, but the agent's anonymity caveat remains necessary: complete mechanical coverage of reviewed text does not prove that combinations of retained facts cannot reidentify a contributor.
