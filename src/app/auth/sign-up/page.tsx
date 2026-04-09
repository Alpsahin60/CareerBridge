import { AppShell } from "@/components/app-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <AppShell variant="marketing">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Konto erstellen
            </h1>
            <p className="text-sm text-[color:var(--color-muted-foreground)]">
              Start im Netzwerk mit verifizierter Arbeit — Schweiz-only.
            </p>
          </div>
          <div className="mt-6">
            <SignUpForm />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

