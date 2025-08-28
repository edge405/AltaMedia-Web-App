import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Moon, Sun, UserPlus } from "lucide-react";
import { toast } from "sonner";
import AltamediaLogo from "../components/AltamediaLogo.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import authService from "../utils/authService.js";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    phone_number: "",
    address: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (showRegisterForm) {
        // Registration
        const result = await register({
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          phone_number: formData.phone_number,
          address: formData.address
        });

        if (result.success) {
          toast.success("Account created successfully! Please log in with your new credentials.");
          setShowRegisterForm(false);
          setFormData({
            email: formData.email,
            password: "",
            fullname: "",
            phone_number: "",
            address: ""
          });
        }
      } else {
        // Login
        const result = await login(formData.email, formData.password);

        if (result.success) {
          // Redirect based on user role
          const currentUser = authService.getCurrentUser();
          console.log('Login successful - User:', currentUser);

          if (currentUser && currentUser.role === 'admin') {
            console.log('Admin user logged in - redirecting to admin dashboard');
            navigate("/admin/dashboard");
          } else {
            console.log('Regular user logged in - redirecting to client portal');
            navigate("/client-portal");
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const toggleFormMode = () => {
    setShowRegisterForm(!showRegisterForm);
    setFormData({
      email: "",
      password: "",
      fullname: "",
      phone_number: "",
      address: ""
    });
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <style>
        {`
          .login-card {
            background: ${isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
            backdrop-filter: blur(20px);
            border: 1px solid ${isDarkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .input-field {
            background: ${isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.3)'};
            border: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)'};
            border-radius: 8px;
            padding: 12px 16px 12px 48px;
            color: ${isDarkMode ? '#d1d5db' : '#374151'};
            font-size: 14px;
            width: 100%;
            transition: all 0.2s ease;
          }

          .input-field:focus {
            outline: none;
            background: ${isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)'};
            border-color: ${isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(156, 163, 175, 0.5)'};
          }

          .input-field::placeholder {
            color: ${isDarkMode ? '#9ca3af' : '#9ca3af'};
          }

          .login-button {
            background: #f59e0b;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
          }

          .login-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
          }

          .login-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .demo-button {
            background: ${isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.3)'};
            color: ${isDarkMode ? '#d1d5db' : '#374151'};
            border: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)'};
            border-radius: 8px;
            padding: 12px 24px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
          }

          .demo-button:hover {
            background: ${isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)'};
            transform: translateY(-1px);
          }

          .dark-mode-toggle {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.3)'};
            border: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)'};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: ${isDarkMode ? '#d1d5db' : '#374151'};
          }

          .dark-mode-toggle:hover {
            background: ${isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)'};
            transform: scale(1.05);
          }

          .dark-mode-icon {
            transition: transform 0.3s ease, opacity 0.3s ease;
          }

          .dark-mode-icon.rotate {
            transform: rotate(180deg);
          }

          .dark-mode-icon:hover {
            transform: scale(1.1);
          }

          .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3b82f6;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
          }

          .dark .spinner {
            border: 2px solid #374151;
            border-top: 2px solid #3b82f6;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          .animate-pulse-slow {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}
      </style>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="dark-mode-toggle"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <div className={`dark-mode-icon ${isDarkMode ? 'rotate' : ''}`}>
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </div>
      </button>

      <Card className="login-card rounded-2xl shadow-xl w-full max-w-md mx-4 p-4 sm:p-6">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <AltamediaLogo size="large" className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
          </div>
          <CardTitle className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {showRegisterForm ? 'Create Account' : 'Welcome to Altamedia'}
          </CardTitle>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            {showRegisterForm ? 'Create your account to get started' : 'Sign in to your account to continue'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {showRegisterForm && (
              <div className="space-y-2">
                <Label htmlFor="fullname" className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Full Name
                </Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Enter your full name"
                    className="input-field"
                    value={formData.fullname}
                    onChange={(e) => handleInputChange('fullname', e.target.value)}
                    required={showRegisterForm}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            {showRegisterForm && (
              <div className="space-y-2">
                <Label htmlFor="phone_number" className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Phone Number
                </Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="input-field"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    required={showRegisterForm}
                  />
                </div>
              </div>
            )}

            {showRegisterForm && (
              <div className="space-y-2">
                <Label htmlFor="address" className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Address
                </Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter your address"
                    className="input-field"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required={showRegisterForm}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    {showRegisterForm ? 'Creating account...' : 'Signing in...'}
                  </div>
                ) : (
                  showRegisterForm ? "Create Account" : "Sign In"
                )}
              </button>

              <button
                type="button"
                onClick={toggleFormMode}
                className="demo-button"
              >
                {showRegisterForm ? "Already have an account? Sign In" : "Don't have an account? Register"}
              </button>
            </div>
          </form>


        </CardContent>
      </Card>

      {/* Admin Login Link */}
      <div className="absolute bottom-4 right-4">
        <a
          href="/admin/login"
          className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors duration-200`}
        >
          Admin Login
        </a>
      </div>
    </div>
  );
} 