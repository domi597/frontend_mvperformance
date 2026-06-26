import { useContext } from "react";
import { AccountThemeContext } from "../state/AccountThemeContext";

export function useAccountTheme() {
    const ctx = useContext(AccountThemeContext);
    if (!ctx) throw new Error("useAccountTheme must be used within AccountThemeProvider");
    return ctx;
}
