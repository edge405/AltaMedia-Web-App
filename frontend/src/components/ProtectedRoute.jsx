import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const loginStatus = localStorage.getItem("isLoggedIn");
    setIsAuthenticated(loginStatus === "true");
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
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

  // Render children if authenticated
  return children;
} 