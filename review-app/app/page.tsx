'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronRight,
  CircleDot,
  FileText,
  Download,
  GitBranch,
  Lightbulb,
  PencilLine,
  Search,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { sampleReviews } from '@/lib/sample-data';
import type { Review } from '@/lib/review-types';
import { cn } from '@/lib/utils';

type EditTarget = { kind: 'summary' | 'insight'; id: string } | null;

function statusLabel(status: Review['status']) {
  if (status === 'completed') return 'Completed';
  if (status === 'in_review') return 'In review';
  return 'Ready for review';
}

function timeLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'recently';
  return date.toLocaleString('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [activeId, setActiveId] = useState(sampleReviews[0].id);
  const [selectedInsight, setSelectedInsight] = useState('I003');
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [draftText, setDraftText] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftEvidence, setDraftEvidence] = useState('');
  const [changeNote, setChangeNote] = useState('');
  const [pendingNotes, setPendingNotes] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  const active = reviews.find((review) => review.id === activeId) ?? reviews[0];
  const selected =
    active.insights.find((insight) => insight.id === selectedInsight) ??
    active.insights[0];
  const evidence = useMemo(() => new Set(selected?.evidence ?? []), [selected]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reviews')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load the review queue.');
        return response.json() as Promise<{ reviews: Review[] }>;
      })
      .then(({ reviews: loaded }) => {
        if (!cancelled && loaded.length) {
          setReviews(loaded);
          setActiveId((current) =>
            loaded.some((review) => review.id === current)
              ? current
              : loaded[0].id,
          );
        }
      })
      .catch(() => {
        if (!cancelled) setSaveState('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function chooseReview(review: Review) {
    setActiveId(review.id);
    setSelectedInsight(review.insights[0]?.id ?? '');
    setDirty(false);
    setPendingNotes([]);
    setSaveState('idle');
  }

  function openEditor(kind: 'summary' | 'insight', id: string) {
    if (kind === 'summary') {
      const line = active.summaryLines.find((item) => item.id === id);
      if (!line) return;
      setDraftText(line.text);
      setDraftTitle('');
      setDraftEvidence('');
    } else {
      const insight = active.insights.find((item) => item.id === id);
      if (!insight) return;
      setDraftText(insight.text);
      setDraftTitle(insight.title);
      setDraftEvidence(insight.evidence.join(', '));
    }
    setChangeNote('');
    setEditTarget({ kind, id });
  }

  function applyEdit() {
    if (!editTarget || !draftText.trim()) return;
    const allowedLines = new Set(active.summaryLines.map((line) => line.id));
    const nextEvidence = draftEvidence
      .split(',')
      .map((value) => value.trim().toUpperCase())
      .filter(
        (value, index, values) =>
          allowedLines.has(value) && values.indexOf(value) === index,
      );

    setReviews((current) =>
      current.map((review) => {
        if (review.id !== active.id) return review;
        if (editTarget.kind === 'summary') {
          return {
            ...review,
            summaryLines: review.summaryLines.map((line) =>
              line.id === editTarget.id
                ? { ...line, text: draftText.trim() }
                : line,
            ),
          };
        }
        return {
          ...review,
          insights: review.insights.map((insight) =>
            insight.id === editTarget.id
              ? {
                  ...insight,
                  title: draftTitle.trim() || insight.title,
                  text: draftText.trim(),
                  evidence: nextEvidence.length
                    ? nextEvidence
                    : insight.evidence,
                }
              : insight,
          ),
        };
      }),
    );
    setPendingNotes((current) => [
      ...current,
      changeNote.trim() || `Edited ${editTarget.id}`,
    ]);
    setDirty(true);
    setSaveState('idle');
    setEditTarget(null);
  }

  async function persist(status: Review['status']) {
    setSaveState('saving');
    try {
      const response = await fetch(`/api/reviews/${active.id}/revisions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          summaryLines: active.summaryLines,
          insights: active.insights,
          note:
            pendingNotes.join('; ') ||
            (status === 'completed'
              ? 'Human review completed.'
              : 'Review draft saved.'),
          status,
        }),
      });
      if (!response.ok) throw new Error('Save failed.');
      const { review } = (await response.json()) as { review: Review };
      setReviews((current) =>
        current.map((item) => (item.id === review.id ? review : item)),
      );
      setPendingNotes([]);
      setDirty(false);
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  }

  if (!active) return null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border/80 bg-card px-4 sm:px-5 lg:px-7">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex items-center gap-2.5 font-semibold tracking-[-0.02em]">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="size-4" />
            </span>
            <span>Oxygen</span>
          </div>
          <div className="hidden h-5 w-px bg-border sm:block" />
          <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <span>Contributor Kit</span>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-foreground">Human review</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className="hidden border-emerald-200 bg-emerald-50 text-emerald-700 lg:inline-flex"
            variant="outline"
          >
            <CircleDot className="size-3 fill-emerald-500 text-emerald-500" />
            {statusLabel(active.status)}
          </Badge>
          <span
            className={cn(
              'hidden text-xs sm:inline',
              saveState === 'error'
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {saveState === 'saving'
              ? 'Saving…'
              : saveState === 'saved'
                ? 'Saved as a new revision'
                : saveState === 'error'
                  ? 'Could not reach review service'
                  : dirty
                    ? 'Unsaved edits'
                    : ''}
          </span>
          <Button
            variant="ghost"
            size="lg"
            render={
              <a
                href={`/api/reviews/${active.id}/export`}
                download
                aria-label="Download reviewed Markdown"
              />
            }
          >
            <Download data-icon="inline-start" />
            <span className="hidden xl:inline">Export .md</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            disabled={saveState === 'saving'}
            onClick={() => persist('in_review')}
          >
            Save draft
          </Button>
          <Button
            size="lg"
            disabled={saveState === 'saving'}
            onClick={() => persist('completed')}
          >
            <Check data-icon="inline-start" />
            <span className="hidden sm:inline">Complete review</span>
            <span className="sm:hidden">Complete</span>
          </Button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="hidden border-r border-border/80 bg-sidebar lg:flex lg:flex-col">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between px-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Review queue
              </p>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {reviews.length}
              </span>
            </div>
            <div className="mb-3 flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-muted-foreground shadow-xs">
              <Search className="size-3.5" />
              <span className="text-xs">Find a run…</span>
            </div>
            <nav className="space-y-1" aria-label="Review runs">
              {reviews.map((review) => (
                <button
                  type="button"
                  key={review.id}
                  onClick={() => chooseReview(review)}
                  className={cn(
                    'w-full rounded-xl px-3 py-3 text-left transition-colors',
                    review.id === active.id
                      ? 'bg-card shadow-[0_1px_0_rgb(20_33_26/5%),0_3px_14px_rgb(20_33_26/6%)] ring-1 ring-border'
                      : 'hover:bg-card/70',
                  )}
                >
                  <span className="mb-1 flex items-center gap-2 text-sm font-medium">
                    <GitBranch
                      className={cn(
                        'size-3.5',
                        review.id === active.id
                          ? 'text-primary'
                          : 'text-muted-foreground',
                      )}
                    />
                    {review.projectName}
                  </span>
                  <span className="flex items-center justify-between pl-[22px] text-[11px] text-muted-foreground">
                    <span>
                      {review.summaryLines.length} lines ·{' '}
                      {review.insights.length} insights
                    </span>
                    {review.revisionCount > 0 && (
                      <span>r{review.revisionCount}</span>
                    )}
                  </span>
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto border-t border-border/80 p-5 text-xs leading-5 text-muted-foreground">
            Original output is preserved.
            <br />
            Every save becomes a revision.
          </div>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{active.id}</span>
                <span>·</span>
                <span>Generated {timeLabel(active.generatedAt)}</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-[-0.035em]">
                {active.projectName}
              </h1>
            </div>
            <div className="text-right text-xs leading-5 text-muted-foreground">
              <p>Select an insight to trace its evidence.</p>
              <p>
                {active.sourcePath} · revision {active.revisionCount}
              </p>
            </div>
          </div>

          <div className="grid min-h-[calc(100vh-10.75rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgb(31_47_38/7%)] xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,.75fr)]">
            <section
              className="min-w-0 border-b border-border xl:border-b-0 xl:border-r"
              aria-labelledby="summary-heading"
            >
              <div className="flex h-14 items-center justify-between border-b border-border bg-muted/35 px-5">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <h2 id="summary-heading" className="text-sm font-semibold">
                    Summary
                  </h2>
                  <Badge variant="secondary">
                    {active.summaryLines.length} lines
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  Click a line to edit
                </span>
              </div>
              <ScrollArea className="h-[560px] xl:h-[calc(100vh-14.3rem)]">
                <ol className="space-y-1 p-3 sm:p-4">
                  {active.summaryLines.map((line) => {
                    const highlighted = evidence.has(line.id);
                    const modified = line.text !== line.originalText;
                    return (
                      <li
                        id={line.id}
                        key={line.id}
                        className={cn(
                          'group grid scroll-mt-4 grid-cols-[52px_1fr_28px] gap-3 rounded-xl border border-transparent px-3 py-3.5 transition-all duration-200',
                          highlighted
                            ? 'border-[color:var(--evidence-border)] bg-[color:var(--evidence-bg)] shadow-[inset_3px_0_0_var(--evidence-accent)]'
                            : 'hover:bg-muted/45',
                        )}
                      >
                        <code
                          className={cn(
                            'pt-0.5 text-[11px] font-semibold',
                            highlighted
                              ? 'text-[color:var(--evidence-strong)]'
                              : 'text-muted-foreground',
                          )}
                        >
                          {line.id}
                        </code>
                        <div>
                          <p className="text-[13px] leading-6 text-foreground/90">
                            {line.text}
                          </p>
                          {modified && (
                            <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--insight-strong)]">
                              Human edited
                            </span>
                          )}
                        </div>
                        <Button
                          aria-label={`Edit ${line.id}`}
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                          onClick={() => openEditor('summary', line.id)}
                        >
                          <PencilLine />
                        </Button>
                      </li>
                    );
                  })}
                </ol>
              </ScrollArea>
            </section>

            <section className="min-w-0" aria-labelledby="insights-heading">
              <div className="flex h-14 items-center justify-between border-b border-border bg-muted/35 px-5">
                <div className="flex items-center gap-2">
                  <Lightbulb className="size-4 text-muted-foreground" />
                  <h2 id="insights-heading" className="text-sm font-semibold">
                    Insights
                  </h2>
                  <Badge variant="secondary">{active.insights.length}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {
                    active.insights.filter((item) => item.status === 'accepted')
                      .length
                  }{' '}
                  accepted
                </span>
              </div>
              <ScrollArea className="h-[620px] xl:h-[calc(100vh-14.3rem)]">
                <div className="space-y-3 p-4">
                  {active.insights.map((insight) => {
                    const selectedNow = insight.id === selected?.id;
                    const modified = insight.text !== insight.originalText;
                    return (
                      <article
                        key={insight.id}
                        className={cn(
                          'group relative rounded-xl border p-4 transition-all',
                          selectedNow
                            ? 'border-[color:var(--insight-border)] bg-[color:var(--insight-bg)] shadow-[0_6px_20px_rgb(49_46_129/8%)]'
                            : 'border-border bg-card hover:-translate-y-0.5 hover:shadow-md',
                        )}
                      >
                        <button
                          type="button"
                          className="absolute inset-0 rounded-xl"
                          aria-label={`Show evidence for ${insight.id}`}
                          onClick={() => setSelectedInsight(insight.id)}
                        />
                        <div className="pointer-events-none relative">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span
                              className={cn(
                                'font-mono text-[11px] font-bold tracking-wide',
                                selectedNow
                                  ? 'text-[color:var(--insight-strong)]'
                                  : 'text-muted-foreground',
                              )}
                            >
                              {insight.id}
                            </span>
                            <div className="flex items-center gap-2">
                              {modified && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--insight-strong)]">
                                  Edited
                                </span>
                              )}
                              {insight.status === 'accepted' && (
                                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                                  <Check className="size-3" /> accepted
                                </span>
                              )}
                            </div>
                          </div>
                          <h3 className="mb-2 pr-7 text-sm font-semibold tracking-[-0.01em]">
                            {insight.title}
                          </h3>
                          <p className="text-xs leading-5 text-muted-foreground">
                            {insight.text}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Evidence
                            </span>
                            {insight.evidence.map((line) => (
                              <span
                                key={line}
                                className={cn(
                                  'rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold',
                                  selectedNow
                                    ? 'border-[color:var(--evidence-border)] bg-[color:var(--evidence-bg)] text-[color:var(--evidence-strong)]'
                                    : 'border-border bg-muted/60 text-muted-foreground',
                                )}
                              >
                                {line}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          aria-label={`Edit ${insight.id}`}
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-3 top-9 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                          onClick={() => openEditor('insight', insight.id)}
                        >
                          <PencilLine />
                        </Button>
                      </article>
                    );
                  })}
                </div>
              </ScrollArea>
            </section>
          </div>
        </section>
      </div>

      <Sheet
        open={Boolean(editTarget)}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
      >
        <SheetContent className="sm:max-w-xl">
          <SheetHeader className="border-b px-6 py-5">
            <SheetTitle>Edit {editTarget?.id}</SheetTitle>
            <SheetDescription>
              Changes remain local until you save a draft or complete the
              review.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1">
            <div className="space-y-6 p-6">
              {editTarget?.kind === 'insight' && (
                <label htmlFor="insight-title" className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Insight title
                  </span>
                  <Input
                    id="insight-title"
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                  />
                </label>
              )}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Original generated text
                </p>
                <div className="rounded-xl border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
                  {editTarget?.kind === 'summary'
                    ? active.summaryLines.find(
                        (line) => line.id === editTarget.id,
                      )?.originalText
                    : active.insights.find(
                        (insight) => insight.id === editTarget?.id,
                      )?.originalText}
                </div>
              </div>
              <label htmlFor="reviewed-text" className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reviewed text
                </span>
                <Textarea
                  id="reviewed-text"
                  className="min-h-40 resize-y leading-6"
                  value={draftText}
                  onChange={(event) => setDraftText(event.target.value)}
                />
              </label>
              {editTarget?.kind === 'insight' && (
                <label htmlFor="evidence-lines" className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Evidence lines
                  </span>
                  <Input
                    id="evidence-lines"
                    className="font-mono"
                    value={draftEvidence}
                    onChange={(event) => setDraftEvidence(event.target.value)}
                    placeholder="L001, L004"
                  />
                  <span className="text-xs text-muted-foreground">
                    Comma-separated Summary line IDs. Unknown lines are ignored.
                  </span>
                </label>
              )}
              <label htmlFor="change-note" className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Why are you changing this?
                </span>
                <Textarea
                  id="change-note"
                  className="min-h-24 resize-y"
                  value={changeNote}
                  onChange={(event) => setChangeNote(event.target.value)}
                  placeholder="Optional review note…"
                />
              </label>
            </div>
          </ScrollArea>
          <SheetFooter className="border-t bg-muted/35 px-6 py-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button onClick={applyEdit} disabled={!draftText.trim()}>
              Apply edit
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </main>
  );
}
