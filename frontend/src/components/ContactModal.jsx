import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    X,
    Phone,
    Mail,
    MessageCircle,
    Clock,
    MapPin,
    ExternalLink
} from 'lucide-react';

export default function ContactModal({ isOpen, onClose, isDarkMode = false, title = "Contact Us" }) {
    const [isLoading, setIsLoading] = useState(false);

    const contactMethods = [
        {
            id: 'phone',
            name: 'Phone Call',
            icon: Phone,
            value: '+63 917 123 4567',
            action: () => window.open('tel:+639171234567'),
            description: 'Available Mon-Fri, 9AM-6PM PHT'
        },
        {
            id: 'email',
            name: 'Email Support',
            icon: Mail,
            value: 'support@altamedia.com',
            action: () => window.open('mailto:support@altamedia.com'),
            description: 'We respond within 24 hours'
        },
        {
            id: 'whatsapp',
            name: 'WhatsApp',
            icon: MessageCircle,
            value: '+63 917 123 4567',
            action: () => window.open('https://wa.me/639171234567'),
            description: 'Quick messaging support'
        }
    ];

    const businessInfo = {
        name: "Alta Media Inc.",
        address: "123 Business District, Makati, Metro Manila, Philippines",
        hours: "Monday - Friday: 9:00 AM - 6:00 PM PHT",
        website: "www.altamedia.com"
    };

    const handleContactMethod = (method) => {
        setIsLoading(true);
        method.action();
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`max-w-2xl max-h-[90vh] overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
                <DialogHeader className="pb-4 flex-shrink-0">
                    <DialogTitle className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </DialogTitle>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Get in touch with our team for inquiries about our services
                    </p>
                </DialogHeader>

                <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-160px)] pr-3 pb-6 custom-scrollbar">
                    {/* Contact Methods */}
                    <div className="space-y-3">
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Contact Methods
                        </h3>

                        <div className="grid grid-cols-1 gap-3">
                            {contactMethods.map((method) => (
                                <Card
                                    key={method.id}
                                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'hover:bg-gray-50'
                                        }`}
                                    onClick={() => handleContactMethod(method)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-3 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                                                }`}>
                                                <method.icon className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                                    }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {method.name}
                                                </h4>
                                                <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                    {method.value}
                                                </p>
                                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {method.description}
                                                </p>
                                            </div>
                                            <ExternalLink className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Business Information */}
                    <div className="space-y-3">
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Business Information
                        </h3>

                        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start space-x-3">
                                    <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`} />
                                    <div>
                                        <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {businessInfo.name}
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {businessInfo.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Clock className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`} />
                                    <div>
                                        <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Business Hours
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {businessInfo.hours}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Services Note */}
                    <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                        }`}>
                        <h4 className={`font-semibold text-sm mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                            🚧 Services Currently Under Development
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                            Our online billing and payment system is currently under development.
                            Please contact us directly for any service inquiries, customizations, or billing questions.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 text-base font-semibold"
                            disabled={isLoading}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => handleContactMethod(contactMethods[0])} // Default to phone
                            className="flex-1 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Phone className="w-5 h-5 mr-2" />
                                    Call Now
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
