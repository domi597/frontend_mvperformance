import type { IKunde } from "../interface/IKunde";

export interface RegisterRequest {
  vorname: string;
  nachname: string;
  email: string;
  password: string;
  telefon: string;
  strasse: string;
  plz: string;
  ort: string;
  marke: string;
  modell: string;
  baujahr: number | null;
  kennzeichen: string;
}

export interface RegisterResponse {
  kunde: IKunde;
}
