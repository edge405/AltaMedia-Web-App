import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Package,
    Calendar,
    DollarSign,
    Plus,
    CheckCircle,
    Clock
} from "lucide-react";
import apiService from "@/utils/api";

export default function PackagePurchaseForm({ onPurchaseCreated }) {
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await apiService.getPackages();
            if (response.success) {
                setPackages(response.data.packages || []);
            }
        } catch (err) {
            console.error('Error fetching packages:', err);
        }
    };

    const handlePackageSelect = (packageId) => {
        const pkg = packages.find(p => p.package_id === parseInt(packageId));
        setSelectedPackage(pkg);
    };

    const handleCreatePurchase = async () => {
        if (!selectedPackage) return;

        try {
            setLoading(true);
            setError(null);

            // Calculate expiration date (30 days from now)
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + (selectedPackage.package_info.duration_days || 30));

            const purchaseData = {
                package_id: selectedPackage.package_id,
                total_amount: selectedPackage.package_info.package_price,
                expiration_date: expirationDate.toISOString().split('T')[0]
            };

            const response = await apiService.createPackagePurchase(purchaseData);

            if (response.success) {
                setShowForm(false);
                setSelectedPackage(null);
                if (onPurchaseCreated) {
                    onPurchaseCreated(response.data);
                }
            }
        } catch (err) {
            console.error('Error creating package purchase:', err);
            setError(err.message || 'Failed to create package purchase');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
                <Button className="bg-slate-800 hover:bg-slate-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Purchase Package
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Purchase New Package</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Package Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="package-select">Select Package</Label>
                        <Select onValueChange={handlePackageSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a package..." />
                            </SelectTrigger>
                            <SelectContent>
                                {packages.map((pkg) => (
                                    <SelectItem key={pkg.package_id} value={pkg.package_id.toString()}>
                                        {pkg.package_info.package_name} - ${pkg.package_info.package_price}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Selected Package Details */}
                    {selectedPackage && (
                        <Card className="border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    {selectedPackage.package_info.package_name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-slate-600">
                                    {selectedPackage.package_info.package_description}
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-slate-600" />
                                        <div>
                                            <p className="text-xs text-slate-500">Price</p>
                                            <p className="font-medium">${selectedPackage.package_info.package_price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-600" />
                                        <div>
                                            <p className="text-xs text-slate-500">Duration</p>
                                            <p className="font-medium">{selectedPackage.package_info.duration_days} days</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Features Preview */}
                                <div>
                                    <h4 className="font-medium text-slate-800 mb-2">Included Features</h4>
                                    <div className="space-y-2">
                                        {selectedPackage.features?.map((feature) => (
                                            <div key={feature.feature_id} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-sm">{feature.feature_info.feature_name}</span>
                                                <Badge variant="outline" className="ml-auto">
                                                    {feature.feature_info.status || 'pending'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Purchase Summary */}
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-medium text-slate-800 mb-2">Purchase Summary</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Package Price:</span>
                                            <span>${selectedPackage.package_info.package_price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Duration:</span>
                                            <span>{selectedPackage.package_info.duration_days} days</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Expires:</span>
                                            <span>{formatDate(new Date(Date.now() + (selectedPackage.package_info.duration_days || 30) * 24 * 60 * 60 * 1000))}</span>
                                        </div>
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between font-medium">
                                                <span>Total:</span>
                                                <span>${selectedPackage.package_info.package_price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleCreatePurchase}
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating Purchase...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Confirm Purchase
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowForm(false)}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
