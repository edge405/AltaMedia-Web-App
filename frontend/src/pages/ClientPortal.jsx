import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Import data
import { clientData } from '@/data/clientData';
import { getPackageByName } from '@/data/packages';
import { brandKitApi } from '@/utils/brandKitApi';
import { brandKitQuestionnaireApi } from '@/utils/brandKitQuestionnaireApi';
import { organizationApi } from '@/utils/organizationApi';
import { userPackageApi } from '@/utils/userPackageApi';

// Import services
import profileService from '@/utils/profileService';
import { useAuth } from '@/contexts/AuthContext';

// Import components
import FormCompletionCheck from '@/components/FormCompletionCheck';
import ClientSidebar from '@/components/dashboard/ClientSidebar';
import TopBar from '@/components/dashboard/TopBar';
import DashboardSection from '@/components/dashboard/DashboardSection';
import PackageDetailsSection from '@/components/dashboard/PackageDetailsSection';
import DeliverablesSection from '@/components/dashboard/DeliverablesSection';
import BrandKitSection from '@/components/dashboard/BrandKitSection';
import AnalyticsSection from '@/components/dashboard/AnalyticsSection';
import SupportSection from '@/components/dashboard/SupportSection';
import ProfileSection from '@/components/dashboard/ProfileSection';

