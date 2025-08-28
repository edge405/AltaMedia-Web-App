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
        console.log(`Field change: ${field} =`, value);
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        // Multiple logging approaches
        console.log('=== TEST LOGGING ===');
        console.log('Current step:', step);
        console.log('Form data:', formData);
        console.log('=== END TEST LOGGING ===');

        // Also try different console methods
        console.info('Info: Step data captured');
        console.warn('Warning: This is a test log');
        console.error('Error: This is a test error log');

        // Create a visible log on the page
        const logDiv = document.createElement('div');
        logDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: yellow; padding: 10px; border: 2px solid red; z-index: 9999;';
        logDiv.innerHTML = `
            <strong>Step ${step} Data:</strong><br>
            ${JSON.stringify(formData, null, 2)}
        `;
        document.body.appendChild(logDiv);

        // Remove the log after 5 seconds
        setTimeout(() => {
            if (logDiv.parentNode) {
                logDiv.parentNode.removeChild(logDiv);
            }
        }, 5000);

        console.log(`Step ${step} data logged! Check console and yellow box.`);

        if (step < 3) {
            setStep(step + 1);
        } else {
            console.log('Form complete! Final data logged to console.');
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