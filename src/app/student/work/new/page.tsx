"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/lib/auth-store";
import {
  createStudentWorkDraft,
  updateStudentWorkDraft,
  type WorkDraft,
} from "@/lib/work-api";
import type { WorkType } from "@/lib/work-types";

type StepId = "type" | "content" | "assets" | "visibility" | "review";

const steps: { id: StepId; title: string; description: string }[] = [
  { id: "type", title: "Typ", description: "Projekt/Thesis auswählen" },
  { id: "content", title: "Inhalt", description: "Abstract, Kontext, Outcome" },
  { id: "assets", title: "Assets", description: "PDF, Repo, Demo, Screens" },
  { id: "visibility", title: "Sichtbarkeit", description: "Privacy by default" },
  { id: "review", title: "Review", description: "Check + Submit" },
];

export default function StudentWorkNewPage() {
  const [step, setStep] = React.useState<StepId>("type");
  const activeIndex = steps.findIndex((s) => s.id === step);
  const token = useAuthStore((s) => s.accessToken);
  const [draft, setDraft] = React.useState<WorkDraft | null>(null);

  const createDraft = useMutation({
    mutationFn: (type: WorkType) => createStudentWorkDraft(token!, { type }),
    onSuccess: (d) => setDraft(d),
  });

  const updateDraft = useMutation({
    mutationFn: (input: { id: string; title?: string; abstract?: string }) =>
      updateStudentWorkDraft(token!, input.id, {
        title: input.title,
        abstract: input.abstract,
      }),
    onSuccess: (d) => setDraft(d),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Work einreichen</h1>
          <p className="text-sm text-[color:var(--color-muted-foreground)]">
            Das ist der Kern von CareerBridge: strukturierte, überprüfbare Evidence.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/student/work">Zur Übersicht</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Flow</CardTitle>
            <CardDescription>Schrittweise, ohne Reibung.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {steps.map((s, idx) => {
                const isActive = s.id === step;
                const done = idx < activeIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStep(s.id)}
                    className={[
                      "w-full text-left rounded-[var(--radius-lg)] border px-3 py-2 transition-colors",
                      isActive
                        ? "border-[color:var(--color-ring)] bg-[color:var(--color-accent)]"
                        : "border-[color:var(--color-border)] hover:bg-[color:var(--color-accent)]",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">{s.title}</div>
                      <div className="text-[10px] text-[color:var(--color-muted-foreground)]">
                        {done ? "Done" : isActive ? "Active" : "—"}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                      {s.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{steps[activeIndex]?.title}</CardTitle>
            <CardDescription>{steps[activeIndex]?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === "type" ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">Work-Typ</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      ["semester_project", "Semesterprojekt"],
                      ["bachelor_thesis", "Bachelorarbeit"],
                      ["master_thesis", "Masterarbeit"],
                      ["practical_project", "Praxisprojekt"],
                      ["open_source", "Open Source"],
                      ["side_project", "Side Project"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      disabled={!token || createDraft.isPending}
                      onClick={async () => {
                        const d = await createDraft.mutateAsync(id);
                        setDraft(d);
                        setStep("content");
                      }}
                      className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-3 text-left text-sm transition-colors hover:bg-[color:var(--color-accent)] disabled:opacity-60"
                    >
                      <div className="font-medium">{label}</div>
                      <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                        Draft wird erstellt.
                      </div>
                    </button>
                  ))}
                </div>
                {createDraft.isError ? (
                  <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-3 text-sm">
                    Konnte Draft nicht erstellen.
                  </div>
                ) : null}
              </div>
            ) : step === "content" ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">Titel</div>
                <Input
                  placeholder="z.B. Event-driven Matching Pipeline (NestJS + Postgres)"
                  value={draft?.title ?? ""}
                  onChange={(e) =>
                    setDraft((d) => (d ? { ...d, title: e.target.value } : d))
                  }
                  onBlur={() => {
                    if (!draft) return;
                    updateDraft.mutate({ id: draft.id, title: draft.title });
                  }}
                />
                <div className="text-sm font-medium">Abstract</div>
                <Input
                  placeholder="1–2 Sätze: Problem, Ansatz, Resultat."
                  value={draft?.abstract ?? ""}
                  onChange={(e) =>
                    setDraft((d) =>
                      d ? { ...d, abstract: e.target.value } : d
                    )
                  }
                  onBlur={() => {
                    if (!draft) return;
                    updateDraft.mutate({ id: draft.id, abstract: draft.abstract });
                  }}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Technologien (z.B. TS, NestJS, Prisma)" />
                  <Input placeholder="Methoden (z.B. DDD, Testing, CI)" />
                </div>
                {!draft ? (
                  <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-3 text-sm text-[color:var(--color-muted-foreground)]">
                    Wähle zuerst einen Work-Typ, um einen Draft zu erzeugen.
                  </div>
                ) : null}
              </div>
            ) : step === "assets" ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">Assets</div>
                <div className="rounded-[var(--radius-lg)] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm text-[color:var(--color-muted-foreground)]">
                  Upload UX kommt als nächstes (PDF/Screens). Für MVP-Foundation ist
                  die Struktur vorbereitet.
                </div>
                <Input placeholder="Repo URL (optional)" />
                <Input placeholder="Demo URL (optional)" />
              </div>
            ) : step === "visibility" ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">Sichtbarkeit</div>
                <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4 text-sm">
                  Default ist <span className="font-medium">Employer-only</span>.
                  Public nur, wenn du es bewusst möchtest.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm font-medium">Review</div>
                <p className="text-sm text-[color:var(--color-muted-foreground)]">
                  Als nächstes wird dieser Flow mit API + Drafts + Asset Upload +
                  Verification Requests verdrahtet.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                disabled={activeIndex <= 0}
                onClick={() => setStep(steps[Math.max(0, activeIndex - 1)]!.id)}
              >
                Zurück
              </Button>
              <Button
                onClick={() =>
                  setStep(steps[Math.min(steps.length - 1, activeIndex + 1)]!.id)
                }
              >
                Weiter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

