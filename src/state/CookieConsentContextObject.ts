import { createContext } from "react";
import { type CookieConsentStatus } from "../utils/cookieConsent";

export interface CookieConsentContextType {
    status: CookieConsentStatus | null;
    bannerOpen: boolean;
    acceptAll: () => void;
    acceptNecessaryOnly: () => void;
    openSettings: () => void;
}

export const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);