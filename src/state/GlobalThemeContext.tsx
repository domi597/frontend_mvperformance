import { createContext, useState, useEffect, type ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { hasPreferenceConsent, onConsentChange } from "../utils/cookieConsent";

export interface GlobalThemeContextType {
    isDark: boolean;
    setIsDark: (val: boolean) => void;
}

export const GlobalThemeContext = createContext<GlobalThemeContextType | undefined>(undefined);

const sharedTypography = {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: "none" as const, fontWeight: 600 },
};

const sharedComponents = {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, padding: "8px 20px" } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
};

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#c62828", light: "#e53935", dark: "#8e0000" },
        background: { default: "#0d0d0d", paper: "#161616" },
        text: { primary: "#eaeaea", secondary: "rgba(255,255,255,0.55)" },
        divider: "rgba(255,255,255,0.08)",
    },
    typography: sharedTypography,
    shape: { borderRadius: 10 },
    components: sharedComponents,
});

const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#c62828", light: "#e53935", dark: "#8e0000" },
    },
    typography: sharedTypography,
    shape: { borderRadius: 10 },
    components: sharedComponents,
});

export function GlobalThemeProvider({ children }: { children: ReactNode }) {
    // Ohne Zustimmung zur funktionalen Speicherung wird die Präferenz nicht gelesen/persistiert,
    // sondern gilt nur für die aktuelle Sitzung (im React-State, nicht im localStorage).
    const [isDark, setIsDark] = useState(() =>
        hasPreferenceConsent() ? localStorage.getItem("theme") !== "light" : true
    );

    useEffect(() => {
        if (hasPreferenceConsent()) {
            localStorage.setItem("theme", isDark ? "dark" : "light");
        }
        document.body.classList.toggle("light-mode", !isDark);
    }, [isDark]);

    // Reagiert live auf eine spätere Entscheidung im Cookie-Banner: bei Zustimmung wird die
    // aktuelle Wahl nachträglich gespeichert, bei Widerruf/Ablehnung sofort wieder entfernt.
    useEffect(
        () =>
            onConsentChange((consent) => {
                if (consent?.status === "all") {
                    localStorage.setItem("theme", isDark ? "dark" : "light");
                } else {
                    localStorage.removeItem("theme");
                }
            }),
        [isDark]
    );

    return (
        <GlobalThemeContext.Provider value={{ isDark, setIsDark }}>
            <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </GlobalThemeContext.Provider>
    );
}
