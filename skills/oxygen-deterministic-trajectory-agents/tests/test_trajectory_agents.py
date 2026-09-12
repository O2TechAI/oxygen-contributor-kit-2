import importlib.util
import json
from pathlib import Path
import stat
import tempfile
import unittest
from unittest.mock import patch


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "trajectory_agents.py"
SPEC = importlib.util.spec_from_file_location("trajectory_agents", SCRIPT)
RUN = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(RUN)


class TrajectoryAgentsTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.source = self.root / "input.jsonl"
        self.original = b'{"type":"session_meta","payload":{"id":"synthetic"}}\n'
        self.source.write_bytes(self.original)
        _, self.run = RUN.paths(self.source)

    def write_pair(self, stage, summary="L001 User requested a check.\nL002 Agent reported success.\n",
                   insights="# I001\nEvidence: L001, L002\n\nA reported outcome still needs verification.\n"):
        first, second = RUN.STAGES[stage][1]
        (self.run / stage / first).write_text(summary)
        (self.run / stage / second).write_text(insights)

    def finish_summary(self):
        RUN.prepare(self.source)
        RUN.issue_call(self.source, "summary")
        self.write_pair("summary")
        return RUN.accept(self.source, "summary")

    def test_only_path_and_derived_task_identity_vary(self):
        for stage in RUN.STAGES:
            first = RUN.call_arguments(stage, self.source)
            second = RUN.call_arguments(stage, self.root / 'spaces "quotes" {braces} $name.jsonl')
            self.assertEqual(first, RUN.call_arguments(stage, self.source))
            prefix_a, data_a = first.pop("message").rsplit("\n", 2)[:2]
            prefix_b, data_b = second.pop("message").rsplit("\n", 2)[:2]
            self.assertEqual(prefix_a, prefix_b)
            self.assertEqual(set(json.loads(data_a)), {"input_json_path"})
            self.assertEqual(set(json.loads(data_b)), {"input_json_path"})
            self.assertNotEqual(first.pop("task_name"), second.pop("task_name"))
            self.assertEqual(first, second)
            self.assertEqual(first, {"model": "gpt-5.6-sol", "reasoning_effort": "medium", "fork_turns": "none"})

    def test_repository_prompts_are_embedded_verbatim(self):
        for stage, (name, _) in RUN.STAGES.items():
            prompt = (RUN.KIT / "prompts" / name).read_bytes()
            self.assertIn(prompt, RUN.fixed_template(stage))

    def test_complete_pipeline_freezes_input_and_guards_stages(self):
        result = RUN.prepare(self.source)
        self.assertEqual(result["input_bytes"], len(self.original))
        self.assertEqual((self.run / "trajectory.json").read_bytes(), self.original)
        with self.assertRaisesRegex(RUN.RunError, "summary_not_complete"):
            RUN.issue_call(self.source, "redaction")
        call = RUN.issue_call(self.source, "summary")
        self.assertEqual(json.loads((self.run / "summary-call.json").read_bytes()), call)
        with self.assertRaisesRegex(RUN.RunError, "dispatch_already_issued"):
            RUN.issue_call(self.source, "summary")
        with self.assertRaisesRegex(RUN.RunError, "unexpected_output_files"):
            RUN.accept(self.source, "summary")
        self.write_pair("summary")
        RUN.accept(self.source, "summary")
        redaction = RUN.issue_call(self.source, "redaction")
        self.assertEqual(redaction["fork_turns"], "none")
        self.write_pair("redaction")
        result = RUN.accept(self.source, "redaction")
        self.assertTrue(result["run_complete"])
        self.assertEqual(result["summary_lines"], 2)
        self.assertEqual(result["insights"], 1)
        self.assertEqual(self.source.read_bytes(), self.original)
        self.assertTrue(json.loads((self.run / "manifest.json").read_text())["complete"])
        for path in self.run.rglob("*"):
            self.assertEqual(stat.S_IMODE(path.stat().st_mode), 0o700 if path.is_dir() else 0o600)

    def test_hierarchical_summary_and_redaction(self):
        summary = "# Trajectory summary\n\nThis segment added a verification step.\n\n# Summary groups\n\n## G001\n\nLines: L001-L001\n\nThe user requested verification.\n\n## G002\n\nLines: L002-L002\n\nThe agent reported success.\n\n# Summary lines\n\nL001 User requested a check.\nL002 Agent reported success.\n"
        RUN.prepare(self.source)
        RUN.issue_call(self.source, "summary")
        self.write_pair("summary", summary)
        self.assertEqual(RUN.accept(self.source, "summary")["summary_lines"], 2)
        RUN.issue_call(self.source, "redaction")
        self.write_pair("redaction", summary)
        self.assertTrue(RUN.accept(self.source, "redaction")["run_complete"])
        for invalid in [
            summary.replace("Lines: L002-L002", "Lines: L001-L002"),
            summary.replace("Lines: L001-L001", "Lines: L002-L002"),
            summary.replace("Lines: L002-L002", "Lines: L002-L003"),
            summary.replace("## G002", "## G003"),
            summary.replace("This segment added a verification step.", ""),
            summary.replace("The agent reported success.", ""),
            summary.replace("# Summary groups", "# Other groups"),
        ]:
            with self.subTest(invalid=invalid), self.assertRaises(RUN.RunError):
                RUN.summary_lines(invalid)

    def test_configuration_change_stops_dispatch(self):
        RUN.prepare(self.source)
        with patch.object(RUN, "EFFORT", "low"), self.assertRaisesRegex(RUN.RunError, "fixed_configuration_changed"):
            RUN.issue_call(self.source, "summary")
        original_template = RUN.fixed_template
        with patch.object(RUN, "fixed_template", side_effect=lambda stage: original_template(stage) + b"changed"), self.assertRaisesRegex(RUN.RunError, "fixed_configuration_changed"):
            RUN.issue_call(self.source, "summary")

    def test_changed_source_and_frozen_copy_fail(self):
        RUN.prepare(self.source)
        self.source.write_bytes(self.original + b"{}\n")
        with self.assertRaisesRegex(RUN.RunError, "input_hash_mismatch"):
            RUN.issue_call(self.source, "summary")
        self.source.write_bytes(self.original)
        (self.run / "trajectory.json").write_bytes(b"{}\n")
        with self.assertRaisesRegex(RUN.RunError, "input_hash_mismatch"):
            RUN.issue_call(self.source, "summary")

    def test_output_edit_after_summary_acceptance_fails(self):
        self.finish_summary()
        self.write_pair("summary", summary="L001 An edited claim.\nL002 Agent reported success.\n")
        with self.assertRaisesRegex(RUN.RunError, "summary_outputs_changed"):
            RUN.issue_call(self.source, "redaction")

    def test_output_validation_rejects_bad_ids_evidence_and_extra_files(self):
        RUN.prepare(self.source)
        RUN.issue_call(self.source, "summary")
        for summary, insights in [
            ("L002 Out of sequence.\n", ""),
            ("L001 Valid.\n", "# I001\nEvidence: L099\n\nUnsupported.\n"),
            ("L001 Valid.\n", "# I002\nEvidence: L001\n\nWrong insight ID.\n"),
            ("L001 Valid.\n", "# I001\nEvidence: L001\n"),
            ("L001 Valid.\n", "Unstructured insight"),
        ]:
            self.write_pair("summary", summary, insights)
            with self.assertRaises(RUN.RunError):
                RUN.accept(self.source, "summary")
        self.write_pair("summary")
        (self.run / "summary" / "extra.md").write_text("extra")
        with self.assertRaisesRegex(RUN.RunError, "unexpected_output_files"):
            RUN.accept(self.source, "summary")

    def test_redaction_can_remove_all_unsupported_content(self):
        self.finish_summary()
        RUN.issue_call(self.source, "redaction")
        self.write_pair("redaction", "", "")
        result = RUN.accept(self.source, "redaction")
        self.assertTrue(result["run_complete"])
        self.assertEqual(result["insights"], 0)

    def test_changed_call_is_rejected(self):
        RUN.prepare(self.source)
        RUN.issue_call(self.source, "summary")
        call = self.run / "summary-call.json"
        value = json.loads(call.read_text())
        value["fork_turns"] = "all"
        call.write_text(json.dumps(value))
        self.write_pair("summary")
        with self.assertRaisesRegex(RUN.RunError, "dispatch_arguments_changed"):
            RUN.accept(self.source, "summary")

    def test_existing_runs_locks_and_symlinks_are_refused(self):
        RUN.prepare(self.source)
        with self.assertRaises(FileExistsError):
            RUN.prepare(self.source)
        (self.run / ".operation-lock").write_text("")
        with self.assertRaises(FileExistsError):
            RUN.issue_call(self.source, "summary")
        link = self.root / "link.jsonl"
        link.symlink_to(self.source)
        with self.assertRaisesRegex(RUN.RunError, "input_symlink"):
            RUN.prepare(link)

    def test_json_documents_and_escaped_paths_are_supported(self):
        source = self.root / 'strange "name"\n{input}.json'
        source.write_text('[{"role":"user","text":"synthetic"}]')
        RUN.prepare(source)
        call = RUN.issue_call(source, "summary")
        value = json.loads(call["message"].splitlines()[-1])
        self.assertEqual(value["input_json_path"], str(source))

    def test_malformed_input_and_live_storage_fail_before_creating_run(self):
        self.source.write_bytes(b"not json\n")
        with self.assertRaisesRegex(RUN.RunError, "malformed_input"):
            RUN.prepare(self.source)
        self.assertFalse(self.run.exists())
        with self.assertRaisesRegex(RUN.RunError, "collect_live_rollout_first"):
            RUN.prepare(self.root / ".codex" / "sessions" / "live.jsonl")


if __name__ == "__main__":
    unittest.main()
