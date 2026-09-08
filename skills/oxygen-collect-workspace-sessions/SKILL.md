---
name: oxygen-collect-workspace-sessions
description: Discover main Codex sessions for a designated workspace and its subfolders, exclude subagent rollouts, and prepare private JSONL snapshots with a manifest for oxygen-strip-trajectory-tool-outputs. Use when collecting workspace session history from active and archived local Codex storage.
---

# Collect workspace sessions

Prepare separate local snapshots of all matching main sessions. Session membership comes from
the initial `session_meta.payload.cwd`, including descendant directories, rather than paths
mentioned in conversation or later directory changes. All `source.subagent` variants are
excluded; recognized main sources are `cli`, `vscode`, and `exec`.

## Collect

Resolve the designated workspace from the request. Resolve a new private output directory whose
parent exists, outside Codex session storage. Run the helper relative to this skill's directory:

```bash
python3 scripts/collect_workspace_sessions.py \
  --workspace /absolute/workspace \
  --output-dir /absolute/private-output
```

The helper searches `sessions` and `archived_sessions` beneath `$CODEX_HOME`, falling back to
`~/.codex`. Use `--codex-home` for another local store. `--dry-run` discovers matching paths
without copying or writing files; `--output-dir` is optional in that mode.

Inspect the content-free manifest emitted to stdout and saved as `manifest.json`. Summarize
selection and exclusion counts, incomplete collection errors, and the output location without
opening conversation text. Zero matches is a successful empty result. Missing active storage,
unknown metadata, unreadable paths, and snapshot failures make collection incomplete and return
a nonzero exit status; successfully captured sessions remain available in the manifest. Missing
archive storage is acceptable. Symlink files and directories are skipped with errors.

## Snapshot contract

Each snapshot preserves the source bytes through the last complete newline within the size
observed when the source was opened. Later appends are allowed. A second prefix read checks its
hash; observed replacement, truncation, metadata changes, or prefix edits reject that snapshot.
This checks an append-only file without locking the live writer; it is not a transactional
snapshot of the whole store. Sessions created after discovery require another collection.

`sessions` entries record the source path, session ID, recorded working directory, relative
`snapshot_path`, SHA-256, and byte length. `source_locations` records each source's initial size
and omitted trailing bytes. Byte-identical prefixes with the same session ID share one snapshot;
differing prefixes remain separate. Dry-run entries contain discovery metadata only and do not
claim snapshot integrity or deduplication. Directories are private (`0700`), files are `0600`,
and existing output destinations are refused.

## Handoff

For each prepared manifest entry, resolve `snapshot_path` relative to the collection directory.
Follow [oxygen-strip-trajectory-tool-outputs](../oxygen-strip-trajectory-tool-outputs/SKILL.md)
using that snapshot as its input and new private output/report paths. For example, from this
skill's directory:

```bash
python3 ../oxygen-strip-trajectory-tool-outputs/scripts/strip_tool_outputs.py \
  /absolute/private-output/snapshots/SNAPSHOT.jsonl \
  --output /absolute/private-output/SNAPSHOT.stripped.jsonl \
  --report /absolute/private-output/SNAPSHOT.report.json
```

Collection ends with snapshots and the manifest; run stripping when requested. The stripper
owns structural validation and explicit tool-output removal. Collection validates only the
initial metadata; a captured session may still be rejected by the stripper. Source files and
Codex databases remain untouched. Raw snapshots retain conversation text and tool results.

Keep all artifacts local and unapproved for release. Apply the existing contributor-review
workflow before release:

> Best-effort redaction v0.1; no formal anonymity guarantee. Original-contributor final review is required before release.
