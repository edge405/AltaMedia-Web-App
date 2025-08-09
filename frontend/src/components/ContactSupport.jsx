import React, { useState } from 'react';
import { X, Phone, Mail, MessageCircle, Clock, MapPin, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function ContactSupport({ isOpen, onClose, isDarkMode = false }) {
  const [activeTab, setActiveTab] = useState('contact');

  const contactMethods = [
    {
      id: 'phone',
      name: 'Phone Support',
      icon: Phone,
      value: '+63 917 123 4567',
      description: 'Available Mon-Fri, 9AM-6PM PHT',
      action: () => window.open('tel:+639171234567'),
      available: true
    },
    {
      id: 'email',
      name: 'Email Support',
      icon: Mail,
      value: 'support@altamedia.com',
      description: 'We respond within 24 hours',
      action: () => window.open('mailto:support@altamedia.com'),
      available: true
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      value: '+63 917 123 4567',
      description: 'Quick messaging support',
      action: () => window.open('https://wa.me/639171234567'),
      available: true
    }
  ];

  const businessInfo = {
    name: "Alta Media Inc.",
    address: "123 Business District, Makati, Metro Manila, Philippines",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM PHT",
    website: "www.altamedia.com",
    email: "support@altamedia.com",
    phone: "+63 917 123 4567"
  };

  const handleContactMethod = (method) => {
    method.action();
    toast.success(`Opening ${method.name}...`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl transition-all duration-300 custom-scrollbar`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Contact Support
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Get in touch with our team for any questions or support needs
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
          {['contact', 'business-info'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? `${isDarkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}`
                  : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
              }`}
            >
              {tab === 'contact' ? 'Contact Methods' : 'Business Information'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-fade-in">
              {/* Service Notice */}
              <div className={`p-4 rounded-lg border-l-4 border-yellow-500 ${
                isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
              }`}>
                <div className="flex items-start space-x-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${
                    isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                  <div>
                    <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                      🚧 Online Services Under Development
                    </h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                      Our online billing, payment, and purchase systems are currently under development. 
                      Please contact us directly for any service inquiries, custom quotes, or billing questions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Contact Methods
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contactMethods.map((method) => (
                    <Card 
                      key={method.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleContactMethod(method)}
                    >
                      <CardContent className="p-4">
                        <div className="text-center space-y-3">
                          <div className={`inline-flex p-3 rounded-full ${
                            isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                          }`}>
                            <method.icon className={`w-6 h-6 ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {method.name}
                            </h4>
                            <p className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {method.value}
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {method.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-center">
                            <Badge className={`${
                              method.available 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {method.available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleContactMethod(contactMethods[0])} // Phone
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Call Now</div>
                    <div className="text-sm opacity-90">+63 917 123 4567</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleContactMethod(contactMethods[1])} // Email
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 p-6 h-auto"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Send Email</div>
                    <div className="text-sm opacity-90">support@altamedia.com</div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'business-info' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Business Information
              </h3>
              
              <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {businessInfo.name}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {businessInfo.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Business Hours
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {businessInfo.hours}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Phone
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {businessInfo.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Email
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {businessInfo.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <ExternalLink className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Website
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {businessInfo.website}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
