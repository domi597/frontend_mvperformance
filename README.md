# 🔧 MVPerformance — Frontend

> Weboberfläche für die **MVPerformance KFZ-Werkstatt** — gebaut mit React 19, TypeScript, Vite und Material UI.

---

## 📋 Projektübersicht

Die Autowerkstatt verfügt aktuell über keine digitale Plattform. Kunden müssen Termine telefonisch oder vor Ort vereinbaren, was zeitaufwendig ist und zu organisatorischen Problemen führen kann. Ziel ist es, eine moderne Website zu entwickeln, die Kunden eine einfache Terminbuchung ermöglicht und einen Admin-Bereich zur Verwaltung bereitstellt.

**Auftraggeber:** Devrim Gül

---

## 👥 Team

| Name | Aufgabe |
|------|---------|
| **Jan** | Frontend — Design & Logik der Benutzeroberfläche |
| **Nicolas** | Frontend-Design, Page-Entwicklung & Verbindung zwischen Frontend und Backend |
| **Dominik** | Backend-Routen (Controller / Endpoints) & Frontend-Entwicklung |

Alle drei sind sowohl am Frontend als auch am Backend beteiligt.

---

## 🎯 Projektziele

- Entwicklung einer modernen Website für die Autowerkstatt
- Terminbuchung für Kunden über die Website
- Admin-Bereich zur Verwaltung von Terminen, Kunden und Angeboten

---

## 🛠️ Tech Stack

| Technologie | Zweck |
|-------------|-------|
| [React 19](https://react.dev/) | UI Framework |
| TypeScript | Typsicherheit |
| [Vite 6](https://vite.dev/) | Build Tool & Dev Server |
| [Material UI 7](https://mui.com/) | Komponenten-Bibliothek & Theming |
| [React Router 7](https://reactrouter.com/) | Client-side Routing |
| [Axios](https://axios-http.com/) | HTTP-Client für Backend-Calls |
| ESLint | Code-Qualität |

---

## 🗂️ Projektstruktur

```
src/
├── api/             # Axios-Clients & Endpoint-Wrapper (auth, customers, offers, services, appointments)
├── components/      # Wiederverwendbare UI-Komponenten (Navbar, AdminNavbar, TopBar, Footer)
├── css/             # Globale Styles
├── hooks/           # Eigene React Hooks
├── interface/       # TypeScript-Interfaces für API-Modelle
├── mockdata/        # Beispiel-/Testdaten
├── pages/           # Öffentliche Seiten (Home, Login, Register, Termin, ...)
│   └── admin/       # Admin-Seiten (Dashboard, Appointments, Customers, Offers, Services, Settings)
├── pics/            # Bilder & Grafiken
├── service/         # Auth- & Register-Service (Session, Tokens)
├── theme.ts         # MUI-Theme
├── types/           # Geteilte TS-Typen
├── view/            # Layouts (PublicLayout, AuthLayout, AdminLayout)
├── App.tsx          # Routing & App-Shell
└── main.tsx         # Einstiegspunkt
```

---

## 📄 Seiten

### Öffentlich
| Seite | Route | Beschreibung |
|-------|-------|--------------|
| **Startseite** | `/` | Hero, Leistungen, Termin-CTA |
| **Über uns** | `/ueber-uns` | Vorstellung der Werkstatt |
| **Leistungen** | `/leistungen` | Übersicht der Services |
| **Angebote** | `/angebote` | Aktuelle Aktionen |
| **Kontakt** | `/kontakt` | Adresse, Anfahrt, Kontaktdaten |
| **Terminbuchung** | `/termin` | Leistung, Fahrzeug, Datum & Uhrzeit wählen |
| **Login / Registrierung** | `/login`, `/register` | Kundenkonto |
| **Passwort vergessen** | `/forgot-password` | Reset-Flow |
| **Impressum / AGB / Datenschutz** | `/impressum`, `/agb`, `/datenschutz` | Rechtliches |

### Admin-Bereich
| Seite | Beschreibung |
|-------|--------------|
| **Dashboard** | Übersicht & Kennzahlen |
| **Termine** | Offene Termine verwalten |
| **Kunden** | Kundenliste & Details |
| **Angebote** | Angebote pflegen |
| **Services** | Leistungs-Katalog pflegen |
| **Einstellungen** | Admin-Settings |

---

## 🚀 Setup & Lokale Entwicklung

### Voraussetzungen

- **Node.js** ≥ 18.x
- Das **Backend** läuft lokal auf `http://localhost:8080`

### Installation & Start

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` erreichbar.

### Weitere Scripts

```bash
npm run build     # Typecheck (tsc -b) + Produktions-Build via Vite
npm run preview   # Lokale Vorschau des Builds
npm run lint      # ESLint
```

---

## 🔌 Backend-Verbindung

Die Kommunikation mit dem Spring Boot Backend erfolgt über REST. Authentifizierung läuft via **JWT-Token** (gespeichert über `AuthService` in `src/service/`).

Die HTTP-Aufrufe sind in `src/api/` gekapselt — Komponenten verwenden die Wrapper, ohne Axios direkt anzusprechen:

- `api.ts` — zentrale Axios-Instanz inkl. Auth-Header
- `auth.ts`, `customers.ts`, `offers.ts`, `services.ts`, `appointmentApi.ts` — Endpoint-Module

---

## 🔗 Verwandte Repositories

- **Backend:** [`backend_MWPerformence`](../backend_MWPerformence) — Spring Boot REST API

---

*HTL Kaindorf — Schulprojekt 2025/26*
