import { AppShell } from "@/components/app-shell";

export default function TrustPage() {
  return (
    <AppShell variant="marketing">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Verified Work</h1>
        <p className="text-[color:var(--color-muted-foreground)]">
          CareerBridge ist kein CV-Tool. Unsere zentrale Einheit ist{" "}
          <span className="font-medium text-[color:var(--color-foreground)]">
            verifizierte Arbeit
          </span>
          : strukturierte, nachvollziehbare Work Samples mit klarer Herkunft,
          Status und Kontext.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4">
            <div className="text-sm font-medium">Was wird verifiziert?</div>
            <ul className="mt-2 space-y-1 text-sm text-[color:var(--color-muted-foreground)]">
              <li>Projekt-/Thesis-Kontext und Zugehörigkeit</li>
              <li>Artefakte (PDF, Repo, Demo) und Konsistenz</li>
              <li>Rollenbeitrag (bei Teamprojekten)</li>
            </ul>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4">
            <div className="text-sm font-medium">Warum ist das wichtig?</div>
            <ul className="mt-2 space-y-1 text-sm text-[color:var(--color-muted-foreground)]">
              <li>Höhere Signalqualität als CV-only Recruiting</li>
              <li>Bessere Vergleichbarkeit über echte Ergebnisse</li>
              <li>Frühere Pipeline vor Abschluss möglich</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

