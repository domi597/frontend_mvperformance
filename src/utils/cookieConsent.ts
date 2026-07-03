/**
 * Zentrale Logik für die Cookie-/Speicher-Einwilligung (DSGVO Art. 6, §165 TKG 2021).
 *
 * Kategorien:
 *  - "necessary": nur technisch notwendige Speicherung (Login-Token in sessionStorage,
 *    diese Einwilligungs-Entscheidung selbst). Erfordert KEINE Zustimmung, da ohne diese
 *    Speicherung die Plattform (Login, Terminbuchung) nicht funktionieren würde.
 *  - "all": zusätzlich funktionale Speicherung von Komfort-Einstellungen (Dark/Light-Mode)
 *    dauerhaft im localStorage. Diese ist NICHT technisch zwingend erforderlich und wird
 *    daher nur nach ausdrücklicher Zustimmung gespeichert.
 *
 * Die Entscheidung selbst wird lokal gespeichert, damit der Banner nicht bei jedem
 * Seitenaufruf erneut erscheint (das ist Standardpraxis und selbst technisch notwendig).
 */

export type CookieConsentStatus = "all" | "necessary";

const STORAGE_KEY = "cookie-consent";
const CONSENT_EVENT = "cookie-consent-changed";

export interface StoredConsent {
    status: CookieConsentStatus;
    /** Zeitstempel der Entscheidung – dient als Nachweis der Einwilligung (Art. 7 Abs. 1 DSGVO). */
    decidedAt: string;
}

/** Liest die gespeicherte Entscheidung, oder null, falls noch keine getroffen wurde. */
export function getStoredConsent(): StoredConsent | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoredConsent;
    } catch {
        return null;
    }
}

/** Speichert die Entscheidung des Nutzers und benachrichtigt alle Listener im Tab. */
export function storeConsent(status: CookieConsentStatus): void {
    const value: StoredConsent = { status, decidedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent<StoredConsent>(CONSENT_EVENT, { detail: value }));
}

/** Registriert einen Listener für Änderungen der Einwilligung; gibt eine Unsubscribe-Funktion zurück. */
export function onConsentChange(listener: (value: StoredConsent | null) => void): () => void {
    const handler = (e: Event) => listener((e as CustomEvent<StoredConsent>).detail ?? null);
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
}

/** true, wenn der Nutzer der funktionalen Speicherung (z. B. Theme-Präferenz) zugestimmt hat. */
export function hasPreferenceConsent(): boolean {
    return getStoredConsent()?.status === "all";
}