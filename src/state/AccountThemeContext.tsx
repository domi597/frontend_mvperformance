import { useState, useEffect, type ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { hasPreferenceConsent, onConsentChange } from "../utils/cookieConsent";
import { AccountThemeContext } from "./AccountThemeContextObject";
export type { AccountThemeContextType } from "./AccountThemeContextObject";

const paletteBase = {
    primary: { main: "#c62828", light: "#e53935", dark: "#8e0000" },
};

const typographyBase = {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: "none" as const, fontWeight: 600 },
};

const componentsBase = {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, padding: "8px 20px" } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
};

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        ...paletteBase,
        background: { default: "#0d0d0d", paper: "#161616" },
        text: { primary: "#eaeaea", secondary: "rgba(255,255,255,0.55)" },
        divider: "rgba(255,255,255,0.08)",
    },
    typography: typographyBase,
    shape: { borderRadius: 10 },
    components: componentsBase,
});

const lightTheme = createTheme({
    palette: {
        mode: "light",
        ...paletteBase,
    },
    typography: typographyBase,
    shape: { borderRadius: 10 },
    components: componentsBase,
});

export function AccountThemeProvider({ children }: { children: ReactNode }) {
    // Ohne Zustimmung zur funktionalen Speicherung gilt die Präferenz nur für die Sitzung.
    const [isDark, setIsDark] = useState(() =>
        hasPreferenceConsent() ? localStorage.getItem("account-theme") !== "light" : true
    );

    useEffect(() => {
        if (hasPreferenceConsent()) {
            localStorage.setItem("account-theme", isDark ? "dark" : "light");
        }
    }, [isDark]);

    useEffect(
        () =>
            onConsentChange((consent) => {
                if (consent?.status === "all") {
                    localStorage.setItem("account-theme", isDark ? "dark" : "light");
                } else {
                    localStorage.removeItem("account-theme");
                }
            }),
        [isDark]
    );

    return (
        <AccountThemeContext.Provider value={{ isDark, setIsDark }}>
            <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AccountThemeContext.Provider>
    );
}