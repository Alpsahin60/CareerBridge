import { apiFetch } from "@/lib/api";

export type StudentProfile = {
  id: string;
  userId: string;
  universityId?: string | null;
  degreeProgramId?: string | null;
  semester?: number | null;
  plannedGradDate?: string | null;
  headline?: string | null;
  summary?: string | null;
  desiredRoles?: unknown;
  regions?: unknown;
  languages?: unknown;
  workModel?: string | null;
  availability?: string | null;
  links?: unknown;
  visibility: "hidden" | "employer_only" | "public";
  createdAt: string;
  updatedAt: string;
  university?: {
    id: string;
    name: string;
    shortName?: string | null;
    city?: string | null;
  } | null;
  degreeProgram?: {
    id: string;
    name: string;
    level: string;
    category: string;
  } | null;
};

function toStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x) => typeof x === "string") as string[];
  return out.length ? out : undefined;
}

function toStringRecord(v: unknown): Record<string, string> | undefined {
  if (!v || typeof v !== "object") return undefined;
  const entries = Object.entries(v as Record<string, unknown>)
    .filter(([k, val]) => typeof k === "string" && typeof val === "string")
    .map(([k, val]) => [k, val] as const);
  return entries.length
    ? (Object.fromEntries(entries) as Record<string, string>)
    : undefined;
}

export function studentProfileView(profile: StudentProfile) {
  return {
    ...profile,
    desiredRoles: toStringArray(profile.desiredRoles),
    regions: toStringArray(profile.regions),
    languages: toStringArray(profile.languages),
    links: toStringRecord(profile.links),
  };
}

export function getStudentProfile(token: string) {
  return apiFetch<StudentProfile>("/student/profile", { token });
}

export function updateStudentProfile(
  token: string,
  input: {
    headline?: string;
    summary?: string;
    desiredRoles?: string[];
    regions?: string[];
    languages?: string[];
    workModel?: string;
    availability?: string;
    links?: Record<string, string>;
    universityId?: string;
    degreeProgramId?: string;
    semester?: number;
    plannedGradDate?: string;
  }
) {
  return apiFetch<StudentProfile>("/student/profile", {
    method: "PUT",
    token,
    body: input,
  });
}
