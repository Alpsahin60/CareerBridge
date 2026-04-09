import * as React from "react";
import { cn } from "@/lib/cn";

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-[var(--radius-md)] border border-[color:var(--color-input)] bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-[color:var(--color-muted-foreground)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-[color:var(--color-background)]",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };

