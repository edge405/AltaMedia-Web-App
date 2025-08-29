import React, { useState } from 'react';
import { X, CreditCard, Download, Calendar, DollarSign, Package, Settings, AlertCircle, CheckCircle, Clock, FileText, CreditCard as CreditCardIcon, Building, User, Mail, Phone, Plus, Edit, Trash2, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import CustomNotification from '@/components/CustomNotification';

export default function BillingManagement({ isOpen, onClose, isDarkMode = false, purchasedAddons = [] }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card-1');
    const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
    const [showEditPaymentMethod, setShowEditPaymentMethod] = useState(false);
    const [editingMethod, setEditingMethod] = useState(null);
    const [showBillingCycleOptions, setShowBillingCycleOptions] = useState(false);
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
    const [methodToRemove, setMethodToRemove] = useState(null);
    const [showRefundNotification, setShowRefundNotification] = useState(false);
    const [refundAddonData, setRefundAddonData] = useState(null);

    // Calculate total addon cost
    const totalAddonCost = purchasedAddons.reduce((sum, addon) => {
        const price = parseFloat(addon.price.replace(/[^\d.]/g, ''));
        return sum + price;
    }, 0);

    // Mock billing data
    const billingData = {
        currentPackage: {
            name: "Core Package",
            price: `P${(10999 + totalAddonCost).toLocaleString()}`,
            cycle: "Monthly",
            nextBilling: "2024-04-15",
            status: "Active",
            addons: purchasedAddons
        },
        paymentMethods: [
            {
                id: 'card-1',
                type: 'credit',
                last4: '1234',
                brand: 'Visa',
                expiry: '12/25',
                isDefault: true
            },
            {
                id: 'card-2',
                type: 'credit',
                last4: '5678',
                brand: 'Mastercard',
                expiry: '08/26',
                isDefault: false
            }
        ],
        invoices: [
            {
                id: "INV-2024-001",
                date: "2024-01-15",
                amount: "P10,999",
                status: "Paid",
                description: "Core Package - January 2024",
                downloadUrl: "#"
            },
            {
                id: "INV-2024-002",
                date: "2024-02-15",
                amount: "P10,999",
                status: "Paid",
                description: "Core Package - February 2024",
                downloadUrl: "#"
            },
            {
                id: "INV-2024-003",
                date: "2024-03-15",
                amount: "P10,999",
                status: "Pending",
                description: "Core Package - March 2024",
                downloadUrl: "#"
            },
            {
                id: "INV-2024-004",
                date: "2024-04-15",
                amount: `P${(10999 + totalAddonCost).toLocaleString()}`,
                status: "Upcoming",
                description: "Core Package + Addons - April 2024",
                downloadUrl: "#"
            },
            // Add addon purchase invoices
            ...purchasedAddons.map((addon, index) => ({
                id: `ADDON-${Date.now()}-${index}`,
                date: new Date().toISOString().split('T')[0],
                amount: addon.price,
                status: "Paid",
                description: `${addon.title} - Addon Purchase`,
                downloadUrl: "#",
                isAddon: true
            }))
        ],
        billingHistory: [
            {
                date: "2024-03-15",
                description: "Core Package - March 2024",
                amount: "P10,999",
                status: "Paid"
            },
            {
                date: "2024-02-15",
                description: "Core Package - February 2024",
                amount: "P10,999",
                status: "Paid"
            },
            {
                date: "2024-01-15",
                description: "Core Package - January 2024",
                amount: "P10,999",
                status: "Paid"
            }
        ]
    };

    const handleDownloadInvoice = (invoice) => {
        // Simulate download with loading state
        const button = document.querySelector(`[data-invoice-id="${invoice.id}"]`);
        if (button) {
            button.disabled = true;
            button.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';
        }

        setTimeout(() => {
            if (button) {
                button.disabled = false;
                button.innerHTML = '<Download className="w-4 h-4" />';
            }
            toast.success(`Invoice ${invoice.id} downloaded successfully!`);
        }, 1500);
    };

    const handleExportAllInvoices = () => {
        toast.success("Exporting all invoices...");
        setTimeout(() => {
            toast.success("All invoices exported successfully!");
        }, 2000);
    };

    const handleUpdatePaymentMethod = () => {
        setShowAddPaymentMethod(true);
    };

    const handleChangeBillingCycle = () => {
        setShowBillingCycleOptions(!showBillingCycleOptions);
    };

    const handleBillingCycleSelect = (cycle) => {
        setShowBillingCycleOptions(false);
        toast.success(`Billing cycle changed to ${cycle}`);
    };

    const handleCancelSubscription = () => {
        if (confirm("Are you sure you want to cancel your subscription? This action cannot be undone.")) {
            toast.error("Subscription cancelled successfully");
        }
    };

    const handleUpgradePackage = () => {
        toast.info("Redirecting to package upgrade options...");
    };

    const handleAddPaymentMethod = () => {
        setShowAddPaymentMethod(true);
    };

    const handleEditPaymentMethod = (method) => {
        setEditingMethod(method);
        setShowEditPaymentMethod(true);
    };

    const handleRemovePaymentMethod = (method) => {
        setMethodToRemove(method);
        setShowRemoveConfirmation(true);
    };

    const handleConfirmRemovePaymentMethod = () => {
        if (methodToRemove) {
            toast.success(`${methodToRemove.brand} •••• ${methodToRemove.last4} removed successfully`);
            setShowRemoveConfirmation(false);
            setMethodToRemove(null);
        }
    };

    const handleCancelRemovePaymentMethod = () => {
        setShowRemoveConfirmation(false);
        setMethodToRemove(null);
    };

    const handleSetDefaultPaymentMethod = (methodId) => {
        toast.success("Default payment method updated");
    };

    const handleRefundAddon = (addonIndex) => {
        const addonToRefund = purchasedAddons[addonIndex];

        // Set the refund data and show custom notification
        setRefundAddonData({ addon: addonToRefund, index: addonIndex });
        setShowRefundNotification(true);
    };

    const handleConfirmRefund = () => {
        if (refundAddonData) {
            const { addon } = refundAddonData;

            // In a real application, you would:
            // 1. Process the refund through payment gateway
            // 2. Update billing records
            // 3. Update user's account balance
            // 4. Send confirmation email

            toast.success(`Refund request submitted for ${addon.title}. Amount: ${addon.price} will be credited to your account within 3-5 business days.`);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'upcoming':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return <CheckCircle className="w-4 h-4" />;
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'upcoming':
                return <Calendar className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl transition-all duration-300 custom-scrollbar`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div>
                        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Billing Management
                        </h2>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                            Manage your subscription, payment methods, and billing history
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Tabs */}
                <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    {['overview', 'invoices', 'payment-methods', 'billing-history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === tab
                                ? `${isDarkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}`
                                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
                                }`}
                        >
                            {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Current Package */}
                            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-200 hover:shadow-lg`}>
                                <CardHeader>
                                    <CardTitle className={`flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <Package className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                        Current Package
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Package</p>
                                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {billingData.currentPackage.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Price</p>
                                            <p className={`font-semibold text-blue-600 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                {billingData.currentPackage.price}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next Billing</p>
                                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {billingData.currentPackage.nextBilling}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 mt-4">
                                        <Button
                                            onClick={handleUpgradePackage}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            <Package className="w-4 h-4 mr-2" />
                                            Upgrade Package
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancelSubscription}
                                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-200"
                                        >
                                            Cancel Subscription
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Purchased Addons */}
                            {purchasedAddons.length > 0 && (
                                <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-200 hover:shadow-lg`}>
                                    <CardHeader>
                                        <CardTitle className={`flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            <Package className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                                            Purchased Addons
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {purchasedAddons.map((addon, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 transition-all duration-200 hover:bg-green-100 dark:hover:bg-green-900/30">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center">
                                                            {addon.icon}
                                                        </div>
                                                        <div>
                                                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                {addon.title}
                                                            </p>
                                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {addon.price} /{addon.type}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge className="bg-green-500 text-white">
                                                            Active
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRefundAddon(index)}
                                                            className="w-6 h-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                                                            title="Request refund for this addon"
                                                        >
                                                            <RotateCcw className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-200 hover:shadow-lg cursor-pointer`} onClick={handleUpdatePaymentMethod}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    Payment Methods
                                                </h3>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Manage your payment methods
                                                </p>
                                            </div>
                                            <Button onClick={handleUpdatePaymentMethod} size="sm" className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                                                <Settings className="w-4 h-4 mr-2" />
                                                Update
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-200 hover:shadow-lg cursor-pointer`} onClick={handleChangeBillingCycle}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    Billing Cycle
                                                </h3>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Change billing frequency
                                                </p>
                                            </div>
                                            <Button onClick={handleChangeBillingCycle} size="sm" className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Change
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Billing Cycle Options */}
                            {showBillingCycleOptions && (
                                <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-200 animate-slide-down`}>
                                    <CardContent className="p-4">
                                        <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select Billing Cycle</h4>
                                        <div className="space-y-2">
                                            {['Monthly', 'Quarterly', 'Annually'].map((cycle) => (
                                                <button
                                                    key={cycle}
                                                    onClick={() => handleBillingCycleSelect(cycle)}
                                                    className={`w-full p-3 rounded-lg border transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${cycle === 'Monthly'
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                        : `${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cycle}</span>
                                                        {cycle === 'Monthly' && <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {activeTab === 'invoices' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Invoice History
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleExportAllInvoices}
                                    className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors duration-200"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export All
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {billingData.invoices.map((invoice) => (
                                    <Card key={invoice.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-200 hover:shadow-lg`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <div>
                                                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                {invoice.id}
                                                            </p>
                                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {invoice.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-right">
                                                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {invoice.amount}
                                                        </p>
                                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {invoice.date}
                                                        </p>
                                                    </div>
                                                    <Badge className={getStatusColor(invoice.status)}>
                                                        <div className="flex items-center space-x-1">
                                                            {getStatusIcon(invoice.status)}
                                                            <span>{invoice.status}</span>
                                                        </div>
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDownloadInvoice(invoice)}
                                                        data-invoice-id={invoice.id}
                                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment-methods' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Payment Methods
                                </h3>
                                <Button
                                    onClick={handleAddPaymentMethod}
                                    className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Add Payment Method
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {billingData.paymentMethods.map((method) => (
                                    <Card key={method.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-200 hover:shadow-lg`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <CreditCardIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                                    <div>
                                                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {method.brand} •••• {method.last4}
                                                        </p>
                                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Expires {method.expiry}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {method.isDefault && (
                                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            Default
                                                        </Badge>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditPaymentMethod(method)}
                                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemovePaymentMethod(method)}
                                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing-history' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Billing History
                            </h3>

                            <div className="space-y-3">
                                {billingData.billingHistory.map((item, index) => (
                                    <Card key={index} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-200 hover:shadow-lg`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {item.description}
                                                    </p>
                                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {item.date}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {item.amount}
                                                    </p>
                                                    <Badge className={getStatusColor(item.status)}>
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Payment Method Modal */}
            {showAddPaymentMethod && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`w-full max-w-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Add Payment Method
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAddPaymentMethod(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    className={`w-full p-3 border rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className={`w-full p-3 border rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className={`w-full p-3 border rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <Button
                                    onClick={() => setShowAddPaymentMethod(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowAddPaymentMethod(false);
                                        toast.success("Payment method added successfully!");
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                    Add Method
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Payment Method Confirmation Modal */}
            {showRemoveConfirmation && methodToRemove && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`w-full max-w-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl p-6 animate-slide-down`}>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Remove Payment Method
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} mb-6`}>
                            <div className="flex items-center space-x-3">
                                <CreditCardIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {methodToRemove.brand} •••• {methodToRemove.last4}
                                    </p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Expires {methodToRemove.expiry}
                                    </p>
                                    {methodToRemove.isDefault && (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1">
                                            Default
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                onClick={handleCancelRemovePaymentMethod}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmRemovePaymentMethod}
                                className="flex-1 bg-red-600 hover:bg-red-700 transition-colors duration-200"
                            >
                                Remove Payment Method
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Refund Notification */}
            <CustomNotification
                isOpen={showRefundNotification}
                onClose={() => setShowRefundNotification(false)}
                onConfirm={handleConfirmRefund}
                title="Request Refund"
                message={refundAddonData ? `Are you sure you want to request a refund for "${refundAddonData.addon.title}"? This will initiate a refund process.` : ""}
                type="info"
                confirmText="Request Refund"
                cancelText="Cancel"
                isDarkMode={isDarkMode}
            />
        </div>
    );
} 