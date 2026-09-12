#!/usr/bin/env python3
"""Prepare and validate fixed Oxygen subagent dispatches; never invoke a model."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import sys
import tempfile


SKILL = Path(__file__).resolve().parents[1]
KIT = SKILL.parents[1]
MODEL = "gpt-5.6-sol"
EFFORT = "medium"
PROTOCOL_VERSION = 1
STAGES = {
    "summary": ("summary-and-insight.md", ("summary.md", "insight.md")),
    "redaction": ("sensitive-redaction.md", ("summary_redacted.md", "insight_redacted.md")),
}


class RunError(ValueError):
    pass


def sha(data):
    return hashlib.sha256(data).hexdigest()


def encode(value):
    return (json.dumps(value, sort_keys=True, indent=2, ensure_ascii=True) + "\n").encode()


def read_regular(path):
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(fd, "rb") as stream:
        before = os.fstat(stream.fileno())
        if not stat.S_ISREG(before.st_mode):
            raise RunError("input_not_regular")
        data = stream.read()
        after = os.fstat(stream.fileno())
    at_path = path.lstat()
    signature = lambda s: (s.st_dev, s.st_ino, s.st_size, s.st_mtime_ns)
    if signature(before) != signature(after) or signature(before) != signature(at_path):
        raise RunError("input_changed_during_read")
    return data


def paths(value):
    # Resolve aliases once; store only the canonical path in every call.
    supplied = Path(value).expanduser()
    if supplied.is_symlink():
        raise RunError("input_symlink")
    source = supplied.resolve(strict=False)
    return source, Path(str(source) + ".oxygen-agents")


def fixed_template(stage):
    wrapper = (SKILL / "references" / f"{stage}-worker.md").read_bytes()
    prompt = (KIT / "prompts" / STAGES[stage][0]).read_bytes()
    # Preserve the exact prompt file inside the message, including its final newline.
    return wrapper + b"\n" + prompt + b"\n\n# Per-item input (JSON data)\n"


def configuration():
    return {
        "protocol_version": PROTOCOL_VERSION,
        "tool": "collaboration.spawn_agent",
        "model": MODEL, "reasoning_effort": EFFORT, "fork_turns": "none",
        "helper_sha256": sha(Path(__file__).read_bytes()),
        "template_sha256": {stage: sha(fixed_template(stage)) for stage in STAGES},
        "prompt_sha256": {stage: sha((KIT / "prompts" / STAGES[stage][0]).read_bytes()) for stage in STAGES},
        "tools_and_sandbox": "inherited from the host; not independently configurable by this tool",
    }


def call_arguments(stage, source):
    return {
        "task_name": f"oxygen_{stage}_{sha(os.fsencode(str(source)))[:16]}",
        "fork_turns": "none", "model": MODEL, "reasoning_effort": EFFORT,
        "message": fixed_template(stage).decode("utf-8")
        + json.dumps({"input_json_path": str(source)}, ensure_ascii=True, sort_keys=True) + "\n",
    }


def write_new(path, data):
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "wb") as stream:
        os.fchmod(stream.fileno(), 0o600)
        stream.write(data)
        stream.flush()
        os.fsync(stream.fileno())


def save_manifest(run, manifest):
    fd, name = tempfile.mkstemp(dir=run, prefix=".manifest-")
    temporary = Path(name)
    try:
        with os.fdopen(fd, "wb") as stream:
            os.fchmod(stream.fileno(), 0o600)
            stream.write(encode(manifest))
            stream.flush()
            os.fsync(stream.fileno())
        temporary.replace(run / "manifest.json")
    finally:
        temporary.unlink(missing_ok=True)


def prepare(value):
    source, run = paths(value)
    if source.suffix.lower() not in {".json", ".jsonl"}:
        raise RunError("expected_json_or_jsonl")
    # Live rollouts must first be frozen by the collector; no analysis under live storage.
    if ".codex" in source.parts and any(part in source.parts for part in ("sessions", "archived_sessions")):
        raise RunError("collect_live_rollout_first")
    data = read_regular(source)
    if not data.strip():
        raise RunError("empty_input")
    try:
        if source.suffix.lower() == ".jsonl":
            for line in data.splitlines():
                json.loads(line)
        else:
            json.loads(data)
    except (ValueError, UnicodeError, RecursionError) as exc:
        raise RunError("malformed_input") from exc
    config = configuration()
    run.mkdir(mode=0o700)
    run.chmod(0o700)
    for stage in STAGES:
        directory = run / stage
        directory.mkdir(mode=0o700)
        directory.chmod(0o700)
    write_new(run / "trajectory.json", data)
    manifest = {
        "input_json_path": str(source), "input_sha256": sha(data), "input_bytes": len(data),
        "configuration": config, "stages": {}, "complete": False,
    }
    save_manifest(run, manifest)
    return {"run_directory": str(run), "input_sha256": sha(data), "input_bytes": len(data)}


def load_run(source, run):
    manifest = json.loads(read_regular(run / "manifest.json"))
    if manifest["configuration"] != configuration():
        raise RunError("fixed_configuration_changed")
    if manifest["input_json_path"] != str(source):
        raise RunError("input_path_mismatch")
    for path in (source, run / "trajectory.json"):
        data = read_regular(path)
        if len(data) != manifest["input_bytes"] or sha(data) != manifest["input_sha256"]:
            raise RunError("input_hash_mismatch")
    return manifest


def summary_lines(text):
    """Accept legacy flat summaries and validate the current three-level format."""
    if not text.startswith("# Trajectory summary\n"):
        return text.splitlines()
    sections = re.split(r"(?m)^# (Trajectory summary|Summary groups|Summary lines)\s*$", text)
    if len(sections) != 7 or sections[1::2] != ["Trajectory summary", "Summary groups", "Summary lines"]:
        raise RunError("invalid_summary_sections")
    paragraph = sections[2].strip()
    if not paragraph or re.search(r"\n\s*\n|(?m:^#)", paragraph):
        raise RunError("invalid_trajectory_summary")
    lines = [line for line in sections[6].splitlines() if line.strip()]
    groups = re.split(r"(?m)^## (G\d{3,})\s*$", sections[4])
    if groups[0].strip() or len(groups) < 3 or len(groups) % 2 != 1:
        raise RunError("invalid_summary_groups")
    next_line = 1
    for number in range(1, (len(groups) + 1) // 2):
        identifier, body = groups[2 * number - 1:2 * number + 1]
        match = re.fullmatch(r"\s*Lines: (L\d{3,})-(L\d{3,})\s*\n\s*\n(.+?)\s*", body, re.DOTALL)
        if identifier != f"G{number:03d}" or not match:
            raise RunError("invalid_summary_groups")
        start, end = int(match[1][1:]), int(match[2][1:])
        if match[1] != f"L{next_line:03d}" or end < start or end > len(lines) or match[2] != f"L{end:03d}":
            raise RunError("invalid_group_coverage")
        if not match[3].strip() or re.search(r"\n\s*\n|(?m:^#)", match[3].strip()):
            raise RunError("invalid_group_summary")
        next_line = end + 1
    if next_line != len(lines) + 1:
        raise RunError("invalid_group_coverage")
    return lines


def validate_pair(directory, stage):
    names = STAGES[stage][1]
    if {p.name for p in directory.iterdir()} != set(names):
        raise RunError("unexpected_output_files")
    data = {name: read_regular(directory / name) for name in names}
    text = [data[name].decode("utf-8") for name in names]
    lines = summary_lines(text[0])
    ids = []
    for number, line in enumerate(lines, 1):
        match = re.fullmatch(r"(L\d{3,})\s+\S.*", line)
        if not match or match[1] != f"L{number:03d}":
            raise RunError("invalid_summary_line_ids")
        ids.append(match[1])
    chunks = re.split(r"(?m)^# (I\d{3,})\s*$", text[1])
    if chunks[0].strip() or len(chunks) % 2 != 1:
        raise RunError("invalid_insight_format")
    for number in range(1, (len(chunks) + 1) // 2):
        identifier, body = chunks[2 * number - 1:2 * number + 1]
        if identifier != f"I{number:03d}":
            raise RunError("invalid_insight_ids")
        evidence = re.findall(r"(?m)^Evidence: (.+)$", body)
        if len(evidence) != 1:
            raise RunError("invalid_evidence_declaration")
        refs = [ref.strip() for ref in evidence[0].split(",")]
        if not refs or not set(refs) <= set(ids) or len(set(refs)) != len(refs):
            raise RunError("invalid_evidence_references")
        if not re.sub(r"(?m)^Evidence: .+$", "", body).strip():
            raise RunError("empty_insight")
    if stage == "summary" and not ids:
        raise RunError("empty_summary")
    if not ids and text[1].strip():
        raise RunError("insights_without_summary")
    for name in names:
        (directory / name).chmod(0o600)
    return {"sha256": {name: sha(data[name]) for name in names},
            "summary_lines": len(ids), "insights": (len(chunks) - 1) // 2}


def locked(value, action):
    source, run = paths(value)
    lock = run / ".operation-lock"
    write_new(lock, b"")
    try:
        return action(source, run, load_run(source, run))
    finally:
        lock.unlink()


def verify_completed(run, manifest, stage):
    state = manifest["stages"].get(stage, {})
    if state.get("status") != "complete":
        raise RunError(f"{stage}_not_complete")
    if validate_pair(run / stage, stage) != state["outputs"]:
        raise RunError(f"{stage}_outputs_changed")


def issue_call(value, stage):
    def issue(source, run, manifest):
        if stage in manifest["stages"]:
            raise RunError("dispatch_already_issued_reconcile_existing_agent")
        if stage == "redaction":
            verify_completed(run, manifest, "summary")
        args = call_arguments(stage, source)
        # Save the exact call and claim before emitting it. A crash never causes a blind retry.
        write_new(run / f"{stage}-call.json", encode(args))
        manifest["stages"][stage] = {"status": "issued", "call_sha256": sha(encode(args))}
        save_manifest(run, manifest)
        return args
    return locked(value, issue)


def accept(value, stage):
    def finish(source, run, manifest):
        state = manifest["stages"].get(stage, {})
        if state.get("status") not in {"issued", "complete"}:
            raise RunError("dispatch_not_issued")
        saved = read_regular(run / f"{stage}-call.json")
        if saved != encode(call_arguments(stage, source)) or sha(saved) != state["call_sha256"]:
            raise RunError("dispatch_arguments_changed")
        if stage == "redaction":
            verify_completed(run, manifest, "summary")
        outputs = validate_pair(run / stage, stage)
        if state.get("status") == "complete" and outputs != state["outputs"]:
            raise RunError("completed_outputs_changed")
        state.update(status="complete", outputs=outputs)
        manifest["complete"] = stage == "redaction" or manifest["complete"]
        save_manifest(run, manifest)
        return {"stage": stage, "status": "complete", **outputs, "run_complete": manifest["complete"]}
    return locked(value, finish)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("prepare", "summary-call", "accept-summary", "redaction-call", "accept-redaction"))
    parser.add_argument("input_json_path", help="The only per-trajectory parameter; a frozen JSON or JSONL file")
    args = parser.parse_args(argv)
    try:
        if args.action == "prepare":
            result = prepare(args.input_json_path)
        elif args.action.endswith("-call"):
            result = issue_call(args.input_json_path, args.action.removesuffix("-call"))
        else:
            result = accept(args.input_json_path, args.action.removeprefix("accept-"))
        print(encode(result).decode(), end="")
        return 0
    except (RunError, OSError, ValueError, KeyError, UnicodeError) as exc:
        # Avoid printing arbitrary source data or parser excerpts.
        reason = str(exc) if isinstance(exc, RunError) else type(exc).__name__
        print(json.dumps({"status": "error", "reason": reason}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
