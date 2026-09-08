# I001
Evidence: L002, L003

When a requested directory sits inside a broader workspace, establish the Git repository boundary before changing branches or staging files. A failed repository check at the workspace root can be resolved safely by inspecting the requested directory itself instead of assuming the original path represents the repository.

# I002
Evidence: L004, L005

A base branch that exists only on the remote should first be materialized as a local tracking branch before creating a derivative branch. This makes the new branch's ancestry explicit and reduces ambiguity about which remote commit it was based on.

# I003
Evidence: L006, L007, L008

When a user requests a commit but the target contents are already committed, inspecting status, history, differences, and tracked files can distinguish “nothing was added” from “the requested state is already present.” An empty initialization commit can record the requested branch-level action without fabricating content changes, provided its emptiness is clearly disclosed.

# I004
Evidence: L009, L010, L011

Network isolation can make an otherwise valid push fail independently of repository state. Retrying only the push with narrowly scoped network authorization, followed by checking the upstream relationship and clean status, separates infrastructure friction from Git correctness and verifies the remote outcome.
