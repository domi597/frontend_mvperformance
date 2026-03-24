export type ETerminStatus = "NEU" | "AUSSTEHEND" | "BESTAETIGT" | "ABGELEHNT";

export const TerminStatusLabel: Record<ETerminStatus, string> = {
  NEU: "Neu",
  AUSSTEHEND: "Ausstehend",
  BESTAETIGT: "Bestätigt",
  ABGELEHNT: "Abgelehnt",
};
