import importlib.util
import json
from pathlib import Path
import tempfile
import unittest


ROOT = Path(__file__).parents[1]
SCRIPT = ROOT / "scripts" / "strip_tool_outputs.py"
SPEC = importlib.util.spec_from_file_location("strip_tool_outputs", SCRIPT)
FILTER = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(FILTER)


def line(record):
    return json.dumps(record, separators=(",", ":"), ensure_ascii=False).encode() + b"\n"


def record(record_type, payload):
    return {"timestamp": "2026-01-01T00:00:00Z", "type": record_type, "payload": payload}


class StripToolOutputsTests(unittest.TestCase):
    def run_filter(self, records):
        directory = tempfile.TemporaryDirectory()
        root = Path(directory.name)
        source = root / "input.jsonl"
        output = root / "output.jsonl"
        report = root / "report.json"
        source.write_bytes(b"".join(line(item) for item in records))
        before = source.read_bytes()
        result = FILTER.filter_rollout(source, output, report)
        self.assertEqual(source.read_bytes(), before)
        self.assertEqual(json.loads(report.read_text()), result)
        self.addCleanup(directory.cleanup)
        return before, output.read_bytes(), result

    def test_removes_raw_outputs_and_completed_tool_presentations_but_keeps_calls(self):
        records = [
            record("session_meta", {"id": "session"}),
            record("response_item", {"type": "function_call", "name": "exec", "arguments": "keep-call"}),
            record("response_item", {"type": "function_call_output", "output": "raw-function-sentinel"}),
            record("response_item", {"type": "custom_tool_call", "name": "shell", "input": "keep-custom-call"}),
            record("response_item", {"type": "custom_tool_call_output", "output": "raw-custom-sentinel"}),
            record("response_item", {"type": "tool_search_call", "arguments": "keep-search-call"}),
            record("response_item", {"type": "tool_search_output", "output": "raw-search-sentinel"}),
            record("response_item", {"type": "image_generation_call", "revised_prompt": "combined-call", "result": "raw-image-sentinel"}),
            record("event_msg", {"type": "item_completed", "item": {"type": "CommandExecution", "stdout": "ui-command-sentinel"}}),
            record("event_msg", {"type": "item_completed", "item": {"type": "Extension", "results": ["ui-search-sentinel"]}}),
            record("event_msg", {"type": "item_started", "item": {"type": "FunctionCallOutput", "output": "ui-function-sentinel"}}),
            record("event_msg", {"type": "item_completed", "item": {"type": "AgentMessage", "content": [{"text": "keep-message"}]}}),
        ]
        _, output, report = self.run_filter(records)
        for sentinel in (
            b"raw-function-sentinel",
            b"raw-custom-sentinel",
            b"raw-search-sentinel",
            b"raw-image-sentinel",
            b"ui-command-sentinel",
            b"ui-search-sentinel",
            b"ui-function-sentinel",
        ):
            self.assertNotIn(sentinel, output)
        for retained in (b"keep-call", b"keep-custom-call", b"keep-search-call", b"keep-message"):
            self.assertIn(retained, output)
        self.assertEqual(report["removed"]["whole_records"], 7)
        self.assertEqual(report["inventory"]["tool_calls_retained"], {
            "custom_tool_call": 1,
            "function_call": 1,
            "tool_search_call": 1,
        })
        self.assertFalse(report["policy"]["resumable_codex_rollout"])
        self.assertTrue(report["policy"]["combined_call_result_items_removed"])

    def test_filters_every_compaction_and_keeps_metadata_aligned(self):
        first_history = [
            {"type": "message", "role": "user", "content": [{"text": "keep-user"}]},
            {"type": "function_call", "name": "exec", "arguments": "keep-call"},
            {"type": "function_call_output", "output": "nested-output-one"},
            {"type": "reasoning", "summary": []},
        ]
        second_history = [
            {"type": "message", "role": "assistant", "content": [{"text": "keep-assistant"}]},
            {"type": "future_tool_output", "output": "nested-output-two"},
            {"type": "image_generation_call", "status": "completed", "result": "nested-image-output"},
            {"type": "compaction", "encrypted_content": "keep-opaque"},
        ]
        records = [
            record("compacted", {
                "message": "keep-summary",
                "replacement_history": first_history,
                "replacement_history_metadata": ["m0", "m1", "m2", "m3"],
            }),
            record("compacted", {"message": "", "replacement_history": second_history}),
        ]
        _, output, report = self.run_filter(records)
        decoded = [json.loads(raw) for raw in output.splitlines()]
        self.assertEqual(
            [item["type"] for item in decoded[0]["payload"]["replacement_history"]],
            ["message", "function_call", "reasoning"],
        )
        self.assertEqual(decoded[0]["payload"]["replacement_history_metadata"], ["m0", "m1", "m3"])
        self.assertEqual(
            [item["type"] for item in decoded[1]["payload"]["replacement_history"]],
            ["message", "compaction"],
        )
        self.assertEqual(decoded[0]["payload"]["message"], "keep-summary")
        self.assertIn(b"keep-opaque", output)
        self.assertNotIn(b"nested-output-one", output)
        self.assertNotIn(b"nested-output-two", output)
        self.assertNotIn(b"nested-image-output", output)
        self.assertEqual(report["compaction"], {
            "records_seen": 2,
            "records_rewritten": 2,
            "summary_messages_retained": 1,
        })
        self.assertEqual(report["removed"]["nested_compaction_items"], 3)

    def test_removes_legacy_tool_result_events(self):
        records = [
            record("event_msg", {"type": "patch_apply_end", "stdout": "legacy-one"}),
            record("event_msg", {"type": "some_tool_call_response", "result": "legacy-two"}),
            record("event_msg", {"type": "exec_command_output_delta", "chunk": "legacy-three"}),
            record("event_msg", {"type": "turn_diff", "unified_diff": "legacy-four"}),
            record("event_msg", {"type": "collab_agent_interaction_end", "status": "legacy-five"}),
            record("event_msg", {"type": "agent_message", "message": "keep"}),
        ]
        _, output, report = self.run_filter(records)
        self.assertNotIn(b"legacy-one", output)
        self.assertNotIn(b"legacy-two", output)
        self.assertNotIn(b"legacy-three", output)
        self.assertNotIn(b"legacy-four", output)
        self.assertNotIn(b"legacy-five", output)
        self.assertIn(b"keep", output)
        self.assertEqual(report["removed"]["whole_records"], 5)

    def test_misaligned_compaction_metadata_fails_without_output(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "input.jsonl"
            output = root / "output.jsonl"
            source.write_bytes(line(record("compacted", {
                "replacement_history": [
                    {"type": "message", "role": "user"},
                    {"type": "function_call_output", "output": "secret"},
                ],
                "replacement_history_metadata": [{}],
            })))
            with self.assertRaisesRegex(FILTER.FilterError, "must align"):
                FILTER.filter_rollout(source, output)
            self.assertFalse(output.exists())

    def test_orphaned_compaction_metadata_fails_without_output(self):
        for history in ("absent", None):
            with self.subTest(history=history), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                source = root / "input.jsonl"
                output = root / "output.jsonl"
                payload = {"replacement_history_metadata": [{}]}
                if history is None:
                    payload["replacement_history"] = None
                source.write_bytes(line(record("compacted", payload)))
                with self.assertRaisesRegex(FILTER.FilterError, "requires"):
                    FILTER.filter_rollout(source, output)
                self.assertFalse(output.exists())

    def test_unknown_turn_item_and_raw_response_items_fail_closed(self):
        cases = [
            record("event_msg", {"type": "item_completed", "item": {"type": "FutureResult", "value": "secret"}}),
            record("event_msg", {"type": "future_combined_result", "value": "secret"}),
            record("event_msg", {"type": "raw_response_item", "item": {"type": "function_call_output", "output": "secret"}}),
            record("response_item", {"type": "future_combined_result", "value": "secret"}),
            record("raw_response_item", {"opaque": "secret"}),
        ]
        for index, candidate in enumerate(cases):
            with self.subTest(index=index), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                source = root / "input.jsonl"
                output = root / "output.jsonl"
                source.write_bytes(line(candidate))
                with self.assertRaises(FILTER.FilterError):
                    FILTER.filter_rollout(source, output)
                self.assertFalse(output.exists())

    def test_malformed_duplicate_and_existing_destination_fail_closed(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            output = root / "output.jsonl"
            for name, source_bytes in (
                ("malformed", b'{"type":"event_msg"\n'),
                ("duplicate", b'{"type":"event_msg","type":"response_item","payload":{}}\n'),
            ):
                source = root / f"{name}.jsonl"
                source.write_bytes(source_bytes)
                with self.subTest(name=name), self.assertRaises(FILTER.FilterError):
                    FILTER.filter_rollout(source, output)
                self.assertFalse(output.exists())

            source = root / "valid.jsonl"
            source.write_bytes(line(record("session_meta", {"id": "session"})))
            output.write_text("do-not-overwrite")
            with self.assertRaisesRegex(FILTER.FilterError, "already exists"):
                FILTER.filter_rollout(source, output)
            self.assertEqual(output.read_text(), "do-not-overwrite")

    def test_untouched_lines_are_byte_identical_and_run_is_deterministic(self):
        retained = line(record("response_item", {
            "type": "message", "role": "assistant", "content": [{"text": "x" * 100_000}]
        }))
        removed = line(record("response_item", {
            "type": "function_call_output", "output": "y" * 100_000
        }))
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "input.jsonl"
            first = root / "first.jsonl"
            second = root / "second.jsonl"
            source.write_bytes(retained + removed)
            first_report = FILTER.filter_rollout(source, first)
            second_report = FILTER.filter_rollout(source, second)
            self.assertEqual(first.read_bytes(), retained)
            self.assertEqual(first.read_bytes(), second.read_bytes())
            self.assertEqual(first_report["output"]["sha256"], second_report["output"]["sha256"])


if __name__ == "__main__":
    unittest.main()
