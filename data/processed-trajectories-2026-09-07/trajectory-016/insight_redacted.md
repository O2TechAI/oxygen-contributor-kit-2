# I001

Evidence: L002, L003, L004

Session discovery can remain deterministic and privacy-conscious when initial metadata is the classification boundary. Workspace membership and session type can be decided without inspecting conversation text, while component-aware matching avoids including similarly prefixed sibling locations.

# I002

Evidence: L005, L007

Safely collecting live append-only logs requires a defined snapshot boundary and verification after capture. Keeping only complete records and checking the captured prefix permits benign appends while detecting truncation, replacement, or edits to already observed data.

# I003

Evidence: L004, L007

Privacy and integrity controls belong in the collection format. Restricted permissions, output-location safeguards, content-free diagnostics, deduplication, and integrity checks let downstream processing operate without exposing conversation text in collection metadata.

# I004

Evidence: L008, L009, L010

Passing behavioral tests does not establish acceptable performance on a live data store. A live dry run exposed an input/output problem and prompted an optimization, showing that realistic dry runs complement correctness tests for tools that scan many active logs.

# I005

Evidence: L011, L012

Invoking a collection does not establish that it completed. When the available record ends before a result or final status, downstream workflows should treat the requested artifacts as unresolved.
