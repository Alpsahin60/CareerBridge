import { cn } from "@/lib/cn";

export type VerificationStatus =
  | "unverified"
  | "requested"
  | "verified"
  | "rejected"
  | "expired";

const label: Record<VerificationStatus, string> = {
  unverified: "Unverified",
  requested: "Angefragt",
  verified: "Verifiziert",
  rejected: "Abgelehnt",
  expired: "Abgelaufen",
};

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus;
  className?: string;
}) {
  const style =
    status === "verified"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : status === "requested"
        ? "border-sky-500/30 bg-sky-500/10 text-sky-200"
        : status === "rejected"
          ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
          : status === "expired"
            ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
            : "border-[color:var(--color-border)] bg-[color:var(--color-background)] text-[color:var(--color-muted-foreground)]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide",
        style,
        className
      )}
    >
      {label[status]}
    </span>
  );
}

