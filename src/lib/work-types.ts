export type WorkType =
  | "semester_project"
  | "bachelor_thesis"
  | "master_thesis"
  | "practical_project"
  | "research_project"
  | "team_project"
  | "open_source"
  | "hackathon"
  | "side_project";

export const workTypeLabels: Record<WorkType, string> = {
  semester_project: "Semesterprojekt",
  bachelor_thesis: "Bachelorarbeit",
  master_thesis: "Masterarbeit",
  practical_project: "Praxisprojekt",
  research_project: "Forschungsprojekt",
  team_project: "Teamprojekt",
  open_source: "Open Source",
  hackathon: "Hackathon",
  side_project: "Side Project",
};

