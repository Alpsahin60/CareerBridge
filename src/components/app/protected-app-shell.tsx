"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function SideLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors",
        active
          ? "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
          : "text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-accent)] hover:text-[color:var(--color-accent-foreground)]"
      )}
    >
      {label}
    </Link>
  );
}

export function ProtectedAppShell({
  area,
  children,
}: Readonly<{
  area: "student" | "employer";
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!accessToken) router.replace("/auth/sign-in");
  }, [hydrated, accessToken, router]);

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
        <div className="h-5 w-44 animate-pulse rounded bg-[color:var(--color-secondary)]" />
        <div className="mt-6 grid gap-3 md:grid-cols-[220px_1fr]">
          <div className="h-40 animate-pulse rounded-[var(--radius-lg)] bg-[color:var(--color-secondary)]" />
          <div className="h-56 animate-pulse rounded-[var(--radius-lg)] bg-[color:var(--color-secondary)]" />
        </div>
      </div>
    );
  }

  if (!accessToken) return null;

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold tracking-tight">
              {area === "student" ? "Student Workspace" : "Employer Workspace"}
            </div>
            <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
              {user?.displayName ?? user?.email ?? "—"}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clear();
              router.replace("/");
            }}
          >
            Abmelden
          </Button>
        </div>

        <div className="mt-4 space-y-1">
          {area === "student" ? (
            <>
              <SideLink href="/student" label="Dashboard" />
              <SideLink href="/student/onboarding" label="Onboarding" />
              <SideLink href="/student/profile" label="Profil" />
              <SideLink href="/student/work" label="Work" />
              <SideLink href="/student/verification" label="Verification" />
              <SideLink href="/student/visibility" label="Sichtbarkeit" />
              <SideLink href="/student/notifications" label="Notifications" />
              <SideLink href="/student/interest" label="Kontaktanfragen" />
            </>
          ) : (
            <>
              <SideLink href="/employer" label="Dashboard" />
              <SideLink href="/employer/discovery" label="Discovery" />
              <SideLink href="/employer/saved" label="Saved" />
              <SideLink href="/employer/pipeline" label="Pipeline" />
              <SideLink href="/employer/requests" label="Requests" />
              <SideLink href="/employer/messages" label="Messages" />
            </>
          )}
        </div>
      </aside>

      <section className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
        {children}
      </section>
    </div>
  );
}

