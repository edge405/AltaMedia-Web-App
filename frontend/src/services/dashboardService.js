import apiService from '@/utils/api';

/**
 * Dashboard Service - Handles all dashboard-related data operations
 * Transforms backend data into frontend-ready format
 */
class DashboardService {
  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData() {
    try {
      const [packagePurchases, addonPurchases, availableAddons] = await Promise.all([
        apiService.getUserPackagePurchases(),
        apiService.getUserAddonPurchases(),
        apiService.getAddons()
      ]);

      return {
        success: true,
        data: {
          packagePurchases: packagePurchases.data || {},
          addonPurchases: addonPurchases.data || {},
          availableAddons: availableAddons.data || {}
        }
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      return {
        success: false,
        error: error.message || 'Failed to load dashboard data'
      };
    }
  }

  /**
   * Transform package purchase data for dashboard display
   */
  transformPackagePurchaseData(packagePurchases) {
    if (!packagePurchases?.package_purchases?.length) {
      return {
        currentPackage: null,
        packageDetails: this.getDefaultPackageDetails(),
        hasActivePackage: false
      };
    }

    // Find the most recent active package
    const activePurchases = packagePurchases.package_purchases.filter(
      purchase => purchase.purchase_info?.status === 'active'
    );

    if (activePurchases.length === 0) {
      return {
        currentPackage: null,
        packageDetails: this.getDefaultPackageDetails(),
        hasActivePackage: false
      };
    }

    // Sort by purchase date and get the most recent
    const currentPackage = activePurchases.sort((a, b) =>
      new Date(b.purchase_info.purchase_date) - new Date(a.purchase_info.purchase_date)
    )[0];

    const packageDetails = this.transformPackageDetails(currentPackage);

    return {
      currentPackage,
      packageDetails,
      hasActivePackage: true,
      allPurchases: packagePurchases.package_purchases
    };
  }

  /**
   * Transform package details for display
   */
  transformPackageDetails(packagePurchase) {
    if (!packagePurchase) return this.getDefaultPackageDetails();

    const packageInfo = packagePurchase.package_details;
    const purchaseInfo = packagePurchase.purchase_info;

    return {
      name: packageInfo?.package_name || "Package",
      description: packageInfo?.package_description || "",
      price: purchaseInfo?.total_amount ? `₱${purchaseInfo.total_amount}` : "₱0",
      period: packageInfo?.duration_days ? `${packageInfo.duration_days} days` : "N/A",
      status: purchaseInfo?.status || "inactive",
      features: this.transformPackageFeatures(packageInfo?.features || []),
      purchaseDate: purchaseInfo?.purchase_date,
      expirationDate: purchaseInfo?.expiration_date,
      totalCost: purchaseInfo?.total_amount ? `₱${purchaseInfo.total_amount}` : "₱0",
      durationType: this.getDurationType(packageInfo?.duration_days)
    };
  }

  /**
   * Transform package features for display
   */
  transformPackageFeatures(features) {
    if (!features?.length) {
      return [
        { 
          feature_id: null,
          name: "Dashboard", 
          cost: "Included", 
          included: true, 
          description: "Basic dashboard access" 
        }
      ];
    }

    return features.map(feature => ({
      feature_id: feature.feature_id, // Include the actual database feature_id
      name: feature.feature_info?.feature_name || feature.feature_name || "Feature",
      description: feature.feature_info?.feature_description || feature.feature_description || "",
      cost: "Included",
      included: true,
      isActive: feature.feature_info?.is_active !== false
    }));
  }

  /**
   * Transform addon purchases for display
   */
  transformAddonPurchases(addonPurchases) {
    if (!addonPurchases?.addon_purchases?.length) {
      return [];
    }

    return addonPurchases.addon_purchases
      .filter(purchase => purchase.purchase_info?.status === 'active')
      .map(purchase => ({
        id: purchase.addon_purchase_id,
        title: purchase.addon_details?.addon_name || "Addon",
        description: purchase.addon_details?.addon_description || "",
        price: purchase.purchase_info?.base_price ? `₱${purchase.purchase_info.base_price}` : "₱0",
        type: purchase.purchase_info?.price_type || "one-time",
        purchaseDate: purchase.purchase_info?.purchase_date,
        status: purchase.purchase_info?.status || "active",
        icon: this.getAddonIcon(purchase.addon_details?.addon_name)
      }));
  }

  /**
   * Transform available addons for display
   */
  transformAvailableAddons(availableAddons) {
    if (!availableAddons?.addons?.length) {
      return this.getDefaultAddons();
    }

    return availableAddons.addons.map(addon => ({
      id: addon.addon_id,
      title: addon.addon_info?.name || "Addon",
      description: addon.addon_info?.description || "",
      price: addon.addon_info?.base_price ? `₱${addon.addon_info.base_price}` : "₱0",
      type: addon.addon_info?.price_type || "one-time",
      features: this.transformAddonFeatures(addon.features || []),
      inCart: false,
      icon: this.getAddonIcon(addon.addon_info?.name),
      isActive: addon.addon_info?.is_active !== false
    })).filter(addon => addon.isActive);
  }

  /**
   * Transform addon features for display
   */
  transformAddonFeatures(features) {
    if (!features?.length) {
      return ["Standard features included"];
    }

    return features.map(feature => 
      feature.feature_info?.feature_name || feature.feature_name || "Feature"
    );
  }

  /**
   * Generate et features based on package features
   */
  generateProjectFeatures(packageDetails, purchasedAddons = []) {
    const features = [];

    // Only add package features if there's an active package
    if (packageDetails?.features?.length) {
      packageDetails.features.forEach((feature) => {
        features.push({
          id: feature.feature_id || feature.id, // Use the actual database feature_id
          title: feature.name,
          status: this.getFeatureStatus(feature.name),
          description: feature.description || `${feature.name} service`,
          output: this.getFeatureOutput(feature.name),
          time: this.getFeatureTime(feature.name),
          icon: this.getFeatureIcon(feature.name),
          expanded: false,
          packageFeatureId: feature.feature_id || feature.id // Explicit reference for comments API
        });
      });
    }

    // Add purchased addons as features
    purchasedAddons.forEach((addon, index) => {
      features.push({
        id: 100 + index,
        title: addon.title,
        status: "Active",
        description: addon.description || `${addon.title} addon service`,
        output: "Addon service active",
        time: addon.purchaseDate ? this.formatRelativeTime(addon.purchaseDate) : "Active",
        icon: addon.icon,
        expanded: false,
        isAddon: true
      });
    });

    return features;
  }

  /**
   * Get feature icon based on feature name
   */
  getFeatureIcon(featureName) {
    const iconMap = {
      "Dashboard": "BarChart3",
      "Website": "Globe",
      "Logo Design": "Package",
      "Brand Guidelines": "FileText",
      "Content/Ad Management": "FileText",
      "Content Calendar": "Calendar",
      "Demo": "Play",
      "Pin4MS": "Zap"
    };

    // Check for partial matches
    const featureKey = Object.keys(iconMap).find(key => 
      featureName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(featureName.toLowerCase())
    );

    return iconMap[featureKey] || "Package";
  }

  /**
   * Get addon icon based on addon name
   */
  getAddonIcon(addonName) {
    if (!addonName) return "Package";

    const name = addonName.toLowerCase();
    
    if (name.includes('calendar') || name.includes('content')) {
      return "Calendar";
    }
    if (name.includes('website') || name.includes('site')) {
      return "Globe";
    }
    if (name.includes('graphics') || name.includes('design')) {
      return "BarChart3";
    }
    if (name.includes('reel') || name.includes('video')) {
      return "Play";
    }
    if (name.includes('payment') || name.includes('gateway')) {
      return "PhilippinePeso";
    }
    
    return "Package";
  }

  /**
   * Get feature status based on feature name (mock logic)
   */
  getFeatureStatus(featureName) {
    const statusMap = {
      "Website": "In Progress",
      "Logo Design": "Completed",
      "Brand Guidelines": "Completed",
      "Content Calendar": "In Progress",
      "Demo": "Scheduled"
    };

    return statusMap[featureName] || "Pending";
  }



  /**
   * Get feature output based on feature name (mock logic)
   */
  getFeatureOutput(featureName) {
    const outputMap = {
      "Website": "Homepage and about page completed",
      "Logo Design": "Logo designs finalized and delivered",
      "Brand Guidelines": "Brand guide document completed",
      "Content Calendar": "15 posts created, 15 remaining",
      "Demo": "Scheduled for next week"
    };

    return outputMap[featureName] || "In development";
  }

  /**
   * Get feature time based on feature name (mock logic)
   */
  getFeatureTime(featureName) {
    const timeMap = {
      "Website": "1 day ago",
      "Logo Design": "3 days ago",
      "Brand Guidelines": "1 week ago",
      "Content Calendar": "3 hours ago",
      "Demo": "Scheduled"
    };

    return timeMap[featureName] || "Recently started";
  }

  /**
   * Get duration type for display
   */
  getDurationType(durationDays) {
    if (!durationDays) return "N/A";
    
    if (durationDays <= 7) return "Weekly";
    if (durationDays <= 31) return "Monthly";
    if (durationDays <= 93) return "Quarterly";
    if (durationDays <= 186) return "Semi-Annual";
    if (durationDays <= 366) return "Annual";
    
    return "Extended";
  }

  /**
   * Format relative time from date
   */
  formatRelativeTime(dateString) {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
    
    return "Just now";
  }

  /**
   * Get default package details when no package is found
   */
  getDefaultPackageDetails() {
    return {
      name: "No Active Package",
      description: "You don't have any active packages",
      price: "₱0",
      period: "N/A",
      status: "inactive",
      features: [],
      purchaseDate: null,
      expirationDate: null,
      totalCost: "₱0",
      durationType: "N/A"
    };
  }

  /**
   * Get default addons when none are available
   */
  getDefaultAddons() {
    return [
      {
        id: "demo-1",
        title: "60-DAY CONTENT CALENDAR",
        description: "Pre-planned posts, Editable anytime",
        price: "₱1,999",
        type: "one-time",
        features: ["Pre-planned posts", "Editable anytime"],
        inCart: false,
        icon: "Calendar",
        isActive: true
      },
      {
        id: "demo-2",
        title: "WEBSITE PACKAGE",
        description: "Branded site + email, 1 year hosting",
        price: "₱5,000",
        type: "one-time",
        features: ["Branded site + email", "1 year hosting"],
        inCart: false,
        icon: "Globe",
        isActive: true
      }
    ];
  }

  /**
   * Get status color for UI display
   */
  getStatusColor(status) {
    const colorMap = {
      "Completed": "bg-green-500 text-white",
      "In Progress": "bg-blue-500 text-white",
      "Pending": "bg-gray-500 text-white",
      "Scheduled": "bg-orange-500 text-white",
      "Active": "bg-green-500 text-white",
      "Cancelled": "bg-red-500 text-white",
      "Expired": "bg-gray-500 text-white"
    };
    return colorMap[status] || "bg-gray-500 text-white";
  }



  /**
   * Check if user has active package
   */
  hasActivePackage(packagePurchases) {
    return packagePurchases?.package_purchases?.some(
      purchase => purchase.purchase_info?.status === 'active'
    ) || false;
  }

  /**
   * Calculate total addon spending
   */
  calculateAddonSpending(addonPurchases) {
    if (!addonPurchases?.addon_purchases?.length) return 0;

    return addonPurchases.addon_purchases
      .filter(purchase => purchase.purchase_info?.status === 'active')
      .reduce((total, purchase) => {
        const price = purchase.purchase_info?.base_price || 0;
        return total + parseFloat(price);
      }, 0);
  }
}

// Create and export singleton instance
const dashboardService = new DashboardService();
export default dashboardService;
