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
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

import PublicLayout from "./view/PublicLayout";
import { AuthLayout } from "./view/AuthLayout";
import AdminLayout from "./view/AdminLayout";

// Public Pages
import HomePage from "./pages/HomePage";
import LeistungenPage from "./pages/LeistungenPage";
import AngebotePage from "./pages/AngebotePage";
import KontaktPage from "./pages/ContactPage";
import UeberUnsPage from "./pages/UeberUnsPage";
import TerminPage from "./pages/TerminPage";
import ImpressumPage from "./pages/ImpressumPage";
import DatenschutzPage from "./pages/DatenschutzPage";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Admin Pages
import DashboardPage from "./pages/admin/DashboardPage";
import TerminePage from "./pages/admin/TerminePage";
import AdminAngebotePage from "./pages/admin/AdminAngebotePage";
import AdminLeistungenPage from "./pages/admin/AdminLeistungenPage";
import KundenPage from "./pages/admin/KundenPage";
import EinstellungenPage from "./pages/admin/EinstellungenPage";
import {AGBPage} from "./pages/AGBPage.tsx";

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
          { path: "/leistungen", element: <LeistungenPage /> },
          { path: "/angebote", element: <AngebotePage /> },
          { path: "/kontakt", element: <KontaktPage /> },
          { path: "/ueber-uns", element: <UeberUnsPage /> },
          { path: "/termin", element: <TerminPage /> },
        ],
      },
      { path: "/impressum", element: <ImpressumPage /> },
      { path: "/datenschutz", element: <DatenschutzPage /> },
      { path: "/agbs", element: <AGBPage /> },

      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/registrieren", element: <RegisterPage /> },
          { path: "/passwort-vergessen", element: <ForgotPasswordPage /> },
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
          { path: "/admin/termine", element: <TerminePage /> },
          { path: "/admin/angebote", element: <AdminAngebotePage /> },
          { path: "/admin/leistungen", element: <AdminLeistungenPage /> },
          { path: "/admin/kunden", element: <KundenPage /> },
          { path: "/admin/einstellungen", element: <EinstellungenPage /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
