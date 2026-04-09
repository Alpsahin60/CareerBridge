"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { createVerificationRequest, getStudentWork } from "@/lib/work-api";
import { workTypeLabels } from "@/lib/work-types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  VerificationBadge,
  type VerificationStatus,
} from "@/components/trust/verification-badge";
import {
  VerificationTimeline,
  type TimelineItem,
} from "@/components/trust/verification-timeline";

export default function StudentWorkDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  const [targetEmail, setTargetEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const query = useQuery({
    queryKey: ["student", "works", "detail", id],
    queryFn: () => getStudentWork(token!, id),
    enabled: Boolean(token && id),
  });

  const requestMutation = useMutation({
    mutationFn: () =>
      createVerificationRequest(token!, id, {
        targetEmail: targetEmail.trim() || undefined,
        message: message.trim() || undefined,
      }),
    onSuccess: async () => {
      setTargetEmail("");
      setMessage("");
      await qc.invalidateQueries({ queryKey: ["student", "works"] });
      await qc.invalidateQueries({ queryKey: ["student", "works", "detail", id] });
    },
  });

  if (query.isLoading) return <div className="text-sm">Laden…</div>;
  if (query.isError || !query.data)
    return (
      <div className="space-y-3">
        <div className="text-sm">Work nicht gefunden.</div>
        <Button asChild variant="outline" size="sm">
          <Link href="/student/work">Zurück</Link>
        </Button>
      </div>
    );

  const w = query.data;
  const timelineItems: TimelineItem[] = (w.verificationRequests ?? []).map(
    (r) => ({
      id: r.id,
      title: `Request · ${r.status}`,
      meta: new Date(r.createdAt).toLocaleDateString("de-CH"),
      content: (
        <>
          {r.targetEmail ? (
            <div className="text-xs text-[color:var(--color-muted-foreground)]">
              {r.targetEmail}
            </div>
          ) : null}
          {r.message ? <div className="mt-1">{r.message}</div> : null}
        </>
      ),
    })
  );
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs text-[color:var(--color-muted-foreground)]">
            {workTypeLabels[w.type]} · {w.status} · {w.visibility}
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{w.title}</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/student/work">Zur Übersicht</Link>
        </Button>
      </div>

      <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Abstract</div>
            <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
              {w.abstract}
            </div>
          </div>
          <VerificationBadge
            status={
              (w.verification?.status ?? "unverified") as VerificationStatus
            }
          />
        </div>
        <div className="mt-4 text-xs text-[color:var(--color-muted-foreground)]">
          Verification Status: {w.verification?.status ?? "unverified"}
        </div>
      </div>

      <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Verification Request</div>
            <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
              Bitte eine Betreuungsperson oder Institution um Bestätigung. Jede
              Anfrage wird historisiert.
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">Verifier E-Mail (optional)</div>
            <Input
              placeholder="name@hochschule.ch"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Nachricht (optional)</div>
            <Textarea
              placeholder="Kurz, professionell, kontextreich. Bitte um Bestätigung, inkl. Kontext (Kurs/Institut/Betreuung)."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-[color:var(--color-muted-foreground)]">
            Status: {w.verification?.status ?? "unverified"}
          </div>
          <Button
            onClick={() => requestMutation.mutate()}
            disabled={requestMutation.isPending || Boolean(!targetEmail.trim() && !message.trim())}
          >
            {requestMutation.isPending ? "…" : "Verification anfragen"}
          </Button>
        </div>
        {requestMutation.isError ? (
          <div className="mt-3 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3 text-sm">
            Konnte Anfrage nicht erstellen.
          </div>
        ) : null}
        {requestMutation.isSuccess ? (
          <div className="mt-3 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3 text-sm">
            Anfrage erstellt. Du siehst den Status in der Historie.
          </div>
        ) : null}

        {w.verificationRequests?.length ? (
          <div className="mt-6 space-y-2">
            <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
              Historie
            </div>
            <VerificationTimeline items={timelineItems} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

