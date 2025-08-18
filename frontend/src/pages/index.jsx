import Layout from "./Layout.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Forms from "./Forms.jsx";
import KnowingYouFormPage from "./KnowingYouFormPage.jsx";
import BrandKitFormPage from "./BrandKitFormPage.jsx";
import ClientPortal from "./ClientPortal.jsx";
import AdminPortal from "./AdminPortal.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminTest from "./AdminTest.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminProtectedRoute from "../components/AdminProtectedRoute.jsx";
import FormCompletionCheck from "../components/FormCompletionCheck.jsx";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Login: Login,
    Dashboard: Dashboard,
    Profile: Profile,
    Forms: Forms,
    KnowYourForm: KnowingYouFormPage,
    BrandKitForm: BrandKitFormPage,
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
            <Route path="/admin/test" element={<AdminTest />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={
                // <AdminProtectedRoute>
                <AdminDashboard />
                // </AdminProtectedRoute>
            } />
            <Route path="/admin-portal" element={
                // <AdminProtectedRoute>
                <AdminPortal />
                // </AdminProtectedRoute>
            } />

            {/* Protected routes with layout */}
            <Route path="/" element={
                <Layout currentPageName={currentPage}>
                    <ProtectedRoute>
                        <FormCompletionCheck>
                            <Dashboard />
                        </FormCompletionCheck>
                    </ProtectedRoute>
                </Layout>
            } />

            <Route path="/dashboard" element={
                <Layout currentPageName={currentPage}>
                    <ProtectedRoute>
                        {/* <FormCompletionCheck> */}
                        <Dashboard />
                        {/* </FormCompletionCheck> */}
                    </ProtectedRoute>
                </Layout>
            } />

            <Route path="/profile" element={
                <Layout currentPageName={currentPage}>
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                </Layout>
            } />

            <Route path="/forms" element={
                <Layout currentPageName={currentPage}>
                    <ProtectedRoute>
                        <Forms />
                    </ProtectedRoute>
                </Layout>
            } />

            <Route path="/know-your-form" element={
                <Layout currentPageName={currentPage}>
                    <ProtectedRoute>
                        <KnowingYouFormPage />
                    </ProtectedRoute>
                </Layout>
            } />

            <Route path="/brandkit-form" element={
                <Layout currentPageName={currentPage}>
                    <ProtectedRoute>
                        <BrandKitFormPage />
                    </ProtectedRoute>
                </Layout>
            } />

            <Route path="/client-portal" element={
                <ProtectedRoute>
                    <ClientPortal />
                </ProtectedRoute>
            } />
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