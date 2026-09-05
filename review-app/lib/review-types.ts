export type SummaryLine = {
  id: string;
  originalText: string;
  text: string;
};

export type Insight = {
  id: string;
  title: string;
  originalText: string;
  text: string;
  evidence: string[];
  status: 'pending' | 'accepted';
};

export type Review = {
  id: string;
  projectName: string;
  sourcePath: string;
  status: 'ready' | 'in_review' | 'completed';
  generatedAt: string;
  updatedAt: string;
  revisionCount: number;
  summaryLines: SummaryLine[];
  insights: Insight[];
};

export type ReviewSavePayload = {
  summaryLines: SummaryLine[];
  insights: Insight[];
  note: string;
  status: Review['status'];
};

export type ReviewCreatePayload = {
  projectName: string;
  sourcePath: string;
  summaryMarkdown: string;
  insightMarkdown: string;
};
