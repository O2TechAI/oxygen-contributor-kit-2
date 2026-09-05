import { saveRevision } from '@/db/reviews';
import type { ReviewSavePayload } from '@/lib/review-types';

const lineId = /^L\d{3,}$/;
const insightId = /^I\d{3,}$/;

function isValidPayload(value: unknown): value is ReviewSavePayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Partial<ReviewSavePayload>;
  const statuses = new Set(['ready', 'in_review', 'completed']);
  if (!Array.isArray(payload.summaryLines) || !Array.isArray(payload.insights))
    return false;
  if (
    typeof payload.note !== 'string' ||
    !payload.status ||
    !statuses.has(payload.status)
  )
    return false;

  const summaryIds = new Set(
    payload.summaryLines
      .filter(
        (line) => line && lineId.test(line.id) && typeof line.text === 'string',
      )
      .map((line) => line.id),
  );
  if (summaryIds.size !== payload.summaryLines.length) return false;

  return payload.insights.every(
    (insight) =>
      insight &&
      insightId.test(insight.id) &&
      typeof insight.title === 'string' &&
      typeof insight.text === 'string' &&
      Array.isArray(insight.evidence) &&
      insight.evidence.every((id) => summaryIds.has(id)),
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ reviewId: string }> },
) {
  try {
    const payload: unknown = await request.json();
    if (!isValidPayload(payload)) {
      return Response.json(
        { error: 'Invalid review revision.' },
        { status: 400 },
      );
    }
    const { reviewId } = await context.params;
    return Response.json({ review: await saveRevision(reviewId, payload) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to save review.';
    return Response.json(
      { error: message },
      { status: message === 'Review not found.' ? 404 : 500 },
    );
  }
}
