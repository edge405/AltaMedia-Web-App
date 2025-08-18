import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formStatusApi } from '../utils/formStatusApi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Circle, FileText, Building2, Package, Users, ArrowRight, Loader2 } from 'lucide-react';

export default function FormStatusIndicator() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formStatus, setFormStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFormStatus = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await formStatusApi.checkAllFormStatus(user.id);
                setFormStatus(response.data);
            } catch (error) {
                console.error('Error loading form status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadFormStatus();
    }, [user?.id]);

    const handleFormClick = (formType) => {
        switch (formType) {
            case 'business':
                navigate('/know-your-form');
                break;
            case 'product':
                navigate('/know-your-form');
                break;
            case 'organization':
                navigate('/know-your-form');
                break;
            default:
                navigate('/know-your-form');
        }
    };

    const getFormIcon = (formType) => {
        switch (formType) {
            case 'business':
                return <Building2 className="w-5 h-5" />;
            case 'product':
                return <Package className="w-5 h-5" />;
            case 'organization':
                return <Users className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    const getFormTitle = (formType) => {
        switch (formType) {
            case 'business':
                return 'Business/Company Form';
            case 'product':
                return 'Product/Service Form';
            case 'organization':
                return 'Organization Form';
            default:
                return 'Form';
        }
    };

    const getFormDescription = (formType) => {
        switch (formType) {
            case 'business':
                return 'Complete brand identity for your business or company';
            case 'product':
                return 'Streamlined branding for your specific product or service';
            case 'organization':
                return 'Social media strategy for your organization or brand';
            default:
                return 'Complete your form';
        }
    };

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading form status...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!formStatus) {
        return null;
    }

    const forms = [
        { type: 'business', ...formStatus.business },
        { type: 'product', ...formStatus.product },
        { type: 'organization', ...formStatus.organization }
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Form Completion Status</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {forms.map((form) => (
                    <div
                        key={form.type}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${form.completed
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${form.completed
                                    ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400'
                                    : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400'
                                }`}>
                                {form.completed ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    getFormIcon(form.type)
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                    {getFormTitle(form.type)}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {getFormDescription(form.type)}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                    {form.completed ? (
                                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Completed
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
                                            <Circle className="w-3 h-3 mr-1" />
                                            Step {form.currentStep} of {form.totalSteps}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!form.completed && (
                            <Button
                                onClick={() => handleFormClick(form.type)}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <span>{form.currentStep === 0 ? 'Start' : 'Continue'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}

                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Note:</strong> All forms lead to the same comprehensive questionnaire.
                        Choose the form that best describes what you're building, and we'll guide you through the appropriate sections.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
