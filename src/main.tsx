import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
} from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { GlobalThemeProvider } from "../src/state/GlobalThemeContext.tsx";
import { CookieConsentProvider } from "./state/CookieConsentContext.tsx";
import CookieConsentBanner from "./components/CookieConsentBanner.tsx";
import SessionExpiryWarning from "./components/SessionExpiryWarning.tsx";

import PublicLayout from "./view/PublicLayout";
import { AuthLayout } from "./view/AuthLayout";
import AdminLayout from "./view/AdminLayout";
import AccountLayout from "./view/AccountLayout";

import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import OffersPage from "./pages/OffersPage";
import KontaktPage from "./pages/ContactPage";
import AboutUsPage from "./pages/AboutUsPage";
import AppointmentPage from "./pages/AppointmentPage";
import ImpressumPage from "./pages/ImpressumPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage.tsx";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage.tsx";
import AdminCalendarPage from "./pages/admin/AdminCalendarPage.tsx";
import AdminOffersPage from "./pages/admin/AdminOffersPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage.tsx";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage.tsx";
import { TermsPage } from "./pages/TermsPage";
import MyAccountPage from "./pages/MyAccountPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";

import { RequireAdmin } from "./utils/RequireAdmin.tsx";
import { ScrollToTop } from "./utils/ScrollToTop.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx";

const router = createBrowserRouter([
    {
        element: (
            <>
                <ScrollToTop />
                <Outlet />
                <CookieConsentBanner />
                <SessionExpiryWarning />
            </>
        ),
        children: [
            {
                element: <PublicLayout />,
                children: [
                    { path: "/", element: <HomePage /> },
                    { path: "/leistungen", element: <ServicesPage /> },
                    { path: "/angebote", element: <OffersPage /> },
                    { path: "/kontakt", element: <KontaktPage /> },
                    { path: "/ueber-uns", element: <AboutUsPage /> },
                    { path: "/termin", element: <AppointmentPage /> },
                ],
            },
            { path: "/impressum", element: <ImpressumPage /> },
            { path: "/datenschutz", element: <PrivacyPolicyPage /> },
            { path: "/agbs", element: <TermsPage /> },

            {
                element: <AuthLayout />,
                children: [
                    { path: "/login", element: <LoginPage /> },
                    { path: "/registrieren", element: <RegisterPage /> },
                    { path: "/email-bestaetigen", element: <VerifyEmailPage /> },
                    { path: "/passwort-vergessen", element: <ForgotPasswordPage /> },
                    { path: "/passwort-zuruecksetzen", element: <ResetPasswordPage /> },
                ],
            },
            {
                element: <AccountLayout />,
                children: [
                    { path: "/my-account", element: <MyAccountPage /> },
                    { path: "/my-account/termine", element: <MyAppointmentsPage /> },
                ],
            },
            {
                element: (
                    <RequireAdmin>
                        <AdminLayout />
                    </RequireAdmin>
                ),
                children: [
                    { path: "/admin", element: <AdminDashboardPage /> },
                    { path: "/admin/termine", element: <AdminAppointmentsPage /> },
                    { path: "/admin/kalender", element: <AdminCalendarPage /> },
                    { path: "/admin/angebote", element: <AdminOffersPage /> },
                    { path: "/admin/leistungen", element: <AdminServicesPage /> },
                    { path: "/admin/kunden", element: <AdminCustomersPage /> },
                    { path: "/admin/einstellungen", element: <AdminSettingsPage /> },
                ],
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <CookieConsentProvider>
            <GlobalThemeProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <RouterProvider router={router} />
                </LocalizationProvider>
            </GlobalThemeProvider>
        </CookieConsentProvider>
    </StrictMode>
);
