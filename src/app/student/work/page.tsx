"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { listStudentWorks } from "@/lib/work-api";
import { workTypeLabels } from "@/lib/work-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StudentWorkPage() {
  const token = useAuthStore((s) => s.accessToken);
  const query = useQuery({
    queryKey: ["student", "works"],
    queryFn: () => listStudentWorks(token!),
    enabled: Boolean(token),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Work</h1>
          <p className="text-sm text-[color:var(--color-muted-foreground)]">
            Deine Arbeiten sind das stärkste Discovery-Signal.
          </p>
        </div>
        <Button asChild>
          <Link href="/student/work/new">Work einreichen</Link>
        </Button>
      </div>

      {query.isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="h-28 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
          <div className="h-28 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
        </div>
      ) : query.isError ? (
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm">
          Konnte Work nicht laden.
        </div>
      ) : (query.data?.length ?? 0) === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm text-[color:var(--color-muted-foreground)]">
          Noch keine Einträge. Reiche deine erste Arbeit ein, um Verified Work aufzubauen.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {query.data!.map((w) => (
            <Card key={w.id} className="bg-[color:var(--color-background)]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span className="truncate">{w.title}</span>
                  <span className="shrink-0 rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-[10px] text-[color:var(--color-muted-foreground)]">
                    {w.status}
                  </span>
                </CardTitle>
                <CardDescription className="truncate">
                  {workTypeLabels[w.type]} · {w.visibility}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-[color:var(--color-muted-foreground)] line-clamp-2">
                  {w.abstract}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-[color:var(--color-muted-foreground)]">
                    Verification: {w.verification?.status ?? "—"}
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/student/work/${w.id}`}>Öffnen</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

