import { AppShell } from "@/components/app-shell";

export default function EmployersPage() {
  return (
    <AppShell variant="marketing">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Für Arbeitgeber</h1>
        <p className="text-[color:var(--color-muted-foreground)]">
          Entdecke Schweizer Early Tech Talent früher — mit verifizierten
          Work-Samples, klaren Signalen und nachvollziehbarem Kontext statt
          CV-only.
        </p>
      </div>
    </AppShell>
  );
}

