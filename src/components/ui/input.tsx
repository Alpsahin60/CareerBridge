import * as React from "react";
import { cn } from "@/lib/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-md)] border border-[color:var(--color-input)] bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-[color:var(--color-muted-foreground)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-[color:var(--color-background)]",
        className
      )}
      {...props}
    />
  );
}

export { Input };

