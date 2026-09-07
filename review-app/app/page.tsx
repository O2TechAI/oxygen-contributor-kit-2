'use client';

import { type SyntheticEvent, useEffect, useMemo, useState } from 'react';
import {
  Check,
  Download,
  FilePlus2,
  FileText,
  Lightbulb,
  LogOut,
  PencilLine,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import type { Review, SummaryLine } from '@/lib/review-types';
import { cn } from '@/lib/utils';

type ItemKind = 'trajectory' | 'group' | 'summary' | 'insight';
type EditorTarget = { kind: ItemKind; id: string; mode: 'add' | 'edit' } | null;
type DeleteTarget = { kind: 'summary' | 'insight'; id: string } | null;
type CreatableItemKind = NonNullable<DeleteTarget>['kind'];

function statusLabel(status: Review['status']) {
  if (status === 'completed') return 'Completed';
  if (status === 'in_review') return 'In review';
  return 'Ready';
}

function nextItemId(ids: string[], prefix: 'L' | 'I') {
  const highest = ids.reduce((maximum, id) => {
    const value = Number(id.slice(1));
    return Number.isFinite(value) ? Math.max(maximum, value) : maximum;
  }, 0);
  return `${prefix}${String(highest + 1).padStart(3, '0')}`;
}

export default function Home() {
  const [authState, setAuthState] = useState<
    'checking' | 'signed_out' | 'signed_in'
  >('checking');
  const [username, setUsername] = useState('Oxygen');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeId, setActiveId] = useState('');
  const [selectedInsight, setSelectedInsight] = useState('');
  const [editorTarget, setEditorTarget] = useState<EditorTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
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
    active?.insights.find((insight) => insight.id === selectedInsight) ??
    active?.insights[0];
  const evidence = useMemo(() => new Set(selected?.evidence ?? []), [selected]);
  const referencesToDelete =
    deleteTarget?.kind === 'summary'
      ? (active?.insights.filter((insight) =>
          insight.evidence.includes(deleteTarget.id),
        ).length ?? 0)
      : 0;

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/session', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to check session.');
        return response.json() as Promise<{ authenticated: boolean }>;
      })
      .then(({ authenticated }) => {
        if (!cancelled) {
          setAuthState(authenticated ? 'signed_in' : 'signed_out');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoginError('Unable to check the login session.');
          setAuthState('signed_out');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authState !== 'signed_in') return;
    let cancelled = false;
    fetch('/api/reviews', { cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 401) {
          setAuthState('signed_out');
          throw new Error('Authentication required.');
        }
        if (!response.ok) throw new Error('Unable to load reviews.');
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
          setSelectedInsight((current) =>
            loaded.some((review) =>
              review.insights.some((insight) => insight.id === current),
            )
              ? current
              : (loaded[0].insights[0]?.id ?? ''),
          );
        }
      })
      .catch(() => {
        if (!cancelled) setSaveState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [authState]);

  async function handleLogin(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginPending(true);
    setLoginError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(result?.error || 'Unable to sign in.');
      }
      setPassword('');
      setAuthState('signed_in');
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : 'Unable to sign in.',
      );
    } finally {
      setLoginPending(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    setReviews([]);
    setActiveId('');
    setSelectedInsight('');
    setPassword('');
    setAuthState('signed_out');
  }

  if (authState === 'checking') {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
        <div className="text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-5" />
          </span>
          <p className="mt-4 text-sm text-muted-foreground">Checking access…</p>
        </div>
      </main>
    );
  }

  if (authState === 'signed_out') {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 py-12 text-foreground">
        <section className="w-full max-w-sm rounded-2xl border bg-card p-7 shadow-sm">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-5" />
          </span>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Oxygen Review
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in to review generated Summary and Insights.
          </p>
          <form className="mt-7 space-y-4" onSubmit={handleLogin}>
            <label className="block space-y-2" htmlFor="login-username">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </span>
              <Input
                id="login-username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>
            <label className="block space-y-2" htmlFor="login-password">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </span>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {loginError && (
              <p role="alert" className="text-sm text-destructive">
                {loginError}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={loginPending}>
              {loginPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </section>
      </main>
    );
  }

  if (!active) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      </main>
    );
  }

  function chooseReview(id: string) {
    const review = reviews.find((item) => item.id === id);
    if (!review) return;
    setActiveId(id);
    setSelectedInsight(review.insights[0]?.id ?? '');
    setPendingNotes([]);
    setDirty(false);
    setSaveState('idle');
  }

  function updateActive(transform: (review: Review) => Review, note: string) {
    setReviews((current) =>
      current.map((review) =>
        review.id === active.id ? transform(review) : review,
      ),
    );
    setPendingNotes((current) => [...current, note]);
    setDirty(true);
    setSaveState('idle');
  }

  function openEditor(kind: ItemKind, id: string) {
    if (kind === 'trajectory') {
      setDraftText(active.trajectorySummary.text);
      setDraftTitle('');
      setDraftEvidence('');
    } else if (kind === 'group') {
      const group = active.summaryGroups.find((item) => item.id === id);
      if (!group) return;
      setDraftText(group.text);
      setDraftTitle('');
      setDraftEvidence('');
    } else if (kind === 'summary') {
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
    setEditorTarget({ kind, id, mode: 'edit' });
  }

  function openCreate(kind: CreatableItemKind) {
    const id =
      kind === 'summary'
        ? nextItemId(
            active.summaryLines.map((line) => line.id),
            'L',
          )
        : nextItemId(
            active.insights.map((insight) => insight.id),
            'I',
          );
    setDraftText('');
    setDraftTitle('');
    setDraftEvidence('');
    setChangeNote('');
    setEditorTarget({ kind, id, mode: 'add' });
  }

  function applyEditor() {
    if (!editorTarget || !draftText.trim()) return;
    const allowedLines = new Set(active.summaryLines.map((line) => line.id));
    const nextEvidence = draftEvidence
      .split(',')
      .map((value) => value.trim().toUpperCase())
      .filter(
        (value, index, values) =>
          allowedLines.has(value) && values.indexOf(value) === index,
      );
    const action = editorTarget.mode === 'add' ? 'Added' : 'Edited';
    const note = changeNote.trim() || `${action} ${editorTarget.id}`;

    updateActive((review) => {
      if (editorTarget.kind === 'trajectory') {
        return {
          ...review,
          trajectorySummary: {
            ...review.trajectorySummary,
            text: draftText.trim(),
          },
        };
      }
      if (editorTarget.kind === 'group') {
        return {
          ...review,
          summaryGroups: review.summaryGroups.map((group) =>
            group.id === editorTarget.id
              ? { ...group, text: draftText.trim() }
              : group,
          ),
        };
      }
      if (editorTarget.kind === 'summary') {
        if (editorTarget.mode === 'add') {
          return {
            ...review,
            summaryGroups: review.summaryGroups.map((group, index, groups) =>
              index === groups.length - 1
                ? { ...group, lineIds: [...group.lineIds, editorTarget.id] }
                : group,
            ),
            summaryLines: [
              ...review.summaryLines,
              {
                id: editorTarget.id,
                originalText: '',
                text: draftText.trim(),
              },
            ],
          };
        }
        return {
          ...review,
          summaryLines: review.summaryLines.map((line) =>
            line.id === editorTarget.id
              ? { ...line, text: draftText.trim() }
              : line,
          ),
        };
      }

      if (editorTarget.mode === 'add') {
        return {
          ...review,
          insights: [
            ...review.insights,
            {
              id: editorTarget.id,
              title: draftTitle.trim() || 'Untitled insight',
              originalText: '',
              text: draftText.trim(),
              evidence: nextEvidence,
              status: 'pending',
            },
          ],
        };
      }
      return {
        ...review,
        insights: review.insights.map((insight) =>
          insight.id === editorTarget.id
            ? {
                ...insight,
                title: draftTitle.trim() || insight.title,
                text: draftText.trim(),
                evidence: nextEvidence,
              }
            : insight,
        ),
      };
    }, note);

    if (editorTarget.kind === 'insight') {
      setSelectedInsight(editorTarget.id);
    }
    setEditorTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    updateActive((review) => {
      if (target.kind === 'summary') {
        return {
          ...review,
          summaryGroups: review.summaryGroups
            .map((group) => ({
              ...group,
              lineIds: group.lineIds.filter((id) => id !== target.id),
            }))
            .filter((group) => group.lineIds.length),
          summaryLines: review.summaryLines.filter(
            (line) => line.id !== target.id,
          ),
          insights: review.insights.map((insight) => ({
            ...insight,
            evidence: insight.evidence.filter((id) => id !== target.id),
          })),
        };
      }
      const insights = review.insights.filter(
        (insight) => insight.id !== target.id,
      );
      if (selectedInsight === target.id) {
        setSelectedInsight(insights[0]?.id ?? '');
      }
      return { ...review, insights };
    }, `Removed ${target.id}`);
    setDeleteTarget(null);
  }

  async function persist(status: Review['status']) {
    setSaveState('saving');
    try {
      const response = await fetch(`/api/reviews/${active.id}/revisions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          trajectorySummary: active.trajectorySummary,
          summaryGroups: active.summaryGroups,
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

  function renderSummaryLine(line: SummaryLine) {
    const highlighted = evidence.has(line.id);
    const added = !line.originalText;
    const modified = added || line.text !== line.originalText;
    return (
      <li
        id={line.id}
        key={line.id}
        className={cn(
          'grid grid-cols-[52px_minmax(0,1fr)_68px] gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors',
          highlighted
            ? 'border-[color:var(--evidence-border)] bg-[color:var(--evidence-bg)] shadow-[inset_3px_0_0_var(--evidence-accent)]'
            : 'hover:bg-muted/40',
        )}
      >
        <code
          className={cn(
            'pt-1 text-xs font-semibold',
            highlighted
              ? 'text-[color:var(--evidence-strong)]'
              : 'text-muted-foreground',
          )}
        >
          {line.id}
        </code>
        <div className="min-w-0">
          <p className="text-base leading-7">{line.text}</p>
          {modified && (
            <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--insight-strong)]">
              {added ? 'Added by reviewer' : 'Edited'}
            </span>
          )}
        </div>
        <div className="flex items-start gap-1">
          <Button
            aria-label={`Edit ${line.id}`}
            variant="ghost"
            size="icon-sm"
            onClick={() => openEditor('summary', line.id)}
          >
            <PencilLine />
          </Button>
          <Button
            aria-label={`Remove ${line.id}`}
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => setDeleteTarget({ kind: 'summary', id: line.id })}
          >
            <Trash2 />
          </Button>
        </div>
      </li>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">Oxygen Review</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Edit the final Summary and Insights
            </p>
          </div>
          <select
            aria-label="Choose project"
            value={active.id}
            onChange={(event) => chooseReview(event.target.value)}
            className="ml-2 h-9 max-w-56 rounded-lg border bg-background px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {reviews.map((review) => (
              <option key={review.id} value={review.id}>
                {review.projectName}
              </option>
            ))}
          </select>
          <Badge variant="secondary">{statusLabel(active.status)}</Badge>
        </div>

        <div className="flex items-center gap-2">
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
                ? `Saved · revision ${active.revisionCount}`
                : saveState === 'error'
                  ? 'Could not save'
                  : dirty
                    ? 'Unsaved changes'
                    : `Revision ${active.revisionCount}`}
          </span>
          <Button
            variant="ghost"
            render={
              <a
                href={`/api/reviews/${active.id}/export`}
                download
                aria-label="Export reviewed Markdown"
              />
            }
          >
            <Download data-icon="inline-start" />
            Export
          </Button>
          <Button
            variant="outline"
            disabled={saveState === 'saving' || !dirty}
            onClick={() => persist('in_review')}
          >
            Save
          </Button>
          <Button
            disabled={saveState === 'saving'}
            onClick={() => persist('completed')}
          >
            <Check data-icon="inline-start" />
            Complete
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut data-icon="inline-start" />
            Sign out
          </Button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,.85fr)]">
        <section
          className="min-w-0 border-b xl:border-b-0 xl:border-r"
          aria-labelledby="summary-heading"
        >
          <div className="flex h-14 items-center justify-between border-b bg-muted/30 px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <h1 id="summary-heading" className="font-semibold">
                Summary
              </h1>
              <Badge variant="secondary">{active.summaryLines.length}</Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openCreate('summary')}
            >
              <Plus data-icon="inline-start" /> Add line
            </Button>
          </div>
          <ScrollArea className="h-[560px] xl:h-[calc(100vh-7.5rem)]">
            {active.summaryLines.length ? (
              <div className="space-y-5 p-3 sm:p-5">
                {active.trajectorySummary.text && (
                  <article className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Trajectory summary
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Contribution of this trajectory to the ongoing project
                        </p>
                      </div>
                      <Button
                        aria-label="Edit trajectory summary"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditor('trajectory', 'trajectory')}
                      >
                        <PencilLine />
                      </Button>
                    </div>
                    <p className="text-lg leading-8">
                      {active.trajectorySummary.text}
                    </p>
                  </article>
                )}

                {active.summaryGroups.length ? (
                  active.summaryGroups.map((group) => {
                    const groupLines = group.lineIds
                      .map((id) =>
                        active.summaryLines.find((line) => line.id === id),
                      )
                      .filter((line): line is SummaryLine => Boolean(line));
                    const containsEvidence = group.lineIds.some((id) =>
                      evidence.has(id),
                    );
                    const modified = group.text !== group.originalText;
                    return (
                      <section
                        key={group.id}
                        className={cn(
                          'overflow-hidden rounded-xl border bg-card',
                          containsEvidence &&
                            'border-[color:var(--evidence-border)]',
                        )}
                      >
                        <div className="flex items-start gap-3 p-4 sm:p-5">
                          <code className="pt-1 text-xs font-bold text-muted-foreground">
                            {group.id}
                          </code>
                          <div className="min-w-0 flex-1">
                            <p className="text-base leading-7">{group.text}</p>
                            {modified && (
                              <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--insight-strong)]">
                                Edited
                              </span>
                            )}
                          </div>
                          <Button
                            aria-label={`Edit ${group.id}`}
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditor('group', group.id)}
                          >
                            <PencilLine />
                          </Button>
                        </div>
                        <details
                          key={`${group.id}-${selected?.id ?? 'none'}`}
                          open={containsEvidence || undefined}
                          className="border-t bg-muted/15"
                        >
                          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted-foreground marker:text-muted-foreground sm:px-5">
                            {groupLines.length} detailed Summary lines
                          </summary>
                          <ol className="space-y-1 border-t p-2 sm:p-3">
                            {groupLines.map(renderSummaryLine)}
                          </ol>
                        </details>
                      </section>
                    );
                  })
                ) : (
                  <ol className="space-y-1 rounded-xl border bg-card p-2 sm:p-3">
                    {active.summaryLines.map(renderSummaryLine)}
                  </ol>
                )}
              </div>
            ) : (
              <EmptyState
                label="No Summary lines yet"
                onAdd={() => openCreate('summary')}
              />
            )}
          </ScrollArea>
        </section>

        <section className="min-w-0" aria-labelledby="insights-heading">
          <div className="flex h-14 items-center justify-between border-b bg-muted/30 px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-muted-foreground" />
              <h2 id="insights-heading" className="font-semibold">
                Insights
              </h2>
              <Badge variant="secondary">{active.insights.length}</Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openCreate('insight')}
            >
              <Plus data-icon="inline-start" /> Add insight
            </Button>
          </div>
          <ScrollArea className="h-[620px] xl:h-[calc(100vh-7.5rem)]">
            {active.insights.length ? (
              <div className="space-y-3 p-4 sm:p-5">
                {active.insights.map((insight) => {
                  const selectedNow = insight.id === selected?.id;
                  const added = !insight.originalText;
                  const modified =
                    added || insight.text !== insight.originalText;
                  return (
                    <article
                      key={insight.id}
                      className={cn(
                        'rounded-xl border p-4 transition-colors',
                        selectedNow
                          ? 'border-[color:var(--insight-border)] bg-[color:var(--insight-bg)]'
                          : 'bg-card hover:bg-muted/30',
                      )}
                    >
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => setSelectedInsight(insight.id)}
                      >
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div>
                            <span className="font-mono text-xs font-bold text-muted-foreground">
                              {insight.id}
                            </span>
                            <h3 className="mt-1 font-semibold">
                              {insight.title}
                            </h3>
                          </div>
                          {modified && (
                            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--insight-strong)]">
                              {added ? 'Added' : 'Edited'}
                            </span>
                          )}
                        </div>
                        <p className="text-base leading-7 text-muted-foreground">
                          {insight.text}
                        </p>
                      </button>

                      <div className="mt-4 flex items-end justify-between gap-3 border-t pt-3">
                        <div className="flex min-w-0 flex-wrap gap-1.5">
                          {insight.evidence.length ? (
                            insight.evidence.map((line) => (
                              <span
                                key={line}
                                className="rounded-md border border-[color:var(--evidence-border)] bg-[color:var(--evidence-bg)] px-1.5 py-0.5 font-mono text-xs font-semibold text-[color:var(--evidence-strong)]"
                              >
                                {line}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No evidence linked
                            </span>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button
                            aria-label={`Edit ${insight.id}`}
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditor('insight', insight.id)}
                          >
                            <PencilLine />
                          </Button>
                          <Button
                            aria-label={`Remove ${insight.id}`}
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              setDeleteTarget({
                                kind: 'insight',
                                id: insight.id,
                              })
                            }
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                label="No Insights yet"
                onAdd={() => openCreate('insight')}
              />
            )}
          </ScrollArea>
        </section>
      </div>

      <Sheet
        open={Boolean(editorTarget)}
        onOpenChange={(open) => {
          if (!open) setEditorTarget(null);
        }}
      >
        <SheetContent className="h-dvh max-h-dvh gap-0 overflow-hidden sm:max-w-xl">
          <SheetHeader className="shrink-0 border-b px-6 py-5">
            <SheetTitle>
              {editorTarget?.mode === 'add' ? 'Add' : 'Edit'}{' '}
              {editorTarget?.kind === 'trajectory'
                ? 'Trajectory summary'
                : editorTarget?.kind === 'group'
                  ? `Summary group ${editorTarget.id}`
                  : editorTarget?.kind === 'summary'
                    ? `Summary line ${editorTarget.id}`
                    : `Insight ${editorTarget?.id ?? ''}`}
            </SheetTitle>
            <SheetDescription>
              This change is included in the next saved revision.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="min-h-0 flex-1 overscroll-contain">
            <div className="space-y-6 p-6">
              {editorTarget?.kind === 'insight' && (
                <label htmlFor="insight-title" className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Title
                  </span>
                  <Input
                    id="insight-title"
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    placeholder="Insight title"
                  />
                </label>
              )}
              {editorTarget?.mode === 'edit' && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Original generated text
                  </p>
                  <div className="rounded-xl border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
                    {editorTarget.kind === 'trajectory'
                      ? active.trajectorySummary.originalText
                      : editorTarget.kind === 'group'
                        ? active.summaryGroups.find(
                            (group) => group.id === editorTarget.id,
                          )?.originalText || 'Added during review'
                        : editorTarget.kind === 'summary'
                          ? active.summaryLines.find(
                              (line) => line.id === editorTarget.id,
                            )?.originalText || 'Added during review'
                          : active.insights.find(
                              (insight) => insight.id === editorTarget.id,
                            )?.originalText || 'Added during review'}
                  </div>
                </div>
              )}
              <label htmlFor="reviewed-text" className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {editorTarget?.kind === 'summary'
                    ? 'Line text'
                    : editorTarget?.kind === 'insight'
                      ? 'Insight text'
                      : 'Summary text'}
                </span>
                <Textarea
                  id="reviewed-text"
                  className="min-h-40 resize-y text-base leading-7"
                  value={draftText}
                  onChange={(event) => setDraftText(event.target.value)}
                />
              </label>
              {editorTarget?.kind === 'insight' && (
                <label htmlFor="evidence-lines" className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Summary evidence
                  </span>
                  <Input
                    id="evidence-lines"
                    className="font-mono"
                    value={draftEvidence}
                    onChange={(event) => setDraftEvidence(event.target.value)}
                    placeholder="L001, L004"
                  />
                  <span className="text-xs text-muted-foreground">
                    Comma-separated line IDs. Leave empty for no evidence.
                  </span>
                </label>
              )}
              <label htmlFor="change-note" className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Revision note (optional)
                </span>
                <Textarea
                  id="change-note"
                  className="min-h-20 resize-y"
                  value={changeNote}
                  onChange={(event) => setChangeNote(event.target.value)}
                />
              </label>
            </div>
          </ScrollArea>
          <SheetFooter className="mt-0 shrink-0 border-t bg-muted/35 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setEditorTarget(null)}>
              Cancel
            </Button>
            <Button onClick={applyEditor} disabled={!draftText.trim()}>
              {editorTarget?.mode === 'add' ? 'Add item' : 'Apply edit'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleteTarget?.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.kind === 'summary' && referencesToDelete > 0
                ? `This line is cited by ${referencesToDelete} insight${referencesToDelete === 1 ? '' : 's'}. Those evidence links will also be removed.`
                : 'The item will disappear from the reviewed output. The original generated version remains in revision history.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function EmptyState({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="grid min-h-72 place-items-center p-8 text-center">
      <div>
        <FilePlus2 className="mx-auto mb-3 size-7 text-muted-foreground" />
        <p className="mb-4 text-sm text-muted-foreground">{label}</p>
        <Button variant="outline" onClick={onAdd}>
          <Plus data-icon="inline-start" /> Add one
        </Button>
      </div>
    </div>
  );
}
