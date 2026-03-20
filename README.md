# 🔧 MW Performance — Frontend

> Weboberfläche für die **MW Performance KFZ-Werkstatt** — gebaut mit React 19, TypeScript und Vite.

---

## 📋 Projektübersicht

Dieses Repository enthält das Frontend der MW Performance Werkstatt-Webanwendung. Die Anwendung ermöglicht die Verwaltung von Kunden, Fahrzeugen, Aufträgen und Terminen über eine moderne, reaktive Benutzeroberfläche, die mit dem Spring Boot Backend kommuniziert.

---

## 👥 Team

| Name | Bereich | Aufgaben |
|------|---------|---------|
| **Nicolas** | API-Integration & UI | Verbindung zwischen Frontend und Backend (REST-Calls, Axios/Fetch Setup, Auth-Flow mit JWT), sowie Mitarbeit am UI-Design einzelner Komponenten |
| **Jan** | Frontend Design & Logik | Hauptverantwortlich für das visuelle Design (Layout, Styling, Komponenten-Struktur) sowie die gesamte Frontend-Logik und Mechanik (State Management, Routing, Formulare, Validierung) |

---

## 🛠️ Tech Stack

| Technologie | Version | Zweck |
|-------------|---------|-------|
| [React](https://react.dev/) | 19.x | UI Framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.x | Typsicherheit |
| [Vite](https://vite.dev/) | 8.x | Build Tool & Dev Server |
| ESLint | 9.x | Code Qualität |

---

## 🗂️ Projektstruktur

```
frontend_mvperformence/
├── public/
│   ├── favicon.svg          # Seiten-Icon
│   └── icons.svg            # SVG Icon Sprite
├── src/
│   ├── assets/              # Statische Ressourcen (Bilder, SVGs)
│   ├── components/          # Wiederverwendbare UI-Komponenten
│   ├── pages/               # Seiten-Komponenten (pro Route eine Seite)
│   ├── services/            # API-Calls und Backend-Kommunikation (Nicolas)
│   ├── hooks/               # Custom React Hooks
│   ├── types/               # TypeScript Interfaces & Typen
│   ├── utils/               # Hilfsfunktionen
│   ├── App.tsx              # Haupt-Komponente & Routing
│   ├── App.css              # Globale Styles
│   ├── main.tsx             # Einstiegspunkt
│   └── index.css            # Base Styles
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

> ⚠️ Die Ordner `components/`, `pages/`, `services/`, `hooks/`, `types/` und `utils/` sind die empfohlene Zielstruktur — sie werden im Laufe der Entwicklung befüllt.

---

## 🚀 Setup & Lokale Entwicklung

### Voraussetzungen

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Das **Backend** läuft lokal auf `http://localhost:8080` (siehe Backend-Repository)

### Installation

```bash
# Repository klonen
git clone <repo-url>
cd frontend_mvperformence

# Abhängigkeiten installieren
npm install
```

### Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` erreichbar.

### Build für Produktion

```bash
npm run build
```

### Build-Vorschau

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🔌 Backend-Verbindung (Nicolas)

Die Kommunikation mit dem Spring Boot Backend erfolgt über REST-Endpunkte. Authentifizierung läuft via **JWT-Token** (Bearer Auth).

**Base URL (Entwicklung):** `http://localhost:8080/api`

Die API-Service-Schicht befindet sich unter `src/services/`. Jeder Bereich der Anwendung hat seinen eigenen Service (z.B. `auftragService.ts`, `kundeService.ts`), der die Fetch/Axios-Logik kapselt.

**Geplante Services:**

| Service | Endpunkte |
|---------|-----------|
| `authService.ts` | Login, Token-Refresh, Logout |
| `kundeService.ts` | CRUD für Kunden |
| `fahrzeugService.ts` | CRUD für Fahrzeuge |
| `auftragService.ts` | Aufträge erstellen, bearbeiten, Status ändern |
| `terminService.ts` | Terminverwaltung |

---

## 🎨 Design & UI-Komponenten (Jan)

Das Design folgt einer professionellen, werkstatt-typischen Ästhetik — klare Struktur, gute Lesbarkeit, mobile-freundlich.

**Geplante Hauptseiten:**

| Seite | Beschreibung |
|-------|-------------|
| `Dashboard` | Übersicht: offene Aufträge, heutige Termine, Schnellzugriff |
| `Kundenverwaltung` | Liste, Suche, Detail, Formular (Neu/Bearbeiten) |
| `Fahrzeugverwaltung` | Fahrzeuge pro Kunde, Fahrzeughistorie |
| `Auftragsverwaltung` | Auftrag anlegen, Positionen hinzufügen, Status-Tracking |
| `Terminkalender` | Wochenansicht, Termin buchen |
| `Login` | Authentifizierung mit JWT |

**Komponenten-Konzept:**
- Wiederverwendbare Formularkomponenten mit eingebetteter Validierung
- Status-Badges für Auftragsstatus (OFFEN, IN_BEARBEITUNG, FERTIG, ABGEHOLT)
- Modal-Dialoge für Schnellaktionen
- Responsive Tabellen mit Filter- und Sortierfunktion

---

## 🔐 Authentifizierung

Der Login läuft über das Backend (`POST /api/auth/login`). Nach erfolgreichem Login wird ein JWT-Token gespeichert und bei jedem Request im `Authorization`-Header mitgeschickt.

```
Authorization: Bearer <token>
```

Geschützte Routen werden client-seitig über einen Auth-Guard abgesichert.

---

## 📡 API-Überblick (Verbindung zum Backend)

| Methode | Endpunkt | Beschreibung |
|---------|---------|-------------|
| `POST` | `/api/auth/login` | Login, gibt JWT zurück |
| `GET` | `/api/kunden` | Alle Kunden abrufen |
| `POST` | `/api/kunden` | Neuen Kunden anlegen |
| `GET` | `/api/fahrzeuge/{id}` | Fahrzeug nach ID |
| `GET` | `/api/auftraege` | Alle Aufträge |
| `POST` | `/api/auftraege` | Neuen Auftrag erstellen |
| `PATCH` | `/api/auftraege/{id}/status` | Auftragsstatus ändern |
| `GET` | `/api/termine` | Termine abrufen |

> Vollständige API-Dokumentation: Swagger UI unter `http://localhost:8080/swagger-ui.html`

---

## 🤝 Contributing

1. Neuen Branch vom `main` erstellen: `git checkout -b feature/mein-feature`
2. Änderungen committen: `git commit -m "feat: kurze Beschreibung"`
3. Branch pushen: `git push origin feature/mein-feature`
4. Pull Request erstellen

**Commit-Konventionen:**

| Prefix | Bedeutung |
|--------|-----------|
| `feat:` | Neues Feature |
| `fix:` | Bugfix |
| `style:` | Nur Styling/CSS Änderungen |
| `refactor:` | Code-Umstrukturierung ohne Funktionsänderung |
| `chore:` | Build, Konfiguration, Dependencies |

---

## 🔗 Verwandte Repositories

- **Backend:** [`backend_MWPerformence`](../backend_MWPerformence) — Spring Boot REST API mit PostgreSQL

---

*HTL Kaindorf — Schulprojekt 2025/26*
