import { createContext, useState, useEffect, type ReactNode } from "react";

export interface AdminThemeContextType {
    isDark: boolean;
    setIsDark: (val: boolean) => void;
}

export const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(() => localStorage.getItem("admin-theme") !== "light");

    useEffect(() => {
        localStorage.setItem("admin-theme", isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <AdminThemeContext.Provider value={{ isDark, setIsDark }}>
            <div className={isDark ? undefined : "light-mode"}>
                {children}
            </div>
        </AdminThemeContext.Provider>
    );
}