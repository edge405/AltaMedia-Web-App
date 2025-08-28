import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ClientProtectedRoute({ children }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center space-y-4">
                    <div className="spinner"></div>
                    <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        toast.error("Please log in to access this page");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Debug logging
    console.log('ClientProtectedRoute - User:', user);
    console.log('ClientProtectedRoute - User role:', user?.role);

    // Check if user has the correct role (user, not admin)
    if (user && user.role === 'admin') {
        console.log('Admin user attempting to access client portal - redirecting to admin dashboard');
        toast.error("Admin users cannot access the client portal");
        return <Navigate to="/admin-portal" replace />;
    }

    // Check if user role is 'user' or undefined/null (default to user)
    if (user && user.role && user.role !== 'user') {
        console.log('Invalid role user attempting to access client portal - redirecting to dashboard');
        toast.error("Access denied. This portal is for regular users only.");
        return <Navigate to="/client-dashboard" replace />;
    }

    // Render children if authenticated and has correct role
    return children;
}
