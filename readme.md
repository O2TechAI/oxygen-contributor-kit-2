# Oxygen Contributor Kit

This repository is organized around three core areas:

- `data/` — project data and examples.
- `prompts/` — reusable prompts and prompt templates.
- `tools/` — utilities and supporting tools.
- `review-app/` — the Oxygen human-review service and evidence-linked review UI.

The generation prompt builds each `summary.md` bottom-up: fine-grained Summary
lines, contiguous line groups with concise summaries, and one trajectory-level
summary describing what that trajectory added to its ongoing project.

## Human review workflow

After an Oxygen agent produces `summary.md` and `insight.md`, publish that pair
to the local review service:

```bash
python3 tools/publish-review.py \
  --project my-contributed-project \
  --source ./oxygen-output/run-001 \
  --summary ./oxygen-output/run-001/summary.md \
  --insight ./oxygen-output/run-001/insight.md
```

The review UI keeps the generated text, the current human-edited version, and
an append-only revision snapshot for every save across all three Summary levels.
It renders Agent-defined groups as collapsible sections. Selecting an Insight
opens and highlights its referenced Summary lines. Completing a review produces
a downloadable Markdown file containing the change log and final reviewed output.

See [`review-app/README.md`](review-app/README.md) for local development.
