"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/auth-store";
import { apiFetch, ApiError } from "@/lib/api";

type Overview = {
  users: number;
  works: number;
  publishedWorks: number;
  openAdminFlags: number;
  pendingInterestRequests: number;
  unreadNotificationsGlobally: number;
};

export default function AdminOverviewPage() {
  const token = useAuthStore((s) => s.accessToken);

  const query = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => apiFetch<Overview>("/admin/overview", { token: token! }),
    enabled: Boolean(token),
    retry: false,
  });

  if (!token) {
    return (
      <div className="mx-auto max-w-lg p-8 text-sm text-[color:var(--color-muted-foreground)]">
        Bitte anmelden.
      </div>
    );
  }

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <div className="h-24 animate-pulse rounded-[var(--radius-xl)] bg-[color:var(--color-secondary)]" />
      </div>
    );
  }

  if (query.isError) {
    const forbidden =
      query.error instanceof ApiError && query.error.status === 403;
    return (
      <div className="mx-auto max-w-lg space-y-2 p-8 text-sm">
        <h1 className="text-lg font-semibold">Admin</h1>
        <p className="text-[color:var(--color-muted-foreground)]">
          {forbidden
            ? "Kein Zugriff. platform_admin Rolle + Seed erforderlich."
            : "Konnte Overview nicht laden."}
        </p>
      </div>
    );
  }

  const d = query.data!;

  return (
    <div className="mx-auto max-w-lg space-y-4 p-8">
      <h1 className="text-lg font-semibold tracking-tight">Platform Overview</h1>
      <div className="grid gap-2 rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[color:var(--color-muted-foreground)]">Users</span>
          <span className="font-medium">{d.users}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[color:var(--color-muted-foreground)]">Works</span>
          <span className="font-medium">{d.works}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[color:var(--color-muted-foreground)]">Published</span>
          <span className="font-medium">{d.publishedWorks}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[color:var(--color-muted-foreground)]">Open flags</span>
          <span className="font-medium">{d.openAdminFlags}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[color:var(--color-muted-foreground)]">
            Pending interest
          </span>
          <span className="font-medium">{d.pendingInterestRequests}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[color:var(--color-muted-foreground)]">
            Unread notifications (global)
          </span>
          <span className="font-medium">{d.unreadNotificationsGlobally}</span>
        </div>
      </div>
    </div>
  );
}
