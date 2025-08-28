import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Forms from "./Forms.jsx";
import KnowingYouFormPage from "./KnowingYouFormPage.jsx";
import BrandKitFormPage from "./BrandKitFormPage.jsx";
import BrandKitQuestionnairePage from "./BrandKitQuestionnairePage.jsx";
import ClientPortal from "./ClientPortal.jsx";
import AdminPortal from "./AdminPortal.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminProtectedRoute from "../components/AdminProtectedRoute.jsx";
import ClientProtectedRoute from "../components/ClientProtectedRoute.jsx";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Login: Login,
    Dashboard: Dashboard,
    Profile: Profile,
    Forms: Forms,
    KnowYourForm: KnowingYouFormPage,
    BrandKitForm: BrandKitFormPage,
    BrandKitQuestionnaire: BrandKitQuestionnairePage,
    ClientPortal: ClientPortal,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected routes */}
            <Route path="/" element={
                <ClientProtectedRoute>
                    <ClientPortal />
                </ClientProtectedRoute>
            } />

            <Route path="/client-portal" element={
                <ClientProtectedRoute>
                    <ClientPortal />
                </ClientProtectedRoute>
            } />

            <Route path="/admin-portal" element={
                <AdminProtectedRoute>
                    <AdminPortal />
                </AdminProtectedRoute>
            } />

            {/* Additional protected routes for future use */}
            <Route path="/dashboard" element={
                <ClientProtectedRoute>
                    <Dashboard />
                </ClientProtectedRoute>
            } />

            <Route path="/profile" element={
                <ClientProtectedRoute>
                    <Profile />
                </ClientProtectedRoute>
            } />

            <Route path="/forms" element={
                <ClientProtectedRoute>
                    <Forms />
                </ClientProtectedRoute>
            } />

            <Route path="/know-your-form" element={
                <ClientProtectedRoute>
                    <KnowingYouFormPage />
                </ClientProtectedRoute>
            } />

            <Route path="/brandkit-form" element={
                <ClientProtectedRoute>
                    <BrandKitFormPage />
                </ClientProtectedRoute>
            } />

            <Route path="/brandkit-questionnaire" element={
                <ClientProtectedRoute>
                    <BrandKitQuestionnairePage />
                </ClientProtectedRoute>
            } />

            {/* Catch-all route - redirect to login */}
            <Route path="*" element={<Login />} />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}