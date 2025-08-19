import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import apiService from "../utils/api.js";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use API to login
      const response = await apiService.login(formData.email, formData.password);

      if (response.success && response.data.user) {
        const user = response.data.user;

        // Check if user has admin role
        if (user.role === 'admin') {
          // Store admin session
          localStorage.setItem("isAdmin", "true");
          localStorage.setItem("adminUser", JSON.stringify({
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
            loginTime: new Date().toISOString()
          }));

          // Also store the regular auth token for API calls
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("user", JSON.stringify(user));

          toast.success("Admin login successful!");
          navigate("/admin-portal");
        } else {
          toast.error("Access denied. Admin privileges required.");
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error('Login error:', error);

      // Handle specific error messages
      if (error.message && error.message.includes('Invalid email or password')) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.message && error.message.includes('Access denied')) {
        toast.error("Access denied. Admin privileges required.");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800 relative overflow-hidden ring-1 ring-[#FFF251]/20 animate-in fade-in duration-500">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFF251]/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFF251]/5 rounded-full translate-y-12 -translate-x-12"></div>
          <CardHeader className="bg-[#FFF251] text-black rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Lock className="w-6 h-6" />
              Admin Panel
            </CardTitle>
            <p className="text-center text-gray-700 mt-2 font-medium">
              Access administrative controls
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter admin email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 border-2 border-gray-200 focus:border-[#FFF251] focus:ring-2 focus:ring-[#FFF251]/20 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    className="pl-10 pr-10 border-2 border-gray-200 focus:border-[#FFF251] focus:ring-2 focus:ring-[#FFF251]/20 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                className="w-full bg-[#FFF251] hover:bg-yellow-400 text-black shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
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
                className="text-sm border-[#FFF251] text-[#FFF251] hover:bg-[#FFF251] hover:text-black transition-all duration-200"
              >
                ← Back to User Login
              </Button>
            </div>


          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin; 