---
name: oxygen-deterministic-trajectory-agents
description: Run the Oxygen summary and privacy-redaction prompts through fixed fresh-context subagent calls, with only the input JSON or JSONL path supplied per trajectory. Use when repeatable dispatch, unchanged prompt text, and isolated per-trajectory processing matter. Controls invocation, not deterministic model output.
---

# Deterministic trajectory agent calls

Use this skill from its location in the contributor kit. Its two task prompts are
the repository's existing `prompts/summary-and-insight.md` and
`prompts/sensitive-redaction.md`; the helper embeds their complete contents verbatim.
The caller supplies one value: the path to a frozen trajectory JSON or JSONL file.
For the output-free analysis workflow, first obtain the input through
[oxygen-strip-trajectory-tool-outputs](../oxygen-strip-trajectory-tool-outputs/SKILL.md).
Collection, stripping, deployment, and release are separate tasks.

## Fixed dispatch

The protocol uses `collaboration.spawn_agent`, `fork_turns="none"`,
`model="gpt-5.6-sol"`, and `reasoning_effort="medium"` for both stages. These are
explicit skill-selected defaults: use the same settings for every item. Check that
the current tool supports these fields and values before preparing a run. If it
does not, report the unsupported setting; do not substitute a model, inherit parent
history, or switch dispatch tools within a batch.

The exact worker contracts live in [summary-worker.md](references/summary-worker.md)
and [redaction-worker.md](references/redaction-worker.md). The helper owns message
assembly. Per stage, all prompt bytes remain identical except for one final
JSON-encoded `input_json_path` value. The task name is a deterministic derivative of
that same path, used solely to avoid task-name collisions. Output locations and the
frozen copy location are derived from the path, never separately supplied.

Fresh context removes parent conversation history. System/developer instructions,
available tools, workspace, and sandbox still come from the host; this tool exposes
no per-call sandbox or tool allowlist. Keep those host settings unchanged across a
batch. Worker file-access restrictions are instructions, not an enforced sandbox.
The pinned model name is an alias, not a guarantee of an immutable model snapshot.
Do not claim identical generated prose or hidden context across sessions.

## Run one trajectory

Run helper commands from this skill's directory. Replace `INPUT.jsonl` with the same
input path at every step; the action names below are fixed protocol steps.

1. `python3 scripts/trajectory_agents.py prepare INPUT.jsonl`
   creates `INPUT.jsonl.oxygen-agents/`, freezes the input bytes, and records input,
   prompt, template, and helper hashes. Existing runs are refused.
2. `python3 scripts/trajectory_agents.py summary-call INPUT.jsonl`
   emits the complete JSON arguments for one `collaboration.spawn_agent` call.
   Pass that exact object to the tool without rewriting, appending context, changing
   settings, or using a history fork. Record the returned agent ID in the parent
   task's progress log and wait for that agent to finish.
3. Require the worker's final `status` to be `complete`, then run
   `python3 scripts/trajectory_agents.py accept-summary INPUT.jsonl`.
   It checks exact output filenames, sequential IDs, evidence references, and input
   integrity. Only a successful check allows the next step.
4. `python3 scripts/trajectory_agents.py redaction-call INPUT.jsonl`
   emits the second call's exact arguments. Spawn a **new** agent with those
   arguments. It reads only the generated summary/insight pair. Do not resume the
   summary agent, include its final response, or provide trajectory contents.
5. Require the second worker's final `status` to be `complete`, then run
   `python3 scripts/trajectory_agents.py accept-redaction INPUT.jsonl`.
   Completion requires all checks and `run_complete: true`.

The helper constructs requests and validates files; it does not itself call the
model. Its saved `*-call.json` files audit the intended arguments. They are not
proof that the host executed an identical request; use the host's actual call log
when auditing execution. Parent-owned administrative files are outside the worker
output directories so each worker still creates exactly its two requested files.

## Batches, failures, and outputs

For several inputs, canonicalize, deduplicate, and sort absolute paths, then run
the same protocol for each. Prepare them with the same configuration hashes and
check these hashes match before dispatching. Keep at most three workers active and
dispatch eligible items in path order; concurrency changes scheduling, not message
content. Use only these two worker roles, one fresh worker per input per stage.

Call issuance is recorded before arguments are emitted. Issuing the same stage
again fails. If interrupted after issuance, reconcile the existing agent using the
parent call log and saved request; wait for that agent instead of spawning a
duplicate. A failed worker, changed input/prompt/configuration, invalid output, or
uncertain dispatch stops that item. Retain artifacts and report the failed stage;
do not rewrite the prompt, repair prose in the parent, or silently retry. Other
independent items may continue. A stale `.operation-lock` signals an interrupted
helper operation; reconcile it before further mutation.

Successful runs contain:

- `summary/summary.md` and `summary/insight.md`;
- `redaction/summary_redacted.md` and `redaction/insight_redacted.md`;
- the frozen input, exact call arguments, and `manifest.json` with validation counts
  and hashes. Empty redacted insights are valid when no safe support remains.

Directories use `0700` and files use `0600`. The helper verifies structure and
integrity; evidence sufficiency and privacy editing remain model judgments subject
to contributor review. Report counts and paths without quoting private text.

Best-effort redaction v0.1; no formal anonymity guarantee. Original-contributor final review is required before release.

## Basis and portability

The requested design follows the referenced conversation's fixed map operation:
one immutable task template plus one path, with a fresh worker for each input.
[Official subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents)
describes subagent workflows and configurable agents. Runtime tool schemas remain
the authority for actual callable controls. 