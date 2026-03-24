import { ETerminStatus } from "../types/ETerminStatus";

export interface ITermin {
  terminId: number;
  kundeId: number;
  kundeName: string;
  leistung: string;
  datum: string;
  uhrzeit: string;
  marke: string;
  modell: string;
  baujahr: number | null;
  kennzeichen: string;
  status: ETerminStatus;
  preis: number | null;
  notiz: string;
  createdAt: string;
}