export default function ClientPortal() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [formsCompleted, setFormsCompleted] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newMessage, setNewMessage] = useState("");

  // User package data state
  const [userPackages, setUserPackages] = useState([]);
  const [activePackage, setActivePackage] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [packageError, setPackageError] = useState(null);

  const [formStatuses, setFormStatuses] = useState({
    knowingYou: { completed: false, currentStep: 0, totalSteps: 11 },
    brandKitQuestionnaire: { completed: false, currentStep: 0, totalSteps: 9 },
    organization: { completed: false, currentStep: 0, totalSteps: 4 }
  });
  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    company: '',
    avatar: null // No avatar needed since we use dummy placeholders
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load user packages
  useEffect(() => {
    const loadUserPackages = async () => {
      if (!user?.id) return;

      setIsLoadingPackages(true);
      setPackageError(null);

      try {
        const response = await userPackageApi.getUserPackages();

        if (response.success && response.data) {
          const packages = response.data.packages || [];
          setUserPackages(packages);

          // Set the most recent active package as the active package
          const activePkg = packages.find(pkg =>
            pkg.status === 'active' &&
            new Date(pkg.expiration_date) >= new Date()
          ) || packages[0]; // Fallback to first package if no active ones

          setActivePackage(activePkg);
          setSelectedPackageId(activePkg?.id || null);
        }
      } catch (error) {
        console.error('Failed to load user packages:', error);
        setPackageError(error.message);
        toast.error('Failed to load package information');
      } finally {
        setIsLoadingPackages(false);
      }
    };

    loadUserPackages();
  }, [user?.id]);

  // Transform API package data to match expected format
  const transformPackageData = (pkg) => {
    if (!pkg) return null;

    return {
      name: pkg.package_name,
      price: `₱${parseFloat(pkg.total_amount).toLocaleString()}`,
      status: pkg.status === 'active' ? 'Active' : 'Expired',
      startDate: pkg.purchase_date ? new Date(pkg.purchase_date).toISOString().split('T')[0] : '',
      endDate: pkg.expiration_date ? new Date(pkg.expiration_date).toISOString().split('T')[0] : '',
      id: pkg.id,
      features: pkg.features || [],
      // Add API-specific data
      total_amount: pkg.total_amount,
      purchase_date: pkg.purchase_date,
      expiration_date: pkg.expiration_date,
      created_at: pkg.created_at,
      updated_at: pkg.updated_at
    };
  };

  // Handle package selection
  const handlePackageSelect = (packageId) => {
    const selectedPkg = userPackages.find(pkg => pkg.id === packageId);
    if (selectedPkg) {
      setSelectedPackageId(packageId);
      setActivePackage(selectedPkg);
    }
  };

  // Get currently selected package
  const getCurrentPackage = () => {
    if (selectedPackageId) {
      return userPackages.find(pkg => pkg.id === selectedPackageId) || activePackage;
    }
    return activePackage;
  };

  // Get package details for the active package
  const currentPackage = getCurrentPackage();
  const packageDetails = currentPackage ? getPackageByName(currentPackage.package_name) : null;
  const transformedActivePackage = transformPackageData(currentPackage);

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Load profile data
        const profile = await profileService.loadProfileData();
        setProfileData(profile);
      } catch (error) {
        console.error('Failed to load profile data:', error);
        toast.error('Failed to load profile data');
      }
    };

    loadProfileData();
  }, []);

  // Check all form statuses
  useEffect(() => {
    const checkAllFormStatuses = async () => {
      try {
        // Get user ID from authenticated user
        const userId = user?.id || 1; // Fallback to 1 for testing

        // Check Knowing You Form (BrandKit)
        try {
          const knowingYouResponse = await brandKitApi.getFormData(userId);
          if (knowingYouResponse.success && knowingYouResponse.data) {
            setFormStatuses(prev => ({
              ...prev,
              knowingYou: {
                completed: knowingYouResponse.data.currentStep === 11,
                currentStep: knowingYouResponse.data.currentStep || 0,
                totalSteps: 11
              }
            }));
          }
        } catch (error) {
          console.error('Error checking Knowing You Form status:', error);
        }

        // Check BrandKitQuestionnaire Form
        try {
          const brandKitQuestionnaireResponse = await brandKitQuestionnaireApi.getFormData(userId);
          if (brandKitQuestionnaireResponse.success && brandKitQuestionnaireResponse.data) {
            setFormStatuses(prev => ({
              ...prev,
              brandKitQuestionnaire: {
                completed: brandKitQuestionnaireResponse.data.currentStep === 9,
                currentStep: brandKitQuestionnaireResponse.data.currentStep || 0,
                totalSteps: 9
              }
            }));
          }
        } catch (error) {
          console.error('Error checking BrandKitQuestionnaire Form status:', error);
        }

        // Check Organization Form
        try {
          const organizationResponse = await organizationApi.getFormData();
          if (organizationResponse.success && organizationResponse.data) {
            setFormStatuses(prev => ({
              ...prev,
              organization: {
                completed: organizationResponse.data.currentStep === 4,
                currentStep: organizationResponse.data.currentStep || 0,
                totalSteps: 4
              }
            }));
          }
        } catch (error) {
          console.error('Error checking Organization Form status:', error);
        }

      } catch (error) {
        console.error('Error checking form statuses:', error);
      } finally {
        setIsLoadingForms(false);
      }
    };

    checkAllFormStatuses();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
      case "Completed":
      case "Approved":
        return "bg-green-500";
      case "In Progress":
      case "Ongoing":
        return "bg-blue-500";
      case "Pending":
      case "Pending Approval":
        return "bg-yellow-500";
      case "In Revision":
        return "bg-orange-500";
      case "Paused":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleProfileInputChange = (field, value) => {
    if (field === 'isEditingProfile') {
      setIsEditingProfile(value);
    } else if (field === 'showPasswordChange') {
      setShowPasswordChange(value);
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      // Validate profile data
      const validationErrors = profileService.validateProfileData(profileData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0]);
        return;
      }

      // Update profile via API
      const response = await profileService.updateProfile(profileData);

      if (response.success) {
        setIsEditingProfile(false);
        toast.success('Profile updated successfully!');

        // Update local state with new data
        setProfileData(prev => ({
          ...prev,
          ...response.data
        }));
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = async () => {
    try {
      // Reload original profile data
      const originalProfile = await profileService.loadProfileData();
      setProfileData(originalProfile);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error reloading profile data:', error);
      toast.error('Failed to reload profile data');
    }
  };

  // Password change handlers
  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    try {
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long');
        return;
      }

      // Change password via API
      const response = await profileService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response.success) {
        toast.success('Password changed successfully!');
        setShowPasswordChange(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordChange(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  const handleFormTypeChange = (type) => {
    setCurrentForm(type);
  };

  const handleFormsComplete = () => {
    console.log('🎉 All forms completed! Setting form statuses to completed...');

    // Set all form statuses to completed
    setFormStatuses({
      knowingYou: { completed: true, currentStep: 11, totalSteps: 11 },
      brandKitQuestionnaire: { completed: true, currentStep: 9, totalSteps: 9 },
      organization: { completed: true, currentStep: 4, totalSteps: 4 }
    });

    // Set forms as completed
    setFormsCompleted(true);
  };

  // Function to refresh form statuses
  const refreshFormStatuses = async () => {
    console.log('🔄 Refreshing form statuses...');
    setIsLoadingForms(true);

    try {
      const userId = user?.id;
      if (!userId) {
        console.log('No user ID available for refresh');
        return;
      }

      // Check all form statuses
      const newFormStatuses = { ...formStatuses };

      // Check Knowing You Form (BrandKit)
      try {
        const knowingYouResponse = await brandKitApi.getFormData(userId);
        if (knowingYouResponse.success && knowingYouResponse.data) {
          newFormStatuses.knowingYou = {
            completed: knowingYouResponse.data.currentStep === 11,
            currentStep: knowingYouResponse.data.currentStep || 0,
            totalSteps: 11
          };
        }
      } catch (error) {
        console.error('Error checking Knowing You Form status:', error);
      }

      // Check BrandKit Questionnaire Form
      try {
        const brandKitQuestionnaireResponse = await brandKitQuestionnaireApi.getFormData(userId);
        if (brandKitQuestionnaireResponse.success && brandKitQuestionnaireResponse.data) {
          const isCompleted = brandKitQuestionnaireResponse.data.isCompleted || brandKitQuestionnaireResponse.data.currentStep === 9;
          const currentStep = brandKitQuestionnaireResponse.data.currentStep || 0;

          newFormStatuses.brandKitQuestionnaire = {
            completed: isCompleted,
            currentStep: isCompleted ? 9 : currentStep, // Force to 9 if completed
            totalSteps: 9
          };

          console.log('📊 BrandKit Questionnaire status:', {
            isCompleted,
            currentStep,
            status: isCompleted ? 'Completed' : currentStep > 0 ? 'In Progress' : 'Not Started'
          });
        } else {
          newFormStatuses.brandKitQuestionnaire = {
            completed: false,
            currentStep: 0,
            totalSteps: 9
          };
        }
      } catch (error) {
        console.error('Error checking BrandKit Questionnaire Form status:', error);
        newFormStatuses.brandKitQuestionnaire = {
          completed: false,
          currentStep: 0,
          totalSteps: 9
        };
      }

      // Check Organization Form
      try {
        const organizationResponse = await organizationApi.getFormData();
        if (organizationResponse.success && organizationResponse.data) {
          newFormStatuses.organization = {
            completed: organizationResponse.data.currentStep === 4,
            currentStep: organizationResponse.data.currentStep || 0,
            totalSteps: 4
          };
        } else {
          newFormStatuses.organization = {
            completed: false,
            currentStep: 0,
            totalSteps: 4
          };
        }
      } catch (error) {
        console.error('Error checking Organization Form status:', error);
        newFormStatuses.organization = {
          completed: false,
          currentStep: 0,
          totalSteps: 4
        };
      }

      console.log('📈 Updated form statuses:', newFormStatuses);
      setFormStatuses(newFormStatuses);

    } catch (error) {
      console.error('Error refreshing form statuses:', error);
    } finally {
      setIsLoadingForms(false);
    }
  };

  // Filter deliverables
  const filteredDeliverables = clientData.deliverables.filter(deliverable => {
    const matchesSearch = deliverable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliverable.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || deliverable.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "Home" },
    { id: "package", label: "Package Details", icon: "Package" },
    { id: "deliverables", label: "Deliverables", icon: "Download" },
    { id: "brandkit", label: "BrandKit", icon: "Palette" },
    // { id: "analytics", label: "Analytics", icon: "BarChart3" },
    { id: "support", label: "Support", icon: "MessageSquare" },
  ];

  const handleProfileClick = () => {
    setShowProfile(true);
    setActiveSection("profile");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setShowProfile(false); // Exit profile view when any section is selected
  };

  const handleViewPackage = () => {
    setActiveSection("package");
    setShowProfile(false);
  };

  const handleViewDeliverables = () => {
    setActiveSection("deliverables");
    setShowProfile(false);
  };

  // Create client data object with API data
  const clientDataWithApi = {
    ...clientData,
    activePackage: transformedActivePackage,
    userPackages: userPackages,
    selectedPackageId: selectedPackageId,
    onPackageSelect: handlePackageSelect,
    isLoadingPackages: isLoadingPackages,
    packageError: packageError
  };

  const renderContent = () => {
    if (showProfile) {
      return (
        <ProfileSection
          profileData={profileData}
          isEditingProfile={isEditingProfile}
          isSavingProfile={isSavingProfile}
          showPasswordChange={showPasswordChange}
          passwordData={passwordData}
          showPasswords={showPasswords}
          isChangingPassword={isChangingPassword}
          onProfileInputChange={handleProfileInputChange}
          onSaveProfile={handleSaveProfile}
          onCancelEdit={handleCancelEdit}
          onPasswordInputChange={handlePasswordInputChange}
          onTogglePasswordVisibility={togglePasswordVisibility}
          onChangePassword={handleChangePassword}
          onCancelPasswordChange={handleCancelPasswordChange}
        />
      );
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardSection
            clientData={clientDataWithApi}
            onViewPackage={handleViewPackage}
            onViewDeliverables={handleViewDeliverables}
          />
        );
      case "package":
        return (
          <PackageDetailsSection
            clientData={clientDataWithApi}
            packageDetails={packageDetails}
          />
        );
      case "deliverables":
        return (
          <DeliverablesSection
            clientData={clientDataWithApi}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filteredDeliverables={filteredDeliverables}
          />
        );
      case "brandkit":
        return (
          <BrandKitSection
            isLoadingForms={isLoadingForms}
            formStatuses={formStatuses}
            currentForm={currentForm}
            onFormTypeChange={handleFormTypeChange}
            onRefreshStatuses={refreshFormStatuses}
          />
        );
      // case "analytics":
      //   return (
      //     <AnalyticsSection
      //       clientData={clientDataWithApi}
      //       getStatusColor={getStatusColor}
      //     />
      //   );
      case "support":
        return (
          <SupportSection
            clientData={clientDataWithApi}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            getStatusColor={getStatusColor}
          />
        );
      default:
        return (
          <DashboardSection
            clientData={clientDataWithApi}
            onViewPackage={handleViewPackage}
            onViewDeliverables={handleViewDeliverables}
          />
        );
    }
  };

  // Show form completion check if forms are not completed
  if (!formsCompleted) {
    return <FormCompletionCheck onFormsComplete={handleFormsComplete} />;
  }

  return (
    <div className="min-h-screen bg-black flex">
      <ClientSidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        profileData={profileData}
        formStatuses={formStatuses}
        isLoadingForms={isLoadingForms}
        logout={logout}
        onProfileClick={handleProfileClick}
        showProfile={showProfile}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 lg:ml-72">
        <TopBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
          sidebarItems={sidebarItems}
          showProfile={showProfile}
          profileData={profileData}
          clientData={clientDataWithApi}
        />

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
