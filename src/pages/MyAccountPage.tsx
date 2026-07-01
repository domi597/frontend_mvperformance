import { useEffect, useState } from "react";
import {Alert, Avatar, Box, Button, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, Snackbar, Stack, TextField, Typography,} from "@mui/material";
import {BadgeOutlined, DirectionsCarOutlined, Edit, DeleteOutline, AddOutlined, LockOutlined, PersonOutlined, PhoneOutlined, HomeOutlined, EmailOutlined, DarkModeOutlined, LightModeOutlined,} from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";
import { useGlobalTheme } from "../hooks/useGlobalTheme";
import { MyAccountService } from "../service/MyAccountService";
import type { ICustomer } from "../interface/ICustomer";
import type { IVehicle } from "../interface/IVehicle";
import type { IInfoRowProps } from "../interface/IInfoRowProps";
import { isValidAustrianPlate } from "../utils/validation";

/** Small uppercase section heading. */
function SectionLabel({ children }: { children: string }) {
    return (
        <Typography
            variant="overline"
            fontWeight={700}
            sx={{ color: "text.secondary", display: "block", mb: 2, letterSpacing: 1.5 }}
        >
            {children}
        </Typography>
    );
}

/** One data row with an icon, label, value and an optional edit button. */
function InfoRow({ icon, label, value, onEdit }: IInfoRowProps) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                "&:last-child": { borderBottom: 0 },
                "&:hover": { bgcolor: "action.hover", borderRadius: 1 },
                px: 1,
                mx: -1,
                transition: "background 0.15s",
            }}
        >
            <Box sx={{ color: "primary.main", mr: 2, display: "flex", minWidth: 24 }}>{icon}</Box>
            <Typography variant="body2" color="text.secondary" sx={{ width: 100, flexShrink: 0 }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ flex: 1, color: value ? "text.primary" : "text.disabled" }}>
                {value || "Nicht angegeben"}
            </Typography>
            {onEdit && (
                <IconButton size="small" onClick={onEdit} sx={{ color: "text.disabled", "&:hover": { color: "primary.main" } }}>
                    <Edit sx={{ fontSize: 16 }} />
                </IconButton>
            )}
        </Stack>
    );
}

const emptyVehicleForm = { brand: "", model: "", buildYear: "", licensePlate: "" };

