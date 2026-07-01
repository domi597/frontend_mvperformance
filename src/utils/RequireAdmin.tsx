import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

export function RequireAdmin({ children }: { children: ReactElement }) {
    const token = sessionStorage.getItem("token");
    const raw = sessionStorage.getItem("loggedInKunde");

    if (!token) return <Navigate to="/login" replace />;

    let isAdmin = false;
    let parseFailed = false;

    try {
        const k = raw ? JSON.parse(raw) : null;
        isAdmin = !!k && k.role === "ADMIN";
    } catch {
        parseFailed = true;
    }

    if (parseFailed) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return children;
}
