export interface IKunde {
  kundeId: number;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  strasse: string;
  plz: string;
  ort: string;
  marke: string;
  modell: string;
  baujahr: number | null;
  kennzeichen: string;
  role: "ADMIN" | "KUNDE";
  createdAt: string;
}
