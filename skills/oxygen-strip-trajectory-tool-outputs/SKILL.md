---
name: oxygen-strip-trajectory-tool-outputs
description: Create a private, non-resumable Codex rollout JSONL copy with explicit tool-call outputs removed from raw response items, paginated event mirrors, and every compacted replacement_history. Use when a contributor provides a local Codex trajectory and needs a deterministic structural comparison or an output-free analysis copy without modifying the live rollout or Codex database.
---

# Strip trajectory tool outputs

Create a separate local analysis copy. Never rewrite a live file under `.codex/sessions`, update
`thread_history_*.sqlite`, upload source text, or treat the result as a resumable Codex rollout.

## Workflow

1. Resolve one contributor-approved JSONL file. If it is live, freeze the intended byte prefix to a
   new private file before filtering. Record its SHA-256 and byte length.
2. Run the deterministic filter:

   ```bash
   python3 scripts/strip_tool_outputs.py INPUT.jsonl \
     --output PRIVATE_OUTPUT.jsonl \
     --report PRIVATE_REPORT.json
   ```

3. Inspect only the content-free JSON report unless the contributor explicitly asks to inspect
   retained conversation text. Report input/output hashes and sizes, removed carrier counts,
   rewritten compaction counts, and retained tool-call counts.
4. Keep both source and output local and unapproved. Apply the repository's separate privacy and
   human-review workflow before any release.

The command refuses an existing destination, malformed or changing input, duplicate JSON keys,
unknown response/event/turn-item variants, orphaned or misaligned `replacement_history_metadata`,
and opaque raw response events. It preserves untouched lines byte-for-byte and rewrites only
compacted records whose histories change.

## Interpretation

The filter removes explicit raw output items and redundant tool-result presentation events. It
retains standalone tool calls and their arguments, user/assistant text, reasoning, compaction
summaries, encrypted compaction items, and non-tool events. It removes a combined call/result item
such as `image_generation_call` as a whole. Retained fields can quote or paraphrase a tool result,
so this is structural removal, not semantic erasure or anonymity.

Read [references/codex-rollout-format.md](references/codex-rollout-format.md) when explaining
compaction, `replacement_history`, subagent rollouts, carrier coverage, or report semantics.

Use this exact privacy posture when the copy may feed a release:

> Best-effort redaction v0.1; no formal anonymity guarantee. Original-contributor final review is required before release.
