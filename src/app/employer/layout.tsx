import { ProtectedAppShell } from "@/components/app/protected-app-shell";

export default function EmployerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedAppShell area="employer">{children}</ProtectedAppShell>;
}

