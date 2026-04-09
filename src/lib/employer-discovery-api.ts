import { apiFetch } from "@/lib/api";

export type DiscoveryQuery = {
  q?: string;
  workType?: string;
  filter?: "all" | "verified_only";
};

export type DiscoveryWorkResult = {
  id: string;
  title: string;
  workType: string;
  verificationStatus: string;
  matchScore?: number;
  summary?: string;
  studentHeadline?: string | null;
  studentDisplayName?: string;
  universityName?: string;
  degreeLabel?: string;
};

export function listDiscoveryWorks(token: string, query?: DiscoveryQuery) {
  const sp = new URLSearchParams();
  if (query?.q?.trim()) sp.set("q", query.q.trim());
  if (query?.workType) sp.set("workType", query.workType);
  if (query?.filter && query.filter !== "all") sp.set("filter", query.filter);
  const qs = sp.toString();
  return apiFetch<DiscoveryWorkResult[]>(
    `/employer/discovery/works${qs ? `?${qs}` : ""}`,
    { token }
  );
}

