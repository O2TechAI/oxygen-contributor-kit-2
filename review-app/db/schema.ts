import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const reviews = sqliteTable(
  'reviews',
  {
    id: text('id').primaryKey(),
    projectName: text('project_name').notNull(),
    sourcePath: text('source_path').notNull(),
    status: text('status').notNull(),
    generatedAt: text('generated_at').notNull(),
    originalSummaryJson: text('original_summary_json').notNull(),
    originalInsightsJson: text('original_insights_json').notNull(),
    currentSummaryJson: text('current_summary_json').notNull(),
    currentInsightsJson: text('current_insights_json').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('idx_reviews_status_updated').on(table.status, table.updatedAt),
  ],
);

export const reviewRevisions = sqliteTable(
  'review_revisions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    reviewId: text('review_id').notNull(),
    revisionNumber: integer('revision_number').notNull(),
    summaryJson: text('summary_json').notNull(),
    insightsJson: text('insights_json').notNull(),
    note: text('note').notNull(),
    status: text('status').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    uniqueIndex('idx_review_revisions_review_number').on(
      table.reviewId,
      table.revisionNumber,
    ),
  ],
);
