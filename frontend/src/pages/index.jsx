import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ClientPortal from "./ClientPortal.jsx";
import AdminPortal from "./AdminPortal.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminProtectedRoute from "../components/AdminProtectedRoute.jsx";
import ClientProtectedRoute from "../components/ClientProtectedRoute.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {

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