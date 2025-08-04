import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Admin credentials check
      if (formData.username === "admin" && formData.password === "admin123") {
        // Store admin session
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminUser", JSON.stringify({
          username: formData.username,
          role: "admin",
          loginTime: new Date().toISOString()
        }));

        toast.success("Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="bg-blue-600 dark:bg-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Lock className="w-6 h-6" />
              Admin Panel
            </CardTitle>
            <p className="text-center text-blue-100 dark:text-blue-200 mt-2">
              Access administrative controls
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter admin username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In as Admin"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/login")}
                className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                ← Back to User Login
              </Button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Demo Credentials</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Username: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">admin</code><br />
                Password: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">admin123</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin; 