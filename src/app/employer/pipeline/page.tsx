"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/auth-store";
import {
  listEmployerBookmarks,
  type EmployerBookmark,
  type PipelineStage,
} from "@/lib/employer-workspace-api";
import { workTypeLabels, type WorkType } from "@/lib/work-types";
import {
  VerificationBadge,
  type VerificationStatus,
} from "@/components/trust/verification-badge";

const COLUMNS: { stage: PipelineStage; label: string }[] = [
  { stage: "saved", label: "Saved" },
  { stage: "shortlist", label: "Shortlist" },
  { stage: "contacted", label: "Contacted" },
  { stage: "archived", label: "Archived" },
];

function Card({ b }: { b: EmployerBookmark }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3">
      <div className="text-xs font-medium line-clamp-2">{b.work.title}</div>
      <div className="mt-1 text-[10px] text-[color:var(--color-muted-foreground)]">
        {workTypeLabels[b.work.type as WorkType] ?? b.work.type}
      </div>
      <div className="mt-2">
        <VerificationBadge
          status={
            (b.work.verification?.status ?? "unverified") as VerificationStatus
          }
        />
      </div>
    </div>
  );
}

export default function EmployerPipelinePage() {
  const token = useAuthStore((s) => s.accessToken);

  const query = useQuery({
    queryKey: ["employer", "bookmarks"],
    queryFn: () => listEmployerBookmarks(token!),
    enabled: Boolean(token),
  });

  const byStage = React.useMemo(() => {
    const m = new Map<PipelineStage, EmployerBookmark[]>();
    for (const c of COLUMNS) m.set(c.stage, []);
    for (const b of query.data ?? []) {
      const list = m.get(b.stage as PipelineStage) ?? [];
      list.push(b);
      m.set(b.stage as PipelineStage, list);
    }
    return m;
  }, [query.data]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Pipeline</h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          Kanban nach Stage — bearbeiten auf der Saved-Seite.
        </p>
      </div>

      {query.isLoading ? (
        <div className="h-40 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => (
            <div
              key={col.stage}
              className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-3"
            >
              <div className="text-xs font-semibold">{col.label}</div>
              <div className="mt-2 space-y-2">
                {(byStage.get(col.stage) ?? []).length === 0 ? (
                  <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
                    —
                  </div>
                ) : (
                  (byStage.get(col.stage) ?? []).map((b) => (
                    <Card key={b.id} b={b} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
