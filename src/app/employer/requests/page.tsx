"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/auth-store";
import { listEmployerInterest } from "@/lib/employer-workspace-api";
import { workTypeLabels, type WorkType } from "@/lib/work-types";

export default function EmployerRequestsPage() {
  const token = useAuthStore((s) => s.accessToken);

  const query = useQuery({
    queryKey: ["employer", "interest"],
    queryFn: () => listEmployerInterest(token!),
    enabled: Boolean(token),
  });

  const rows = query.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Kontaktanfragen
        </h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          Outbound Interest Requests — Antworten siehst du unter Messages /
          Notifications.
        </p>
      </div>

      {query.isLoading ? (
        <div className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
      ) : rows.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm text-[color:var(--color-muted-foreground)]">
          Noch keine Anfragen gesendet.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">{r.work.title}</div>
                  <div className="text-xs text-[color:var(--color-muted-foreground)]">
                    {workTypeLabels[r.work.type as WorkType] ?? r.work.type}
                  </div>
                </div>
                <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-[10px] uppercase">
                  {r.status}
                </span>
              </div>
              {r.message ? (
                <p className="mt-2 text-xs text-[color:var(--color-muted-foreground)]">
                  {r.message}
                </p>
              ) : null}
              {r.studentNote ? (
                <p className="mt-2 text-xs">
                  Student: {r.studentNote}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
