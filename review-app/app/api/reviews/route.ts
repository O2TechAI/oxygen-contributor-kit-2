import { createReview, listReviews } from '@/db/reviews';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';
import type { ReviewCreatePayload } from '@/lib/review-types';

export async function GET(request: Request) {
  if (!(await isAuthenticated(request))) return unauthorizedResponse();
  try {
    return Response.json({ reviews: await listReviews() });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to load reviews.';
    return Response.json({ error: message }, { status: 500 });
  }
}

function isCreatePayload(value: unknown): value is ReviewCreatePayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Partial<ReviewCreatePayload>;
  return Boolean(
    payload.projectName?.trim() &&
    payload.sourcePath?.trim() &&
    payload.summaryMarkdown?.trim() &&
    payload.insightMarkdown?.trim(),
  );
}

export async function POST(request: Request) {
  if (!(await isAuthenticated(request))) return unauthorizedResponse();
  try {
    const payload: unknown = await request.json();
    if (!isCreatePayload(payload)) {
      return Response.json(
        {
          error:
            'projectName, sourcePath, summaryMarkdown, and insightMarkdown are required.',
        },
        { status: 400 },
      );
    }
    return Response.json(
      { review: await createReview(payload) },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to create review.';
    return Response.json({ error: message }, { status: 400 });
  }
}
