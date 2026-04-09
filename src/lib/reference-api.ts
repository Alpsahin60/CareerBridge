import { apiFetch } from "@/lib/api";

export type UniversityRef = {
  id: string;
  name: string;
  shortName?: string | null;
  city?: string | null;
};

export type DegreeProgramRef = {
  id: string;
  universityId: string;
  name: string;
  level: string;
  category: string;
};

export function listUniversities() {
  return apiFetch<UniversityRef[]>("/reference/universities");
}

export function listDegreePrograms(universityId: string) {
  const q = new URLSearchParams({ universityId });
  return apiFetch<DegreeProgramRef[]>(
    `/reference/degree-programs?${q.toString()}`
  );
}
