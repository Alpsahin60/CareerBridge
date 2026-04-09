import { AppShell } from "@/components/app-shell";

export default function StudentsPage() {
  return (
    <AppShell variant="marketing">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Für Studierende</h1>
        <p className="text-[color:var(--color-muted-foreground)]">
          Zeige, was du wirklich kannst — mit Arbeiten, Artefakten und
          Verifikationskontext. Du kontrollierst Sichtbarkeit und Kontakt.
        </p>
      </div>
    </AppShell>
  );
}

