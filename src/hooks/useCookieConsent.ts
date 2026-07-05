import { useContext } from "react";
import { CookieConsentContext, type CookieConsentContextType } from "../state/CookieConsentContextObject";

export function useCookieConsent(): CookieConsentContextType {
    const ctx = useContext(CookieConsentContext);
    if (!ctx) {
        throw new Error("useCookieConsent muss innerhalb eines CookieConsentProvider verwendet werden.");
    }
    return ctx;
}