"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
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

export default function StudentProfilePage() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();

  const query = useQuery({
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
      github: "",
      linkedin: "",
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
    if (!query.data) return;
    const v = studentProfileView(query.data);
    const links = v.links ?? {};
    const grad = v.plannedGradDate ? v.plannedGradDate.slice(0, 10) : "";
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
      github: links.github ?? "",
      linkedin: links.linkedin ?? "",
    });
  }, [query.data, form]);

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
        links: {
          ...(values.github?.trim() ? { github: values.github.trim() } : {}),
          ...(values.linkedin?.trim() ? { linkedin: values.linkedin.trim() } : {}),
        },
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["student", "profile"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Profil</h1>
          <p className="text-sm text-[color:var(--color-muted-foreground)]">
            Evidence-first. Kurz, präzise, überprüfbar.
          </p>
        </div>
        <Button
          onClick={form.handleSubmit((v) => save.mutate(v))}
          disabled={save.isPending || query.isLoading}
        >
          {save.isPending ? "…" : "Speichern"}
        </Button>
      </div>

      {query.isLoading ? (
        <div className="h-40 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
      ) : query.isError ? (
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm">
          Konnte Profil nicht laden.
        </div>
      ) : (
        <form className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">Headline</div>
            <Input placeholder="z.B. Backend/Systems Student (CH), evidence-first Profil" {...form.register("headline")} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Verfügbarkeit</div>
            <Input placeholder="z.B. ab Sep 2026 · 60–80% · Zürich/Remote CH" {...form.register("availability")} />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <div className="text-sm font-medium">Summary</div>
            <Textarea placeholder="1–3 Sätze: Problemräume, Work Proof, Stärken. Kein CV-Sprech." {...form.register("summary")} />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <div className="text-sm font-medium">Hochschule</div>
            <p className="text-xs text-[color:var(--color-muted-foreground)]">
              Referenzdaten aus Seed (CH). Ohne DB/Seed bleiben Listen leer.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
                  Institution
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
                  {(universitiesQuery.data ?? []).map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.shortName ? `${u.shortName} — ${u.name}` : u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
                  Studiengang
                </div>
                <select
                  className="flex h-10 w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 text-sm"
                  {...form.register("degreeProgramId")}
                  disabled={!universityId || programsQuery.isPending}
                >
                  <option value="">
                    {universityId ? "Auswählen…" : "Zuerst Hochschule"}
                  </option>
                  {(programsQuery.data ?? []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.level} {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
                  Semester
                </div>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  placeholder="optional"
                  {...form.register("semester")}
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
                  Abschluss (Datum)
                </div>
                <Input type="date" {...form.register("plannedGradDate")} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Wunschrollen</div>
            <Input placeholder="Komma-getrennt (z.B. Backend Engineer, Data Engineer)" {...form.register("desiredRoles")} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Regionen</div>
            <Input placeholder="Komma-getrennt (z.B. Zürich, Bern, Basel, Remote CH)" {...form.register("regions")} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Sprachen</div>
            <Input placeholder="Komma-getrennt (z.B. Deutsch, Englisch, Französisch)" {...form.register("languages")} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Arbeitsmodell</div>
            <Input placeholder="z.B. Hybrid, Remote-first, Onsite" {...form.register("workModel")} />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">GitHub</div>
            <Input placeholder="https://github.com/…" {...form.register("github")} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">LinkedIn</div>
            <Input placeholder="https://linkedin.com/in/…" {...form.register("linkedin")} />
          </div>

          {save.isError ? (
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4 text-sm lg:col-span-2">
              Speichern fehlgeschlagen.
            </div>
          ) : null}
          {save.isSuccess ? (
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4 text-sm lg:col-span-2">
              Gespeichert.
            </div>
          ) : null}
        </form>
      )}
    </div>
  );
}

