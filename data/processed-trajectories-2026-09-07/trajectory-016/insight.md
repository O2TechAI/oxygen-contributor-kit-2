# I001
Evidence: L003, L005, L009

A reliable collection-to-sanitization pipeline benefits from a narrow stage boundary: discovery and immutable snapshotting establish which inputs will be processed, while the existing stripper remains responsible for validating and removing tool outputs one snapshot at a time.

# I002
Evidence: L005, L007, L013

For append-only session logs, a useful snapshot protocol is to capture the size observed at open, cut back to the last complete record, hash and re-read that prefix, and tolerate only bytes appended afterward. This preserves a stable consumable input without locking the live writer while still detecting destructive races.

# I003
Evidence: L005, L008, L012

Session selection should rely on small, initial metadata fields rather than scanning conversation text. That makes workspace and actor classification deterministic and allows manifests and diagnostics to remain content-free even when malformed or unknown records are encountered.

# I004
Evidence: L014, L015, L016

Passing behavioral tests did not establish operational readiness on the target filesystem: a live metadata-only dry run exposed an I/O performance problem that synthetic tests missed. Combining focused tests, package validation, and a representative non-writing run caught both correctness and deployment-environment issues.

# I005
Evidence: L017, L020, L021

Discovery estimates and a successful implementation do not prove that a later materializing run completed. When a trajectory ends at the launch of a side-effecting collection command, downstream reporting should preserve the outcome as unknown until the command result and manifest are observed.
