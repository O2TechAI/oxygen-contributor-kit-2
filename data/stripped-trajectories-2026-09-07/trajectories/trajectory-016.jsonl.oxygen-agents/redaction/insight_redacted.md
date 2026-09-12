# I001

Evidence: L002, L003, L004

Session discovery can remain deterministic and privacy-conscious by using the initial metadata record as the classification boundary. Workspace membership, actor type, and source eligibility can be decided without inspecting conversation text, while path-component matching prevents similarly prefixed sibling directories from being included.

# I002

Evidence: L005, L008, L009

Collecting active append-only logs safely requires a defined snapshot boundary and verification after copying. Capturing only complete records and rechecking the observed prefix and file identity permits benign appends while detecting truncation, replacement, and edits to previously observed bytes.

# I003

Evidence: L006, L008, L009

Privacy safeguards can be built into the collection format. Restrictive permissions, output-location guards, content-free diagnostics, integrity metadata, and deduplication support downstream processing without placing conversation text in the manifest.

# I004

Evidence: L010, L011, L012

Passing behavioral tests did not establish acceptable performance on the active session store. A live dry run exposed an input/output bottleneck and led to more efficient read behavior, showing that representative dry runs complement correctness tests for tools that traverse many active logs.

# I005

Evidence: L012, L014, L015

A successful dry run and validated implementation do not establish that a later materializing run completed. When the available record ends immediately after collection begins, downstream work should treat the requested artifacts as unresolved until completion evidence is available.
