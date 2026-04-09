"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";
import {
  listDiscoveryWorks,
  type DiscoveryWorkResult,
} from "@/lib/employer-discovery-api";
import {
  createEmployerInterest,
  listEmployerBookmarks,
  saveEmployerBookmark,
} from "@/lib/employer-workspace-api";
import { workTypeLabels, type WorkType } from "@/lib/work-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  VerificationBadge,
  type VerificationStatus,
} from "@/components/trust/verification-badge";
import { cn } from "@/lib/cn";

const WORK_TYPES = Object.keys(workTypeLabels) as WorkType[];

function ResultRow({
  work,
  active,
  saved,
  compareOn,
  onClick,
  onToggleCompare,
}: {
  work: DiscoveryWorkResult;
  active: boolean;
  saved: boolean;
  compareOn: boolean;
  onClick: () => void;
  onToggleCompare: () => void;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-[var(--radius-xl)] border p-4 text-left transition-colors",
        active
          ? "border-[color:var(--color-ring)] bg-[color:var(--color-accent)]"
          : "border-[color:var(--color-border)] bg-[color:var(--color-background)]"
      )}
    >
      <div className="flex items-start gap-2">
        <button type="button" onClick={onClick} className="min-w-0 flex-1 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">{work.title}</div>
              <div className="text-xs text-[color:var(--color-muted-foreground)]">
                {workTypeLabels[work.workType as WorkType] ?? work.workType}
                {typeof work.matchScore === "number"
                  ? ` · Match ${work.matchScore}`
                  : ""}
              </div>
              {work.studentDisplayName ||
              work.universityName ||
              work.degreeLabel ? (
                <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
                  {[work.studentDisplayName, work.universityName, work.degreeLabel]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              ) : null}
            </div>
            <VerificationBadge
              status={work.verificationStatus as VerificationStatus}
            />
          </div>
          {work.summary ? (
            <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)] line-clamp-2">
              {work.summary}
            </div>
          ) : null}
        </button>
        <label className="flex shrink-0 cursor-pointer flex-col items-center gap-1 text-[10px] text-[color:var(--color-muted-foreground)]">
          <input
            type="checkbox"
            checked={compareOn}
            onChange={onToggleCompare}
            className="rounded border-[color:var(--color-border)]"
          />
          Compare
        </label>
      </div>
      {saved ? (
        <div className="mt-2 text-[10px] font-medium text-[color:var(--color-muted-foreground)]">
          In Saved / Pipeline
        </div>
      ) : null}
    </div>
  );
}

