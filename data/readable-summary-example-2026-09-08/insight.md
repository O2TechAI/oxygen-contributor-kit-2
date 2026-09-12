# I001

Evidence: L009, L011

When replacing a model in an evaluation workflow, first identify whether the model generates the answers or only scores saved answers. If the requirement is to preserve answer text, reuse the saved answers, change only the judging model, and run a small validation that explicitly checks the text is unchanged; replacing the answer-generating model would alter the object being evaluated.

# I002

Evidence: L015, L017

When an unavailable compute pool requires a temporary scheduling exception, scope the override to the current job and verify that the persistent scheduling preference remains unchanged. This preserves the user's normal configuration while still allowing the exceptional run to proceed.

# I003

Evidence: L021, L023

When a small evaluation test produces a score ordering, use it as pipeline validation rather than sufficient evidence for choosing a winner. Defer the decision until the intended evaluation set is complete, and avoid attributing a lower score to a cause that has not been determined.

# I004

Evidence: L027, L029

When an evaluation depends on a provider with daily request limits, a successful one-example test does not establish that a full run can finish. Before resubmitting the full workload, estimate available request capacity against the workload size, because the larger run can exhaust the quota after the pilot succeeds.
