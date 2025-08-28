import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BrandKitFormTest = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: ''
    });

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Form complete
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 1: Basic Info</h3>
                        <Input
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 2: Contact</h3>
                        <Input
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 3: Company</h3>
                        <Input
                            placeholder="Enter your company"
                            value={formData.company}
                            onChange={(e) => handleFieldChange('company', e.target.value)}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Test Form - Step {step} of 3</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {renderStep()}
                    <Button onClick={handleNext} className="w-full">
                        {step === 3 ? 'Submit' : 'Next'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default BrandKitFormTest; 