export default function EmployerDiscoveryPage() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  const [searchInput, setSearchInput] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [workTypeFilter, setWorkTypeFilter] = React.useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [compareIds, setCompareIds] = React.useState<string[]>([]);
  const [interestMsg, setInterestMsg] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const discoveryQuery = useQuery({
    queryKey: [
      "employer",
      "discovery",
      "works",
      debouncedSearch,
      workTypeFilter,
      verifiedOnly,
    ],
    queryFn: () =>
      listDiscoveryWorks(token!, {
        q: debouncedSearch.trim() || undefined,
        workType: workTypeFilter || undefined,
        filter: verifiedOnly ? "verified_only" : "all",
      }),
    enabled: Boolean(token),
  });

  const bookmarksQuery = useQuery({
    queryKey: ["employer", "bookmarks"],
    queryFn: () => listEmployerBookmarks(token!),
    enabled: Boolean(token),
  });

  const savedByWorkId = React.useMemo(() => {
    const m = new Map<string, boolean>();
    for (const b of bookmarksQuery.data ?? []) m.set(b.workId, true);
    return m;
  }, [bookmarksQuery.data]);

  const saveMut = useMutation({
    mutationFn: (workId: string) => saveEmployerBookmark(token!, workId, {}),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["employer", "bookmarks"] });
    },
  });

  const interestMut = useMutation({
    mutationFn: ({ workId, message }: { workId: string; message?: string }) =>
      createEmployerInterest(token!, workId, { message }),
    onSuccess: async () => {
      setInterestMsg("");
      await qc.invalidateQueries({ queryKey: ["employer", "interest"] });
    },
  });

  const rows = React.useMemo(
    () => discoveryQuery.data ?? [],
    [discoveryQuery.data]
  );
  const active = rows.find((w) => w.id === activeId) ?? rows[0] ?? null;

  React.useEffect(() => {
    if (!activeId && rows[0]?.id) setActiveId(rows[0].id);
  }, [activeId, rows]);

  React.useEffect(() => {
    setInterestMsg("");
  }, [activeId]);

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  const compareWorks = compareIds
    .map((id) => rows.find((w) => w.id === id))
    .filter(Boolean) as DiscoveryWorkResult[];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Discovery</h1>
          <p className="text-sm text-[color:var(--color-muted-foreground)]">
            Server-seitige Filter, Saved, Compare (max. 3), Kontaktanfrage.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4">
            <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
              Suche & Match
            </div>
            <div className="mt-2">
              <Input
                placeholder="Titel / Abstract…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="mt-3 space-y-2">
              <div className="text-[10px] font-medium text-[color:var(--color-muted-foreground)]">
                Work-Typ
              </div>
              <select
                className="flex h-9 w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-2 text-xs"
                value={workTypeFilter}
                onChange={(e) => setWorkTypeFilter(e.target.value)}
              >
                <option value="">Alle</option>
                {WORK_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {workTypeLabels[t]}
                  </option>
                ))}
              </select>
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              Nur verified Works
            </label>
          </div>

          {discoveryQuery.isLoading ? (
            <div className="space-y-2">
              <div className="h-24 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
              <div className="h-24 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
            </div>
          ) : discoveryQuery.isError ? (
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4 text-sm">
              {discoveryQuery.error instanceof ApiError &&
              discoveryQuery.error.status === 403
                ? "Discovery ist für Employer-Konten vorgesehen."
                : "Konnte Discovery nicht laden."}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4 text-sm text-[color:var(--color-muted-foreground)]">
              Keine Treffer für die aktuellen Filter.
            </div>
          ) : (
            <div className="space-y-2">
              {rows.map((w) => (
                <ResultRow
                  key={w.id}
                  work={w}
                  active={w.id === activeId}
                  saved={Boolean(savedByWorkId.get(w.id))}
                  compareOn={compareIds.includes(w.id)}
                  onClick={() => setActiveId(w.id)}
                  onToggleCompare={() => toggleCompare(w.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6">
            {active ? (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-[color:var(--color-muted-foreground)]">
                      Work Preview
                    </div>
                    <div className="mt-1 text-lg font-semibold tracking-tight">
                      {active.title}
                    </div>
                  </div>
                  <VerificationBadge
                    status={active.verificationStatus as VerificationStatus}
                  />
                </div>
                <div className="text-sm text-[color:var(--color-muted-foreground)]">
                  {active.summary ?? "—"}
                </div>
                {active.studentHeadline ? (
                  <div className="text-sm font-medium">{active.studentHeadline}</div>
                ) : null}
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3">
                    <div className="text-xs font-medium">Match</div>
                    <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
                      {typeof active.matchScore === "number"
                        ? `${active.matchScore}/100`
                        : "—"}
                    </div>
                  </div>
                  <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3">
                    <div className="text-xs font-medium">Typ</div>
                    <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
                      {workTypeLabels[active.workType as WorkType] ??
                        active.workType}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={saveMut.isPending || savedByWorkId.get(active.id)}
                    onClick={() => saveMut.mutate(active.id)}
                  >
                    {savedByWorkId.get(active.id) ? "Gespeichert" : "Zu Saved"}
                  </Button>
                  <Button
                    size="sm"
                    disabled={interestMut.isPending}
                    onClick={() =>
                      interestMut.mutate({
                        workId: active.id,
                        message: interestMsg.trim() || undefined,
                      })
                    }
                  >
                    Kontaktanfrage
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-medium text-[color:var(--color-muted-foreground)]">
                    Nachricht (optional)
                  </div>
                  <Textarea
                    className="min-h-[72px] text-sm"
                    placeholder="Kurz: Rolle, Timing, was ihr prüfen wollt."
                    value={interestMsg}
                    onChange={(e) => setInterestMsg(e.target.value)}
                  />
                </div>
                {interestMut.isSuccess &&
                interestMut.data?.workId === active.id ? (
                  <p className="text-xs text-[color:var(--color-muted-foreground)]">
                    Anfrage gesendet. Student erhält eine In-App Notification.
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="text-sm text-[color:var(--color-muted-foreground)]">
                Wähle links ein Resultat.
              </div>
            )}
          </div>

          {compareWorks.length >= 2 ? (
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4">
              <div className="text-sm font-medium">Compare</div>
              <p className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                Schnellvergleich Abstract + Verification (max. 3).
              </p>
              <div
                className="mt-3 grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${compareWorks.length}, minmax(0,1fr))`,
                }}
              >
                {compareWorks.map((w) => (
                  <div
                    key={w.id}
                    className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3"
                  >
                    <div className="text-xs font-medium line-clamp-2">{w.title}</div>
                    <div className="mt-2">
                      <VerificationBadge
                        status={w.verificationStatus as VerificationStatus}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-[color:var(--color-muted-foreground)] line-clamp-4">
                      {w.summary ?? "—"}
                    </div>
                    <div className="mt-2 text-[10px] text-[color:var(--color-muted-foreground)]">
                      Match {w.matchScore ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
