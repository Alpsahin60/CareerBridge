import * as React from "react";
import { cn } from "@/lib/cn";

export type TimelineItem = {
  id: string;
  title: string;
  meta?: string;
  content?: React.ReactNode;
};

export function VerificationTimeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, idx) => (
        <div key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[color:var(--color-primary)]" />
            {idx < items.length - 1 ? (
              <div className="mt-2 h-full w-px bg-[color:var(--color-border)]" />
            ) : null}
          </div>

          <div className="flex-1 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-medium">{item.title}</div>
              {item.meta ? (
                <div className="text-[10px] text-[color:var(--color-muted-foreground)]">
                  {item.meta}
                </div>
              ) : null}
            </div>
            {item.content ? (
              <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
                {item.content}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

