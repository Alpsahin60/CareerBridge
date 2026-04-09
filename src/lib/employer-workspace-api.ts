import { apiFetch } from "@/lib/api";

export type PipelineStage =
  | "saved"
  | "shortlist"
  | "contacted"
  | "archived";

export type EmployerBookmark = {
  id: string;
  employerId: string;
  workId: string;
  stage: PipelineStage;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  work: {
    id: string;
    title: string;
    type: string;
    abstract: string;
    verification: { status: string } | null;
  };
};

export type WorkInterestRow = {
  id: string;
  workId: string;
  employerId: string;
  message: string | null;
  status: string;
  studentNote: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  work: { id: string; title: string; type: string };
};

export function listEmployerBookmarks(token: string) {
  return apiFetch<EmployerBookmark[]>("/employer/bookmarks", { token });
}

export function saveEmployerBookmark(
  token: string,
  workId: string,
  body?: { stage?: PipelineStage; note?: string | null }
) {
  return apiFetch<EmployerBookmark>(`/employer/bookmarks/${workId}`, {
    method: "POST",
    token,
    body: body ?? {},
  });
}

export function updateEmployerBookmark(
  token: string,
  workId: string,
  body: { stage?: PipelineStage; note?: string | null }
) {
  return apiFetch<EmployerBookmark>(`/employer/bookmarks/${workId}`, {
    method: "PATCH",
    token,
    body,
  });
}

export function deleteEmployerBookmark(token: string, workId: string) {
  return apiFetch<{ ok: boolean }>(`/employer/bookmarks/${workId}`, {
    method: "DELETE",
    token,
  });
}

export function listEmployerInterest(token: string) {
  return apiFetch<WorkInterestRow[]>("/employer/interest", { token });
}

export function createEmployerInterest(
  token: string,
  workId: string,
  body?: { message?: string }
) {
  return apiFetch<{ id: string; workId: string; status: string }>(
    `/employer/interest/${workId}`,
    {
      method: "POST",
      token,
      body: body ?? {},
    }
  );
}

export type AppNotification = {
  id: string;
  userId: string;
  type: string;
  payload: unknown;
  readAt: string | null;
  createdAt: string;
};

export function listEmployerNotifications(token: string) {
  return apiFetch<AppNotification[]>("/employer/notifications", { token });
}

export function markEmployerNotificationRead(token: string, id: string) {
  return apiFetch<{ ok: boolean }>(`/employer/notifications/${id}/read`, {
    method: "PATCH",
    token,
  });
}
