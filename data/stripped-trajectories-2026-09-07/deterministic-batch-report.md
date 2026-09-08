# Deterministic trajectory batch report

All 16 summary workers and 15 redaction workers finished. They produced 62 Markdown files. 2 trajectories passed the current validator end to end; the batch is not fully validated.

Model: `gpt-5.6-sol`; reasoning: `medium`; parent history: `none`.

| Trajectory | Summary lines / insights | Redacted lines / insights | Validation |
|---|---:|---:|---|
| [trajectory-001.jsonl](trajectories/trajectory-001.jsonl.oxygen-agents/) | 2 / 1 | 2 / 1 | redaction: `invalid_summary_line_ids` |
| [trajectory-002.jsonl](trajectories/trajectory-002.jsonl.oxygen-agents/) | 57 / 9 | 22 / 8 | redaction: `invalid_summary_sections` |
| [trajectory-003.jsonl](trajectories/trajectory-003.jsonl.oxygen-agents/) | 50 / 10 | 22 / 10 | redaction: `invalid_summary_sections` |
| [trajectory-004.jsonl](trajectories/trajectory-004.jsonl.oxygen-agents/) | 47 / 10 | 33 / 10 | redaction: `invalid_summary_sections` |
| [trajectory-005.jsonl](trajectories/trajectory-005.jsonl.oxygen-agents/) | 57 / 10 | 33 / 10 | Passed |
| [trajectory-006.jsonl](trajectories/trajectory-006.jsonl.oxygen-agents/) | 57 / 12 | 37 / 12 | redaction: `invalid_summary_sections` |
| [trajectory-007.jsonl](trajectories/trajectory-007.jsonl.oxygen-agents/) | 50 / 10 | 33 / 10 | redaction: `invalid_summary_line_ids` |
| [trajectory-008.jsonl](trajectories/trajectory-008.jsonl.oxygen-agents/) | 72 / 12 | Not dispatched | summary: `invalid_evidence_references` |
| [trajectory-009.jsonl](trajectories/trajectory-009.jsonl.oxygen-agents/) | 42 / 9 | 30 / 8 | redaction: `invalid_summary_sections` |
| [trajectory-010.jsonl](trajectories/trajectory-010.jsonl.oxygen-agents/) | 55 / 9 | 32 / 9 | redaction: `invalid_summary_line_ids` |
| [trajectory-011.jsonl](trajectories/trajectory-011.jsonl.oxygen-agents/) | 35 / 8 | 22 / 7 | redaction: `invalid_summary_sections` |
| [trajectory-012.jsonl](trajectories/trajectory-012.jsonl.oxygen-agents/) | 51 / 11 | 22 / 8 | redaction: `invalid_summary_sections` |
| [trajectory-013.jsonl](trajectories/trajectory-013.jsonl.oxygen-agents/) | 49 / 9 | 30 / 9 | redaction: `invalid_summary_line_ids` |
| [trajectory-014.jsonl](trajectories/trajectory-014.jsonl.oxygen-agents/) | 42 / 10 | 28 / 10 | Passed |
| [trajectory-015.jsonl](trajectories/trajectory-015.jsonl.oxygen-agents/) | 15 / 3 | 10 / 3 | redaction: `invalid_summary_line_ids` |
| [trajectory-016.jsonl](trajectories/trajectory-016.jsonl.oxygen-agents/) | 18 / 5 | 15 / 5 | redaction: `invalid_summary_line_ids` |

Counts describe generated files, including those rejected by validation.

- All worker dispatches used gpt-5.6-sol, medium reasoning, and fork_turns=none. The fixed wrappers and repository prompt contents were included in each dispatched message.
- Before any worker was dispatched, the helper validator was updated to recognize the current hierarchical summary prompt. The initial unexecuted preparations were preserved in preflight-before-hierarchy-validator; all actual dispatches used one consistent configuration.
- The validator also applies the three-level layout requirement to redactions, although sensitive-redaction.md does not explicitly require preservation of that layout. Rejected redaction outputs have sequential numbered lines; layout rejection does not establish content failure or privacy correctness.
- Trajectory 008 used evidence ranges instead of individually listed references. Its summary was retained and redaction was not dispatched after validation failed.
- No worker was retried and no generated prose was repaired by the parent. Raw inputs, frozen copies, accepted summaries, and saved intended calls passed integrity checks. Saved calls establish intended arguments; runtime tool logs remain the execution authority.
- Artifacts remain private and local. Contributor review is required before release.

See [the JSON report](deterministic-batch-report.json) for artifact hashes and [the progress log](deterministic-batch-progress.json) for recorded agents and stage results.
