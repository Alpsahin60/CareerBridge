import { AppShell } from "@/components/app-shell";

export default function HowItWorksPage() {
  return (
    <AppShell variant="marketing">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Wie CareerBridge funktioniert
        </h1>
        <ol className="space-y-3 text-[color:var(--color-muted-foreground)]">
          <li>
            <span className="font-medium text-[color:var(--color-foreground)]">
              1. Studierende
            </span>{" "}
            erstellen ein Evidence-Profil und reichen Arbeiten strukturiert ein.
          </li>
          <li>
            <span className="font-medium text-[color:var(--color-foreground)]">
              2. Verifikation
            </span>{" "}
            wird über Hochschule/Betreuung/Partner oder Plattformprozesse
            ausgelöst und dokumentiert.
          </li>
          <li>
            <span className="font-medium text-[color:var(--color-foreground)]">
              3. Arbeitgeber
            </span>{" "}
            entdecken Talente über Work Proof, Filter und nachvollziehbare
            Signale — nicht über Selbstaussagen.
          </li>
        </ol>
      </div>
    </AppShell>
  );
}

