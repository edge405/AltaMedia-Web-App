import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
    Save,
    Building,
    Phone,
    Mail,
    MapPin,
    Crown,
    Settings,
    Briefcase,
    User,
    Shield,
    CreditCard,
    Bell,
    Key,
    Globe,
    Calendar,
    Activity,
    TrendingUp,
    Users,
    FileText,
    Download,
    Upload,
    Edit,
    Trash2,
    Plus,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Lock,
    Eye,
    EyeOff,
    Camera,
    Star,
    Zap,
    Sparkles
} from "lucide-react";

export default function Profile({ isDarkMode = false }) {
    const navigate = useNavigate();
    const { user: authUser, updateProfile, changePassword } = useAuth();
    const [client, setClient] = useState(null);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        fullname: "",
        phone_number: "",
        address: "",
        company_name: "",
        industry: "",
        current_plan: "starter",
        website: "",
        description: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Use authenticated user data
            if (authUser) {
                setUser(authUser);
                setFormData({
                    fullname: authUser.fullname || "",
                    phone_number: authUser.phone_number || "",
                    address: authUser.address || "",
                    company_name: "Demo Company", // Mock company data
                    industry: "Technology",
                    current_plan: "professional",
                    website: "https://democompany.com",
                    description: "Leading technology solutions provider"
                });
            }
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load profile data. Please try again.");
        }
        setIsLoading(false);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateProfile({
                fullname: formData.fullname,
                phone_number: formData.phone_number,
                address: formData.address
            });

            if (result.success) {
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            console.error("Error saving profile data:", error);
            toast.error("Failed to save profile data. Please try again.");
        }
        setIsSaving(false);
    };

    const handleUpgradePlan = () => {
        // In a real app, this would redirect to billing/upgrade page
        navigate("/billing");
    };

    const handleDeleteAccount = () => {
        // Account deletion disabled in demo mode
    };

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    };

    const handleChangePassword = async () => {
        // Validate current password
        if (!passwordData.currentPassword) {
            toast.error("Current password is required");
            return;
        }

        // Validate new password
        if (!passwordData.newPassword) {
            toast.error("New password is required");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        // Validate password confirmation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        // Check if new password is different from current
        if (passwordData.currentPassword === passwordData.newPassword) {
            toast.error("New password must be different from current password");
            return;
        }

        try {
            const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

            if (result.success) {
                // Clear form data
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });

                // Close modal
                document.getElementById('password-modal').close();

                // Show success message
                toast.success("Password changed successfully!");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            // Error message is already handled by the changePassword function
        }
    };

    const handleToggleTwoFactor = () => {
        setTwoFactorEnabled(!twoFactorEnabled);
    };

    const handleDownloadInvoices = () => {
        // Download invoices functionality
    };

    const handleViewLoginHistory = () => {
        // View login history functionality
    };

    const handleAvatarUpload = () => {
        // Avatar upload functionality
    };

    const planDetails = {
        starter: {
            name: "Starter Plan",
            color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
            features: ["Basic features", "Email support", "5GB storage"],
            price: "₱2,999"
        },
        professional: {
            name: "Professional Plan",
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            features: ["Advanced features", "Priority support", "50GB storage", "Analytics"],
            price: "₱10,999"
        },
        enterprise: {
            name: "Enterprise Plan",
            color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            features: ["All features", "24/7 support", "Unlimited storage", "Custom integrations"],
            price: "₱29,999"
        }
    };

    const industries = [
        "Technology", "Healthcare", "Finance", "Education", "Retail",
        "Manufacturing", "Real Estate", "Food & Beverage", "Entertainment",
        "Non-profit", "Consulting", "Other"
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-3 p-2 sm:p-4 animate-fade-in">
            {/* Back to Dashboard Button */}
            <div className="flex items-center justify-between">
                <Button
                    onClick={handleBackToDashboard}
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span>Back to Dashboard</span>
                </Button>
            </div>

            <div className="text-center animate-slide-up">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Profile Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xs">Manage your account and company information</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2 animate-slide-up-delay">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <TabsTrigger
                        value="profile"
                        className="flex items-center space-x-1 lg:space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200 text-xs lg:text-sm"
                    >
                        <User className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="company"
                        className="flex items-center space-x-1 lg:space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200 text-xs lg:text-sm"
                    >
                        <Building className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden sm:inline">Company</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="billing"
                        className="flex items-center space-x-1 lg:space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200 text-xs lg:text-sm"
                    >
                        <CreditCard className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden sm:inline">Billing</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="flex items-center space-x-1 lg:space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200 text-xs lg:text-sm"
                    >
                        <Shield className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-2 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Profile Overview */}
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                    <Settings className="w-5 h-5" />
                                    <span>Account Overview</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="relative group">
                                        <Avatar className="w-24 h-24 group-hover:scale-105 transition-transform duration-200">
                                            <AvatarImage src="" />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl font-semibold">
                                                {formData.company_name?.charAt(0) || user?.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                                            onClick={handleAvatarUpload}
                                        >
                                            <Camera className="w-3 h-3" />
                                        </Button>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                                            {formData.fullname || "Your Name"}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                        <Badge className={`mt-3 ${planDetails[formData.current_plan].color} border-0 hover:scale-105 transition-transform duration-200`}>
                                            <Crown className="w-3 h-3 mr-1" />
                                            {planDetails[formData.current_plan].name}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center space-x-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
                                        <Building className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-300">{formData.industry || "Industry not set"}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-300">{formData.phone_number || "Phone not set"}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-300">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-300">{formData.address || "Address not set"}</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <Button
                                        variant="outline"
                                        className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800 transition-all duration-200"
                                        onClick={handleDeleteAccount}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Profile Form */}
                        <div className="lg:col-span-2 space-y-2">
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                        <User className="w-5 h-5" />
                                        <span>Personal Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullname" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                                            <Input
                                                id="fullname"
                                                value={formData.fullname}
                                                onChange={(e) => handleInputChange("fullname", e.target.value)}
                                                placeholder="Your full name"
                                                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                                            <Input
                                                id="email"
                                                value={user?.email}
                                                disabled
                                                className="bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone_number" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                                            <Input
                                                id="phone_number"
                                                value={formData.phone_number}
                                                onChange={(e) => handleInputChange("phone_number", e.target.value)}
                                                placeholder="+1 (555) 123-4567"
                                                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">Address</Label>
                                            <Input
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange("address", e.target.value)}
                                                placeholder="Your address"
                                                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Bio</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-3">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all duration-200 disabled:transform-none"
                                        >
                                            {isSaving ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Saving...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="company" className="space-y-3 animate-fade-in">
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <Briefcase className="w-5 h-5" />
                                <span>Company Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name" className="text-gray-700 dark:text-gray-300">Company Name</Label>
                                    <Input
                                        id="company_name"
                                        value={formData.company_name}
                                        onChange={(e) => handleInputChange("company_name", e.target.value)}
                                        placeholder="Your Company Name"
                                        className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="industry" className="text-gray-700 dark:text-gray-300">Industry</Label>
                                    <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500">
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {industries.map((industry) => (
                                                <SelectItem key={industry} value={industry}>
                                                    {industry}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website" className="text-gray-700 dark:text-gray-300">Website</Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange("website", e.target.value)}
                                        placeholder="https://yourcompany.com"
                                        className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_description" className="text-gray-700 dark:text-gray-300">Company Description</Label>
                                    <Input
                                        id="company_description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        placeholder="Brief description of your company"
                                        className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-3">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all duration-200 disabled:transform-none"
                                >
                                    {isSaving ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing" className="space-y-3 animate-fade-in">
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <CreditCard className="w-5 h-5" />
                                <span>Billing & Subscription</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        Coming Soon
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                        We're working on bringing you a comprehensive billing and subscription management system.
                                        Stay tuned for updates!
                                    </p>
                                </div>
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Billing features will be available soon</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-3 animate-fade-in">
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                <Shield className="w-5 h-5" />
                                <span>Security Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <div>
                                        <h3 className="font-medium text-gray-800 dark:text-gray-100">Two-Factor Authentication</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                                    </div>
                                    <Button
                                        variant={twoFactorEnabled ? "default" : "outline"}
                                        onClick={handleToggleTwoFactor}
                                        className={twoFactorEnabled ? "bg-green-600 hover:bg-green-700" : ""}
                                    >
                                        {twoFactorEnabled ? "Enabled" : "Enable"}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <div>
                                        <h3 className="font-medium text-gray-800 dark:text-gray-100">Change Password</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
                                    </div>
                                    <Button variant="outline" onClick={() => document.getElementById('password-modal').showModal()}>
                                        Change
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <div>
                                        <h3 className="font-medium text-gray-800 dark:text-gray-100">Login History</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">View recent login activity</p>
                                    </div>
                                    <Button variant="outline" onClick={handleViewLoginHistory}>
                                        View
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Password Change Modal */}
            <dialog id="password-modal" className="modal backdrop-blur-sm">
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Change Password</h3>
                            <button
                                onClick={() => document.getElementById('password-modal').close()}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="current-password" className="text-gray-700 dark:text-gray-300 font-medium">
                                    Current Password
                                </Label>
                                <div className="relative mt-1">
                                    <Input
                                        id="current-password"
                                        type={showPassword ? "text" : "password"}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        placeholder="Enter your current password"
                                        className="pr-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="new-password" className="text-gray-700 dark:text-gray-300 font-medium">
                                    New Password
                                </Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="Enter your new password"
                                    className="mt-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Password must be at least 6 characters long
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300 font-medium">
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Confirm your new password"
                                    className="mt-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setPasswordData({
                                        currentPassword: "",
                                        newPassword: "",
                                        confirmPassword: ""
                                    });
                                    document.getElementById('password-modal').close();
                                }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleChangePassword}
                                className="bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all duration-200"
                            >
                                <Key className="w-4 h-4 mr-2" />
                                Change Password
                            </Button>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );
}