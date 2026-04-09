import Link from "next/link";

export default function EmployerDashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          Discovery → Saved / Pipeline → Kontaktanfrage. Antworten der Studierenden
          landen unter Messages.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          href="/employer/discovery"
          className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4 text-sm font-medium transition-colors hover:bg-[color:var(--color-accent)]"
        >
          Discovery öffnen
        </Link>
        <Link
          href="/employer/saved"
          className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4 text-sm font-medium transition-colors hover:bg-[color:var(--color-accent)]"
        >
          Saved & Stages
        </Link>
        <Link
          href="/employer/pipeline"
          className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4 text-sm font-medium transition-colors hover:bg-[color:var(--color-accent)]"
        >
          Pipeline (Kanban)
        </Link>
        <Link
          href="/employer/messages"
          className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4 text-sm font-medium transition-colors hover:bg-[color:var(--color-accent)]"
        >
          Messages
        </Link>
      </div>
    </div>
  );
}

