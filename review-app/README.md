# Oxygen Review

Oxygen Review is the human-in-the-loop surface for generated `summary.md` and
`insight.md` pairs.

## Run locally

Node.js 22.13 or newer is required.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Local development uses a project-local D1
database through Miniflare.

## Backend contract

`POST /api/reviews` registers a generated output pair:

```json
{
  "projectName": "my-project",
  "sourcePath": "outputs/run-001",
  "summaryMarkdown": "L001 ...",
  "insightMarkdown": "# I001\nEvidence: L001\n\n..."
}
```

`POST /api/reviews/:id/revisions` saves the full reviewed snapshot and appends
a revision record. `GET /api/reviews/:id/export` returns the change log and
latest reviewed Summary and Insights as Markdown.

The Python bridge at `../tools/publish-review.py` implements the registration
call using only the Python standard library.
