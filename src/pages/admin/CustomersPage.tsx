import React, { useEffect, useState, useCallback } from "react";
import { ICustomer } from "../../interface/ICustomer.ts";
import { getAllCustomers, updateCustomer, deleteCustomer, updateCustomerPassword } from "../../api/customers.ts";
import "../../css/CustomerAdminPage.css"

const PAGE_SIZE = 10;

function extractErrorMessage(err: unknown, fallback: string): string {
    const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
    return message ?? fallback;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editingCustomer, setEditingCustomer] = useState<ICustomer | null>(null);
    const [editForm, setEditForm] = useState<Partial<ICustomer>>({});
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const [prevDebouncedSearch, setPrevDebouncedSearch] = useState(debouncedSearch);
    
    if (debouncedSearch !== prevDebouncedSearch) {
        setPrevDebouncedSearch(debouncedSearch);
        setPage(0);
    }

    const loadCustomers = useCallback(() => {
        getAllCustomers(page, PAGE_SIZE, debouncedSearch)
            .then((result) => {
                setCustomers(result.content);
                setTotalPages(result.totalPages);
                setTotalElements(result.totalElements);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [page, debouncedSearch]);

    useEffect(() => {
        // Intentional: show the loading spinner immediately for every page/search
        // change (not just on mount), so a synchronous setState here is by design.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        loadCustomers();
    }, [loadCustomers]);

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCustomer?.id) return;

        if (newPassword.trim().length > 0) {
            if (newPassword.trim().length < 6) {
                setPasswordError("Das Passwort muss mindestens 6 Zeichen lang sein.");
                return;
            }
            if (newPassword !== confirmPassword) {
                setPasswordError("Die beiden Passwörter stimmen nicht überein.");
                return;
            }
        }
        setPasswordError(null);

        try {
            await updateCustomer(editingCustomer.id, editForm);

            if (newPassword.trim().length > 0) {
                await updateCustomerPassword(editingCustomer.id, newPassword.trim());
            }

            setEditingCustomer(null);
            setNewPassword("");
            setConfirmPassword("");
            loadCustomers();
        } catch (err) {
            alert(extractErrorMessage(err, "Speichern fehlgeschlagen. Bitte erneut versuchen."));
        }
    };

    const handleDeleteConfirm = () => {
        if (!deletingId) return;
        deleteCustomer(deletingId)
            .then(() => {
                setDeletingId(null);
                setDeleteError(null);
                loadCustomers();
            })
            .catch((err) => {
                setDeleteError(extractErrorMessage(err, "Löschen fehlgeschlagen. Bitte erneut versuchen."));
            });
    };

    const filteredCustomers = customers;

    return (
        <div className="admin-customers-page">
            <div className="admin-main">
                <div className="admin-header">
                    <h1>Kunden</h1>
                </div>
                <div className="search-box">
                    <span>🔍</span>
                    <input type="text" placeholder="Kunden suchen..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="table-card">
                    {loading ? (
                        <div className="loading-state">Laden...</div>
                    ) : (
                        <table className="customers-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>E-MAIL</th>
                                <th>TELEFON</th>
                                <th>AKTIONEN</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td><strong>{customer.firstName} {customer.lastName}</strong></td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone || "-"}</td>
                                    <td>
                                        <button
                                            className="table-btn"
                                            onClick={() => {
                                                setEditingCustomer(customer);
                                                setEditForm({
                                                    firstName: customer.firstName,
                                                    lastName: customer.lastName,
                                                    email: customer.email,
                                                    phone: customer.phone,
                                                });
                                                setNewPassword("");
                                                setConfirmPassword("");
                                                setPasswordError(null);
                                            }}
                                        >
                                            Bearbeiten
                                        </button>
                                        <button
                                            className="table-btn delete-small-btn"
                                            onClick={() => { setDeletingId(customer.id); setDeleteError(null); }}
                                        >
                                            Löschen
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {!loading && totalElements > 0 && (
                    <div className="pagination-bar">
                        <span className="pagination-info">
                            {totalElements} {totalElements === 1 ? "Kunde" : "Kunden"} · Seite {page + 1} von {Math.max(totalPages, 1)}
                        </span>
                        <div className="pagination-controls">
                            <button
                                className="table-btn"
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                            >
                                Zurück
                            </button>
                            <button
                                className="table-btn"
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page + 1 >= totalPages}
                            >
                                Weiter
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {editingCustomer && (
                <div className="modal-overlay">
                    <form className="customer-form" onSubmit={handleSaveEdit}>
                        <h2>Kunde bearbeiten</h2>
                        <div className="form-row">
                            <div>
                                <label>Vorname</label>
                                <input type="text" value={editForm.firstName || ""} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} required />
                            </div>
                            <div>
                                <label>Nachname</label>
                                <input type="text" value={editForm.lastName || ""} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} required />
                            </div>
                        </div>
                        <label>E-Mail</label>
                        <input type="email" value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
                        <label>Telefon</label>
                        <input type="text" value={editForm.phone || ""} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />

                        <div className="password-field-header">
                            <label>Neues Passwort</label>
                            {newPassword.length > 0 && (
                                <span className={`char-counter ${newPassword.length < 6 ? "char-counter-low" : "char-counter-ok"}`}>
                                    {newPassword.length} Zeichen
                                </span>
                            )}
                        </div>
                        <input
                            type="password"
                            placeholder="Leer lassen, um das Passwort nicht zu ändern"
                            value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value); setPasswordError(null); }}
                            minLength={6}
                        />

                        {newPassword.length > 0 && (
                            <>
                                <label>Passwort bestätigen</label>
                                <input
                                    type="password"
                                    placeholder="Passwort wiederholen"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); }}
                                    minLength={6}
                                />
                            </>
                        )}

                        {passwordError ? (
                            <div className="warning-box warning-box-error">
                                <span className="warning-icon">⛔</span>
                                <p>{passwordError}</p>
                            </div>
                        ) : (
                            <div className="warning-box">
                                <span className="warning-icon">⚠️</span>
                                <p>
                                    Dieses Feld setzt ein <strong>komplett neues</strong> Passwort für den Kunden.
                                    Das aktuelle Passwort ist aus Sicherheitsgründen nicht einsehbar und kann nicht angezeigt werden.
                                    Nur ausfüllen, wenn wirklich ein Reset gewünscht ist.
                                </p>
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="button" onClick={() => { setEditingCustomer(null); setNewPassword(""); setConfirmPassword(""); setPasswordError(null); }}>Abbrechen</button>
                            <button type="submit">Speichern</button>
                        </div>
                    </form>
                </div>
            )}
            {deletingId !== null && (
                <div className="modal-overlay">
                    <div className="delete-box">
                        <h2>Konto löschen?</h2>
                        <p>Soll dieser Kunde wirklich gelöscht werden?</p>

                        {deleteError && (
                            <div className="warning-box warning-box-error">
                                <span className="warning-icon">⛔</span>
                                <p>{deleteError}</p>
                            </div>
                        )}

                        <div className="delete-actions">
                            <button onClick={() => { setDeletingId(null); setDeleteError(null); }}>Abbrechen</button>
                            <button onClick={handleDeleteConfirm} className="delete-small-btn">Ja, Löschen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}