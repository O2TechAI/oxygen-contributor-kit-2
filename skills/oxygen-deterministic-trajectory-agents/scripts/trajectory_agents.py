#!/usr/bin/env python3
"""Prepare and validate fixed Oxygen subagent dispatches; never invoke a model."""

import argparse
import hashlib
import importlib.util
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
PROTOCOL_VERSION = 3
STAGES = {
    "summary": ("summary-and-insight.md", ("summary.md", "summary_labeled.md")),
    "insight": ("insight-from-summary.md", ("summary.md", "summary_labeled.md", "insight.md")),
    "redaction": ("sensitive-redaction.md", (
        "summary_redacted.md", "summary_redacted_labeled.md", "insight_redacted.md",
    )),
}
LABEL_SCRIPT = SKILL / "scripts" / "label_summary_lines.py"
LABEL_SPEC = importlib.util.spec_from_file_location("oxygen_label_summary", LABEL_SCRIPT)
LABEL = importlib.util.module_from_spec(LABEL_SPEC)
LABEL_SPEC.loader.exec_module(LABEL)



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
    helper = b""
    if stage in {"insight", "redaction"}:
        helper = b"\n# Label helper command (JSON argv prefix)\n" + encode(["python3", str(LABEL_SCRIPT)])
    return wrapper + b"\n" + prompt + helper + b"\n\n# Per-item input (JSON data)\n"


def configuration():
    return {
        "protocol_version": PROTOCOL_VERSION,
        "tool": "collaboration.spawn_agent",
        "model": MODEL, "reasoning_effort": EFFORT, "fork_turns": "none",
        "helper_sha256": sha(Path(__file__).read_bytes()),
        "labeler_sha256": sha(LABEL_SCRIPT.read_bytes()),
        "template_sha256": {stage: sha(fixed_template(stage)) for stage in STAGES},
        "prompt_sha256": {stage: sha((KIT / "prompts" / STAGES[stage][0]).read_bytes()) for stage in STAGES},
        "tools_and_sandbox": "inherited from the host; not independently configurable by this tool",
    }


