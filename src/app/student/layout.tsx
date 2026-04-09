import { ProtectedAppShell } from "@/components/app/protected-app-shell";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedAppShell area="student">{children}</ProtectedAppShell>;
}

