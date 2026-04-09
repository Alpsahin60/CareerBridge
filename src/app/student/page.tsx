"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/auth-store";
import { getStudentProfile } from "@/lib/student-api";
import { listStudentWorks } from "@/lib/work-api";
import {
  computeNextActions,
  computeStudentStrength,
} from "@/lib/student-dashboard-strength";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function visibilityLabel(v: string | undefined) {
  if (v === "public") return "Öffentlich";
  if (v === "hidden") return "Ausgeblendet";
  return "Employer-only (Default)";
}

export default function StudentDashboardPage() {
  const token = useAuthStore((s) => s.accessToken);

  const profileQuery = useQuery({
    queryKey: ["student", "profile"],
    queryFn: () => getStudentProfile(token!),
    enabled: Boolean(token),
  });

  const worksQuery = useQuery({
    queryKey: ["student", "works"],
    queryFn: () => listStudentWorks(token!),
    enabled: Boolean(token),
  });

  const loading = profileQuery.isPending || worksQuery.isPending;
  const profile = profileQuery.data;
  const works = React.useMemo(
    () => worksQuery.data ?? [],
    [worksQuery.data]
  );

  const breakdown = React.useMemo(
    () => computeStudentStrength(profile, works),
    [profile, works]
  );

  const actions = React.useMemo(
    () => computeNextActions(profile, works, breakdown),
    [profile, works, breakdown]
  );

  const strength = breakdown.score;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          Fokus: Evidence aufbauen, verifizieren lassen, Sichtbarkeit kontrollieren.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profilstärke</CardTitle>
            <CardDescription>
              Je mehr Evidence + Verification Context, desto besser wirst du gefunden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="h-9 w-24 animate-pulse rounded-md bg-[color:var(--color-muted)]" />
                <div className="h-2 w-full animate-pulse rounded-full bg-[color:var(--color-muted)]" />
                <div className="grid gap-3 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-[var(--radius-lg)] bg-[color:var(--color-muted)]"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-3xl font-semibold tracking-tight">
                      {strength}
                      <span className="text-base text-[color:var(--color-muted-foreground)]">
                        /100
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
                      Ziel: 70+ für starke Discovery-Sichtbarkeit.
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/student/profile">Profil bearbeiten</Link>
                  </Button>
                </div>
                <div className="mt-4">
                  <Progress value={strength} />
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-3">
                    <div className="text-xs font-medium">Evidence</div>
                    <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                      {breakdown.publishedCount} published
                      {breakdown.draftCount > 0
                        ? ` · ${breakdown.draftCount} draft`
                        : ""}
                    </div>
                  </div>
                  <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-3">
                    <div className="text-xs font-medium">Verification</div>
                    <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                      {breakdown.verifiedCount} verified
                      {breakdown.requestedCount > 0
                        ? ` · ${breakdown.requestedCount} pending`
                        : ""}
                    </div>
                  </div>
                  <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-3">
                    <div className="text-xs font-medium">Visibility</div>
                    <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                      {visibilityLabel(profile?.visibility)}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nächste Schritte</CardTitle>
            <CardDescription>Die schnellsten Hebel für Trust und Discovery.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-[var(--radius-lg)] bg-[color:var(--color-muted)]"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {actions.map((a) => (
                  <Link
                    key={`${a.href}-${a.title}`}
                    href={a.href}
                    className="block rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-3 transition-colors hover:bg-[color:var(--color-accent)]"
                  >
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                      {a.description}
                    </div>
                  </Link>
                ))}
                <Button asChild size="lg" className="w-full">
                  <Link href="/student/work/new">Work einreichen</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
