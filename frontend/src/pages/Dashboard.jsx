import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  DollarSign,
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
  Palette
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import BillingManagement from "@/components/BillingManagement";
import PackageDetails from "@/components/PackageDetails";
import CartModal from "@/components/CartModal";
import CustomNotification from "@/components/CustomNotification";
import FeatureDetails from "@/components/FeatureDetails";
import Messages from "@/components/Messages";

export default function Dashboard({ isDarkMode: parentIsDarkMode }) {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("Current");
  const incomeCardRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("April 13, 2025");
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showBillingManagement, setShowBillingManagement] = useState(false);
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Use parent's dark mode state if provided, otherwise use local state
  const effectiveDarkMode = parentIsDarkMode !== undefined ? parentIsDarkMode : isDarkMode;
  const [cartItems, setCartItems] = useState([]);
  const [purchasedAddons, setPurchasedAddons] = useState([]);
  const [showRefundNotification, setShowRefundNotification] = useState(false);
  const [refundAddonData, setRefundAddonData] = useState(null);
  const [isCorePackageCollapsed, setIsCorePackageCollapsed] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureComments, setFeatureComments] = useState({});
  const [newComment, setNewComment] = useState("");

  const packageDetails = {
    name: "Core Package",
    price: "P10,999",
    period: "month",
    status: "Active",
    features: [
      { name: "Dashboard", cost: "Free", included: true },
      { name: "Website", cost: "P5,000", included: true },
      { name: "Content/Ad Management", cost: "P4,000", included: true },
      { name: "Content Calendar/Creation (30 days)", cost: "P4,000", included: true },
      { name: "Demo", cost: "P500", included: true },
      { name: "Pin4MS", cost: "P1,000", included: true }
    ],
    totalCost: "P14,500",
    sellingPrice: "P10,999",
    savings: "P3,501"
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

  const packageFeatures = [
    {
      id: 1,
      title: "Dashboard",
      status: "Completed",
      progress: 100,
      description: "Your business dashboard with analytics and reporting tools",
      output: "Dashboard is live and accessible",
      time: "2 days ago",
      icon: <BarChart3 className="w-4 h-4 text-white" />,
      expanded: false,
      outputs: [
        {
          id: 1,
          title: "Analytics Dashboard",
          description: "Real-time analytics and reporting interface",
          url: "https://dashboard.altalabs.com",
          status: "Live",
          lastUpdated: "2 days ago"
        },
        {
          id: 2,
          title: "Performance Metrics",
          description: "Key performance indicators and metrics",
          url: "https://metrics.altalabs.com",
          status: "Live",
          lastUpdated: "1 day ago"
        }
      ],
      feedback: [
        {
          id: 1,
          user: "John Doe",
          comment: "Great dashboard! The analytics are very helpful.",
          rating: 5,
          date: "1 day ago"
        }
      ]
    },
    {
      id: 2,
      title: "Website",
      status: "In Progress",
      progress: 75,
      description: "Custom website development with responsive design",
      output: "Homepage and about page completed",
      time: "1 day ago",
      icon: <Globe className="w-4 h-4 text-white" />,
      expanded: false
    },
    {
      id: 3,
      title: "Content/Ad Management",
      status: "Pending",
      progress: 0,
      description: "Social media content creation and ad campaign management",
      output: "Awaiting content brief from client",
      time: "Not started",
      icon: <FileText className="w-4 h-4 text-white" />,
      expanded: false
    },
    {
      id: 4,
      title: "Content Calendar/Creation",
      status: "In Progress",
      progress: 50,
      description: "30-day content calendar with scheduled posts",
      output: "15 posts created, 15 remaining",
      time: "3 hours ago",
      icon: <Calendar className="w-4 h-4 text-white" />,
      expanded: false
    }
  ];

  const allPackageFeatures = [
    {
      id: 1,
      title: "Dashboard",
      status: "Completed",
      progress: 100,
      description: "Your business dashboard with analytics and reporting tools",
      output: "Dashboard is live and accessible",
      time: "2 days ago",
      icon: <BarChart3 className="w-4 h-4 text-white" />,
      expanded: false
    },
    {
      id: 2,
      title: "Website",
      status: "In Progress",
      progress: 75,
      description: "Custom website development with responsive design",
      output: "Homepage and about page completed",
      time: "1 day ago",
      icon: <Globe className="w-4 h-4 text-white" />,
      expanded: false
    },
    {
      id: 3,
      title: "Content/Ad Management",
      status: "Pending",
      progress: 0,
      description: "Social media content creation and ad campaign management",
      output: "Awaiting content brief from client",
      time: "Not started",
      icon: <FileText className="w-4 h-4 text-white" />,
      expanded: false
    },
    {
      id: 4,
      title: "Content Calendar/Creation",
      status: "In Progress",
      progress: 50,
      description: "30-day content calendar with scheduled posts",
      output: "15 posts created, 15 remaining",
      time: "3 hours ago",
      icon: <Calendar className="w-4 h-4 text-white" />,
      expanded: false
    },
    {
      id: 5,
      title: "Demo",
      status: "Scheduled",
      progress: 0,
      description: "Product demonstration and training session",
      output: "Scheduled for next week",
      time: "Scheduled",
      icon: <Play className="w-4 h-4 text-white" />,
      expanded: false
    },
    {
      id: 6,
      title: "Pin4MS",
      status: "Completed",
      progress: 100,
      description: "Pin4MS integration and setup",
      output: "Integration complete and tested",
      time: "1 week ago",
      icon: <Zap className="w-4 h-4 text-white" />,
      expanded: false
    },
    // Add purchased addons as project features
    ...purchasedAddons.map((addon, index) => ({
      id: 100 + index,
      title: addon.title,
      status: "Active",
      progress: 100,
      description: `${addon.title} addon service`,
      output: "Addon service active",
      time: "Just purchased",
      icon: addon.icon,
      expanded: false,
      isAddon: true
    }))
  ];

  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const displayedFeatures = showAllFeatures ? allPackageFeatures : packageFeatures;

  const getStatusColor = (status) => {
    const colorMap = {
      "Completed": "bg-green-500 text-white",
      "In Progress": "bg-blue-500 text-white",
      "Pending": "bg-gray-500 text-white",
      "Scheduled": "bg-orange-500 text-white"
    };
    return colorMap[status] || "bg-gray-500 text-white";
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress > 0) return "bg-orange-500";
    return "bg-gray-300";
  };

  const proposalStats = [
    { label: "Proposals sent", count: 64, color: "bg-gray-300" },
    { label: "Interviews", count: 14, color: "bg-red-500" },
    { label: "Hires", count: 10, color: "bg-gray-300" }
  ];

  const availableDates = [
    "April 13, 2025",
    "April 14, 2025", 
    "April 15, 2025",
    "April 16, 2025",
    "April 17, 2025"
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
    // Add animation effect
    if (incomeCardRef.current) {
      incomeCardRef.current.style.transform = 'scale(0.98)';
      setTimeout(() => {
        if (incomeCardRef.current) {
          incomeCardRef.current.style.transform = 'scale(1)';
        }
      }, 150);
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

  const handleManageBilling = () => {
    setShowBillingManagement(true);
    toast.success("Opening billing management...");
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

  const handleFeatureCardClick = (feature) => {
    setSelectedFeature(feature);
    setIsCorePackageCollapsed(true);
    toast.info(`Opening ${feature.title} details...`);
  };

  const handleBackToCorePackage = () => {
    setSelectedFeature(null);
    setIsCorePackageCollapsed(false);
  };

  const handleAddComment = (featureId, comment) => {
    setFeatureComments(prev => ({
      ...prev,
      [featureId]: [...(prev[featureId] || []), comment]
    }));
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

  const addons = [
    {
      id: 1,
      title: "60-DAY CONTENT CALENDAR",
      description: "Pre-planned posts, Editable anytime",
      price: "P1,999",
      type: "one-time",
      features: ["Pre-planned posts", "Editable anytime"],
      inCart: false,
      icon: <Calendar className="w-4 h-4 text-white" />
    },
    {
      id: 2,
      title: "90-DAY CONTENT CALENDAR",
      description: "Pre-planned posts, Editable anytime",
      price: "P2,999",
      type: "one-time",
      features: ["Pre-planned posts", "Editable anytime"],
      inCart: false,
      icon: <Calendar className="w-4 h-4 text-white" />
    },
    {
      id: 3,
      title: "CUSTOM STATIC GRAPHICS",
      description: "Custom designs, Format-ready for posts",
      price: "P500",
      type: "per image",
      features: ["Custom designs", "Format-ready for posts"],
      inCart: false,
      icon: <BarChart3 className="w-4 h-4 text-white" />
    },
    {
      id: 4,
      title: "REELS EDITING",
      description: "Edited short-form videos, Great for Reels/Shorts",
      price: "P500",
      type: "per reel",
      features: ["Edited short-form videos", "Great for Reels/Shorts"],
      inCart: false,
      icon: <Play className="w-4 h-4 text-white" />
    },
    {
      id: 5,
      title: "WEBSITE PACKAGE",
      description: "Branded site + email, 1 year hosting",
      price: "P5,000",
      type: "one-time",
      features: ["Branded site + email", "1 year hosting"],
      inCart: false,
      icon: <Globe className="w-4 h-4 text-white" />
    },
    {
      id: 6,
      title: "180-DAY CONTENT CALENDAR",
      description: "Pre-planned posts, Editable anytime",
      price: "P5,000",
      type: "one-time",
      features: ["Pre-planned posts", "Editable anytime"],
      inCart: false,
      icon: <Calendar className="w-4 h-4 text-white" />
    },
    {
      id: 7,
      title: "365-DAY CONTENT CALENDAR",
      description: "Pre-planned posts, Editable anytime",
      price: "P15,000",
      type: "one-time",
      features: ["Pre-planned posts", "Editable anytime"],
      inCart: false,
      icon: <Calendar className="w-4 h-4 text-white" />
    },
    {
      id: 8,
      title: "CUSTOM MOTION GRAPHICS",
      description: "Short animated videos, For social & ads",
      price: "P1,500",
      type: "starts at",
      features: ["Short animated videos", "For social & ads"],
      inCart: false,
      icon: <Play className="w-4 h-4 text-white" />
    },
    {
      id: 9,
      title: "E-COMMERCE SITE",
      description: "Catalog, cart, checkout, Mobile-friendly layout",
      price: "P15,000",
      type: "one-time",
      features: ["Catalog, cart, checkout", "Mobile-friendly layout"],
      inCart: false,
      icon: <Globe className="w-4 h-4 text-white" />
    },
    {
      id: 10,
      title: "PAYMENT GATEWAY SETUP",
      description: "Stripe, GCash, PayMongo setup, EFuture-ready payment option",
      price: "P3,000",
      type: "one-time",
      features: ["Stripe, GCash, PayMongo setup", "EFuture-ready payment option"],
      inCart: false,
      icon: <DollarSign className="w-4 h-4 text-white" />
    }
  ];

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
    
    setCartItems([...cartItems, addon]);
    toast.success(`${addon.title} added to cart!`);
    setShowCartModal(true);
  };

  const handleRemoveFromCart = (addonId) => {
    setCartItems(cartItems.filter(item => item.id !== addonId));
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    // Add purchased addons to the core package
    setPurchasedAddons([...purchasedAddons, ...cartItems]);
    
    // Clear cart
    setCartItems([]);
    
    // Show success message
    toast.success("Payment successful! Addons have been added to your package.");
    
    // Close cart modal
    setShowCartModal(false);
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

  const handleConfirmRefund = () => {
    if (refundAddonData) {
      const { addon, index } = refundAddonData;
      
      // Remove the addon from purchased addons
      const updatedPurchasedAddons = purchasedAddons.filter((_, i) => i !== index);
      setPurchasedAddons(updatedPurchasedAddons);
      
      // Show success message
      toast.success(`Refund processed for ${addon.title}. Amount: ${addon.price} will be credited to your account.`);
      
      // In a real application, you would also:
      // 1. Update the billing/invoice records
      // 2. Process the actual refund through payment gateway
      // 3. Update the user's account balance
      // 4. Send confirmation email
    }
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

  // Calculate total package value including purchased addons
  const totalPurchasedAddonCost = purchasedAddons.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ''));
    return sum + price;
  }, 0);

  const updatedPackageDetails = {
    ...packageDetails,
    price: `P${(10999 + totalPurchasedAddonCost).toLocaleString()}`,
    totalCost: `P${(14500 + totalPurchasedAddonCost).toLocaleString()}`,
    savings: `P${(3501 + totalPurchasedAddonCost).toLocaleString()}`
  };

  const updatedFeatures = [
    ...packageDetails.features,
    ...purchasedAddons.map(addon => ({
      name: addon.title,
      cost: addon.price,
      included: true,
      isAddon: true
    }))
  ];

  const displayedAddons = showAllAddons ? addons : addons.slice(0, 2);

    return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full p-2 sm:p-4">
      {/* Forms Button */}
      <div className="mb-4 lg:mb-6 animate-bounce-in">
        <Button 
          onClick={handleNavigateToForms}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <FileText className="w-5 h-5" />
          <span className="text-lg">Brand Kit Forms</span>
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center">
            <Palette className="w-3 h-3 text-white" />
          </div>
        </Button>
      </div>
      
      {/* Left Column */}
      <div className="flex-1">
        {selectedFeature ? (
          <FeatureDetails
            feature={selectedFeature}
            onBack={handleBackToCorePackage}
            isDarkMode={effectiveDarkMode}
            onAddComment={handleAddComment}
            newComment={newComment}
            setNewComment={setNewComment}
          />
        ) : (
          /* Current Package */
          <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Current Package</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                    {selectedTimeframe} <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedTimeframe("Current")}>
                    Current
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTimeframe("Previous")}>
                    Previous
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Complete multimedia automation solution for your business
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Package Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {updatedPackageDetails.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Complete multimedia automation solution for your business
                </p>
              </div>
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                {updatedPackageDetails.status}
              </Badge>
            </div>

            {/* Price Display */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Monthly Price
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {updatedPackageDetails.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Original Value
                  </p>
                  <p className="text-base font-semibold line-through text-gray-400 dark:text-gray-500">
                    {updatedPackageDetails.totalCost}
                  </p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Save {updatedPackageDetails.savings}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Features List */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                Core Features
              </h4>
              <div className="space-y-1">
                {packageDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-500/20">
                        {getFeatureIcon(feature.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                        {feature.name}
                      </span>
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

            {/* Purchased Addons List */}
            {purchasedAddons.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                  Purchased Addons
                </h4>
                <div className="space-y-1">
                  {purchasedAddons.map((addon, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-2 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-500/20">
                          {addon.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                          {addon.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {addon.price}
                        </span>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRefundAddon(index);
                          }}
                          className="w-6 h-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                          title="Refund this addon"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm" onClick={handleManageBilling}>
                <DollarSign className="w-3 h-3 mr-2" />
                Manage Billing
              </Button>
              <Button variant="outline" className="flex-1 text-sm" onClick={handleViewDetails}>
                <FileText className="w-3 h-3 mr-2" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
        )}
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-80">
        {/* Project Features */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Project Features</h2>
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
          </div>
                    <div className={`space-y-2 transition-all duration-500 ease-out ${showAllFeatures ? 'animate-expand-height' : ''}`}>
            {displayedFeatures.map((feature, index) => (
              <div key={feature.id} className={`${index >= packageFeatures.length ? 'animate-slide-in-right' : ''}`} style={{ animationDelay: `${(index - packageFeatures.length) * 0.1}s` }}>
                <Card 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer min-h-[100px] hover:border-blue-300 dark:hover:border-blue-600"
                  onClick={() => handleFeatureCardClick(feature)}
                >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-0.5">
                        <div className={`w-7 h-7 rounded flex items-center justify-center ${
                          feature.status === "Completed" ? "bg-green-500" :
                          feature.status === "In Progress" ? "bg-blue-500" :
                          feature.status === "Pending" ? "bg-gray-500" :
                          "bg-orange-500"
                        }`}>
                          {feature.icon}
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
                        
                        {/* Progress Bar */}
                        <div className="mb-2 pr-8">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{feature.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(feature.progress)}`}
                              style={{ width: `${feature.progress}%` }}
                            ></div>
                          </div>
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
                          {addon.icon}
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
                            handleAddToCart(addon);
                          }}
                        >
                          {cartItems.find(item => item.id === addon.id) ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                          )}
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
            {cartItems.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm mb-2">Cart ({cartItems.length})</h4>
                <div className="space-y-1">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-1 px-2 rounded bg-gray-100 dark:bg-gray-600/50">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-100">{item.title}</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-100">{item.price}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-sm py-1" onClick={handleCheckout}>
                  <DollarSign className="w-3 h-3 mr-1" />
                  Checkout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Billing Management Modal */}
      <BillingManagement 
        isOpen={showBillingManagement}
        onClose={() => setShowBillingManagement(false)}
        isDarkMode={effectiveDarkMode}
        purchasedAddons={purchasedAddons}
      />

      {/* Package Details Modal */}
              <PackageDetails 
          isOpen={showPackageDetails} 
          onClose={() => setShowPackageDetails(false)} 
          isDarkMode={effectiveDarkMode}
          purchasedAddons={purchasedAddons}
          onAddToCart={handleAddToCart}
          onOpenMessages={handleOpenMessages}
        />

      {/* Cart Modal */}
      <CartModal 
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        isDarkMode={effectiveDarkMode}
      />

      {/* Custom Refund Notification */}
      <CustomNotification
        isOpen={showRefundNotification}
        onClose={() => setShowRefundNotification(false)}
        onConfirm={handleConfirmRefund}
        title="Confirm Refund"
        message={refundAddonData ? `Are you sure you want to refund "${refundAddonData.addon.title}"? This action cannot be undone.` : ""}
        type="warning"
        confirmText="Process Refund"
        cancelText="Cancel"
        isDarkMode={effectiveDarkMode}
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