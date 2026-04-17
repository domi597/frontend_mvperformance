// IKunde spiegelt das UserDTO vom Backend wider.
// Backend-Felder: id, firstName, lastName, email, phone, street, city, role, createdAt

export interface ICustomer {
    // Backend-Felder (camelCase wie vom Backend geliefert)
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    street: string | null;
    city: string | null;
    role: "ADMIN" | "CUSTOMER";
    createdAt: string;

    // Alias-Felder für Frontend-Kompatibilität (werden aus firstName/lastName befüllt)
    kundeId?: number;
    vorname?: string;
    nachname?: string;
    telefon?: string | null;
    strasse?: string | null;
    ort?: string | null;
}
