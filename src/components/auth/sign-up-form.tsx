"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    displayName: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(10),
    accountKind: z.enum(["student", "employer"]),
    companyName: z.string().max(120).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accountKind === "employer") {
      const c = data.companyName?.trim() ?? "";
      if (c.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Firmenname erforderlich (min. 2 Zeichen)",
          path: ["companyName"],
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

type RegisterResponse = {
  user: { id: string; email: string; displayName: string; locale?: string };
  accessToken: string;
};

export function SignUpForm() {
  const setSession = useAuthStore((s) => s.setSession);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      accountKind: "student",
      companyName: "",
    },
  });

  const accountKind = useWatch({
    control: form.control,
    name: "accountKind",
    defaultValue: "student",
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const res = await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: {
          displayName: values.displayName,
          email: values.email,
          password: values.password,
          accountKind: values.accountKind,
          ...(values.accountKind === "employer"
            ? { companyName: values.companyName?.trim() }
            : {}),
        },
      });
      setSession({
        accessToken: res.accessToken,
        user: {
          id: res.user.id,
          email: res.user.email,
          displayName: res.user.displayName,
        },
      });
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Registrierung fehlgeschlagen.";
      setError(msg);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Ich bin</label>
        <select
          className="flex h-10 w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 text-sm"
          {...form.register("accountKind")}
        >
          <option value="student">Student / Talent</option>
          <option value="employer">Employer (Recruiting)</option>
        </select>
      </div>

      {accountKind === "employer" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Firmenname</label>
          <Input
            autoComplete="organization"
            placeholder="z.B. ACME Engineering AG"
            {...form.register("companyName")}
          />
          {form.formState.errors.companyName?.message ? (
            <p className="text-xs text-[color:var(--color-destructive)]">
              {form.formState.errors.companyName.message}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          autoComplete="name"
          placeholder="z.B. Nora Meier"
          {...form.register("displayName")}
        />
        {form.formState.errors.displayName?.message ? (
          <p className="text-xs text-[color:var(--color-destructive)]">
            {form.formState.errors.displayName.message}
          </p>
        ) : null}
      </div>

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
          autoComplete="new-password"
          placeholder="Mindestens 10 Zeichen"
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

      <Button
        className="w-full"
        size="lg"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "…" : "Konto erstellen"}
      </Button>

      <p className="text-center text-sm text-[color:var(--color-muted-foreground)]">
        Schon registriert?{" "}
        <Link
          href="/auth/sign-in"
          className="font-medium text-[color:var(--color-foreground)] hover:underline"
        >
          Anmelden
        </Link>
      </p>
    </form>
  );
}
