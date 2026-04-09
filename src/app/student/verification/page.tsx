"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { listVerificationRequests } from "@/lib/work-api";
import {
  VerificationBadge,
  type VerificationStatus,
} from "@/components/trust/verification-badge";
import { workTypeLabels } from "@/lib/work-types";
import {
  VerificationTimeline,
  type TimelineItem,
} from "@/components/trust/verification-timeline";

export default function StudentVerificationPage() {
  const token = useAuthStore((s) => s.accessToken);
  const query = useQuery({
    queryKey: ["student", "verification", "requests"],
    queryFn: () => listVerificationRequests(token!),
    enabled: Boolean(token),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Verification</h1>
          <p className="text-sm text-[color:var(--color-muted-foreground)]">
            Deine Verification Requests über alle Works — historisiert und nachvollziehbar.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/student/work">Zu Work</Link>
        </Button>
      </div>

      {query.isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="h-28 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
          <div className="h-28 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
        </div>
      ) : query.isError ? (
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm">
          Konnte Verification Requests nicht laden.
        </div>
      ) : (query.data?.length ?? 0) === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm text-[color:var(--color-muted-foreground)]">
          Noch keine Requests. Starte in einer Arbeit eine Verification Anfrage.
        </div>
      ) : (
        <VerificationTimeline
          items={query.data!.map<TimelineItem>((r) => ({
            id: r.id,
            title: r.work.title,
            meta: new Date(r.createdAt).toLocaleDateString("de-CH"),
            content: (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[color:var(--color-muted-foreground)]">
                    {workTypeLabels[r.work.type]} · Request: {r.status}
                    {r.targetEmail ? ` · ${r.targetEmail}` : ""}
                  </span>
                  <VerificationBadge
                    status={
                      (r.work.verification?.status ?? "unverified") as VerificationStatus
                    }
                  />
                  <Link
                    href={`/student/work/${r.work.id}`}
                    className="text-xs font-medium text-[color:var(--color-foreground)] hover:underline"
                  >
                    Öffnen
                  </Link>
                </div>
                {r.message ? (
                  <div className="line-clamp-2">{r.message}</div>
                ) : null}
              </div>
            ),
          }))}
        />
      )}
    </div>
  );
}

