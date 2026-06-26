import { createContext, useState, useEffect, type ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

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
    const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") !== "light");

    useEffect(() => {
        localStorage.setItem("theme", isDark ? "dark" : "light");
        document.body.classList.toggle("light-mode", !isDark);
    }, [isDark]);

    return (
        <GlobalThemeContext.Provider value={{ isDark, setIsDark }}>
            <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </GlobalThemeContext.Provider>
    );
}
