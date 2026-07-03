import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
    type CookieConsentStatus,
    getStoredConsent,
    onConsentChange,
    storeConsent,
} from "../utils/cookieConsent";

export interface CookieConsentContextType {
    status: CookieConsentStatus | null;
    bannerOpen: boolean;
    acceptAll: () => void;
    acceptNecessaryOnly: () => void;
    openSettings: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

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

export function useCookieConsent(): CookieConsentContextType {
    const ctx = useContext(CookieConsentContext);
    if (!ctx) {
        throw new Error("useCookieConsent muss innerhalb eines CookieConsentProvider verwendet werden.");
    }
    return ctx;
}
