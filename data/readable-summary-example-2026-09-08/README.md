# Readable summary example

This synthetic example demonstrates the summary, Python labeling, and separate insight stages. Start with summary.md; compare source.md to see the supplied evidence.

- source.md: synthetic existing summary supplied to the original trial.
- summary.md: the trial agent's readable overview and thematic summary.
- summary_labeled.md: Python-generated evidence copy, with an ID for every physical line.
- insight.md: the trial insight agent's unedited output, citing the new IDs.

The original temporary trial directory was no longer available when these examples were requested. The source, summary, and insights were recovered from the conversation's recorded trial text. Each matches its SHA-256 recorded during that trial. The labeled copy was regenerated with the label helper and also matches its recorded SHA-256. This recovery did not rerun the agents or recreate an execution manifest.

Review finding: I003 cites existing content lines but omits L011, which supplies the pipeline-validation premise used in its advice. The output is preserved as generated. Structural validation checks reference targets and file integrity; it does not establish full semantic support.
