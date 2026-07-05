import { useContext } from "react";
import { AdminThemeContext } from "../state/AdminThemeContextObject";

export function useAdminTheme() {
    const ctx = useContext(AdminThemeContext);
    if (!ctx) throw new Error("useAdminTheme must be used within AdminThemeProvider");
    return ctx;
}