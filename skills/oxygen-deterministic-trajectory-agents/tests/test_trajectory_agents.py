import importlib.util
import json
from pathlib import Path
import stat
import subprocess
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "trajectory_agents.py"
SPEC = importlib.util.spec_from_file_location("trajectory_agents", SCRIPT)
RUN = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(RUN)

SUMMARY = (
    "# Overview\n\nThe team agreed to verify a reported result.\n\n"
    "# Detailed summary\n\n## Purpose\n\n- User requested a check.\n\n"
    "## Decision and unresolved work\n\nAgent reported success; independent verification remained pending.\n"
)
INSIGHTS = "# I001\nEvidence: L009, L013\n\nWhen a reported result matters, check its evidence before relying on it.\n"


class TrajectoryAgentsTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.source = self.root / "input.jsonl"
        self.original = b'{"type":"session_meta","payload":{"id":"synthetic"}}\n'
        self.source.write_bytes(self.original)
        _, self.run = RUN.paths(self.source)

    def write_summary(self, summary=SUMMARY):
        (self.run / "summary" / "summary.md").write_text(summary)

    def finish_summary(self):
        RUN.prepare(self.source)
        RUN.issue_call(self.source, "summary")
        self.write_summary()
        return RUN.accept(self.source, "summary")

    def finish_insight(self, insights=INSIGHTS):
        self.finish_summary()
        RUN.issue_call(self.source, "insight")
        (self.run / "insight" / "insight.md").write_text(insights)
        return RUN.accept(self.source, "insight")

    def write_redaction(self, summary=SUMMARY, insights=INSIGHTS):
        directory = self.run / "redaction"
        (directory / "summary_redacted.md").write_text(summary)
        RUN.LABEL.label_file(directory / "summary_redacted.md", directory / "summary_redacted_labeled.md")
        (directory / "insight_redacted.md").write_text(insights)

    def test_only_path_and_derived_task_identity_vary(self):
        for stage in RUN.STAGES:
            first = RUN.call_arguments(stage, self.source)
            second = RUN.call_arguments(stage, self.root / 'spaces "quotes" {braces} $name.md')
            self.assertEqual(first, RUN.call_arguments(stage, self.source))
            prefix_a, data_a = first.pop("message").rsplit("\n", 2)[:2]
            prefix_b, data_b = second.pop("message").rsplit("\n", 2)[:2]
            self.assertEqual(prefix_a, prefix_b)
            self.assertEqual(set(json.loads(data_a)), {"input_path"})
            self.assertEqual(set(json.loads(data_b)), {"input_path"})
            self.assertNotEqual(first.pop("task_name"), second.pop("task_name"))
            self.assertEqual(first, second)
            self.assertEqual(first, {"model": "gpt-5.6-sol", "reasoning_effort": "medium", "fork_turns": "none"})

    def test_repository_prompts_are_embedded_verbatim(self):
        for stage, (name, _) in RUN.STAGES.items():
            self.assertIn((RUN.KIT / "prompts" / name).read_bytes(), RUN.fixed_template(stage))

    def test_supplied_label_commands_execute_identically_for_both_workers(self):
        source = self.root / 'summary with "quotes".md'
        source.write_text(SUMMARY)
        results = []
        for stage in ("insight", "redaction"):
            template = RUN.fixed_template(stage).decode()
            encoded = template.split("# Label helper command (JSON argv prefix)\n")[1].split("# Per-item input")[0]
            prefix = json.loads(encoded)
            destination = self.root / f"{stage}-labeled.md"
            subprocess.run(prefix + [str(source), str(destination)], check=True, capture_output=True)
            results.append(destination.read_bytes())
        self.assertEqual(results[0], RUN.LABEL.label_bytes(source.read_bytes()))
        self.assertEqual(results[0], results[1])

    def test_insight_revises_working_summary_relabels_and_hands_off_final_trio(self):
        self.finish_summary()
        RUN.issue_call(self.source, "insight")
        directory = self.run / "insight"
        self.assertEqual((directory / "summary.md").read_text(), SUMMARY)
        revised = SUMMARY.replace("\n## Purpose\n\n- User requested a check.\n", "")
        (directory / "summary.md").write_text(revised)
        (directory / "insight.md").write_text("# I001\nEvidence: L009\n\nVerify a reported result before relying on it.\n")
        with self.assertRaisesRegex(RUN.RunError, "labeled_summary_mismatch"):
            RUN.accept(self.source, "insight")
        (directory / "summary_labeled.md").unlink()
        RUN.LABEL.label_file(directory / "summary.md", directory / "summary_labeled.md")
        result = RUN.accept(self.source, "insight")
        self.assertEqual(result["summary_lines"], 9)
        self.assertEqual((self.run / "summary/summary.md").read_text(), SUMMARY)
        RUN.issue_call(self.source, "redaction")
        self.write_redaction(revised, (directory / "insight.md").read_text())
        self.assertTrue(RUN.accept(self.source, "redaction")["run_complete"])

    def test_stale_insight_references_after_relabeling_are_rejected(self):
        self.finish_summary()
        RUN.issue_call(self.source, "insight")
        directory = self.run / "insight"
        (directory / "summary.md").write_text(SUMMARY.replace("\n## Purpose\n\n- User requested a check.\n", ""))
        (directory / "summary_labeled.md").unlink()
        RUN.LABEL.label_file(directory / "summary.md", directory / "summary_labeled.md")
        (directory / "insight.md").write_text(INSIGHTS)
        with self.assertRaisesRegex(RUN.RunError, "invalid_evidence_references"):
            RUN.accept(self.source, "insight")

    def test_accepted_final_summary_remains_frozen(self):
        self.finish_insight()
        directory = self.run / "insight"
        (directory / "summary.md").write_text(SUMMARY.replace("reported success", "reported failure"))
        (directory / "summary_labeled.md").unlink()
        RUN.LABEL.label_file(directory / "summary.md", directory / "summary_labeled.md")
        with self.assertRaisesRegex(RUN.RunError, "insight_outputs_changed"):
            RUN.issue_call(self.source, "redaction")

    def test_insight_cannot_modify_first_summary_or_preseed_workspace(self):
        self.finish_summary()
        (self.run / "insight/summary.md").write_text("unexpected")
        with self.assertRaisesRegex(RUN.RunError, "insight_workspace_not_empty"):
            RUN.issue_call(self.source, "insight")
        (self.run / "insight/summary.md").unlink()
        RUN.issue_call(self.source, "insight")
        self.write_summary(SUMMARY.replace("reported success", "reported failure"))
        (self.run / "insight/insight.md").write_text(INSIGHTS)
        with self.assertRaisesRegex(RUN.RunError, "labeled_summary_mismatch"):
            RUN.accept(self.source, "insight")

    def test_complete_pipeline_labels_before_insights_and_guards_stages(self):
        result = RUN.prepare(self.source)
        self.assertEqual(result["input_bytes"], len(self.original))
        self.assertEqual((self.run / "trajectory.json").read_bytes(), self.original)
        for stage in ("insight", "redaction"):
            with self.assertRaisesRegex(RUN.RunError, "summary_not_complete"):
                RUN.issue_call(self.source, stage)
        call = RUN.issue_call(self.source, "summary")
        self.assertEqual(json.loads((self.run / "summary-call.json").read_bytes()), call)
        with self.assertRaisesRegex(RUN.RunError, "dispatch_already_issued"):
            RUN.issue_call(self.source, "summary")
        with self.assertRaisesRegex(RUN.RunError, "unexpected_output_files"):
            RUN.accept(self.source, "summary")
        self.write_summary()
        self.assertFalse((self.run / "summary/summary_labeled.md").exists())
        result = RUN.accept(self.source, "summary")
        self.assertEqual(result["summary_lines"], 13)
        self.assertEqual(result["evidence_lines"], 3)
        self.assertEqual((self.run / "summary/summary.md").read_text(), SUMMARY)
        self.assertEqual((self.run / "summary/summary_labeled.md").read_bytes(), RUN.LABEL.label_bytes(SUMMARY.encode()))
        with self.assertRaisesRegex(RUN.RunError, "insight_not_complete"):
            RUN.issue_call(self.source, "redaction")
        RUN.issue_call(self.source, "insight")
        (self.run / "insight/insight.md").write_text(INSIGHTS)
        self.assertFalse(RUN.accept(self.source, "insight")["run_complete"])
        RUN.issue_call(self.source, "redaction")
        self.write_redaction()
        result = RUN.accept(self.source, "redaction")
        self.assertTrue(result["run_complete"])
        self.assertEqual(result["insights"], 1)
        self.assertEqual(RUN.accept(self.source, "redaction"), result)
        self.assertEqual(self.source.read_bytes(), self.original)
        for path in self.run.rglob("*"):
            self.assertEqual(stat.S_IMODE(path.stat().st_mode), 0o700 if path.is_dir() else 0o600)

    def test_rich_markdown_and_existing_summary_source(self):
        self.source = self.root / "source.MD"
        self.source.write_text("L001 Original source evidence only.\n")
        _, self.run = RUN.paths(self.source)
        RUN.prepare(self.source)
        self.assertEqual((self.run / "source.md").read_bytes(), self.source.read_bytes())
        self.assertFalse((self.run / "trajectory.json").exists())
        RUN.issue_call(self.source, "summary")
        rich = SUMMARY.replace("- User requested a check.", "**User:** requested a check.\n\n| Option | Decision |\n| --- | --- |\n| Retry | Deferred |")
        self.write_summary(rich)
        RUN.accept(self.source, "summary")
        self.assertEqual((self.run / "summary/summary_labeled.md").read_bytes(), RUN.LABEL.label_bytes(rich.encode()))

    def test_configuration_change_stops_dispatch(self):
        RUN.prepare(self.source)
        with patch.object(RUN, "EFFORT", "low"), self.assertRaisesRegex(RUN.RunError, "fixed_configuration_changed"):
            RUN.issue_call(self.source, "summary")
        original_template = RUN.fixed_template
        with patch.object(RUN, "fixed_template", side_effect=lambda stage: original_template(stage) + b"changed"):
            with self.assertRaisesRegex(RUN.RunError, "fixed_configuration_changed"):
                RUN.issue_call(self.source, "summary")

        with patch.object(RUN, "PROTOCOL_VERSION", 1):
            with self.assertRaisesRegex(RUN.RunError, "fixed_configuration_changed"):
                RUN.issue_call(self.source, "summary")
        labeler = self.root / "different-labeler.py"
        labeler.write_text("# changed implementation")
        with patch.object(RUN, "LABEL_SCRIPT", labeler):
            with self.assertRaisesRegex(RUN.RunError, "fixed_configuration_changed"):
                RUN.issue_call(self.source, "summary")

    def test_fenced_headings_do_not_change_summary_structure(self):
        summary = SUMMARY + "\n```markdown\n# Example heading\n## Example topic\n```\n"
        RUN.validate_summary(summary.encode())

    def test_changed_source_and_frozen_copy_fail(self):
        RUN.prepare(self.source)
        self.source.write_bytes(self.original + b"{}\n")
        with self.assertRaisesRegex(RUN.RunError, "input_hash_mismatch"):
            RUN.issue_call(self.source, "summary")
        self.source.write_bytes(self.original)
        (self.run / "trajectory.json").write_bytes(b"{}\n")
        with self.assertRaisesRegex(RUN.RunError, "input_hash_mismatch"):
            RUN.issue_call(self.source, "summary")

    def test_summary_or_labels_changed_after_acceptance_stop_insights(self):
        self.finish_summary()
        labeled = self.run / "summary/summary_labeled.md"
        labeled.write_bytes(labeled.read_bytes().replace(b"User requested", b"User cancelled"))
        with self.assertRaisesRegex(RUN.RunError, "labeled_summary_mismatch"):
            RUN.issue_call(self.source, "insight")
        changed = SUMMARY.replace("User requested a check.", "User cancelled the check.")
        self.write_summary(changed)
        labeled.write_bytes(RUN.LABEL.label_bytes(changed.encode()))
        with self.assertRaisesRegex(RUN.RunError, "summary_outputs_changed"):
            RUN.issue_call(self.source, "insight")

    def test_inputs_cannot_change_during_insight_or_redaction(self):
        self.finish_insight()
        path = self.run / "insight/insight.md"
        path.write_text(INSIGHTS.replace("check its evidence", "ask for evidence"))
        with self.assertRaisesRegex(RUN.RunError, "insight_outputs_changed"):
            RUN.issue_call(self.source, "redaction")

    def test_invalid_summary_and_extra_files_are_rejected(self):
        RUN.prepare(self.source)
        RUN.issue_call(self.source, "summary")
        for summary in ("", "L001 A legacy flat line.\n", SUMMARY.replace("# Overview", "# Wrong"),
                        SUMMARY.replace("- User requested a check.", ""),
                        SUMMARY.replace("- User requested a check.", "L001 User requested a check.")):
            self.write_summary(summary)
            with self.assertRaises(RUN.RunError):
                RUN.accept(self.source, "summary")
        self.write_summary()
        (self.run / "summary/insight.md").write_text(INSIGHTS)
        with self.assertRaisesRegex(RUN.RunError, "unexpected_output_files"):
            RUN.accept(self.source, "summary")
        self.assertFalse((self.run / "summary/summary_labeled.md").exists())

    def test_invalid_evidence_blank_headings_ranges_and_ids_are_rejected(self):
        self.finish_summary()
        RUN.issue_call(self.source, "insight")
        for insight in (
            INSIGHTS.replace("L009, L013", "L999"),
            INSIGHTS.replace("L009, L013", "L007"),
            INSIGHTS.replace("L009, L013", "L008"),
            INSIGHTS.replace("L009, L013", "L009-L013"),
            INSIGHTS.replace("L009, L013", "L009, L009"),
            INSIGHTS.replace("I001", "I002"),
            "# I001\nEvidence: L009\n", "Unstructured insight",
        ):
            (self.run / "insight/insight.md").write_text(insight)
            with self.assertRaises(RUN.RunError):
                RUN.accept(self.source, "insight")

    def test_redaction_references_follow_new_lines(self):
        self.finish_insight()
        RUN.issue_call(self.source, "redaction")
        shorter = SUMMARY.replace("\n## Purpose\n\n- User requested a check.\n", "")
        self.write_redaction(shorter, "# I001\nEvidence: L009\n\nVerify a claimed result before relying on it.\n")
        result = RUN.accept(self.source, "redaction")
        self.assertEqual(result["summary_lines"], 9)
        self.assertTrue(result["run_complete"])

    def test_redaction_labels_and_stale_citations_are_checked(self):
        self.finish_insight()
        RUN.issue_call(self.source, "redaction")
        shorter = SUMMARY.replace("\n## Purpose\n\n- User requested a check.\n", "")
        self.write_redaction(shorter)
        with self.assertRaisesRegex(RUN.RunError, "invalid_evidence_references"):
            RUN.accept(self.source, "redaction")
        (self.run / "redaction/insight_redacted.md").write_text("")
        (self.run / "redaction/summary_redacted_labeled.md").write_text("L001 Incorrect.\n")
        with self.assertRaisesRegex(RUN.RunError, "labeled_summary_mismatch"):
            RUN.accept(self.source, "redaction")

    def test_empty_insights_and_fully_removed_redaction(self):
        result = self.finish_insight("")
        self.assertEqual(result["insights"], 0)
        RUN.issue_call(self.source, "redaction")
        self.write_redaction("", "")
        result = RUN.accept(self.source, "redaction")
        self.assertTrue(result["run_complete"])
        self.assertEqual(result["summary_lines"], 0)

    def test_changed_call_is_rejected(self):
        RUN.prepare(self.source)
        RUN.issue_call(self.source, "summary")
        call = self.run / "summary-call.json"
        value = json.loads(call.read_text())
        value["fork_turns"] = "all"
        call.write_text(json.dumps(value))
        self.write_summary()
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
        self.assertEqual(value["input_path"], str(source))

    def test_malformed_input_and_live_storage_fail_before_creating_run(self):
        self.source.write_bytes(b"not json\n")
        with self.assertRaisesRegex(RUN.RunError, "malformed_input"):
            RUN.prepare(self.source)
        self.assertFalse(self.run.exists())
        with self.assertRaisesRegex(RUN.RunError, "collect_live_rollout_first"):
            RUN.prepare(self.root / ".codex" / "sessions" / "live.jsonl")


if __name__ == "__main__":
    unittest.main()
