export interface RegisterRequest {
    vorname: string;
    nachname: string;
    email: string;
    password: string;
    telefon: string;
    strasse: string;
    plz: string;
    ort: string;
    marke: string;
    modell: string;
    baujahr: number | null;
    kennzeichen: string;
}

/** Antwort direkt nach der Registrierung — es wird noch kein Token ausgestellt,
 *  das Konto muss zuerst per E-Mail-Code bestätigt werden. */
export interface PendingVerificationResponse {
    email: string;
    message: string;
}

