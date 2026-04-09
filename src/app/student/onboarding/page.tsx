"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/auth-store";
import {
  getStudentProfile,
  studentProfileView,
  updateStudentProfile,
} from "@/lib/student-api";
import {
  listUniversities,
  listDegreePrograms,
} from "@/lib/reference-api";

type StepId = "basics" | "university" | "preferences" | "review";

const steps: { id: StepId; title: string; description: string }[] = [
  {
    id: "basics",
    title: "Basis",
    description: "Name, Kontakt, Kurzprofil",
  },
  {
    id: "university",
    title: "Hochschule",
    description: "Uni/FH, Studiengang, Semester, Abschluss",
  },
  {
    id: "preferences",
    title: "Ziele",
    description: "Rollen, Regionen, Arbeitsmodell, Verfügbarkeit",
  },
  {
    id: "review",
    title: "Review",
    description: "Check, Visibility Defaults, Start",
  },
];

const schema = z.object({
  headline: z.string().max(120).optional(),
  summary: z.string().max(600).optional(),
  universityId: z.string().optional(),
  degreeProgramId: z.string().optional(),
  semester: z.string().optional(),
  plannedGradDate: z.string().optional(),
  desiredRoles: z.string().optional(),
  regions: z.string().optional(),
  languages: z.string().optional(),
  workModel: z.string().max(60).optional(),
  availability: z.string().max(120).optional(),
});

type FormValues = z.infer<typeof schema>;

function splitList(v?: string) {
  const items =
    v
      ?.split(",")
      .map((x) => x.trim())
      .filter(Boolean) ?? [];
  return items.length ? items : undefined;
}

function parseSemester(v?: string): number | undefined {
  if (!v?.trim()) return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 1 || n > 30) return undefined;
  return Math.round(n);
}

