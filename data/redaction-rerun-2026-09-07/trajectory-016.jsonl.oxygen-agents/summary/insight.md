# I001

Evidence: L003, L004, L006

Session discovery can remain deterministic and privacy-conscious by making the initial metadata record the sole classification boundary. Workspace membership, actor type, and source eligibility can be decided without inspecting conversation text, while path-component matching prevents similarly prefixed sibling directories from being included.

# I002

Evidence: L005, L008, L010

Collecting live append-only logs safely requires a defined snapshot boundary and verification after copying. Capturing only through the last complete record, hashing and rereading the captured prefix, and checking file identity permits benign appends while detecting truncation, replacement, and edits to already observed bytes.

# I003

Evidence: L006, L008, L010

Privacy and provenance are part of the collection format rather than later cleanup steps. Restrictive permissions, output-location guards, content-free diagnostics, per-snapshot hashes, and retained source locations allow downstream processing and auditing without placing raw conversation text in the manifest.

# I004

Evidence: L011, L012, L014

Passing synthetic behavioral tests did not establish acceptable performance on the live session store. The live metadata scan exposed an I/O problem and led to positional reads for prefix work, showing that filesystem-scale dry runs are a necessary complement to correctness tests for tools that traverse many active logs.

# I005

Evidence: L014, L016, L017, L018

A successful dry run and validated implementation do not establish that a later materializing run completed. When a frozen record ends immediately after command invocation, downstream workflows should treat the requested artifacts as unresolved until a result or manifest is independently observed.
