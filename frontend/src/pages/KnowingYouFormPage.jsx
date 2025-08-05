import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KnowingYouForm from '@/components/form/KnowingYouForm';
import BrandKitForm from '@/components/form/BrandKitForm';

const KnowingYouFormPage = () => {
  return (
    <div className="min-h-screen bg-transparent custom-scrollbar">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">
            Alta Media Branding
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
            Complete the "Knowing You Form" to help us understand your business and create the perfect brand identity.
          </p>
        </div>

        <KnowingYouForm />
      </div>
    </div>
  );
};

export default KnowingYouFormPage; 