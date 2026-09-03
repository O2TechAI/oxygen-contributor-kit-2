import { env } from 'cloudflare:workers';

import { sampleReviews } from '@/lib/sample-data';
import type {
  Insight,
  Review,
  ReviewCreatePayload,
  ReviewSavePayload,
  SummaryLine,
} from '@/lib/review-types';

type ReviewRow = {
  id: string;
  project_name: string;
  source_path: string;
  status: Review['status'];
  generated_at: string;
  original_summary_json: string;
  original_insights_json: string;
  current_summary_json: string;
  current_insights_json: string;
  updated_at: string;
  revision_count: number;
};

let initialized = false;

function database() {
  if (!env.DB) throw new Error('D1 binding DB is unavailable.');
  return env.DB;
}

function parseJson<T>(value: string): T {
  return JSON.parse(value) as T;
}

function mapReview(row: ReviewRow): Review {
  const originalSummary = parseJson<SummaryLine[]>(row.original_summary_json);
  const originalInsights = parseJson<Insight[]>(row.original_insights_json);
  const originalSummaryById = new Map(
    originalSummary.map((line) => [line.id, line.text]),
  );
  const originalInsightsById = new Map(
    originalInsights.map((insight) => [insight.id, insight.text]),
  );

  return {
    id: row.id,
    projectName: row.project_name,
    sourcePath: row.source_path,
    status: row.status,
    generatedAt: row.generated_at,
    updatedAt: row.updated_at,
    revisionCount: Number(row.revision_count || 0),
    summaryLines: parseJson<SummaryLine[]>(row.current_summary_json).map(
      (line) => ({
        ...line,
        originalText:
          originalSummaryById.get(line.id) ?? line.originalText ?? line.text,
      }),
    ),
    insights: parseJson<Insight[]>(row.current_insights_json).map(
      (insight) => ({
        ...insight,
        originalText:
          originalInsightsById.get(insight.id) ??
          insight.originalText ??
          insight.text,
      }),
    ),
  };
}

async function ensureDatabase() {
  if (initialized) return;
  const db = database();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      project_name TEXT NOT NULL,
      source_path TEXT NOT NULL,
      status TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      original_summary_json TEXT NOT NULL,
      original_insights_json TEXT NOT NULL,
      current_summary_json TEXT NOT NULL,
      current_insights_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS review_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      review_id TEXT NOT NULL,
      revision_number INTEGER NOT NULL,
      summary_json TEXT NOT NULL,
      insights_json TEXT NOT NULL,
      note TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_review_revisions_review_number
      ON review_revisions(review_id, revision_number)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_reviews_status_updated
      ON reviews(status, updated_at DESC)`),
  ]);

  const count = await db
    .prepare('SELECT COUNT(*) AS count FROM reviews')
    .first<{ count: number }>();
  if (!count?.count) {
    const inserts = sampleReviews.map((review) =>
      db
        .prepare(`INSERT OR IGNORE INTO reviews (
        id, project_name, source_path, status, generated_at,
        original_summary_json, original_insights_json,
        current_summary_json, current_insights_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(
          review.id,
          review.projectName,
          review.sourcePath,
          review.status,
          review.generatedAt,
          JSON.stringify(review.summaryLines),
          JSON.stringify(review.insights),
          JSON.stringify(review.summaryLines),
          JSON.stringify(review.insights),
          review.generatedAt,
          review.updatedAt,
        ),
    );
    await db.batch(inserts);
  }
  initialized = true;
}

export async function listReviews(): Promise<Review[]> {
  await ensureDatabase();
  const result = await database()
    .prepare(`SELECT reviews.*,
      COUNT(review_revisions.id) AS revision_count
    FROM reviews
    LEFT JOIN review_revisions ON review_revisions.review_id = reviews.id
    GROUP BY reviews.id
    ORDER BY CASE reviews.status WHEN 'ready' THEN 0 WHEN 'in_review' THEN 1 ELSE 2 END,
      reviews.updated_at DESC`)
    .all<ReviewRow>();
  return result.results.map(mapReview);
}

function parseSummary(markdown: string): SummaryLine[] {
  const lines: SummaryLine[] = [];
  for (const rawLine of markdown.split(/\r?\n/)) {
    const match = rawLine.trim().match(/^(L\d{3,})\s+(.+)$/);
    if (match) {
      lines.push({ id: match[1], originalText: match[2], text: match[2] });
    } else if (rawLine.trim() && lines.length) {
      const previous = lines[lines.length - 1];
      previous.originalText += ` ${rawLine.trim()}`;
      previous.text = previous.originalText;
    }
  }
  return lines;
}

