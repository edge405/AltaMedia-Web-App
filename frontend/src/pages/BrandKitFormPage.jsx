import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BrandKitForm from '@/components/form/BrandKitForm';
import BrandKitFormTest from '@/components/form/BrandKitFormTest';
import ConsoleTest from '@/components/form/ConsoleTest';

const BrandKitFormPage = () => {
    return (
        <div className="min-h-screen bg-transparent custom-scrollbar">
            <div className="container mx-auto px-4 py-4 sm:py-8">
                <div className="mb-6 sm:mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">
                        Alta Media BrandKit
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
                        Complete the BrandKit form to help us create the perfect brand identity for your business.
                    </p>
                </div>

                <BrandKitForm />
            </div>
        </div>
    );
};

export default BrandKitFormPage; 