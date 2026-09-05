import type { Review } from './review-types';

export const sampleReviews: Review[] = [
  {
    id: 'run-024',
    projectName: 'agent-latency-bench',
    sourcePath: 'outputs/agent-latency-bench',
    status: 'ready',
    generatedAt: '2026-09-03T20:42:00.000Z',
    updatedAt: '2026-09-03T20:42:00.000Z',
    revisionCount: 0,
    summaryLines: [
      {
        id: 'L001',
        originalText:
          'User asked the agent to reduce retrieval latency without changing ranking quality.',
        text: 'User asked the agent to reduce retrieval latency without changing ranking quality.',
      },
      {
        id: 'L002',
        originalText:
          'Agent measured a 2.8 second median response time and attributed most of it to sequential provider calls.',
        text: 'Agent measured a 2.8 second median response time and attributed most of it to sequential provider calls.',
      },
      {
        id: 'L003',
        originalText:
          'Agent changed provider execution from sequential to concurrent and added a shared timeout.',
        text: 'Agent changed provider execution from sequential to concurrent and added a shared timeout.',
      },
      {
        id: 'L004',
        originalText:
          'The focused test suite passed, and median retrieval latency fell to 1.1 seconds.',
        text: 'The focused test suite passed, and median retrieval latency fell to 1.1 seconds.',
      },
      {
        id: 'L005',
        originalText:
          'User reported that the overall workflow still felt slow because every candidate required manual compatibility checks.',
        text: 'User reported that the overall workflow still felt slow because every candidate required manual compatibility checks.',
      },
      {
        id: 'L006',
        originalText:
          'Agent first proposed caching all provider results, but the user noted that inventory data becomes stale quickly.',
        text: 'Agent first proposed caching all provider results, but the user noted that inventory data becomes stale quickly.',
      },
      {
        id: 'L007',
        originalText:
          'Agent retained live inventory queries and instead added compatibility evidence beside each candidate.',
        text: 'Agent retained live inventory queries and instead added compatibility evidence beside each candidate.',
      },
      {
        id: 'L008',
        originalText:
          'In a second review, the user completed candidate validation with fewer source-page lookups.',
        text: 'In a second review, the user completed candidate validation with fewer source-page lookups.',
      },
      {
        id: 'L009',
        originalText:
          'The final implementation kept concurrent retrieval, bounded timeouts, and visible compatibility evidence.',
        text: 'The final implementation kept concurrent retrieval, bounded timeouts, and visible compatibility evidence.',
      },
    ],
    insights: [
      {
        id: 'I001',
        title: 'Latency was not the only bottleneck',
        evidence: ['L002', 'L004', 'L005'],
        originalText:
          'A faster backend did not make the workflow feel fast once human verification became the dominant cost. Measure the whole decision loop, not only request time.',
        text: 'A faster backend did not make the workflow feel fast once human verification became the dominant cost. Measure the whole decision loop, not only request time.',
        status: 'accepted',
      },
      {
        id: 'I002',
        title: 'Concurrency needs a failure boundary',
        evidence: ['L002', 'L003', 'L004'],
        originalText:
          'Running independent providers concurrently delivered the latency gain, while a shared timeout prevented one slow provider from holding the result open.',
        text: 'Running independent providers concurrently delivered the latency gain, while a shared timeout prevented one slow provider from holding the result open.',
        status: 'pending',
      },
      {
        id: 'I003',
        title: 'Freshness constrained the obvious optimization',
        evidence: ['L006', 'L007'],
        originalText:
          'Caching looked attractive until the user surfaced inventory freshness as a product constraint. The adopted solution reduced review work without weakening live evidence.',
        text: 'Caching looked attractive until the user surfaced inventory freshness as a product constraint. The adopted solution reduced review work without weakening live evidence.',
        status: 'pending',
      },
      {
        id: 'I004',
        title: 'Expose evidence at the decision point',
        evidence: ['L005', 'L007', 'L008'],
        originalText:
          'Placing compatibility evidence beside each candidate reduced context switching more directly than another retrieval optimization would have.',
        text: 'Placing compatibility evidence beside each candidate reduced context switching more directly than another retrieval optimization would have.',
        status: 'pending',
      },
    ],
  },
  {
    id: 'run-023',
    projectName: 'provider-fallbacks',
    sourcePath: 'outputs/provider-fallbacks',
    status: 'in_review',
    generatedAt: '2026-09-03T18:18:00.000Z',
    updatedAt: '2026-09-03T19:05:00.000Z',
    revisionCount: 0,
    summaryLines: [
      {
        id: 'L001',
        originalText:
          'The user required partial provider failure to remain visible without blocking successful offers.',
        text: 'The user required partial provider failure to remain visible without blocking successful offers.',
      },
      {
        id: 'L002',
        originalText:
          'The first implementation treated one timeout as a failure of the complete lookup.',
        text: 'The first implementation treated one timeout as a failure of the complete lookup.',
      },
      {
        id: 'L003',
        originalText:
          'The agent changed aggregation to preserve successful results and attach provider-level warnings.',
        text: 'The agent changed aggregation to preserve successful results and attach provider-level warnings.',
      },
      {
        id: 'L004',
        originalText:
          'Integration tests confirmed that successful offers remained selectable during one provider timeout.',
        text: 'Integration tests confirmed that successful offers remained selectable during one provider timeout.',
      },
    ],
    insights: [
      {
        id: 'I001',
        title: 'Failure belongs at the provider boundary',
        evidence: ['L002', 'L003', 'L004'],
        originalText:
          'Independent providers should fail independently when partial results still have product value.',
        text: 'Independent providers should fail independently when partial results still have product value.',
        status: 'pending',
      },
      {
        id: 'I002',
        title: 'Warnings preserve decision context',
        evidence: ['L001', 'L003'],
        originalText:
          'Returning successful offers with explicit warnings retained both utility and uncertainty.',
        text: 'Returning successful offers with explicit warnings retained both utility and uncertainty.',
        status: 'pending',
      },
    ],
  },
  {
    id: 'run-022',
    projectName: 'review-loop-design',
    sourcePath: 'outputs/review-loop-design',
    status: 'completed',
    generatedAt: '2026-09-02T16:10:00.000Z',
    updatedAt: '2026-09-02T17:44:00.000Z',
    revisionCount: 0,
    summaryLines: [
      {
        id: 'L001',
        originalText:
          'Reviewers could edit generated output but could not see which summary evidence supported each insight.',
        text: 'Reviewers could edit generated output but could not see which summary evidence supported each insight.',
      },
      {
        id: 'L002',
        originalText: 'The user requested a side-by-side evidence view.',
        text: 'The user requested a side-by-side evidence view.',
      },
      {
        id: 'L003',
        originalText:
          'The accepted design highlighted referenced summary lines when an insight was selected.',
        text: 'The accepted design highlighted referenced summary lines when an insight was selected.',
      },
    ],
    insights: [
      {
        id: 'I001',
        title: 'Review needs visible provenance',
        evidence: ['L001', 'L002', 'L003'],
        originalText:
          'Evidence links become useful only when reviewers can inspect them without losing their current context.',
        text: 'Evidence links become useful only when reviewers can inspect them without losing their current context.',
        status: 'accepted',
      },
    ],
  },
];
