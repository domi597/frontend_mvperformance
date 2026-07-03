import { createContext, useState, useEffect, type ReactNode } from "react";
import { hasPreferenceConsent, onConsentChange } from "../utils/cookieConsent";

export interface AdminThemeContextType {
    isDark: boolean;
    setIsDark: (val: boolean) => void;
}

export const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
    // Ohne Zustimmung zur funktionalen Speicherung gilt die Präferenz nur für die Sitzung.
    const [isDark, setIsDark] = useState(() =>
        hasPreferenceConsent() ? localStorage.getItem("admin-theme") !== "light" : true
    );

    useEffect(() => {
        if (hasPreferenceConsent()) {
            localStorage.setItem("admin-theme", isDark ? "dark" : "light");
        }
    }, [isDark]);

    useEffect(
        () =>
            onConsentChange((consent) => {
                if (consent?.status === "all") {
                    localStorage.setItem("admin-theme", isDark ? "dark" : "light");
                } else {
                    localStorage.removeItem("admin-theme");
                }
            }),
        [isDark]
    );

    return (
        <AdminThemeContext.Provider value={{ isDark, setIsDark }}>
            <div className={isDark ? undefined : "light-mode"}>
                {children}
            </div>
        </AdminThemeContext.Provider>
    );
}