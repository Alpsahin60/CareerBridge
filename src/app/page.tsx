import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/landing/section";
import { Reveal } from "@/components/landing/reveal";
import { Faq } from "@/components/landing/faq";
import { VerificationBadge } from "@/components/trust/verification-badge";

export default function Home() {
  return (
    <AppShell variant="marketing">
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)]">
        <div className="absolute inset-0 opacity-[0.16] [background:radial-gradient(1200px_circle_at_10%_0%,hsl(var(--primary))_0%,transparent_45%),radial-gradient(900px_circle_at_90%_40%,hsl(var(--ring))_0%,transparent_40%)]" />
        <div className="relative grid gap-10 px-6 py-14 md:grid-cols-[1.15fr_0.85fr] md:px-10">
          <Reveal>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 py-1 text-xs text-[color:var(--color-muted-foreground)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-primary)]" />
                Schweiz-only · Verified Work Network
              </div>

              <h1 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-foreground)] md:text-5xl">
                Früh sichtbar werden — mit{" "}
                <span className="underline decoration-[color:var(--color-ring)] decoration-from-font underline-offset-4">
                  verifizierter Arbeit
                </span>
                , nicht nur mit CV.
              </h1>
              <p className="max-w-xl text-pretty text-base leading-7 text-[color:var(--color-muted-foreground)] md:text-lg">
                CareerBridge ist ein Verified Early Tech Talent Network für die Schweiz.
                Studierende werden über echte Work Samples discoverable—Arbeitgeber sehen
                belastbare Signale statt Selbstaussagen.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/auth/sign-up">Als Student registrieren</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/employer/discovery">Talente entdecken</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-[color:var(--color-muted-foreground)]">
                <span className="rounded-full border border-[color:var(--color-border)] px-2.5 py-1">
                  Evidence-first
                </span>
                <span className="rounded-full border border-[color:var(--color-border)] px-2.5 py-1">
                  Verification Timeline
                </span>
                <span className="rounded-full border border-[color:var(--color-border)] px-2.5 py-1">
                  Explainable Matching
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Product Preview</div>
                  <div className="rounded-full bg-[color:var(--color-secondary)] px-2 py-0.5 text-xs text-[color:var(--color-secondary-foreground)]">
                    Verified-first
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">
                          Semesterprojekt · Distributed Systems
                        </div>
                        <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                          ZHAW · TypeScript, NestJS, PostgreSQL
                        </div>
                      </div>
                      <VerificationBadge status="verified" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-[color:var(--color-muted-foreground)]">
                        Match readiness
                      </div>
                      <div className="text-xs font-medium">84</div>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-secondary)]">
                      <div className="h-full w-[84%] bg-[color:var(--color-primary)]" />
                    </div>
                    <div className="mt-3 text-xs text-[color:var(--color-muted-foreground)]">
                      Why: Systems signal + verified artifact + strong outcome.
                    </div>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">
                          Masterarbeit · Applied ML
                        </div>
                        <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                          EPFL · Python, PyTorch, MLOps
                        </div>
                      </div>
                      <VerificationBadge status="requested" />
                    </div>
                    <div className="mt-3 text-xs text-[color:var(--color-muted-foreground)]">
                      Verification request pending (institutional).
                    </div>
                  </div>
                </div>

                <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3 text-xs text-[color:var(--color-muted-foreground)]">
                  Discovery zeigt **Evidence + Verification Context** statt CV-only.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Section
        eyebrow="Das Problem"
        title="Klassisches Recruiting startet zu spät — und Signale sind zu schwach."
        description="Studierende haben echte Fähigkeiten lange vor dem Abschluss. Arbeitgeber suchen früh—sehen aber meist nur CVs. CareerBridge macht relevante Signale früher sichtbar."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              t: "CV-only ist unpräzise",
              d: "Technologien, Methoden und Ergebnisqualität sind schwer verifizierbar.",
            },
            {
              t: "Zu spät in die Pipeline",
              d: "Gute Talente werden erst sichtbar, wenn sie bereits überlaufen sind.",
            },
            {
              t: "Trust fehlt",
              d: "Ohne Herkunft/Verifikation bleiben Work Samples oft unverbindlich.",
            },
          ].map((x) => (
            <Reveal key={x.t}>
              <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5">
                <div className="text-sm font-semibold">{x.t}</div>
                <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
                  {x.d}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Das neue Modell"
        title="Proof-of-Potential, strukturiert und verifizierbar."
        description="CareerBridge verknüpft Work Evidence, Kontext und Verification in einem System, das Discovery und Matching besser macht."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Reveal>
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5">
              <div className="text-sm font-semibold">Für Studierende</div>
              <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-muted-foreground)]">
                <li>Evidence-Profil statt CV-Abbild</li>
                <li>Visibility & Consentful Contact</li>
                <li>Verification als Trust-Mechanismus</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5">
              <div className="text-sm font-semibold">Für Arbeitgeber</div>
              <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-muted-foreground)]">
                <li>Discovery über verifizierte Work Samples</li>
                <li>Explainable Matching statt Blackbox</li>
                <li>Frühe Pipeline für Internship/Thesis/Graduate</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Wie es funktioniert"
        title="Ein Workflow, der Trust systematisch erzeugt."
        description="Kein Badge-Feature. Verified Work ist ein Prozess mit Status, Historie und Kontext — sichtbar für Studierende und Arbeitgeber."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              t: "1) Work einreichen",
              d: "Titel, Abstract, Outcome, Methoden, Artefakte. Evidence-first Struktur statt CV-Felder.",
            },
            {
              t: "2) Verification anfragen",
              d: "Hochschule/Betreuung/Institut/Partner bestätigen. Jede Anfrage ist historisiert.",
            },
            {
              t: "3) Verified Discovery",
              d: "Arbeitgeber sehen Trust-Signale und Kontext, filtern danach und bauen früh eine Pipeline auf.",
            },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 0.04}>
              <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5">
                <div className="text-sm font-semibold">{x.t}</div>
                <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
                  {x.d}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Für Arbeitgeber"
        title="Früher, präziser, mit weniger Streuverlust."
        description="Discovery über Evidence, nicht über Selbstaussagen. Verified Work macht Screening schneller und zuverlässiger."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Reveal>
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5">
              <div className="text-sm font-semibold">Was du sofort siehst</div>
              <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-muted-foreground)]">
                <li>Work Samples mit Ergebnis- und Methodenkontext</li>
                <li>Verification Status + Quelle + Historie</li>
                <li>Explainable Match Score (warum passt es?)</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5">
              <div className="text-sm font-semibold">ROI (MVP Fokus)</div>
              <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-muted-foreground)]">
                <li>Weniger Zeit in CV-Screening, mehr Signalqualität</li>
                <li>Frühere Pipeline für Internship/Thesis/Graduate</li>
                <li>Vergleichbarkeit über echte Artefakte</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            { k: "Signalqualität", v: "+", d: "Evidence + Verification Context" },
            { k: "Time-to-screen", v: "↓", d: "schnelleres, besseres Pre-Screening" },
            { k: "Early pipeline", v: "↑", d: "vor Abschluss sichtbar" },
          ].map((m) => (
            <Reveal key={m.k}>
              <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-5">
                <div className="flex items-baseline justify-between">
                  <div className="text-sm font-semibold">{m.k}</div>
                  <div className="text-2xl font-semibold tracking-tight">{m.v}</div>
                </div>
                <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
                  {m.d}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Für Hochschulen"
        title="Verification ohne Overhead – aber mit Wirkung."
        description="CareerBridge ist ein Trust-Netzwerk. Hochschulen können Qualität sichtbar machen, ohne in Recruiting-UI zu enden."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Reveal>
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5">
              <div className="text-sm font-semibold">Verification Inbox</div>
              <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
                Anfragen prüfen, Kontext sehen, Entscheidung dokumentieren — auditierbar.
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5">
              <div className="text-sm font-semibold">Outcome</div>
              <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
                Frühe Sichtbarkeit, bessere Übergänge in Praxisrollen, und echte Signalqualität über studentische Arbeit.
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Social Proof"
        title="Geplant: Partner aus der Schweizer Tech-Landschaft."
        description="Im MVP zeigen wir Platzhalter – die Struktur ist bewusst seriös gehalten."
      >
        <div className="grid gap-3 md:grid-cols-4">
          {["University Partner", "Institute", "Tech Employer", "Platform Trust"].map(
            (x, i) => (
              <Reveal key={x} delay={i * 0.03}>
                <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-5 text-sm text-[color:var(--color-muted-foreground)]">
                  {x}
                </div>
              </Reveal>
            )
          )}
        </div>
      </Section>

      <Section
        eyebrow="FAQ"
        title="Kurz beantwortet, ohne Marketing-Nebel."
        description="Wenn du Fragen hast: Verified Work ist der Kern. Alles andere ist darauf ausgerichtet."
      >
        <Faq
          items={[
            {
              q: "Ist CareerBridge eine Jobbörse?",
              a: "Nein. Der Kern ist Verified Work Discovery — strukturiertes Evidence mit Herkunft und Status, das Employer Discovery präziser macht.",
            },
            {
              q: "Was bedeutet „Verified Work“ konkret?",
              a: "Eine Arbeit wird nicht nur hochgeladen, sondern mit Kontext, Artefakten und einem nachvollziehbaren Verification-Prozess (Status + Historie) versehen.",
            },
            {
              q: "Wer kann verifizieren?",
              a: "Im MVP sind Hochschule/Betreuung/Institut/Partner sowie Reviewer-Rollen vorgesehen. Wichtig ist die klare Quelle und Auditierbarkeit.",
            },
            {
              q: "Wie ist Privacy gelöst?",
              a: "Privacy by default. Visibility ist granular (global + pro Work), und Kontakt passiert consentful.",
            },
            {
              q: "Warum nur Schweiz?",
              a: "Weil Trust und Netzwerk-Effekte lokal funktionieren: Hochschulen, Verifikationswege und Employer Needs sind stark landesspezifisch.",
            },
          ]}
        />
      </Section>

      <Section
        eyebrow="CTA"
        title="Starte mit Evidence. Baue Trust."
        description="Erstelle dein Profil, reiche Work ein, und stelle Verification-Anfragen—oder entdecke verified Talent als Arbeitgeber."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Als Student starten</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/employer/discovery">Discovery öffnen</Link>
          </Button>
        </div>
        <div className="mt-6 rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5 text-sm text-[color:var(--color-muted-foreground)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>CareerBridge · Verified Early Tech Talent Network · Switzerland</span>
            <div className="flex gap-3">
              <Link className="hover:underline" href="/trust">
                Verified Work
              </Link>
              <Link className="hover:underline" href="/how-it-works">
                Wie es funktioniert
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </AppShell>
  );
}
