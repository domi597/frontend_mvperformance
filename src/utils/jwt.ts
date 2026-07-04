export function getTokenExpiryMs(token: string): number | null {
    try {
        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) return null;

        const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

        const payload = JSON.parse(atob(padded)) as { exp?: number };
        if (!payload.exp) return null;

        return payload.exp * 1000;
    } catch {
        return null;
    }
}