import type { IKunde } from "../interface/IKunde";
import type { ITermin } from "../interface/ITermin";
import type { IAngebot } from "../interface/IAngebot";

// Erweitertes Mock-Interface mit Passwort (nur für lokale Testdaten) -N 27.03.2026
export interface IMockKunde extends IKunde {
  passwort: string;
}

// Mock Kunden - generiert

export const MOCK_KUNDEN: IMockKunde[] = [
  {
    kundeId: 0,
    vorname: "Georg",
    nachname: "Dietrich",
    email: "admin@gdg.at",
    telefon: "+43 3452 12345",
    strasse: "Werkstattgasse 1",
    plz: "8430",
    ort: "Leibnitz",
    marke: "",
    modell: "",
    baujahr: null,
    kennzeichen: "",
    role: "ADMIN",
    createdAt: "2024-01-01T00:00:00",
    passwort: "test123",
  },
  {
    kundeId: 1,
    vorname: "Thomas",
    nachname: "Kauer",
    email: "thomas.kauer@gmail.com",
    telefon: "+43 664 123 4567",
    strasse: "Hauptstraße 12",
    plz: "8430",
    ort: "Leibnitz",
    marke: "VW",
    modell: "Golf",
    baujahr: 2018,
    kennzeichen: "LB-TK-123",
    role: "KUNDE",
    createdAt: "2024-11-03T10:22:00",
    passwort: "test123",
  },
  {
    kundeId: 2,
    vorname: "Maria",
    nachname: "Schreiner",
    email: "m.schreiner@outlook.at",
    telefon: "+43 676 987 6543",
    strasse: "Bahnhofgasse 5",
    plz: "8430",
    ort: "Leibnitz",
    marke: "BMW",
    modell: "X2",
    baujahr: 2021,
    kennzeichen: "LB-MS-456",
    role: "KUNDE",
    createdAt: "2024-12-15T14:05:00",
    passwort: "test123",
  },
  {
    kundeId: 3,
    vorname: "Stefan",
    nachname: "Bauer",
    email: "stefan.bauer@yahoo.com",
    telefon: "+43 699 555 1234",
    strasse: "Kirchenplatz 3",
    plz: "8435",
    ort: "Wagna",
    marke: "Audi",
    modell: "A4",
    baujahr: 2017,
    kennzeichen: "LB-SB-789",
    role: "KUNDE",
    createdAt: "2025-01-08T09:30:00",
    passwort: "test123",
  },
];

// Mock Termine - generiert

export const MOCK_TERMINE: ITermin[] = [
  {
    terminId: 1,
    kundeId: 1,
    kundeName: "Thomas Kauer",
    leistung: "Ölwechsel",
    datum: "2025-03-19",
    uhrzeit: "10:00",
    marke: "VW",
    modell: "Golf",
    baujahr: 2018,
    kennzeichen: "LB-TK-123",
    status: "NEU",
    preis: 49,
    notiz: "",
    createdAt: "2025-03-10T08:14:00",
  },
  {
    terminId: 2,
    kundeId: 2,
    kundeName: "Maria Schreiner",
    leistung: "Reifenwechsel",
    datum: "2025-03-20",
    uhrzeit: "09:00",
    marke: "BMW",
    modell: "X2",
    baujahr: 2021,
    kennzeichen: "LB-MS-456",
    status: "AUSSTEHEND",
    preis: 69,
    notiz: "Bitte Winterreifen einlagern",
    createdAt: "2025-03-11T11:30:00",
  },
  {
    terminId: 3,
    kundeId: 3,
    kundeName: "Stefan Bauer",
    leistung: "Bremsenservice",
    datum: "2025-03-21",
    uhrzeit: "14:00",
    marke: "Audi",
    modell: "A4",
    baujahr: 2017,
    kennzeichen: "LB-SB-789",
    status: "BESTAETIGT",
    preis: 95,
    notiz: "",
    createdAt: "2025-03-12T15:45:00",
  },
];

// Mock Angebote - generiert

export const MOCK_ANGEBOTE: IAngebot[] = [
  {
    angebotId: 1,
    titel: "Frühlings-Check",
    beschreibung: "Ölwechsel + Bremsen + Reifenwechsel – alles in einem Termin",
    preis: 49,
    aktiv: true,
    createdAt: "2025-02-01T00:00:00",
  },
  {
    angebotId: 2,
    titel: "Klimaservice",
    beschreibung: "Kältemittel auffüllen + Desinfektion + kompletter System-Check",
    preis: 69,
    aktiv: true,
    createdAt: "2025-02-15T00:00:00",
  },
  {
    angebotId: 3,
    titel: "HU-Kombipaket",
    beschreibung: "§57a Begutachtung inklusive kleinem Service-Check vor der Prüfung",
    preis: 99,
    aktiv: false,
    createdAt: "2025-01-10T00:00:00",
  },
];
