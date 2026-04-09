import { AppShell } from "@/components/app-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AppShell variant="marketing">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">Anmelden</h1>
            <p className="text-sm text-[color:var(--color-muted-foreground)]">
              Zugriff auf dein Evidence-Profil und Verified Work.
            </p>
          </div>
          <div className="mt-6">
            <SignInForm />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