def call_arguments(stage, source):
    return {
        "task_name": f"oxygen_{stage}_{sha(os.fsencode(str(source)))[:16]}",
        "fork_turns": "none", "model": MODEL, "reasoning_effort": EFFORT,
        "message": fixed_template(stage).decode("utf-8")
        + json.dumps({"input_path": str(source)}, ensure_ascii=True, sort_keys=True) + "\n",
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
    if source.suffix.lower() not in {".json", ".jsonl", ".md"}:
        raise RunError("expected_json_jsonl_or_markdown")
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
        elif source.suffix.lower() == ".json":
            json.loads(data)
        else:
            data.decode("utf-8")
    except (ValueError, UnicodeError, RecursionError) as exc:
        raise RunError("malformed_input") from exc
    config = configuration()
    run.mkdir(mode=0o700)
    run.chmod(0o700)
    for stage in STAGES:
        directory = run / stage
        directory.mkdir(mode=0o700)
        directory.chmod(0o700)
    frozen_name = "source.md" if source.suffix.lower() == ".md" else "trajectory.json"
    write_new(run / frozen_name, data)
    manifest = {
        "input_path": str(source), "input_sha256": sha(data), "input_bytes": len(data),
        "configuration": config, "frozen_file": frozen_name, "stages": {}, "complete": False,
    }
    save_manifest(run, manifest)
    return {"run_directory": str(run), "input_sha256": sha(data), "input_bytes": len(data)}


def load_run(source, run):
    manifest = json.loads(read_regular(run / "manifest.json"))
    if manifest["configuration"] != configuration():
        raise RunError("fixed_configuration_changed")
    if manifest["input_path"] != str(source):
        raise RunError("input_path_mismatch")
    frozen_name = "source.md" if source.suffix.lower() == ".md" else "trajectory.json"
    if manifest["frozen_file"] != frozen_name:
        raise RunError("frozen_path_mismatch")
    for path in (source, run / frozen_name):
        data = read_regular(path)
        if len(data) != manifest["input_bytes"] or sha(data) != manifest["input_sha256"]:
            raise RunError("input_hash_mismatch")
    return manifest


def validate_summary(data, allow_empty=False):
    text = data.decode("utf-8").replace("\r\n", "\n")
    if not text.strip():
        if allow_empty:
            return
        raise RunError("empty_summary")
    entries = list(LABEL.markdown_lines(data))
    if re.search(r"(?m)^(?:L\d{3,}\s|#{1,6}\s+G\d{3,}\s*$|Lines: L\d)", text):
        raise RunError("summary_must_be_unlabeled")
    top = [(index, line.strip()) for index, (kind, line) in enumerate(entries)
           if kind == "heading" and re.match(r"^ {0,3}#\s", line)]
    if len(top) != 2 or [line for _, line in top] != ["# Overview", "# Detailed summary"]:
        raise RunError("invalid_readable_summary_sections")
    overview, detailed = top[0][0], top[1][0]
    if any(line.strip() for _, line in entries[:overview]):
        raise RunError("invalid_readable_summary_sections")
    if not any(kind == "content" for kind, _ in entries[overview + 1:detailed]):
        raise RunError("empty_readable_summary_section")
    topics = [index for index, (kind, line) in enumerate(entries)
              if index > detailed and kind == "heading" and re.match(r"^ {0,3}##\s", line)]
    if not topics or any(not any(kind == "content" for kind, _ in entries[start + 1:end])
                         for start, end in zip(topics, topics[1:] + [len(entries)])):
        raise RunError("empty_or_missing_summary_topics")
    # Human fidelity and quality of thematic organization still need review.


def validate_insights(data, summary):
    text = data.decode("utf-8")
    ids = LABEL.evidence_lines(summary)
    chunks = re.split(r"(?m)^# (I\d{3,})\s*$", text)
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
    if not summary.strip() and text.strip():
        raise RunError("insights_without_summary")
    return (len(chunks) - 1) // 2


def validate_outputs(run, stage):
    directory = run / stage
    names = STAGES[stage][1]
    if {p.name for p in directory.iterdir()} != set(names):
        raise RunError("unexpected_output_files")
    data = {name: read_regular(directory / name) for name in names}
    count = 0
    summary = data[names[0]]
    validate_summary(summary, allow_empty=stage == "redaction")
    if data[names[1]] != LABEL.label_bytes(summary):
        raise RunError("labeled_summary_mismatch")
    if stage in {"insight", "redaction"}:
        count = validate_insights(data[names[2]], summary)
    for name in names:
        (directory / name).chmod(0o600)
    return {
        "sha256": {name: sha(data[name]) for name in names},
        "summary_lines": len(LABEL.physical_lines(summary)),
        "evidence_lines": len(LABEL.evidence_lines(summary)),
        "insights": count,
    }


def prepare_summary_labels(run):
    directory = run / "summary"
    names = {p.name for p in directory.iterdir()}
    if names not in ({"summary.md"}, set(STAGES["summary"][1])):
        raise RunError("unexpected_output_files")
    validate_summary(read_regular(directory / "summary.md"))
    if names == {"summary.md"}:
        LABEL.label_file(directory / "summary.md", directory / "summary_labeled.md")


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
    if validate_outputs(run, stage) != state["outputs"]:
        raise RunError(f"{stage}_outputs_changed")


def issue_call(value, stage):
    def issue(source, run, manifest):
        if stage in manifest["stages"]:
            raise RunError("dispatch_already_issued_reconcile_existing_agent")
        for previous in list(STAGES)[:list(STAGES).index(stage)]:
            verify_completed(run, manifest, previous)
        if stage == "insight":
            # Preserve the accepted first draft; revisions belong to the insight stage.
            if any((run / "insight").iterdir()):
                raise RunError("insight_workspace_not_empty")
            for name in STAGES["summary"][1]:
                write_new(run / "insight" / name, read_regular(run / "summary" / name))
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
        for previous in list(STAGES)[:list(STAGES).index(stage)]:
            verify_completed(run, manifest, previous)
        if stage == "summary":
            prepare_summary_labels(run)
        outputs = validate_outputs(run, stage)
        if state.get("status") == "complete" and outputs != state["outputs"]:
            raise RunError("completed_outputs_changed")
        state.update(status="complete", outputs=outputs)
        manifest["complete"] = stage == "redaction" or manifest["complete"]
        save_manifest(run, manifest)
        return {"stage": stage, "status": "complete", **outputs, "run_complete": manifest["complete"]}
    return locked(value, finish)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("prepare", "summary-call", "accept-summary", "insight-call", "accept-insight", "redaction-call", "accept-redaction"))
    parser.add_argument("input_path", help="The only per-item parameter; a frozen JSON/JSONL trajectory or existing Markdown summary")
    args = parser.parse_args(argv)
    try:
        if args.action == "prepare":
            result = prepare(args.input_path)
        elif args.action.endswith("-call"):
            result = issue_call(args.input_path, args.action.removesuffix("-call"))
        else:
            result = accept(args.input_path, args.action.removeprefix("accept-"))
        print(encode(result).decode(), end="")
        return 0
    except (RunError, OSError, ValueError, KeyError, UnicodeError) as exc:
        # Avoid printing arbitrary source data or parser excerpts.
        reason = str(exc) if isinstance(exc, RunError) else type(exc).__name__
        print(json.dumps({"status": "error", "reason": reason}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
