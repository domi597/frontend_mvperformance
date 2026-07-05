import { createContext } from "react";

export interface GlobalThemeContextType {
    isDark: boolean;
    setIsDark: (val: boolean) => void;
}

export const GlobalThemeContext = createContext<GlobalThemeContextType | undefined>(undefined);