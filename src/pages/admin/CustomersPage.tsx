import React, { useEffect, useState, useCallback } from "react";
import { ICustomer } from "../../interface/ICustomer.ts";
import { getAllCustomers, updateCustomer, deleteCustomer } from "../../api/customers.ts";
import "../../css/CustomerAdminPage.css"

export default function CustomersPage() {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingCustomer, setEditingCustomer] = useState<ICustomer | null>(null);
    const [editForm, setEditForm] = useState<Partial<ICustomer>>({});
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadCustomers = useCallback(() => {
        setLoading(true);
        getAllCustomers()
            .then((data) => {
                setCustomers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCustomer?.id) return;
        updateCustomer(editingCustomer.id, editForm)
            .then(() => {
                setEditingCustomer(null);
                loadCustomers();
            })
            .catch((err) => alert(err.message));
    };

    const handleDeleteConfirm = () => {
        if (!deletingId) return;
        deleteCustomer(deletingId)
            .then(() => {
                setDeletingId(null);
                loadCustomers();
            })
            .catch((err) => alert(err.message));
    };

    const filteredCustomers = customers.filter((c) => {
        const fullName = `${c.vorname || ""} ${c.nachname || ""}`.toLowerCase();
        const email = (c.email || "").toLowerCase();
        const query = search.toLowerCase();
        return fullName.includes(query) || email.includes(query);
    });

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
                                    <td><strong>{customer.vorname} {customer.nachname}</strong></td>
                                    <td>{customer.email}</td>
                                    <td>{customer.telefon || "-"}</td>
                                    <td>
                                        <button className="table-btn" onClick={() => { setEditingCustomer(customer); setEditForm({ vorname: customer.vorname, nachname: customer.nachname, email: customer.email, telefon: customer.telefon }); }}>Bearbeiten</button>
                                        <button className="table-btn delete-small-btn" onClick={() => setDeletingId(customer.id)}>Löschen</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            {editingCustomer && (
                <div className="modal-overlay">
                    <form className="customer-form" onSubmit={handleSaveEdit}>
                        <h2>Kunde bearbeiten</h2>
                        <div className="form-row">
                            <div><label>Vorname</label><input type="text" value={editForm.vorname || ""} onChange={(e) => setEditForm({ ...editForm, vorname: e.target.value })} required /></div>
                            <div><label>Nachname</label><input type="text" value={editForm.nachname || ""} onChange={(e) => setEditForm({ ...editForm, nachname: e.target.value })} required /></div>
                        </div>
                        <label>E-Mail</label><input type="email" value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
                        <label>Telefon</label><input type="text" value={editForm.telefon || ""} onChange={(e) => setEditForm({ ...editForm, telefon: e.target.value })} />
                        <div className="form-actions">
                            <button type="button" onClick={() => setEditingCustomer(null)}>Abbrechen</button>
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
                        <div className="delete-actions">
                            <button onClick={() => setDeletingId(null)}>Abbrechen</button>
                            <button onClick={handleDeleteConfirm} className="delete-small-btn">Ja, Löschen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}