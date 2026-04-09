"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import { useAuthStore } from "@/lib/auth-store";
import {
  listEmployerNotifications,
  markEmployerNotificationRead,
} from "@/lib/employer-workspace-api";

function payloadSummary(type: string, payload: unknown): string {
  if (!payload || typeof payload !== "object") return type;
  const p = payload as Record<string, unknown>;
  if (type === "interest_response") {
    const title = typeof p.workTitle === "string" ? p.workTitle : "Work";
    const st = typeof p.status === "string" ? p.status : "";
    return `Antwort zu «${title}»: ${st}`;
  }
  return type;
}

export default function EmployerMessagesPage() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["employer", "notifications"],
    queryFn: () => listEmployerNotifications(token!),
    enabled: Boolean(token),
  });

  const readMut = useMutation({
    mutationFn: (id: string) => markEmployerNotificationRead(token!, id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["employer", "notifications"] });
    },
  });

  const rows = query.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          In-App Notifications (z. B. wenn ein Student auf deine
          Kontaktanfrage antwortet). Gesendete Anfragen:{" "}
          <Link href="/employer/requests" className="underline">
            Requests
          </Link>
          .
        </p>
      </div>

      {query.isLoading ? (
        <div className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
      ) : rows.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6 text-sm text-[color:var(--color-muted-foreground)]">
          Keine Notifications.
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
                  {payloadSummary(n.type, n.payload)}
                </span>
                {!n.readAt ? (
                  <span className="shrink-0 text-[10px] text-[color:var(--color-ring)]">
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
