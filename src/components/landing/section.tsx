import * as React from "react";
import { cn } from "@/lib/cn";

export function Section({
  eyebrow,
  title,
  description,
  children,
  className,
}: Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}>) {
  return (
    <section className={cn("py-10 md:py-14", className)}>
      <div className="space-y-3">
        {eyebrow ? (
          <div className="text-xs font-medium tracking-wide text-[color:var(--color-muted-foreground)]">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-muted-foreground)] md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}

