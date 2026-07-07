import { useGlobalTheme } from "../../hooks/useGlobalTheme.ts";

export default function AdminSettingsPage() {
    const { isDark, setIsDark } = useGlobalTheme();

    return (
        <div className="main full">
            <h1>Admin Einstellungen</h1>

            <div className="card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>Dark Mode aktivieren</p>
                <input
                    type="checkbox"
                    checked={isDark}
                    onChange={(e) => setIsDark(e.target.checked)}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
            </div>
        </div>
    );
}