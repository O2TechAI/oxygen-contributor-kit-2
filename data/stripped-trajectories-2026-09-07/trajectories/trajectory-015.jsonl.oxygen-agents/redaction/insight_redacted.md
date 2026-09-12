# I001

Evidence: L002, L003, L004

Repository-boundary validation is important before branch operations in workspaces containing nested repositories. Moving checks into the requested project allowed the agent to identify the relevant repository and base-branch state before changing branches.

# I002

Evidence: L005, L006, L009

When a requested branch must include a new commit but its base already contains all desired files, an explicitly disclosed empty commit can create a distinct branch tip while preserving the tree.

# I003

Evidence: L007, L008, L010

Retrying publication with network access can address an environment restriction, but a final status statement does not replace retained results in an auditable record. When those results are unavailable, the summary should attribute success to the agent and preserve the verification gap.
