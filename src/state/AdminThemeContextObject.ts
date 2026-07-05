import { createContext } from "react";

export interface AdminThemeContextType {
    isDark: boolean;
    setIsDark: (val: boolean) => void;
}

export const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);