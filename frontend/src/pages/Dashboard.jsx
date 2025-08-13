import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  ChevronDown,
  Plus,
  MapPin,
  Clock,
  Target,
  Send,
  FileText,
  Calendar,
  BarChart3,
  Package,
  CheckCircle,
  PhilippinePeso,
  Globe,
  Play,
  Zap,
  RotateCcw,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Star,
  ThumbsUp,
  Eye,
  FileEdit,
  Palette,
  AlertCircle,
  Loader2,
  Building2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import PackageDetails from "@/components/PackageDetails";
import CustomNotification from "@/components/CustomNotification";
import FeatureDetails from "@/components/FeatureDetails";
import Messages from "@/components/Messages";
import apiService from "@/utils/api";
import dashboardService from "@/services/dashboardService";

export default function Dashboard({ isDarkMode: parentIsDarkMode }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState("Current");
  const incomeCardRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("April 13, 2025");
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);

  // Use parent's dark mode state if provided, otherwise use local state
  const effectiveDarkMode = parentIsDarkMode !== undefined ? parentIsDarkMode : isDarkMode;
  const [isCorePackageCollapsed, setIsCorePackageCollapsed] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureComments, setFeatureComments] = useState({});
  const [newComment, setNewComment] = useState("");

  // Real data states
  const [dashboardData, setDashboardData] = useState(null);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [packageDetails, setPackageDetails] = useState(null);
  const [availableAddons, setAvailableAddons] = useState([]);
  const [projectFeatures, setProjectFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasActivePackage, setHasActivePackage] = useState(false);

  // Load selected company and fetch dashboard data on component mount
  useEffect(() => {
    const savedCompany = localStorage.getItem('selectedCompany');
    const savedCompanies = localStorage.getItem('userCompanies');

    if (savedCompanies) {
      const parsedCompanies = JSON.parse(savedCompanies);
      setAllCompanies(parsedCompanies);
    }

    if (savedCompany) {
      setSelectedCompany(JSON.parse(savedCompany));
    } else {
      // If no company selected, redirect to company selection
      navigate('/company-selection');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await dashboardService.getDashboardData();

      if (result.success) {
        setDashboardData(result.data);

        // Transform package data
        const packageData = dashboardService.transformPackagePurchaseData(result.data.packagePurchases);
        setCurrentPackage(packageData.currentPackage);
        setPackageDetails(packageData.packageDetails);
        setHasActivePackage(packageData.hasActivePackage);

        // Transform available addons
        const availableAddonsList = dashboardService.transformAvailableAddons(result.data.availableAddons);
        setAvailableAddons(availableAddonsList);

        // Generate project features
        const features = dashboardService.generateProjectFeatures(packageData.packageDetails, []);
        setProjectFeatures(features);

        toast.success("Dashboard data loaded successfully");
      } else {
        setError(result.error || 'Failed to load dashboard data');
        toast.error("Failed to load dashboard data");
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      toast.error("Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Package details are now handled by the dashboard service and stored in state

  const getIconComponent = (iconName) => {
    const iconMap = {
      "BarChart3": <BarChart3 className="w-4 h-4 text-white" />,
      "Globe": <Globe className="w-4 h-4 text-white" />,
      "FileText": <FileText className="w-4 h-4 text-white" />,
      "Calendar": <Calendar className="w-4 h-4 text-white" />,
      "Play": <Play className="w-4 h-4 text-white" />,
      "Zap": <Zap className="w-4 h-4 text-white" />,
      "Package": <Package className="w-4 h-4 text-white" />,
      "PhilippinePeso": <PhilippinePeso className="w-4 h-4 text-white" />
    };
    return iconMap[iconName] || <CheckCircle className="w-4 h-4 text-white" />;
  };

  const getFeatureIcon = (featureName) => {
    const iconMap = {
      "Dashboard": <BarChart3 className="w-4 h-4" />,
      "Website": <Globe className="w-4 h-4" />,
      "Content/Ad Management": <FileText className="w-4 h-4" />,
      "Content Calendar/Creation (30 days)": <Calendar className="w-4 h-4" />,
      "Demo": <Play className="w-4 h-4" />,
      "Pin4MS": <Zap className="w-4 h-4" />
    };
    return iconMap[featureName] || <CheckCircle className="w-4 h-4" />;
  };

  // Package features are now dynamically generated from real data via projectFeatures state

  // All package features are now dynamically generated from real data via projectFeatures state

  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const displayedFeatures = showAllFeatures ? projectFeatures : projectFeatures.slice(0, 4);

  const getStatusColor = (status) => {
    return dashboardService.getStatusColor(status);
  };



  const proposalStats = [
    { label: "Proposals sent", count: 64, color: "bg-gray-300" },
    { label: "Interviews", count: 14, color: "bg-red-500" },
    { label: "Hires", count: 10, color: "bg-gray-300" }
  ];

  const toggleProjectExpansion = (index) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedProjects(newExpanded);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);

    if (dashboardData?.packagePurchases?.package_purchases?.length > 0) {
      const purchases = dashboardData.packagePurchases.package_purchases;

      if (timeframe === "Current") {
        // Set current package as the most recent active purchase
        const activePurchases = purchases.filter(
          purchase => purchase.purchase_info?.status === 'active'
        );

        if (activePurchases.length > 0) {
          const mostRecent = activePurchases.sort((a, b) =>
            new Date(b.purchase_info.purchase_date) - new Date(a.purchase_info.purchase_date)
          )[0];
          setCurrentPackage(mostRecent);
          const transformedDetails = dashboardService.transformPackageDetails(mostRecent);
          setPackageDetails(transformedDetails);
        }
      } else if (timeframe === "Previous" && purchases.length > 1) {
        // Set previous package as the second most recent purchase
        const sortedPurchases = purchases.sort((a, b) =>
          new Date(b.purchase_info.purchase_date) - new Date(a.purchase_info.purchase_date)
        );

        if (sortedPurchases.length > 1) {
          const previousPackage = sortedPurchases[1];
          setCurrentPackage(previousPackage);
          const transformedDetails = dashboardService.transformPackageDetails(previousPackage);
          setPackageDetails(transformedDetails);
        }
      }
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDateDropdown(false);
  };

  const handleSeeAllProjects = () => {
    toast.info('Viewing all projects...');
  };

  const handleProjectCardClick = (project) => {
    toast.info(`Opening ${project.title}...`);
  };

  const handleProposalStatClick = (stat) => {
    toast.info(`Viewing ${stat.label} details...`);
  };

  const handleContactSupport = () => {
    toast.info("For billing inquiries, please contact us at +63 917 123 4567 or email support@altamedia.com");
    // Could also open Messages component
    setShowMessages(true);
    setChatType('human');
  };

  const handleViewDetails = () => {
    setShowPackageDetails(true);
    toast.info("Opening package details and invoice history...");
  };

  // Mock invoice data for demonstration
  const invoiceHistory = [
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      amount: "P10,999",
      status: "Paid",
      description: "Core Package - January 2024"
    },
    {
      id: "INV-2024-002",
      date: "2024-02-15",
      amount: "P10,999",
      status: "Paid",
      description: "Core Package - February 2024"
    },
    {
      id: "INV-2024-003",
      date: "2024-03-15",
      amount: "P10,999",
      status: "Pending",
      description: "Core Package - March 2024"
    }
  ];

  const billingInfo = {
    nextInvoice: "2024-04-15",
    amount: "P10,999",
    paymentMethod: "Credit Card ending in 1234",
    autoRenew: true,
    packageName: "Core Package",
    billingCycle: "Monthly"
  };

  const handleSeeAllFeatures = () => {
    setShowAllFeatures(!showAllFeatures);
  };

  const handleFeatureCardClick = async (feature) => {
    setSelectedFeature(feature);
    setIsCorePackageCollapsed(true);
    toast.info(`Opening ${feature.title} details...`);

    // Load comments for this feature
    await loadFeatureComments(feature.id);
  };

  const loadFeatureComments = async (featureId) => {
    if (!user?.id) return;

    // Find the feature to get the real packageFeatureId
    const feature = projectFeatures.find(f => f.id === featureId);
    const packageFeatureId = feature?.packageFeatureId || feature?.id;

    if (!packageFeatureId) {
      console.log('No packageFeatureId found for feature:', featureId);
      return;
    }

    try {
      const response = await apiService.getCommentsByFeatureAndUser(packageFeatureId, user.id);

      if (response.success && response.data?.comments) {
        // Transform API response to match expected format
        const transformedComments = response.data.comments.map(comment => ({
          id: comment.id,
          user: comment.users?.fullname || comment.users?.email || 'Unknown User',
          comment: comment.comment_text,
          date: new Date(comment.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));

        setFeatureComments(prev => ({
          ...prev,
          [featureId]: transformedComments
        }));
      }
    } catch (error) {
      console.error('Error loading feature comments:', error);
      // Don't show error to user as this is not critical
    }
  };

  const handleBackToCorePackage = () => {
    setSelectedFeature(null);
    setIsCorePackageCollapsed(false);
  };

  const handleAddComment = async (featureId, commentText) => {
    if (!user?.id) {
      toast.error("Please log in to add comments");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (commentText.length > 500) {
      toast.error("Comment must be 500 characters or less");
      return;
    }

    // Find the feature to get the real packageFeatureId
    const feature = projectFeatures.find(f => f.id === featureId);
    const packageFeatureId = feature?.packageFeatureId || feature?.id;

    if (!packageFeatureId) {
      toast.error("Cannot add comment: Feature not found");
      return;
    }

    try {
      const response = await apiService.createFeatureComment(packageFeatureId, user.id, commentText);

      if (response.success) {
        toast.success("Comment added successfully!");

        // Update local comments state
        const newComment = {
          id: response.data.id,
          user: user.fullname || user.email,
          comment: commentText,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        setFeatureComments(prev => ({
          ...prev,
          [featureId]: [...(prev[featureId] || []), newComment]
        }));

        // Clear the comment input
        setNewComment("");
      } else {
        toast.error("Failed to add comment");
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  const toggleFeatureExpansion = (index) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedProjects(newExpanded);
  };

  // Addons are now dynamically loaded from backend via availableAddons state

  const [showAllAddons, setShowAllAddons] = useState(false);
  const [expandedAddons, setExpandedAddons] = useState(new Set());

  const toggleAddonExpansion = (addonId) => {
    const newExpanded = new Set(expandedAddons);
    if (newExpanded.has(addonId)) {
      newExpanded.delete(addonId);
    } else {
      newExpanded.add(addonId);
    }
    setExpandedAddons(newExpanded);
  };

  const handleAddToCart = (addon) => {
    const existingItem = cartItems.find(item => item.id === addon.id);
    if (existingItem) {
      toast.error(`${addon.title} is already in your cart!`);
      return;
    }

    const existingPurchase = purchasedAddons.find(purchased => purchased.title === addon.title);
    if (existingPurchase) {
      toast.error(`${addon.title} is already purchased!`);
      return;
    }

    setCartItems([...cartItems, addon]);
    toast.success(`${addon.title} added to cart!`);
    setShowCartModal(true);
  };

  const handleRemoveFromCart = (addonId) => {
    setCartItems(cartItems.filter(item => item.id !== addonId));
    toast.success("Item removed from cart");
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Purchase each addon in the cart
      const purchasePromises = cartItems.map(async (addon) => {
        const response = await apiService.createAddonPurchase(addon.id);
        if (!response.success) {
          throw new Error(`Failed to purchase ${addon.title}`);
        }
        return response;
      });

      await Promise.all(purchasePromises);

      // Refresh dashboard data to get updated purchases
      await fetchDashboardData();

      // Clear cart
      setCartItems([]);

      // Show success message
      toast.success("Payment successful! Addons have been added to your account.");

      // Close cart modal
      setShowCartModal(false);
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error(error.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllAddons = () => {
    setShowAllAddons(!showAllAddons);
  };

  const handleRefundAddon = (addonIndex) => {
    const addonToRefund = purchasedAddons[addonIndex];

    // Set the refund data and show custom notification
    setRefundAddonData({ addon: addonToRefund, index: addonIndex });
    setShowRefundNotification(true);
  };



  const [showMessages, setShowMessages] = useState(false);
  const [chatType, setChatType] = useState('human');

  const handleOpenMessages = (chatType = 'human') => {
    setChatType(chatType);
    setShowMessages(true);
  };

  const handleCloseMessages = () => {
    setShowMessages(false);
  };

  const handleNavigateToForms = () => {
    navigate('/know-your-form');
  };

  const handleCompanySwitch = (company) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
    // Refresh dashboard data for the new company
    fetchDashboardData();
    toast.success(`Switched to ${company.name}`);
  };

  const updatedFeatures = packageDetails?.features || [];

  const displayedAddons = showAllAddons ? availableAddons : availableAddons.slice(0, 2);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full p-2 sm:p-4">
      {/* Left Column */}
      <div className="flex-1">
        {selectedFeature ? (
          <FeatureDetails
            feature={{
              ...selectedFeature,
              feedback: featureComments[selectedFeature.id] || []
            }}
            onBack={handleBackToCorePackage}
            isDarkMode={effectiveDarkMode}
            onAddComment={handleAddComment}
            newComment={newComment}
            setNewComment={setNewComment}
          />
        ) : (
          <>
            {/* Company Switcher Dropdown */}
            {selectedCompany && allCompanies.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-gray-200 dark:border-gray-700 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {selectedCompany.name}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedCompany.industry || 'Company Dashboard'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <Building2 className="w-4 h-4 mr-2" />
                          Switch Company
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {allCompanies.map((company) => (
                          <DropdownMenuItem
                            key={company.id}
                            onClick={() => handleCompanySwitch(company)}
                            className={`flex items-center space-x-3 ${company.id === selectedCompany.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                              }`}
                          >
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                              <Building2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {company.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {company.industry || 'No industry'}
                              </div>
                            </div>
                            {company.id === selectedCompany.id && (
                              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                          onClick={() => navigate('/company-selection')}
                          className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Company
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Package */}
            <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Current Package</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Loading dashboard data...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
                    <Button onClick={fetchDashboardData} variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                ) : hasActivePackage && packageDetails ? (
                  <>
                    {/* Package Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                          {packageDetails.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {packageDetails.description}
                        </p>
                      </div>
                      <Badge variant="default" className={`${packageDetails.status === 'active' ? 'bg-green-500 hover:bg-green-600' :
                        packageDetails.status === 'expired' ? 'bg-red-500 hover:bg-red-600' :
                          'bg-yellow-500 hover:bg-yellow-600'
                        }`}>
                        {packageDetails.status.charAt(0).toUpperCase() + packageDetails.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Purchase Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Purchase Date</p>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {packageDetails.purchaseDate ? new Date(packageDetails.purchaseDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Expires</p>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {packageDetails.expirationDate ? new Date(packageDetails.expirationDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhilippinePeso className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {packageDetails.price}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Package Price
                          </p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {packageDetails.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Duration
                          </p>
                          <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            {packageDetails.period}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Core Features List */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                        Package Features
                      </h4>
                      <div className="space-y-1">
                        {packageDetails.features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex items-center space-x-2">
                              <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-500/20">
                                {getFeatureIcon(feature.name)}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                                  {feature.name}
                                </span>
                                {feature.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {feature.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {feature.cost}
                              </span>
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No Active Package</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You don't have any active packages. Browse our available packages to get started.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Browse Packages
                    </Button>
                  </div>
                )}



                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm" onClick={handleContactSupport}>
                    <MessageSquare className="w-3 h-3 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="flex-1 text-sm" onClick={handleViewDetails}>
                    <FileText className="w-3 h-3 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-80">
        {/* Project Features */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Project Features</h2>
            {projectFeatures.length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-sm transition-all duration-300 hover:scale-105"
                onClick={handleSeeAllFeatures}
              >
                <span className="transition-all duration-300">
                  {showAllFeatures ? "Show Less" : "See all Features"}
                </span>
              </Button>
            )}
          </div>

          {projectFeatures.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-gray-200 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No Active Projects</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You don't have any active package features. Purchase a package to see your project features here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={`space-y-2 transition-all duration-500 ease-out ${showAllFeatures ? 'animate-expand-height' : ''}`}>
              {displayedFeatures.map((feature, index) => (
                <div key={feature.id} className={`${index >= 4 ? 'animate-slide-in-right' : ''}`} style={{ animationDelay: `${(index - 4) * 0.1}s` }}>
                  <Card
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer min-h-[100px] hover:border-blue-300 dark:hover:border-blue-600"
                    onClick={() => handleFeatureCardClick(feature)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-0.5">
                            <div className={`w-7 h-7 rounded flex items-center justify-center ${feature.status === "Completed" ? "bg-green-500" :
                              feature.status === "In Progress" ? "bg-blue-500" :
                                feature.status === "Pending" ? "bg-gray-500" :
                                  feature.status === "Active" ? "bg-green-500" :
                                    "bg-orange-500"
                              }`}>
                              {typeof feature.icon === 'string' ? getIconComponent(feature.icon) : feature.icon}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-start space-x-2 flex-1 min-w-0">
                                <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm leading-tight break-words">{feature.title}</h3>
                              </div>
                              <Badge
                                className={`text-xs whitespace-nowrap flex-shrink-0 ${getStatusColor(feature.status)}`}
                              >
                                {feature.status}
                              </Badge>
                            </div>



                            {/* Output Status */}
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                              <span className="truncate">{feature.output}</span>
                            </div>

                            {/* Time */}
                            <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{feature.time}</span>
                            </div>

                            {/* Expanded Details */}
                            {expandedProjects.has(index) && (
                              <div className="space-y-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 animate-fade-in transition-all duration-300">
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                  <span>Last updated: {feature.time}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFeatureExpansion(index);
                          }}
                          className="w-5 h-5 p-0 btn-primary ml-2 flex-shrink-0"
                          title={expandedProjects.has(index) ? "Collapse feature" : "Expand feature"}
                        >
                          {expandedProjects.has(index) ? (
                            <ChevronDown className="w-3 h-3 transition-transform duration-300" />
                          ) : (
                            <ChevronDown className="w-3 h-3 rotate-180 transition-transform duration-300" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Addons Section */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700 hover-lift progress-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Addons</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-sm transition-all duration-300 hover:scale-105"
                onClick={handleViewAllAddons}
              >
                <span className="transition-all duration-300">
                  {showAllAddons ? "Show Less" : "See all Addons"}
                </span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`space-y-2 transition-all duration-500 ease-out ${showAllAddons ? 'animate-expand-height' : ''}`}>
              {displayedAddons.map((addon, index) => (
                <div
                  key={addon.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer min-h-[80px] ${index >= 2 ? 'animate-slide-in-right' : ''}`}
                  style={{ animationDelay: `${(index - 2) * 0.1}s` }}
                  onClick={() => toggleAddonExpansion(addon.id)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-7 h-7 rounded bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {typeof addon.icon === 'string' ? getIconComponent(addon.icon) : addon.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start space-x-2 mb-1">
                            <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm leading-tight break-words">{addon.title}</h3>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{addon.price}</span>
                            <span>/{addon.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactForAddon(addon);
                          }}
                          title="Contact us for this addon"
                        >
                          <MessageSquare className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAddonExpansion(addon.id);
                          }}
                          className="w-5 h-5 p-0"
                          title={expandedAddons.has(addon.id) ? "Collapse details" : "Expand details"}
                        >
                          {expandedAddons.has(addon.id) ? (
                            <ChevronDown className="w-3 h-3 transition-transform duration-300" />
                          ) : (
                            <ChevronDown className="w-3 h-3 rotate-180 transition-transform duration-300" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedAddons.has(addon.id) && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 animate-fade-in transition-all duration-300">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-100 text-xs mb-2">Features:</h4>
                          <div className="space-y-1">
                            {addon.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Description:</span> {addon.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Package Details Modal */}
      <PackageDetails
        isOpen={showPackageDetails}
        onClose={() => setShowPackageDetails(false)}
        isDarkMode={effectiveDarkMode}
        onOpenMessages={handleOpenMessages}
      />

      {/* Messages Component */}
      <Messages
        isOpen={showMessages}
        onClose={handleCloseMessages}
        chatType={chatType}
        isDarkMode={effectiveDarkMode}
      />
    </div>
  );
}