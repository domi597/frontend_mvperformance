import { createContext } from "react";

export interface AccountThemeContextType {
    isDark: boolean;
    setIsDark: (val: boolean) => void;
}

export const AccountThemeContext = createContext<AccountThemeContextType | undefined>(undefined);