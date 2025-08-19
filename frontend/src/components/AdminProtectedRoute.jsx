import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAdminAuth = () => {
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      const adminUser = localStorage.getItem("adminUser");

      if (isAdmin && adminUser) {
        try {
          const userData = JSON.parse(adminUser);
          // Check if login time is within 24 hours
          const loginTime = new Date(userData.loginTime);
          const now = new Date();
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

          // Also check if user has admin role
          if (hoursDiff < 24 && userData.role === 'admin') {
            setIsAuthenticated(true);
          } else {
            // Session expired or not admin
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("adminUser");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            navigate("/admin/login");
          }
        } catch (error) {
          // Invalid user data
          localStorage.removeItem("isAdmin");
          localStorage.removeItem("adminUser");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/admin/login");
        }
      } else {
        navigate("/admin/login");
      }
      setIsLoading(false);
    };

    checkAdminAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default AdminProtectedRoute; 