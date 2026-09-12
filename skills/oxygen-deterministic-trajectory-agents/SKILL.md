---
name: oxygen-deterministic-trajectory-agents
description: Generate a readable thematic summary, label its lines with Python, and run fresh insight and privacy-redaction agents using fixed calls with one input path. Accepts frozen JSON/JSONL trajectories or existing Markdown summaries. Controls invocation, not deterministic model prose.
---

# Deterministic summary and insight agents

Use this skill from its location in the contributor kit. Supply one path: a frozen
JSON/JSONL trajectory or an existing Markdown summary. For output-free trajectory
analysis, first use
[oxygen-strip-trajectory-tool-outputs](../oxygen-strip-trajectory-tool-outputs/SKILL.md).
For a readability rewrite of an existing summary, pass that .md file directly;
it becomes the sole factual source.

Protocol v3 separates readable summary writing, mechanical labeling, insight
generation, and privacy editing. The reader sees Markdown with an overview and
topic sections. A separate labeled copy provides evidence addresses.

## Fixed calls and context

All three agents use `collaboration.spawn_agent`, `fork_turns="none"`,
`model="gpt-5.6-sol"`, and `reasoning_effort="medium"`. These are the
skill-selected defaults. Check tool support before dispatch; do not substitute
settings or tools within a batch.

The helper embeds the complete repository prompts verbatim:
[summary-and-insight.md](../../prompts/summary-and-insight.md) now produces only a
readable summary; [insight-from-summary.md](../../prompts/insight-from-summary.md)
allows consulting the frozen trajectory and revising the summary before deriving
insights; and [sensitive-redaction.md](../../prompts/sensitive-redaction.md) edits the
final summary, its labeled copy, and insights together.

The complete access and output contracts are
[summary-worker.md](references/summary-worker.md),
[insight-worker.md](references/insight-worker.md), and
[redaction-worker.md](references/redaction-worker.md).
Use helper-generated arguments exactly. Per stage, the sole variable in the message
is the final JSON-encoded `input_path`; the task name is derived from that path.
Paths must be passed as data or separate subprocess arguments.

Fresh context excludes parent conversation history. Host system/developer
instructions, tools, workspace, and sandbox still apply. File-access restrictions
are instructions, not an independently enforced sandbox. The model alias does not
guarantee an immutable backend or identical prose. Keep host settings consistent
throughout a batch.

## Run one input

Run these commands from this skill's directory, substituting the same INPUT path:

1. `python3 scripts/trajectory_agents.py prepare INPUT`
   creates INPUT.oxygen-agents/, freezes the input, and records configuration and
   source hashes. Existing runs are refused.
2. `python3 scripts/trajectory_agents.py summary-call INPUT`
   returns the exact arguments for a fresh summary worker. Pass them unchanged to
   `collaboration.spawn_agent`; record its ID and wait for its final status.
3. After worker status `complete`, run
   `python3 scripts/trajectory_agents.py accept-summary INPUT`.
   This validates the readable summary, runs the Python labeler, and freezes the
   hashes of both summary files. No insight call is allowed before this succeeds.
4. `python3 scripts/trajectory_agents.py insight-call INPUT`
   copies the accepted summary and labels into insight/ and returns a fresh
   worker's arguments. The worker reads those working copies and may consult the
   frozen trajectory to revise insight/summary.md. It executes the supplied Python
   labeler after any revision, then writes insight/insight.md against the new IDs.
   The summary/ files remain the immutable first draft. After it completes, run
   `python3 scripts/trajectory_agents.py accept-insight INPUT`.
   This freezes the final trio together and validates exact summary/label
   correspondence and evidence IDs. Empty insights are valid. Markdown-only inputs
   provide source.md as evidence; they do not make an original trajectory available.
5. For privacy-edited outputs, run
   `python3 scripts/trajectory_agents.py redaction-call INPUT` and dispatch a new
   worker. It reads only the three accepted insight/ files. It writes the
   readable redacted summary, runs the supplied labeler, then writes redacted
   insights citing those new labels. After worker status `complete`, run
   `python3 scripts/trajectory_agents.py accept-redaction INPUT`.
   A full privacy pipeline finishes with `run_complete: true`.

If only summary and insight generation is requested, stop after accept-insight and
report those stages complete; the manifest's overall complete flag remains false
until privacy editing is completed.

The helper never calls a model. Saved *-call.json files record intended arguments;
the host tool log is the authority for actual dispatch. Model-written prose and
semantic support still require review; the helper checks structure and integrity.

## Labeling contract

For a standalone readable Markdown file:

```bash
python3 scripts/label_summary_lines.py summary.md summary_labeled.md
```

The labeler prepends `L001 `, `L002 `, etc. to every physical line, including
headings and blank lines. It splits only on LF, preserves LF/CRLF and a final line
without a newline, and adds no phantom line after a terminal newline. Unicode,
Markdown indentation, and content bytes are preserved after removing the prefixes.
A wrapped paragraph therefore has multiple IDs; summary writers use one physical
line per paragraph or list item for readable evidence units.

Output must be a new file; input is never overwritten. The helper reports counts
and hashes without content and creates the output with mode 0600. Blank and heading
IDs are navigation only; insights cite content lines. Existing numbers from the
source summary have no authority in the new representation.

Once labeled, freeze the readable summary and labeled copy together. Any edit,
reordering, or deletion requires new labels and regenerated or remapped insight
references. The pipeline checks exact byte correspondence and hashes at every handoff.
The insight stage is the authorized revision window for its working copy; the
accepted first draft and all completed stage outputs remain immutable. Both the
insight and redaction calls supply the same deterministic label_summary_lines.py
command as a fixed JSON argv prefix. Workers remove only their own derived labeled
copy when regenerating it and pass paths as separate subprocess arguments.

## Outputs and failures

Successful full runs contain:

- summary/summary.md and summary/summary_labeled.md;
- insight/summary.md, insight/summary_labeled.md, and insight/insight.md (the final
  unredacted outputs, even when the summary did not need revision);
- redaction/summary_redacted.md, redaction/summary_redacted_labeled.md,
  and redaction/insight_redacted.md;
- source.md for an imported summary, or trajectory.json for a trajectory;
- fixed call records and manifest.json with counts and hashes.

Directories use 0700; files use 0600. Report counts and paths without private prose.
Original-contributor review is required before release. Structural validation does
not establish factual fidelity or privacy completeness.

For batches, canonicalize, deduplicate, and sort input paths. Use matching
configuration hashes and a default limit of three active workers unless the user
sets a task-specific limit. Cap the requested limit at available host capacity;
this skill cannot raise the host's concurrency ceiling. Record requested and
effective limits in the task's local execution record, without changing global
settings. Dispatch eligible items in path order. A single trajectory's three
stages run sequentially regardless of the limit. Use a fresh worker for each stage;
never reuse earlier agent context.

Issuing a stage twice is refused. If dispatch is uncertain, reconcile the saved
request and parent call log rather than spawning a duplicate. Invalid output or
changed source, prompt, labeler, or configuration stops that item. Preserve failed
artifacts; do not repair prose in the parent or silently retry. Other items may
continue. A stale .operation-lock requires reconciliation before further mutation.

Protocol v1/v2 runs and previously published Gxxx/Lxxx artifacts are historical outputs.
Their configuration is not resumable under v3. Prepare a new input location to
regenerate; do not edit old manifests to bypass the guard. The existing review-app
seed importer uses the historical format and needs a separate adapter before
importing v3 artifacts. This skill does not alter a deployed review collection.
