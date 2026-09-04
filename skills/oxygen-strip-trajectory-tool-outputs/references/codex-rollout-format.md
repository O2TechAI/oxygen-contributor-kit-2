# Codex rollout filtering contract

## Physical and logical history

A local rollout is append-only JSONL. The physical file can carry the same tool result twice:

- `response_item` stores model-protocol items such as `function_call_output`,
  `custom_tool_call_output`, and `tool_search_output`.
- `event_msg` stores UI/pagination projections such as a started or completed
  `CommandExecution` or `Extension` item.

Compaction appends a `compacted` record; it does not delete earlier lines. Its
`payload.replacement_history` is a rewritten logical prefix used to resume the task, followed by
records appended after the checkpoint. Therefore a filter must inspect both the physical raw
items and every replacement history. If parallel `replacement_history_metadata` exists, its
original length must equal the original history and it must be filtered with the identical mask.

The checkpoint's summary-bearing `message` and any encrypted `compaction` response item remain
opaque. They may summarize facts learned from a tool even when no explicit output item remains.

## Subagents

A full-history subagent fork starts from inherited parent context and then records its own work.
Parent and child rollout files remain separate physical artifacts. Filter every supplied file
independently; filtering only the parent cannot remove outputs stored in a child file. Within a
single file, completed collaboration presentation items are removed while non-result
`SubAgentActivity` markers are retained.

## Removed carriers

The script removes:

- any top-level `response_item` whose item type ends in `_output`;
- the same item types from every compacted `replacement_history`;
- the combined `image_generation_call` raw item, because its required `result` field is the
  generated image output;
- started or completed presentation items of type `FunctionCallOutput`, `CommandExecution`,
  `DynamicToolCall`, `CollabAgentToolCall`, `WebSearch`, `ImageView`, `Extension`,
  `ImageGeneration`, `FileChange`, or `McpToolCall`;
- legacy tool completion/result event records such as `exec_command_end`, `patch_apply_end`,
  `mcp_tool_call_end`, `web_search_end`, `image_generation_end`, and
  `dynamic_tool_call_response`, plus streamed `exec_command_output_delta` and derived
  `turn_diff` records and collaboration `*_end` result events.

Unknown response-item, event, and turn-item variants plus undecoded `raw_response_item` records
abort processing. This is intentional: silently preserving a new result carrier would violate
the filter's structural claim.

## Retained content and output status

Standalone tool-call records and arguments are retained so the copy still shows which action was
requested. A combined call/result item is removed whole. Conversation, reasoning, summaries, and
unrelated events are retained. The report contains only schema types, counts, hashes, and byte
totals; it never includes removed values.

The output is an analysis artifact, not a valid resume source. Removing results breaks protocol
pairing and the paginated event stream. Never install it over a live rollout or into Codex's local
SQLite projections.
