"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

type LoginResponse = {
  user: { id: string; email: string; displayName: string; locale?: string };
  accessToken: string;
};

export function SignInForm() {
  const setSession = useAuthStore((s) => s.setSession);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    const res = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: values,
    });
    setSession({
      accessToken: res.accessToken,
      user: {
        id: res.user.id,
        email: res.user.email,
        displayName: res.user.displayName,
      },
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium">E-Mail</label>
        <Input
          autoComplete="email"
          placeholder="name@hochschule.ch"
          {...form.register("email")}
        />
        {form.formState.errors.email?.message ? (
          <p className="text-xs text-[color:var(--color-destructive)]">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Passwort</label>
        <Input
          type="password"
          autoComplete="current-password"
          {...form.register("password")}
        />
        {form.formState.errors.password?.message ? (
          <p className="text-xs text-[color:var(--color-destructive)]">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-secondary)] p-3 text-sm">
          {error}
        </div>
      ) : null}

      <Button className="w-full" size="lg" type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "…" : "Anmelden"}
      </Button>

      <p className="text-center text-sm text-[color:var(--color-muted-foreground)]">
        Noch kein Konto?{" "}
        <Link
          href="/auth/sign-up"
          className="font-medium text-[color:var(--color-foreground)] hover:underline"
        >
          Registrieren
        </Link>
      </p>
    </form>
  );
}

