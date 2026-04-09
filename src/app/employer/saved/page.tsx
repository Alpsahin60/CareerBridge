"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import { useAuthStore } from "@/lib/auth-store";
import {
  deleteEmployerBookmark,
  listEmployerBookmarks,
  updateEmployerBookmark,
  type PipelineStage,
} from "@/lib/employer-workspace-api";
import { workTypeLabels, type WorkType } from "@/lib/work-types";
import { Button } from "@/components/ui/button";
import {
  VerificationBadge,
  type VerificationStatus,
} from "@/components/trust/verification-badge";

const STAGES: PipelineStage[] = [
  "saved",
  "shortlist",
  "contacted",
  "archived",
];

export default function EmployerSavedPage() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["employer", "bookmarks"],
    queryFn: () => listEmployerBookmarks(token!),
    enabled: Boolean(token),
  });

  const patchMut = useMutation({
    mutationFn: ({
      workId,
      stage,
    }: {
      workId: string;
      stage: PipelineStage;
    }) => updateEmployerBookmark(token!, workId, { stage }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["employer", "bookmarks"] });
    },
  });

  const delMut = useMutation({
    mutationFn: (workId: string) => deleteEmployerBookmark(token!, workId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["employer", "bookmarks"] });
    },
  });

  const rows = query.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Saved</h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          Gespeicherte Works — Stage steuert deine Pipeline (auch auf der
          Pipeline-Seite sichtbar).
        </p>
      </div>

      {query.isLoading ? (
        <div className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
      ) : rows.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm text-[color:var(--color-muted-foreground)]">
          Noch nichts gespeichert. In{" "}
          <Link href="/employer/discovery" className="underline">
            Discovery
          </Link>{" "}
          auf &quot;Zu Saved&quot; klicken.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((b) => (
            <div
              key={b.id}
              className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="text-sm font-medium">{b.work.title}</div>
                  <div className="text-xs text-[color:var(--color-muted-foreground)]">
                    {workTypeLabels[b.work.type as WorkType] ?? b.work.type}
                  </div>
                  <div className="mt-1">
                    <VerificationBadge
                      status={
                        (b.work.verification?.status ??
                          "unverified") as VerificationStatus
                      }
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-[color:var(--color-muted-foreground)]">
                    {b.work.abstract}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <select
                    className="h-9 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-2 text-xs"
                    value={b.stage}
                    onChange={(e) =>
                      patchMut.mutate({
                        workId: b.workId,
                        stage: e.target.value as PipelineStage,
                      })
                    }
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={delMut.isPending}
                    onClick={() => delMut.mutate(b.workId)}
                  >
                    Entfernen
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
