import { useEffect, useState, type ReactNode } from "react";
import {
    getStoredConsent,
    onConsentChange,
    storeConsent,
    type CookieConsentStatus,
} from "../utils/cookieConsent";
import { CookieConsentContext } from "./CookieConsentContextObject";
export type { CookieConsentContextType } from "./CookieConsentContextObject";

export function CookieConsentProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<CookieConsentStatus | null>(
        () => getStoredConsent()?.status ?? null
    );
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => onConsentChange((value) => setStatus(value?.status ?? null)), []);

    const acceptAll = () => {
        storeConsent("all");
        setSettingsOpen(false);
    };

    const acceptNecessaryOnly = () => {
        storeConsent("necessary");
        setSettingsOpen(false);
    };

    const openSettings = () => setSettingsOpen(true);

    return (
        <CookieConsentContext.Provider
            value={{
                status,
                bannerOpen: status === null || settingsOpen,
                acceptAll,
                acceptNecessaryOnly,
                openSettings,
            }}
        >
            {children}
        </CookieConsentContext.Provider>
    );
}