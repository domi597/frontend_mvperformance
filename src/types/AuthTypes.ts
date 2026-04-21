// AuthTypes.ts
// Typen die exakt zum Backend AuthResponse passen.

import type { ICustomer } from "../interface/ICustomer";

export interface AuthResponse {
    token: string;
    user: ICustomer;
}
