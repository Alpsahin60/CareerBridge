import * as React from "react";
import { cn } from "@/lib/cn";

export type FaqItem = {
  q: string;
  a: React.ReactNode;
};

export function Faq({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((it) => (
        <details
          key={it.q}
          className="group rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5"
        >
          <summary className="cursor-pointer list-none text-sm font-semibold tracking-tight">
            <div className="flex items-center justify-between gap-3">
              <span>{it.q}</span>
              <span className="text-[color:var(--color-muted-foreground)] transition-transform group-open:rotate-45">
                +
              </span>
            </div>
          </summary>
          <div className="mt-3 text-sm leading-6 text-[color:var(--color-muted-foreground)]">
            {it.a}
          </div>
        </details>
      ))}
    </div>
  );
}

