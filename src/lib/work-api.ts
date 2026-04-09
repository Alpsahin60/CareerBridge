import { apiFetch } from "@/lib/api";
import type { WorkType } from "@/lib/work-types";

export type WorkListItem = {
  id: string;
  type: WorkType;
  status: "draft" | "submitted" | "published" | "archived";
  title: string;
  abstract: string;
  visibility: "hidden" | "employer_only" | "public";
  createdAt: string;
  updatedAt: string;
  verification?: {
    status: string;
    verificationType?: string | null;
    verifiedAt?: string | null;
  } | null;
};

export type WorkDraft = {
  id: string;
  type: WorkType;
  status: "draft" | "submitted" | "published" | "archived";
  title: string;
  abstract: string;
  visibility: "hidden" | "employer_only" | "public";
  createdAt: string;
  updatedAt: string;
};

export function listStudentWorks(token: string) {
  return apiFetch<WorkListItem[]>("/student/works", { token });
}

export type WorkDetail = {
  id: string;
  type: WorkType;
  status: "draft" | "submitted" | "published" | "archived";
  title: string;
  abstract: string;
  outcomes?: string | null;
  learnings?: string | null;
  visibility: "hidden" | "employer_only" | "public";
  createdAt: string;
  updatedAt: string;
  verification?: {
    status: string;
    verificationType?: string | null;
    verifiedAt?: string | null;
  } | null;
  verificationRequests: {
    id: string;
    status: string;
    targetEmail?: string | null;
    message?: string | null;
    decisionNote?: string | null;
    decidedAt?: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
};

export function getStudentWork(token: string, id: string) {
  return apiFetch<WorkDetail>(`/student/works/${id}`, { token });
}

export function createStudentWorkDraft(token: string, input: { type: WorkType }) {
  return apiFetch<WorkDraft>("/student/works", {
    method: "POST",
    token,
    body: input,
  });
}

export function updateStudentWorkDraft(
  token: string,
  id: string,
  input: { title?: string; abstract?: string }
) {
  return apiFetch<WorkDraft>(`/student/works/${id}`, {
    method: "PATCH",
    token,
    body: input,
  });
}

export function createVerificationRequest(
  token: string,
  workId: string,
  input: { targetEmail?: string; message?: string }
) {
  return apiFetch<{ id: string; status: string }>(
    `/student/works/${workId}/verification-requests`,
    { method: "POST", token, body: input }
  );
}

export type VerificationRequestListItem = {
  id: string;
  status: string;
  targetEmail?: string | null;
  message?: string | null;
  decisionNote?: string | null;
  decidedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  work: {
    id: string;
    title: string;
    type: WorkType;
    status: string;
    visibility: string;
    verification?: {
      status: string;
      verificationType?: string | null;
      verifiedAt?: string | null;
    } | null;
  };
};

export function listVerificationRequests(token: string) {
  return apiFetch<VerificationRequestListItem[]>(
    "/student/works/verification-requests",
    { token }
  );
}