export default function MyAccountPage() {
    const navigate = useNavigate();
    const kunde = AuthService.getKunde();
    const { isDark, setIsDark } = useGlobalTheme();

    const [customer, setCustomer] = useState<ICustomer | null>(kunde);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [editField, setEditField] = useState<"name" | "email" | "phone" | "address" | null>(null);
    const [editValue, setEditValue] = useState("");
    const [editValue2, setEditValue2] = useState("");

    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    const [vehicleLoading, setVehicleLoading] = useState(false);
    const [vehicleDialog, setVehicleDialog] = useState<{ open: boolean; editing: IVehicle | null }>({ open: false, editing: null });
    const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);
    const [vehicleSaving, setVehicleSaving] = useState(false);

    const [deleteVehicleTarget, setDeleteVehicleTarget] = useState<IVehicle | null>(null);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

    useEffect(() => {
        if (!AuthService.isLoggedIn()) {
            navigate("/login");
            return;
        }
        setLoading(true);
        MyAccountService.fetchCustomer()
            .then((data) => {
                setCustomer(data);
                return data;
            })
            .then((data) => {
                setVehicleLoading(true);
                return MyAccountService.fetchVehicles(data.id)
                    .then(setVehicles)
                    .finally(() => setVehicleLoading(false));
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [navigate]);

    const memberSince = customer?.createdAt ? new Date(customer.createdAt).getFullYear() : null;
    const initials = customer
        ? `${customer.firstName?.[0] ?? ""}${customer.lastName?.[0] ?? ""}`.toUpperCase()
        : "??";
    const fullName = customer ? `${customer.firstName} ${customer.lastName}` : "";

    /** Opens the edit form for the given field and fills it with the current value. */
    const openEdit = (field: typeof editField) => {
        setEditField(field);
        if (field === "name") { setEditValue(customer?.firstName ?? ""); setEditValue2(customer?.lastName ?? ""); }
        else if (field === "email") { setEditValue(customer?.email ?? ""); }
        else if (field === "phone") { setEditValue(customer?.phone ?? ""); }
        else if (field === "address") { setEditValue(customer?.street ?? ""); setEditValue2(customer?.city ?? ""); }
    };

    /** Resets all edit state and closes the inline edit form. */
    const cancelEdit = () => { setEditField(null); setEditValue(""); setEditValue2(""); };

    /** Saves the edited profile field and closes the form. */
    const saveEdit = async () => {
        if (!customer || !editField) return;
        setSaving(true);
        setError(null);
        try {
            const patch = MyAccountService.buildPatch(editField, editValue, editValue2);
            const updated = await MyAccountService.updateProfile(customer.id, patch);
            setCustomer(updated);
            setSuccessMsg("Änderungen gespeichert.");
            cancelEdit();
        } catch {
            setError("Speichern fehlgeschlagen. Bitte versuche es erneut.");
        } finally {
            setSaving(false);
        }
    };

    /** Opens the vehicle dialog — in edit mode if a vehicle is passed, otherwise add mode. */
    const openVehicleDialog = (vehicle?: IVehicle) => {
        setVehicleDialog({ open: true, editing: vehicle ?? null });
        setVehicleForm(vehicle
            ? { brand: vehicle.brand, model: vehicle.model, buildYear: vehicle.buildYear?.toString() ?? "", licensePlate: vehicle.licensePlate ?? "" }
            : emptyVehicleForm
        );
    };

    /** Creates or updates a vehicle and refreshes the list. */
    const saveVehicle = async () => {
        if (!customer) return;
        setVehicleSaving(true);
        try {
            const result = await MyAccountService.saveVehicle(
                customer.id,
                vehicleForm,
                vehicleDialog.editing?.id,
            );
            if (vehicleDialog.editing) {
                setVehicles((prev) => prev.map((v) => v.id === result.id ? result : v));
            } else {
                setVehicles((prev) => [...prev, result]);
            }
            setVehicleDialog({ open: false, editing: null });
            setSuccessMsg(vehicleDialog.editing ? "Fahrzeug aktualisiert." : "Fahrzeug hinzugefügt.");
        } catch {
            setError("Fahrzeug konnte nicht gespeichert werden.");
        } finally {
            setVehicleSaving(false);
        }
    };

    /** Deletes the selected vehicle after confirmation. */
    const confirmDeleteVehicle = async () => {
        if (!deleteVehicleTarget) return;
        try {
            await MyAccountService.removeVehicle(deleteVehicleTarget.id);
            setVehicles((prev) => prev.filter((v) => v.id !== deleteVehicleTarget.id));
            setSuccessMsg("Fahrzeug gelöscht.");
        } catch {
            setError("Fahrzeug konnte nicht gelöscht werden.");
        } finally {
            setDeleteVehicleTarget(null);
        }
    };

    /** Deletes the account, clears localStorage and redirects to home. */
    const confirmDeleteAccount = async () => {
        if (!customer) return;
        try {
            await MyAccountService.removeAccount(customer.id);
            navigate("/");
        } catch {
            setError("Konto konnte nicht gelöscht werden.");
            setDeleteAccountOpen(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>

            <Grid container spacing={3} alignItems="flex-start">

                <Grid size={{ xs: 12, md: 3 }}>

                    <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: 3, border: "1px solid", borderColor: "divider", textAlign: "center" }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: 28, fontWeight: 700, mx: "auto", mb: 2 }}>
                            {initials}
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight={700} noWrap>{fullName}</Typography>
                        <Typography variant="caption" color="text.secondary">{customer?.email}</Typography>
                        {memberSince && (
                            <Box sx={{ mt: 2 }}>
                                <Chip label={`Kunde seit ${memberSince}`} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                            </Box>
                        )}
                    </Paper>

                    <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                        <SectionLabel>Sicherheit</SectionLabel>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <LockOutlined fontSize="small" sx={{ color: "text.secondary" }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500}>Passwort</Typography>
                            </Box>
                            <Button variant="outlined" size="small" sx={{ borderRadius: 2, fontSize: 12 }}>
                                Ändern
                            </Button>
                        </Stack>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                        <SectionLabel>Darstellung</SectionLabel>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            {isDark
                                ? <DarkModeOutlined fontSize="small" sx={{ color: "text.secondary" }} />
                                : <LightModeOutlined fontSize="small" sx={{ color: "text.secondary" }} />
                            }
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500}>{isDark ? "Dark Mode" : "Light Mode"}</Typography>
                            </Box>
                            <Switch checked={isDark} onChange={(e) => setIsDark(e.target.checked)} size="small" color="primary" />
                        </Stack>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "error.light", bgcolor: "rgba(211,47,47,0.03)" }}>
                        <SectionLabel>Konto</SectionLabel>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <BadgeOutlined fontSize="small" sx={{ color: "error.light" }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={500}>Konto löschen</Typography>
                                <Typography variant="caption" color="text.secondary">Unwiderruflich</Typography>
                            </Box>
                            <Button variant="outlined" size="small" color="error" sx={{ borderRadius: 2, fontSize: 12 }} onClick={() => setDeleteAccountOpen(true)}>
                                Löschen
                            </Button>
                        </Stack>
                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>

                    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                        <SectionLabel>Persönliche Daten</SectionLabel>

                        {editField ? (
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {editField === "name" && "Name bearbeiten"}
                                    {editField === "email" && "E-Mail bearbeiten"}
                                    {editField === "phone" && "Telefon bearbeiten"}
                                    {editField === "address" && "Adresse bearbeiten"}
                                </Typography>
                                <Stack spacing={2} sx={{ maxWidth: 480 }}>
                                    {(editField === "name" || editField === "address") ? (
                                        <>
                                            <TextField label={editField === "name" ? "Vorname" : "Straße"} value={editValue} onChange={(e) => setEditValue(e.target.value)} size="small" fullWidth autoFocus />
                                            <TextField label={editField === "name" ? "Nachname" : "Ort"} value={editValue2} onChange={(e) => setEditValue2(e.target.value)} size="small" fullWidth />
                                        </>
                                    ) : (
                                        <TextField label={editField === "email" ? "E-Mail" : "Telefon"} value={editValue} onChange={(e) => setEditValue(e.target.value)} size="small" fullWidth autoFocus type={editField === "email" ? "email" : "tel"} />
                                    )}
                                </Stack>
                                {error && <Alert severity="error" sx={{ mt: 2, maxWidth: 480 }} onClose={() => setError(null)}>{error}</Alert>}
                                <Stack direction="row" spacing={1} sx={{ mt: 2.5 }}>
                                    <Button variant="contained" size="small" onClick={saveEdit} disabled={saving} sx={{ borderRadius: 2 }}>
                                        {saving ? <CircularProgress size={16} color="inherit" /> : "Speichern"}
                                    </Button>
                                    <Button variant="text" size="small" onClick={cancelEdit} disabled={saving} sx={{ borderRadius: 2 }}>Abbrechen</Button>
                                </Stack>
                            </Box>
                        ) : (
                            <Box>
                                <InfoRow icon={<PersonOutlined fontSize="small" />} label="Name" value={fullName || null} onEdit={() => openEdit("name")} />
                                <InfoRow icon={<EmailOutlined fontSize="small" />} label="E-Mail" value={customer?.email} onEdit={() => openEdit("email")} />
                                <InfoRow icon={<PhoneOutlined fontSize="small" />} label="Telefon" value={customer?.phone} onEdit={() => openEdit("phone")} />
                                <InfoRow
                                    icon={<HomeOutlined fontSize="small" />}
                                    label="Adresse"
                                    value={customer?.street ? `${customer.street}${customer.city ? `, ${customer.city}` : ""}` : null}
                                    onEdit={() => openEdit("address")}
                                />
                            </Box>
                        )}
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                        <SectionLabel>Meine Fahrzeuge</SectionLabel>

                        {vehicleLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            <Stack spacing={1.5} sx={{ mb: 2 }}>
                                {vehicles.length === 0 && (
                                    <Typography variant="body2" color="text.disabled" sx={{ py: 1 }}>
                                        Noch keine Fahrzeuge eingetragen.
                                    </Typography>
                                )}
                                {vehicles.map((v) => (
                                    <Stack
                                        key={v.id}
                                        direction="row"
                                        alignItems="center"
                                        sx={{
                                            px: 2, py: 1.5, borderRadius: 2,
                                            border: "1px solid", borderColor: "divider",
                                            bgcolor: "background.default",
                                            "&:hover": { borderColor: "primary.light", bgcolor: "action.hover" },
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", mr: 2, flexShrink: 0 }}>
                                            <DirectionsCarOutlined sx={{ color: "white", fontSize: 20 }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight={600}>{v.brand} {v.model}</Typography>
                                            <Stack direction="row" spacing={0.75} sx={{ mt: 0.25, flexWrap: "wrap" }}>
                                                {v.licensePlate && <Chip label={v.licensePlate} size="small" sx={{ fontSize: 10, height: 18 }} />}
                                                {v.buildYear && <Chip label={v.buildYear} size="small" variant="outlined" sx={{ fontSize: 10, height: 18 }} />}
                                            </Stack>
                                        </Box>
                                        <IconButton size="small" onClick={() => openVehicleDialog(v)} sx={{ color: "text.secondary", "&:hover": { color: "primary.main" }, mr: 0.5 }}>
                                            <Edit sx={{ fontSize: 16 }} />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => setDeleteVehicleTarget(v)} sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}>
                                            <DeleteOutline sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Stack>
                                ))}
                            </Stack>
                        )}

                        <Button variant="outlined" size="small" startIcon={<AddOutlined />} onClick={() => openVehicleDialog()} sx={{ borderRadius: 2, borderStyle: "dashed" }}>
                            Fahrzeug hinzufügen
                        </Button>
                    </Paper>

                </Grid>
            </Grid>

            <Dialog open={vehicleDialog.open} onClose={() => setVehicleDialog({ open: false, editing: null })} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
                <DialogTitle fontWeight={700}>{vehicleDialog.editing ? "Fahrzeug bearbeiten" : "Fahrzeug hinzufügen"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 0.5 }}>
                        <TextField label="Marke" value={vehicleForm.brand} onChange={(e) => setVehicleForm((f) => ({ ...f, brand: e.target.value }))} size="small" fullWidth autoFocus required />
                        <TextField label="Modell" value={vehicleForm.model} onChange={(e) => setVehicleForm((f) => ({ ...f, model: e.target.value }))} size="small" fullWidth required />
                        <TextField label="Baujahr" value={vehicleForm.buildYear} onChange={(e) => setVehicleForm((f) => ({ ...f, buildYear: e.target.value }))} size="small" fullWidth type="number" slotProps={{ htmlInput: { min: 1900, max: new Date().getFullYear() } }} />
                        <TextField
                            label="Kennzeichen"
                            value={vehicleForm.licensePlate}
                            onChange={(e) => setVehicleForm((f) => ({ ...f, licensePlate: e.target.value }))}
                            size="small"
                            fullWidth
                            placeholder="z.B. W-12345AB"
                            error={vehicleForm.licensePlate.trim() !== "" && !isValidAustrianPlate(vehicleForm.licensePlate)}
                            helperText={vehicleForm.licensePlate.trim() !== "" && !isValidAustrianPlate(vehicleForm.licensePlate) ? "Ungültiges österreichisches Kennzeichen (z.B. W-12345AB)" : ""}
                        />
                    </Stack>
                    {error && <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>{error}</Alert>}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setVehicleDialog({ open: false, editing: null })} disabled={vehicleSaving}>Abbrechen</Button>
                    <Button variant="contained" onClick={saveVehicle} disabled={vehicleSaving || !vehicleForm.brand.trim() || !vehicleForm.model.trim() || !isValidAustrianPlate(vehicleForm.licensePlate)} sx={{ borderRadius: 2 }}>
                        {vehicleSaving ? <CircularProgress size={16} color="inherit" /> : "Speichern"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!deleteVehicleTarget} onClose={() => setDeleteVehicleTarget(null)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
                <DialogTitle fontWeight={700}>Fahrzeug löschen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Soll <strong>{deleteVehicleTarget?.brand} {deleteVehicleTarget?.model}</strong> wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setDeleteVehicleTarget(null)}>Abbrechen</Button>
                    <Button variant="contained" color="error" onClick={confirmDeleteVehicle} sx={{ borderRadius: 2 }}>Löschen</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
                <DialogTitle fontWeight={700}>Konto löschen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Dein Konto und alle zugehörigen Daten werden <strong>unwiderruflich</strong> gelöscht. Bist du sicher?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setDeleteAccountOpen(false)}>Abbrechen</Button>
                    <Button variant="contained" color="error" onClick={confirmDeleteAccount} sx={{ borderRadius: 2 }}>Konto löschen</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>
            </Snackbar>

        </Container>
    );
}
