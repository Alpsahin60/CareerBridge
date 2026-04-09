import { apiFetch } from "@/lib/api";
import type { AppNotification } from "@/lib/employer-workspace-api";

export type IncomingInterest = {
  id: string;
  workId: string;
  employerId: string;
  message: string | null;
  status: string;
  studentNote: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  employer: {
    id: string;
    companyName: string;
    hqCity: string | null;
    websiteUrl: string | null;
  };
  work: { id: string; title: string; type: string };
};

export function listStudentNotifications(token: string) {
  return apiFetch<AppNotification[]>("/student/notifications", { token });
}

export function markStudentNotificationRead(token: string, id: string) {
  return apiFetch<{ ok: boolean }>(`/student/notifications/${id}/read`, {
    method: "PATCH",
    token,
  });
}

export function listIncomingInterest(token: string) {
  return apiFetch<IncomingInterest[]>("/student/interest-incoming", { token });
}

export function respondIncomingInterest(
  token: string,
  id: string,
  body: { status: "accepted" | "declined"; studentNote?: string }
) {
  return apiFetch<{ id: string; status: string }>(
    `/student/interest-incoming/${id}`,
    {
      method: "PATCH",
      token,
      body,
    }
  );
}
