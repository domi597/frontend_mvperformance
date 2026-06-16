

export interface ICustomer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    street: string | null;
    city: string | null;
    role: "ADMIN" | "CUSTOMER";
    createdAt: string;

    kundeId?: number;
    vorname?: string;
    nachname?: string;
    telefon?: string | null;
    strasse?: string | null;
    ort?: string | null;
}