function parseInsights(markdown: string, summaryIds: Set<string>): Insight[] {
  const sections = markdown
    .split(/^#\s+(?=I\d{3,}\s*$)/gm)
    .filter((section) => /^I\d{3,}/.test(section.trim()));
  return sections.flatMap((section) => {
    const lines = section.trim().split(/\r?\n/);
    const id = lines.shift()?.trim() ?? '';
    const evidenceLine = lines.find((line) => /^Evidence:\s*/i.test(line));
    const evidence = (evidenceLine?.replace(/^Evidence:\s*/i, '') ?? '')
      .split(',')
      .map((value) => value.trim().toUpperCase())
      .filter(
        (value, index, values) =>
          summaryIds.has(value) && values.indexOf(value) === index,
      );
    const text = lines
      .filter((line) => line !== evidenceLine)
      .join('\n')
      .trim();
    if (!/^I\d{3,}$/.test(id) || !text || !evidence.length) return [];
    const firstSentence = text.split(/(?<=[.!?])\s/)[0].replace(/[*_`#]/g, '');
    const title =
      firstSentence.length > 72
        ? `${firstSentence.slice(0, 69)}…`
        : firstSentence;
    return [
      {
        id,
        title,
        originalText: text,
        text,
        evidence,
        status: 'pending' as const,
      },
    ];
  });
}

export async function createReview(
  payload: ReviewCreatePayload,
): Promise<Review> {
  await ensureDatabase();
  const summaryLines = parseSummary(payload.summaryMarkdown);
  const summaryIds = new Set(summaryLines.map((line) => line.id));
  const insights = parseInsights(payload.insightMarkdown, summaryIds);
  if (!summaryLines.length || !insights.length) {
    throw new Error(
      'The Markdown does not contain valid Summary lines and evidence-linked Insights.',
    );
  }

  const now = new Date().toISOString();
  const slug =
    payload.projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'review';
  const reviewId = `${slug}-${crypto.randomUUID().slice(0, 8)}`;
  await database()
    .prepare(`INSERT INTO reviews (
    id, project_name, source_path, status, generated_at,
    original_summary_json, original_insights_json,
    current_summary_json, current_insights_json, created_at, updated_at
  ) VALUES (?, ?, ?, 'ready', ?, ?, ?, ?, ?, ?, ?)`)
    .bind(
      reviewId,
      payload.projectName.trim(),
      payload.sourcePath.trim(),
      now,
      JSON.stringify(summaryLines),
      JSON.stringify(insights),
      JSON.stringify(summaryLines),
      JSON.stringify(insights),
      now,
      now,
    )
    .run();

  const reviews = await listReviews();
  return reviews.find((review) => review.id === reviewId)!;
}

export async function saveRevision(
  reviewId: string,
  payload: ReviewSavePayload,
): Promise<Review> {
  await ensureDatabase();
  const db = database();
  const current = await db
    .prepare('SELECT id FROM reviews WHERE id = ?')
    .bind(reviewId)
    .first();
  if (!current) throw new Error('Review not found.');

  const last = await db
    .prepare(`SELECT COALESCE(MAX(revision_number), 0) AS revision
    FROM review_revisions WHERE review_id = ?`)
    .bind(reviewId)
    .first<{ revision: number }>();
  const revision = Number(last?.revision || 0) + 1;
  const createdAt = new Date().toISOString();
  const summaryJson = JSON.stringify(payload.summaryLines);
  const insightsJson = JSON.stringify(payload.insights);

  await db.batch([
    db
      .prepare(`INSERT INTO review_revisions (
      review_id, revision_number, summary_json, insights_json, note, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(
        reviewId,
        revision,
        summaryJson,
        insightsJson,
        payload.note.trim(),
        payload.status,
        createdAt,
      ),
    db
      .prepare(`UPDATE reviews SET
      current_summary_json = ?, current_insights_json = ?, status = ?, updated_at = ?
      WHERE id = ?`)
      .bind(summaryJson, insightsJson, payload.status, createdAt, reviewId),
  ]);

  const reviews = await listReviews();
  return reviews.find((review) => review.id === reviewId)!;
}

export async function exportReview(reviewId: string): Promise<string> {
  await ensureDatabase();
  const reviews = await listReviews();
  const review = reviews.find((item) => item.id === reviewId);
  if (!review) throw new Error('Review not found.');
  const result = await database()
    .prepare(`SELECT revision_number, note, created_at
    FROM review_revisions WHERE review_id = ? ORDER BY revision_number`)
    .bind(reviewId)
    .all<{
      revision_number: number;
      note: string;
      created_at: string;
    }>();

  const changeLog = result.results.length
    ? result.results
        .map(
          (revision) =>
            `- Revision ${revision.revision_number} (${revision.created_at}): ${revision.note || 'No note provided.'}`,
        )
        .join('\n')
    : '- No human edits were recorded.';
  const summary = review.summaryLines
    .map((line) => `${line.id} ${line.text}`)
    .join('\n');
  const insights = review.insights
    .map((insight) =>
      [
        `# ${insight.id}`,
        `Evidence: ${insight.evidence.join(', ')}`,
        '',
        insight.text,
      ].join('\n'),
    )
    .join('\n\n');

  return `# Human-reviewed Oxygen output\n\nProject: ${review.projectName}\nStatus: ${review.status}\n\n## Review changes\n\n${changeLog}\n\n## Final summary\n\n${summary}\n\n## Final insights\n\n${insights}\n`;
}
