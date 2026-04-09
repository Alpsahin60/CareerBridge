"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import { useAuthStore } from "@/lib/auth-store";
import {
  listIncomingInterest,
  respondIncomingInterest,
} from "@/lib/student-engagement-api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function StudentInterestPage() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  const [notes, setNotes] = React.useState<Record<string, string>>({});

  const query = useQuery({
    queryKey: ["student", "interest-incoming"],
    queryFn: () => listIncomingInterest(token!),
    enabled: Boolean(token),
  });

  const respondMut = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "accepted" | "declined";
    }) =>
      respondIncomingInterest(token!, id, {
        status,
        studentNote: notes[id]?.trim() || undefined,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["student", "interest-incoming"] });
      await qc.invalidateQueries({ queryKey: ["student", "notifications"] });
    },
  });

  const rows = query.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Kontaktanfragen
        </h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          Employers, die Interesse an deinen Works signalisieren. Antwort löst
          eine Notification beim Employer aus.
        </p>
      </div>

      {query.isLoading ? (
        <div className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
      ) : rows.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm text-[color:var(--color-muted-foreground)]">
          Keine Anfragen. Sobald ein Employer eine{" "}
          <Link href="/student/work" className="underline">
            Kontaktanfrage
          </Link>{" "}
          sendet, erscheint sie hier.
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">
                    {r.employer.companyName}
                  </div>
                  <div className="text-xs text-[color:var(--color-muted-foreground)]">
                    {r.employer.hqCity ?? "CH"} · Work: {r.work.title}
                  </div>
                </div>
                <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-[10px] uppercase">
                  {r.status}
                </span>
              </div>
              {r.message ? (
                <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
                  {r.message}
                </p>
              ) : null}
              {r.status === "pending" ? (
                <div className="mt-3 space-y-2">
                  <Textarea
                    className="min-h-[64px] text-sm"
                    placeholder="Optionale Nachricht an den Employer…"
                    value={notes[r.id] ?? ""}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))
                    }
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      disabled={respondMut.isPending}
                      onClick={() =>
                        respondMut.mutate({ id: r.id, status: "accepted" })
                      }
                    >
                      Zusagen
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={respondMut.isPending}
                      onClick={() =>
                        respondMut.mutate({ id: r.id, status: "declined" })
                      }
                    >
                      Ablehnen
                    </Button>
                  </div>
                </div>
              ) : r.studentNote ? (
                <p className="mt-2 text-xs">Deine Antwort: {r.studentNote}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
