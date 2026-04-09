import * as React from "react";
import { cn } from "@/lib/cn";

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-secondary)]",
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
    >
      <div
        className="h-full rounded-full bg-[color:var(--color-primary)] transition-[width] duration-500"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

