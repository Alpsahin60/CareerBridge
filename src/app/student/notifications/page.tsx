"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/auth-store";
import {
  listStudentNotifications,
  markStudentNotificationRead,
} from "@/lib/student-engagement-api";

function summary(type: string, payload: unknown): string {
  if (!payload || typeof payload !== "object") return type;
  const p = payload as Record<string, unknown>;
  if (type === "work_interest") {
    const co =
      typeof p.companyName === "string" ? p.companyName : "Employer";
    const title =
      typeof p.workId === "string" ? `Work ${p.workId.slice(0, 8)}…` : "Work";
    return `${co} — Interesse an ${title}`;
  }
  return type;
}

export default function StudentNotificationsPage() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["student", "notifications"],
    queryFn: () => listStudentNotifications(token!),
    enabled: Boolean(token),
  });

  const readMut = useMutation({
    mutationFn: (id: string) => markStudentNotificationRead(token!, id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["student", "notifications"] });
    },
  });

  const rows = query.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          Z. B. Kontaktanfragen von Employers.
        </p>
      </div>

      {query.isLoading ? (
        <div className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
      ) : rows.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm text-[color:var(--color-muted-foreground)]">
          Keine Einträge.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                if (!n.readAt) readMut.mutate(n.id);
              }}
              className="w-full rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-3 text-left text-sm transition-colors hover:bg-[color:var(--color-accent)]"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={
                    n.readAt
                      ? "text-[color:var(--color-muted-foreground)]"
                      : "font-medium"
                  }
                >
                  {summary(n.type, n.payload)}
                </span>
                {!n.readAt ? (
                  <span className="text-[10px] text-[color:var(--color-ring)]">
                    Neu
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-[10px] text-[color:var(--color-muted-foreground)]">
                {new Date(n.createdAt).toLocaleString("de-CH")}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
