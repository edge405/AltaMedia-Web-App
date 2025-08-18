import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Palette,
  FileText,
  Package,
  Building
} from 'lucide-react';
import KnowingYouForm from '@/components/form/KnowingYouForm';
import ProductServiceForm from '@/components/form/ProductServiceForm';
import OrganizationForm from '@/components/form/OrganizationForm';

export default function BrandKitSection({
  isLoadingForms,
  formStatuses,
  currentForm,
  onFormTypeChange
}) {
  // If a specific form is selected, render that form
  if (currentForm) {
    const formComponents = {
      'business': <KnowingYouForm onFormTypeChange={onFormTypeChange} initialFormType="business" embedded={true} />,
      'product': <ProductServiceForm onFormTypeChange={onFormTypeChange} embedded={true} />,
      'organization': <OrganizationForm onFormTypeChange={onFormTypeChange} embedded={true} />
    };

    return (
      <div className="space-y-8">
        {/* Back to BrandKit Button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onFormTypeChange(null)}
            variant="outline"
            className="flex items-center space-x-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to BrandKit</span>
          </Button>
        </div>

        {formComponents[currentForm]}
      </div>
    );
  }

  // Otherwise, show the BrandKit status interface
  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-[#f7e833] rounded-2xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-black" />
            </div>
            <span>BrandKit Forms Status</span>
          </CardTitle>
          <p className="text-gray-300 mt-2">
            Track your brand identity forms completion
          </p>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {isLoadingForms ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f7e833]"></div>
              <span className="ml-3 text-gray-600">Loading status...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Knowing You Form */}
              <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Knowing You Form</h3>
                      <p className="text-sm text-gray-500">Business/Company Brand Identity</p>
                    </div>
                  </div>
                  <Badge className={`px-3 py-1 rounded-full text-sm font-bold ${formStatuses.knowingYou.completed
                    ? 'bg-green-500 text-white'
                    : formStatuses.knowingYou.currentStep > 0
                      ? 'bg-[#f7e833] text-black'
                      : 'bg-gray-300 text-gray-600'
                    }`}>
                    {formStatuses.knowingYou.completed
                      ? 'Completed'
                      : formStatuses.knowingYou.currentStep > 0
                        ? `${Math.round((formStatuses.knowingYou.currentStep / formStatuses.knowingYou.totalSteps) * 100)}%`
                        : 'Not Started'
                    }
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span className="font-bold text-gray-900">
                      Step {formStatuses.knowingYou.currentStep} of {formStatuses.knowingYou.totalSteps}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(formStatuses.knowingYou.currentStep / formStatuses.knowingYou.totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Button
                  onClick={() => onFormTypeChange('business')}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${formStatuses.knowingYou.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {formStatuses.knowingYou.completed
                    ? 'View Completed Form'
                    : formStatuses.knowingYou.currentStep === 0
                      ? 'Start Form'
                      : 'Continue Form'
                  }
                </Button>
              </div>

              {/* Product Service Form */}
              <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Product/Service Form</h3>
                      <p className="text-sm text-gray-500">Specific Product/Service Brand Identity</p>
                    </div>
                  </div>
                  <Badge className={`px-3 py-1 rounded-full text-sm font-bold ${formStatuses.productService.completed
                    ? 'bg-green-500 text-white'
                    : formStatuses.productService.currentStep > 0
                      ? 'bg-[#f7e833] text-black'
                      : 'bg-gray-300 text-gray-600'
                    }`}>
                    {formStatuses.productService.completed
                      ? 'Completed'
                      : formStatuses.productService.currentStep > 0
                        ? `${Math.round((formStatuses.productService.currentStep / formStatuses.productService.totalSteps) * 100)}%`
                        : 'Not Started'
                    }
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span className="font-bold text-gray-900">
                      Step {formStatuses.productService.currentStep} of {formStatuses.productService.totalSteps}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(formStatuses.productService.currentStep / formStatuses.productService.totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Button
                  onClick={() => onFormTypeChange('product')}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${formStatuses.productService.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                >
                  {formStatuses.productService.completed
                    ? 'View Completed Form'
                    : formStatuses.productService.currentStep === 0
                      ? 'Start Form'
                      : 'Continue Form'
                  }
                </Button>
              </div>

              {/* Organization Form */}
              <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Organization Form</h3>
                      <p className="text-sm text-gray-500">Organization/Brand/Page Identity</p>
                    </div>
                  </div>
                  <Badge className={`px-3 py-1 rounded-full text-sm font-bold ${formStatuses.organization.completed
                    ? 'bg-green-500 text-white'
                    : formStatuses.organization.currentStep > 0
                      ? 'bg-[#f7e833] text-black'
                      : 'bg-gray-300 text-gray-600'
                    }`}>
                    {formStatuses.organization.completed
                      ? 'Completed'
                      : formStatuses.organization.currentStep > 0
                        ? `${Math.round((formStatuses.organization.currentStep / formStatuses.organization.totalSteps) * 100)}%`
                        : 'Not Started'
                    }
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span className="font-bold text-gray-900">
                      Step {formStatuses.organization.currentStep} of {formStatuses.organization.totalSteps}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(formStatuses.organization.currentStep / formStatuses.organization.totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Button
                  onClick={() => onFormTypeChange('organization')}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${formStatuses.organization.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                >
                  {formStatuses.organization.completed
                    ? 'View Completed Form'
                    : formStatuses.organization.currentStep === 0
                      ? 'Start Form'
                      : 'Continue Form'
                  }
                </Button>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formStatuses.knowingYou.completed ? '✓' : formStatuses.knowingYou.currentStep}
                    </div>
                    <div className="text-sm text-gray-600">Knowing You</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formStatuses.productService.completed ? '✓' : formStatuses.productService.currentStep}
                    </div>
                    <div className="text-sm text-gray-600">Product/Service</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formStatuses.organization.completed ? '✓' : formStatuses.organization.currentStep}
                    </div>
                    <div className="text-center text-sm text-gray-600">Organization</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
