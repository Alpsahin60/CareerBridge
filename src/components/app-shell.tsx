import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function NavItem({
  href,
  label,
  subtle,
}: {
  href: string;
  label: string;
  subtle?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm",
        subtle
          ? "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
          : "text-[color:var(--color-foreground)] hover:bg-[color:var(--color-accent)]"
      )}
    >
      {label}
    </Link>
  );
}

export function AppShell({
  children,
  variant = "marketing",
}: Readonly<{
  children: React.ReactNode;
  variant?: "marketing" | "app";
}>) {
  return (
    <div className="min-h-full bg-[color:var(--color-background)]">
      <header className="sticky top-0 z-40 border-b border-[color:var(--color-border)] bg-[color:var(--color-background)]/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-1 py-1 text-sm font-semibold tracking-tight"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)]">
                C
              </span>
              <span>CareerBridge</span>
            </Link>
            <div className="hidden items-center gap-1 md:flex">
              <NavItem href="/trust" label="Verified Work" subtle />
              <NavItem href="/how-it-works" label="Wie es funktioniert" subtle />
              <NavItem href="/employers" label="Für Arbeitgeber" subtle />
              <NavItem href="/students" label="Für Studierende" subtle />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/sign-in">Anmelden</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">
                {variant === "marketing" ? "Als Student starten" : "Weiter"}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}

