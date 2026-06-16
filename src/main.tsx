import { StrictMode, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

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
import ImpressumPage from "./pages/ImpressumPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import DashboardPage from "./pages/admin/DashboardPage";
import AppointmentsPage from "./pages/admin/AppointmentsPage";
import AdminOffersPage from "./pages/admin/AdminOffersPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import CustomersPage from "./pages/admin/CustomersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import { TermsPage } from "./pages/TermsPage";
import MyAccountPage from "./pages/MyAccountPage";


function RequireAdmin({ children }: { children: ReactElement }) {
  const token = localStorage.getItem("token");
  const raw = localStorage.getItem("loggedInKunde");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const k = raw ? JSON.parse(raw) : null;
    if (!k || k.role !== "ADMIN") return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollToTop />
        <Outlet />
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
          { path: "/passwort-vergessen", element: <ForgotPasswordPage /> },
        ],
      },
      {
        element: <AccountLayout />,
        children: [
          { path: "/my-account", element: <MyAccountPage /> },
        ],
      },
      {
        element: (
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        ),
        children: [
          { path: "/admin", element: <DashboardPage /> },
          { path: "/admin/termine", element: <AppointmentsPage /> },
          { path: "/admin/angebote", element: <AdminOffersPage /> },
          { path: "/admin/leistungen", element: <AdminServicesPage /> },
          { path: "/admin/kunden", element: <CustomersPage /> },
          { path: "/admin/einstellungen", element: <SettingsPage /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <RouterProvider router={router} />
        </LocalizationProvider>
      </ThemeProvider>
    </StrictMode>
);
