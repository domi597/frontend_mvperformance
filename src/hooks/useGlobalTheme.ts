import { useContext } from "react";
import { GlobalThemeContext } from "../state/GlobalThemeContextObject";

export function useGlobalTheme() {
    const ctx = useContext(GlobalThemeContext);
    if (!ctx) throw new Error("useGlobalTheme must be used within GlobalThemeProvider");
    return ctx;
}