import type { IAppointment } from "../interface/IAppointment";
import type { IOffer } from "../interface/IOffer";

// Standalone mock customer type with password — only for local test data. -N 27.03.2026
export interface IMockKunde {
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

export const MOCK_TERMINE: IAppointment[] = [
  {
    id: 1,
    customerId: 1,
    customerName: "Thomas Kauer",
    serviceType: "Ölwechsel",
    date: "2025-03-19",
    time: "10:00",
    brand: "VW",
    model: "Golf",
    year: 2018,
    licensePlate: "LB-TK-123",
    status: "NEU",
    price: 49,
    note: "",
    createdAt: "2025-03-10T08:14:00",
  },
  {
    id: 2,
    customerId: 2,
    customerName: "Maria Schreiner",
    serviceType: "Reifenwechsel",
    date: "2025-03-20",
    time: "09:00",
    brand: "BMW",
    model: "X2",
    year: 2021,
    licensePlate: "LB-MS-456",
    status: "AUSSTEHEND",
    price: 69,
    note: "Bitte Winterreifen einlagern",
    createdAt: "2025-03-11T11:30:00",
  },
  {
    id: 3,
    customerId: 3,
    customerName: "Stefan Bauer",
    serviceType: "Bremsenservice",
    date: "2026-04-10",
    time: "14:00",
    brand: "Audi",
    model: "A4",
    year: 2017,
    licensePlate: "LB-SB-789",
    status: "BESTÄTIGT",
    price: 95,
    note: "",
    createdAt: "2025-03-12T15:45:00",
  },
];

// Mock Angebote - generiert

export const MOCK_ANGEBOTE: IOffer[] = [
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
