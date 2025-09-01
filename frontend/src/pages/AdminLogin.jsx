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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-gray-200 bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-[#f7e833] text-black p-8">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-black" />
              </div>
              <span>Admin Portal</span>
            </CardTitle>
            <p className="text-center text-black mt-2">
              Access administrative controls
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Admin Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter admin email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border border-gray-300 bg-white text-gray-900 focus:border-[#f7e833] focus:ring-1 focus:ring-[#f7e833] transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12 border border-gray-300 bg-white text-gray-900 focus:border-[#f7e833] focus:ring-1 focus:ring-[#f7e833] transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#f7e833] hover:bg-[#f7e833]/80 text-black font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In as Admin"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Back to User Login Link - Bottom Right */}
      <div className="absolute bottom-4 right-4">
        <a
          href="/login"
          className="text-xs text-gray-600 hover:text-black transition-colors duration-200"
        >
          Client Login
        </a>
      </div>
    </div>
  );
};

export default AdminLogin; 