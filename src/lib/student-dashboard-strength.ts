import type { WorkListItem } from "@/lib/work-api";
import type { StudentProfile } from "@/lib/student-api";
import { studentProfileView } from "@/lib/student-api";

export type DashboardAction = {
  title: string;
  description: string;
  href: string;
};

export type StrengthBreakdown = {
  score: number;
  profilePoints: number;
  workPoints: number;
  verificationPoints: number;
  publishedCount: number;
  draftCount: number;
  verifiedCount: number;
  requestedCount: number;
};

function countWorks(works: WorkListItem[]) {
  const published = works.filter((w) => w.status === "published").length;
  const draft = works.filter((w) => w.status === "draft").length;
  const verified = works.filter((w) => w.verification?.status === "verified").length;
  const requested = works.filter((w) => w.verification?.status === "requested").length;
  return { published, draft, verified, requested, total: works.length };
}

/** Deterministic 0–100 score from profile + works + verification. */
export function computeStudentStrength(
  profile: StudentProfile | undefined,
  works: WorkListItem[]
): StrengthBreakdown {
  const v = profile ? studentProfileView(profile) : null;
  const summaryLen = (v?.summary ?? "").trim().length;
  const hasHeadline = Boolean((v?.headline ?? "").trim());
  const hasGoals =
    Boolean(v?.desiredRoles?.length) && Boolean(v?.regions?.length);
  const hasAvailability = Boolean((v?.availability ?? "").trim());

  let profilePoints = 0;
  if (hasHeadline) profilePoints += 10;
  if (summaryLen >= 30) profilePoints += 15;
  else if (summaryLen > 0) profilePoints += 8;
  if (hasGoals) profilePoints += 10;
  if (hasAvailability) profilePoints += 5;
  profilePoints = Math.min(40, profilePoints);
  if (profile?.universityId && profile?.degreeProgramId) {
    profilePoints = Math.min(45, profilePoints + 5);
  }

  const { published, draft, verified, requested, total } = countWorks(works);
  let workPoints = 0;
  if (total > 0) workPoints += 20;
  if (published > 0) workPoints += 20;
  else if (draft > 0) workPoints += 8;
  workPoints = Math.min(40, workPoints);

  let verificationPoints = 0;
  if (requested > 0) verificationPoints += 10;
  if (verified > 0) verificationPoints += 20;
  verificationPoints = Math.min(30, verificationPoints);

  const score = Math.min(100, profilePoints + workPoints + verificationPoints);

  return {
    score,
    profilePoints,
    workPoints,
    verificationPoints,
    publishedCount: published,
    draftCount: draft,
    verifiedCount: verified,
    requestedCount: requested,
  };
}

export function computeNextActions(
  profile: StudentProfile | undefined,
  works: WorkListItem[],
  breakdown: StrengthBreakdown
): DashboardAction[] {
  const v = profile ? studentProfileView(profile) : null;
  const actions: DashboardAction[] = [];

  if (!v?.headline?.trim()) {
    actions.push({
      title: "Headline setzen",
      description: "Eine klare, evidence-first Zeile hilft beim ersten Scan.",
      href: "/student/profile",
    });
  }
  if ((v?.summary ?? "").trim().length < 30) {
    actions.push({
      title: "Summary ausbauen",
      description: "Mindestens 1–2 Sätze: Problemräume, Stärken, Work Proof.",
      href: "/student/profile",
    });
  }
  if (!v?.desiredRoles?.length || !v?.regions?.length) {
    actions.push({
      title: "Onboarding vervollständigen",
      description: "Rollen und Regionen setzen — besseres Matching später.",
      href: "/student/onboarding",
    });
  }
  if (
    (!profile?.universityId || !profile?.degreeProgramId) &&
    Boolean(v?.desiredRoles?.length) &&
    Boolean(v?.regions?.length)
  ) {
    actions.push({
      title: "Hochschule & Studiengang",
      description: "CH-Referenzdaten für Discovery-Kontext hinterlegen.",
      href: "/student/onboarding",
    });
  }
  if (works.length === 0) {
    actions.push({
      title: "Erste Arbeit anlegen",
      description: "Work Proof ist dein stärkstes Discovery-Signal.",
      href: "/student/work/new",
    });
  } else if (breakdown.publishedCount === 0) {
    actions.push({
      title: "Work veröffentlichen",
      description: "Sobald bereit: von Draft zu Published — dann sichtbar für Discovery.",
      href: "/student/work",
    });
  }
  if (
    works.length > 0 &&
    breakdown.verifiedCount === 0 &&
    breakdown.requestedCount === 0
  ) {
    actions.push({
      title: "Verification anfragen",
      description: "Institution/Betreuung um Bestätigung bitten — Trust-Signal.",
      href: "/student/verification",
    });
  }

  if (actions.length === 0) {
    actions.push({
      title: "Profil pflegen",
      description: "Weitere Works, stärkere Outcomes, mehr Verification Context.",
      href: "/student/profile",
    });
  }

  return actions.slice(0, 5);
}