export default function StudentOnboardingPage() {
  const [step, setStep] = React.useState<StepId>("basics");
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();

  const activeIndex = steps.findIndex((s) => s.id === step);

  const profileQuery = useQuery({
    queryKey: ["student", "profile"],
    queryFn: () => getStudentProfile(token!),
    enabled: Boolean(token),
  });

  const universitiesQuery = useQuery({
    queryKey: ["reference", "universities"],
    queryFn: () => listUniversities(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      headline: "",
      summary: "",
      universityId: "",
      degreeProgramId: "",
      semester: "",
      plannedGradDate: "",
      desiredRoles: "",
      regions: "",
      languages: "",
      workModel: "",
      availability: "",
    },
  });

  const universityId = useWatch({
    control: form.control,
    name: "universityId",
    defaultValue: "",
  });

  const programsQuery = useQuery({
    queryKey: ["reference", "degree-programs", universityId],
    queryFn: () => listDegreePrograms(universityId!),
    enabled: Boolean(universityId),
  });

  React.useEffect(() => {
    if (!profileQuery.data) return;
    const v = studentProfileView(profileQuery.data);
    const grad = v.plannedGradDate
      ? v.plannedGradDate.slice(0, 10)
      : "";
    form.reset({
      headline: v.headline ?? "",
      summary: v.summary ?? "",
      universityId: v.universityId ?? "",
      degreeProgramId: v.degreeProgramId ?? "",
      semester: v.semester != null ? String(v.semester) : "",
      plannedGradDate: grad,
      desiredRoles: v.desiredRoles?.join(", ") ?? "",
      regions: v.regions?.join(", ") ?? "",
      languages: v.languages?.join(", ") ?? "",
      workModel: v.workModel ?? "",
      availability: v.availability ?? "",
    });
  }, [profileQuery.data, form]);

  const save = useMutation({
    mutationFn: async (values: FormValues) =>
      updateStudentProfile(token!, {
        headline: values.headline?.trim() || undefined,
        summary: values.summary?.trim() || undefined,
        universityId: values.universityId?.trim() || undefined,
        degreeProgramId: values.degreeProgramId?.trim() || undefined,
        semester: parseSemester(values.semester),
        plannedGradDate: values.plannedGradDate?.trim() || undefined,
        desiredRoles: splitList(values.desiredRoles),
        regions: splitList(values.regions),
        languages: splitList(values.languages),
        workModel: values.workModel?.trim() || undefined,
        availability: values.availability?.trim() || undefined,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["student", "profile"] });
    },
  });

  function next() {
    setStep(steps[Math.min(steps.length - 1, activeIndex + 1)]!.id);
  }

  function prev() {
    setStep(steps[Math.max(0, activeIndex - 1)]!.id);
  }

  const universities = universitiesQuery.data ?? [];
  const programs = programsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Onboarding</h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          Premium, mehrstufig. Fokus auf Schweiz-Fit und Evidence-Profil.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4">
          <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
            Fortschritt
          </div>
          <div className="mt-2 space-y-2">
            {steps.map((s, idx) => {
              const isActive = s.id === step;
              const done = idx < activeIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={[
                    "w-full text-left rounded-[var(--radius-md)] border px-3 py-2 transition-colors",
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
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4">
          {profileQuery.isLoading ? (
            <div className="h-36 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
          ) : profileQuery.isError ? (
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 text-sm">
              Konnte Profil nicht laden.
            </div>
          ) : (
            <>
              {step === "basics" ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Kurzprofil</div>
                    <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                      1–2 Sätze, evidence-first. Kein CV-Sprech.
                    </div>
                  </div>
                  <Input
                    placeholder="z.B. Backend/Systems Student (CH), evidence-first Profil"
                    {...form.register("headline")}
                  />
                  <Textarea
                    placeholder="Kurzsummary: Problemräume, Work Proof, Stärken."
                    {...form.register("summary")}
                  />
                </div>
              ) : step === "university" ? (
                <div className="space-y-4">
                  <div className="text-sm font-medium">Hochschule</div>
                  {universitiesQuery.isError ? (
                    <div className="text-sm text-[color:var(--color-muted-foreground)]">
                      Referenzdaten konnten nicht geladen werden. API +{" "}
                      <code className="text-xs">prisma db seed</code> prüfen.
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
                      Hochschule / FH
                    </div>
                    <select
                      className="flex h-10 w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 text-sm"
                      value={universityId}
                      onChange={(e) => {
                        form.setValue("universityId", e.target.value);
                        form.setValue("degreeProgramId", "");
                      }}
                      disabled={universitiesQuery.isPending}
                    >
                      <option value="">Auswählen…</option>
                      {universities.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.shortName ? `${u.shortName} — ${u.name}` : u.name}
                          {u.city ? ` (${u.city})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
                      Studiengang
                    </div>
                    <select
                      className="flex h-10 w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 text-sm"
                      {...form.register("degreeProgramId")}
                      disabled={!universityId || programsQuery.isPending}
                    >
                      <option value="">
                        {universityId ? "Auswählen…" : "Zuerst Hochschule wählen"}
                      </option>
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.level} {p.name} · {p.category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
                        Semester (optional)
                      </div>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        placeholder="z.B. 5"
                        {...form.register("semester")}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
                        Geplanter Abschluss (optional)
                      </div>
                      <Input type="date" {...form.register("plannedGradDate")} />
                    </div>
                  </div>
                </div>
              ) : step === "preferences" ? (
                <div className="space-y-4">
                  <div className="text-sm font-medium">Ziele & Setup</div>
                  <Input
                    placeholder="Wunschrollen (Komma-getrennt)"
                    {...form.register("desiredRoles")}
                  />
                  <Input
                    placeholder="Regionen (Komma-getrennt)"
                    {...form.register("regions")}
                  />
                  <Input
                    placeholder="Sprachen (z.B. Deutsch, Englisch)"
                    {...form.register("languages")}
                  />
                  <Input
                    placeholder="Arbeitsmodell (z.B. Hybrid, Remote)"
                    {...form.register("workModel")}
                  />
                  <Input
                    placeholder="Verfügbarkeit (z.B. ab Sep 2026 · 60–80%)"
                    {...form.register("availability")}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm font-medium">Review</div>
                  <p className="text-sm text-[color:var(--color-muted-foreground)]">
                    Als nächstes: Visibility Defaults setzen und erste Arbeit
                    einreichen.
                  </p>
                  <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3 text-sm">
                    Default: <span className="font-medium">Employer-only</span> bis
                    du explizit public stellst.
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={form.handleSubmit((v) => save.mutate(v))}
                      disabled={save.isPending}
                    >
                      {save.isPending ? "…" : "Speichern"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/student")}
                      disabled={save.isPending}
                    >
                      Zum Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              disabled={activeIndex <= 0}
              onClick={prev}
            >
              Zurück
            </Button>
            <Button
              onClick={() => {
                if (step === "review") return;
                form.handleSubmit((v) => save.mutate(v))();
                next();
              }}
              disabled={save.isPending}
            >
              Weiter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
